import { createFileRoute } from '@tanstack/react-router'
import { createClient } from '@supabase/supabase-js'
import { sendWhatsAppMessage } from '@/lib/whatsapp.server'

// Configuration : 5 messages par jour à répartir
// 07h, 10h, 13h, 16h, 19h (GMT/UTC)
const PLANNED_SLOTS = [7, 10, 13, 16, 19];

export const Route = createFileRoute('/api/public/hooks/send-lessons')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const isForce = url.searchParams.get('force') === 'true';
        // En Lovable Cloud, la anon key s'utilise comme 'apikey'
        const authHeader = request.headers.get('apikey')
        if (!authHeader || authHeader !== process.env['SUPABASE_PUBLISHABLE_KEY']) {
          return new Response('Unauthorized', { status: 401 })
        }

        const supabaseUrl = process.env['SUPABASE_URL']!
        const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY']!
        
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        try {
          // 1. Déterminer combien de messages devraient avoir été envoyés aujourd'hui
          const now = new Date();
          const currentHour = now.getUTCHours();
          const slotsElapsed = PLANNED_SLOTS.filter(h => h <= currentHour).length;

          if (slotsElapsed === 0) {
            return new Response(JSON.stringify({ message: 'Trop tôt pour le premier envoi' }), { status: 200 });
          }

          // 2. Vérifier l'état actuel (index du prochain message)
          const { data: schedule, error: schedError } = await supabase
            .from('daily_schedule')
            .select('*')
            .single()

          if (schedError && schedError.code !== 'PGRST116') throw schedError

          const today = now.toISOString().split('T')[0]
          const lastDate = schedule?.last_message_date
          const lastSentCount = (lastDate === today) ? (schedule?.sent_count_today || 0) : 0;
          
          // Logique de rattrapage
          let toSendCount = slotsElapsed - lastSentCount;
          
          if (isForce && toSendCount <= 0) {
            toSendCount = 1;
          }

          if (toSendCount <= 0) {
            return new Response(JSON.stringify({ 
              message: 'Tous les messages prévus jusqu\'à cette heure ont déjà été envoyés',
              slotsElapsed,
              lastSentCount
            }), { status: 200 });
          }

          const { data: messages, error: msgError } = await supabase
            .from('messages')
            .select('*')
            .eq('is_active', true)
            .order('id', { ascending: true })

          if (msgError) throw msgError
          if (!messages || messages.length === 0) {
            return new Response(JSON.stringify({ error: 'Aucun message actif trouvé' }), { status: 404 })
          }

          const { data: template } = await supabase
            .from('whatsapp_templates')
            .select('content_template')
            .eq('is_default', true)
            .single();

          const contentTpl = template?.content_template || "*{{subject}}*\n\n{{content}}\n\n📌 *Cas pratique :*\n{{casus}}\n\n⚖️ *Référence légale :*\n{{reference}}\n\n📖 *Article (partie législative) :*\n{{article}}\n\n✅ *Bonne pratique RH :*\n{{best_practice}}\n\n_AdminRH-France_";
          const targetPhone = "+243821355337"; 
          
          // Récupérer l'index du PROCHAIN message à envoyer
          let nextMessageIndex = schedule?.message_index || 0;
          const sentResults = [];

          for (let i = 0; i < toSendCount; i++) {
            // On prend le message à l'index actuel
            const messageToSend = messages[nextMessageIndex % messages.length];

            const vars: Record<string, string> = {
              subject: messageToSend.subject || "Leçon du jour",
              content: messageToSend.content || "",
              casus: messageToSend.casus || "Scénario pratique non défini",
              reference: messageToSend.reference || "N/A",
              article: messageToSend.article || "Détail de l'article à venir",
              best_practice: messageToSend.best_practice || "Formalisez la décision par écrit et conservez la preuve de sa remise au salarié.",
            };

            const formattedContent = contentTpl.replace(
              /\{\{(subject|content|casus|reference|article|best_practice)\}\}/g,
              (_m: string, key: string) => vars[key] ?? "",
            );

            try {
              await sendWhatsAppMessage(targetPhone, formattedContent, messageToSend.subject);
              sentResults.push(messageToSend.subject);
              // Incrémentation immédiate pour pointer vers le SUIVANT
              nextMessageIndex++;
            } catch (err: any) {
              console.error(`Échec de l'envoi du message ${messageToSend.subject}:`, err.message);
              break;
            }
          }

          // Mise à jour finale du planning
          const { error: upsertError } = await supabase
            .from('daily_schedule')
            .upsert({
              id: 1,
              last_message_date: today,
              message_index: nextMessageIndex % messages.length,
              sent_count_today: lastSentCount + sentResults.length
            })

          if (upsertError) throw upsertError

          return new Response(JSON.stringify({ 
            success: true, 
            sentCount: sentResults.length,
            sentMessages: sentResults,
            nextIndex: currentIndex,
            totalSentToday: lastSentCount + sentResults.length
          }), {
            headers: { 'Content-Type': 'application/json' }
          })
        } catch (error: any) {
          console.error('Erreur dans le hook send-lessons:', error)
          return new Response(JSON.stringify({ error: error.message }), { status: 500 })
        }
      }
    }
  }
})
