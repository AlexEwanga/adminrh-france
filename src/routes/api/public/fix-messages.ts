import { createFileRoute } from '@tanstack/react-router'
import { createClient } from '@supabase/supabase-js'

export const Route = createFileRoute('/api/public/fix-messages')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const authHeader = request.headers.get('apikey')
        if (!authHeader || authHeader !== process.env['SUPABASE_PUBLISHABLE_KEY']) {
          return new Response('Unauthorized', { status: 401 })
        }

        const supabaseUrl = process.env['SUPABASE_URL']!
        const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY']!
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        const fixes = [
          {
            subject: "La Rupture Conventionnelle",
            casus: "Un salarié et un employeur souhaitent mettre fin au contrat de travail d'un commun accord pour permettre au salarié de lancer son entreprise tout en bénéficiant du chômage. Quelle procédure doivent-ils suivre ?",
            reference: "Art. L1237-11",
            article: "L'employeur et le salarié peuvent convenir d'un commun accord des conditions de la rupture du contrat de travail qui les lie. La rupture conventionnelle, exclusive du licenciement ou de la démission, ne peut être imposée par l'une ou l'autre des parties. Elle résulte d'une convention signée par les parties au contrat. Elle est soumise aux dispositions de la présente section destinées à garantir la liberté du consentement des parties."
          },
          {
            subject: "Le Harcèlement Moral Institutionnel",
            casus: "Une grande entreprise met en place une politique de management par le stress visant à pousser les salariés les moins productifs à la démission. Est-ce légal ?",
            reference: "Art. L1152-1",
            article: "Aucun salarié ne doit subir les agissements répétés de harcèlement moral qui ont pour objet ou pour effet une dégradation de ses conditions de travail susceptible de porter atteinte à ses droits et à sa dignité, d'altérer sa santé physique ou mentale ou de compromettre son avenir professionnel."
          },
          {
            subject: "Embauche des Étrangers",
            casus: "Une entreprise souhaite recruter un ressortissant hors Union Européenne. Quelles sont les vérifications obligatoires concernant son titre de séjour ?",
            reference: "Art. L5221-8",
            article: "L'employeur s'assure auprès des administrations territorialement compétentes de l'existence du titre autorisant l'étranger à exercer une activité salariée en France, sauf si ce titre lui a été présenté."
          },
          {
            subject: "Obligation de Loyauté RH",
            casus: "Un responsable RH travaille pour un concurrent pendant ses congés payés. Manque-t-il à ses obligations ?",
            reference: "Art. L1222-1",
            article: "Le contrat de travail est exécuté de bonne foi."
          }
        ];

        for (const fix of fixes) {
          await supabase
            .from('messages')
            .update({
              casus: fix.casus,
              reference: fix.reference,
              article: fix.article
            })
            .ilike('subject', fix.subject);
        }

        return new Response(JSON.stringify({ success: true, fixed: fixes.length }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  }
})
