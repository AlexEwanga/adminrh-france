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
            casus: "Une grande entreprise met en place une politique de management par le stress visant à pousser les salariés les moins productifs à la démission (méthode de 'départs forcés'). L'entreprise peut-elle être condamnée même si aucun individu n'est spécifiquement ciblé ?",
            reference: "Art. L1152-1",
            article: "Aucun salarié ne doit subir les agissements répétés de harcèlement moral qui ont pour objet ou pour effet une dégradation de ses conditions de travail susceptible de porter atteinte à ses droits et à sa dignité, d'altérer sa santé physique ou mentale ou de compromettre son avenir professionnel. La jurisprudence (France Télécom) a étendu cette protection au harcèlement dit 'institutionnel' découlant de la politique managériale."
          },
          {
            subject: "Embauche des Étrangers",
            casus: "Un candidat hors Union Européenne se présente pour un poste de développeur. L'employeur doit-il vérifier son titre de séjour et quelle est la démarche si le candidat n'a pas encore d'autorisation de travail ?",
            reference: "Art. L5221-8",
            article: "L'employeur s'assure auprès des administrations territorialement compétentes de l'existence du titre autorisant l'étranger à exercer une activité salariée en France, sauf si ce titre lui a été présenté. En cas d'absence de titre, une demande d'autorisation de travail doit être déposée sur le portail de l'administration numérique des étrangers en France (ANEF) après vérification de la situation de l'emploi (publication de l'offre pendant 3 semaines)."
          },
          {
            subject: "Obligation de Loyauté RH",
            casus: "Un Responsable RH entretient une relation personnelle étroite avec une représentante syndicale de l'entreprise. Cette situation crée-t-elle un conflit d'intérêts justifiant une sanction pour manquement à la loyauté ?",
            reference: "Art. L1222-1",
            article: "Le contrat de travail est exécuté de bonne foi. L'obligation de loyauté impose au salarié, et particulièrement au cadre RH, de ne pas se placer dans une situation de conflit d'intérêts. La jurisprudence valide le licenciement si le manquement à la discrétion ou à la neutralité est avéré et préjudiciable à l'entreprise."
          },
          {
            subject: "Culture dEntreprise en France",
            casus: "Une équipe française prend systématiquement 1h30 de pause déjeuner et refuse de répondre aux emails après 18h. Est-ce un comportement protégé par la loi ?",
            reference: "Art. L2242-17",
            article: "La négociation annuelle sur l'égalité professionnelle entre les femmes et les hommes et la qualité de vie au travail porte sur les modalités du plein exercice par le salarié de son droit à la déconnexion et la mise en place par l'entreprise de dispositifs de régulation de l'utilisation des outils numériques, en vue d'assurer le respect des temps de repos et de congé ainsi que de la vie personnelle et familiale."
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
