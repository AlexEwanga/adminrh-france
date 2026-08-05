import { createFileRoute } from '@tanstack/react-router'
import { createClient } from '@supabase/supabase-js'
import { sendWhatsAppMessage } from '@/lib/wpsent.server'

export const Route = createFileRoute('/api/public/hooks/send-lessons')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // En Lovable Cloud, la anon key s'utilise comme 'apikey'
        const authHeader = request.headers.get('apikey')
        if (!authHeader || authHeader !== process.env['SUPABASE_PUBLISHABLE_KEY']) {
          return new Response('Unauthorized', { status: 401 })
        }

        const supabaseUrl = process.env['SUPABASE_URL']!
        const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY']!
        
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        try {
          // 1. Récupérer l'état actuel de la planification
          const { data: schedule, error: schedError } = await supabase
            .from('daily_schedule')
            .select('*')
            .single()

          if (schedError && schedError.code !== 'PGRST116') throw schedError

          let messageIndex = schedule?.message_index || 0
          const lastDate = schedule?.last_message_date
          const today = new Date().toISOString().split('T')[0]

          // Réinitialiser l'index si c'est un nouveau jour (optionnel, selon la logique souhaitée)
          if (lastDate !== today) {
            messageIndex = 0
          }

          // 2. Récupérer le message à envoyer
          const { data: messages, error: msgError } = await supabase
            .from('messages')
            .select('*')
            .eq('is_active', true)
            .order('id', { ascending: true })

          if (msgError) throw msgError
          if (!messages || messages.length === 0) {
            return new Response(JSON.stringify({ message: 'No active messages found' }), { status: 200 })
          }

          const messageToSend = messages[messageIndex % messages.length]

          // 3. Envoi WhatsApp via WPSent
          const formattedContent = `*${messageToSend.subject}*\n\n${messageToSend.content}\n\n_AdminRH-France_`;
          
          // On récupère le numéro de téléphone de l'utilisateur (à adapter selon votre logique d'abonnement)
          // Ici on simule un envoi général ou on pourrait boucler sur les profils
          await sendWhatsAppMessage("NUMERO_DESTINATAIRE", formattedContent);

          // 4. Mettre à jour le planning pour le prochain envoi
          const nextIndex = (messageIndex + 1) % messages.length
          const { error: upsertError } = await supabase
            .from('daily_schedule')
            .upsert({
              id: 1,
              last_message_date: today,
              message_index: nextIndex
            })

          if (upsertError) throw upsertError

          return new Response(JSON.stringify({ 
            success: true, 
            sent: messageToSend.subject,
            next_index: nextIndex 
          }), {
            headers: { 'Content-Type': 'application/json' }
          })
        } catch (error: any) {
          console.error('Error in send-lessons hook:', error)
          return new Response(JSON.stringify({ error: error.message }), { status: 500 })
        }
      }
    }
  }
})

