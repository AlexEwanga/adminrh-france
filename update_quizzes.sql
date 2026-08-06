UPDATE public.quizzes SET questions = '[
  {"question": "Quelle est la durée légale du travail hebdomadaire en France ?", "options": ["32h", "35h", "39h", "40h"], "correct_index": 1},
  {"question": "Quel document régit la relation individuelle entre l''employeur et le salarié ?", "options": ["Le règlement intérieur", "La convention collective", "Le contrat de travail", "Le code du travail"], "correct_index": 2},
  {"question": "Quelle est la durée maximale de la période d''essai pour un employé en CDI (hors renouvellement) ?", "options": ["1 mois", "2 mois", "3 mois", "4 mois"], "correct_index": 1},
  {"question": "Quel est l''âge minimum légal pour travailler en France (sauf dérogations) ?", "options": ["14 ans", "15 ans", "16 ans", "18 ans"], "correct_index": 2},
  {"question": "Un CDD peut-il être rompu avant son terme pour une embauche en CDI ?", "options": ["Non, jamais", "Oui, avec préavis", "Oui, sans préavis", "Seulement si l''employeur est d''accord"], "correct_index": 1},
  {"question": "Quelle est la durée minimale du repos quotidien ?", "options": ["8h", "10h", "11h", "12h"], "correct_index": 2},
  {"question": "Combien de jours de congés payés un salarié acquiert-il par mois de travail effectif ?", "options": ["2 jours", "2,5 jours", "3 jours", "5 jours"], "correct_index": 1},
  {"question": "Le SMIC est réévalué au minimum tous les :", "options": ["6 mois", "Ans", "2 ans", "5 ans"], "correct_index": 1}
]'::jsonb, casus = 'Un salarié en CDI depuis 3 ans souhaite démissionner pour rejoindre une autre entreprise. Il vous demande quelle est la durée de son préavis. En l''absence de précisions dans le contrat, c''est la convention collective ou la loi qui s''applique. Dans ce cas précis, le respect des procédures de rupture est essentiel pour éviter les litiges.' WHERE title = 'Bases du Droit du Travail';

UPDATE public.quizzes SET questions = '[
  {"question": "Quelle mention est obligatoire dans une offre d''emploi ?", "options": ["L''âge souhaité", "Le sexe du candidat", "L''intitulé du poste", "La situation familiale"], "correct_index": 2},
  {"question": "Combien de fois un CDD peut-il être renouvelé au maximum ?", "options": ["1 fois", "2 fois", "3 fois", "Illimité"], "correct_index": 1},
  {"question": "Qu''est-ce que l''onboarding ?", "options": ["Le licenciement", "L''entretien annuel", "Le processus d''intégration", "La sélection des CV"], "correct_index": 2},
  {"question": "Quel délai de carence s''applique entre deux CDD sur le même poste (contrat > 14 jours) ?", "options": ["Pas de délai", "1/3 de la durée du contrat précédent", "1/2 de la durée du contrat précédent", "1 mois fixe"], "correct_index": 1},
  {"question": "La déclaration préalable à l''embauche (DPAE) doit être faite :", "options": ["Avant la prise de poste", "Le jour même", "Dans les 48h", "À la fin du mois"], "correct_index": 0},
  {"question": "Un employeur peut-il demander le casier judiciaire pour n''importe quel poste ?", "options": ["Oui", "Non, seulement si justifié par la nature du poste", "Seulement pour les cadres", "Seulement pour les CDI"], "correct_index": 1}
]'::jsonb, casus = 'Une candidate se présente pour un poste de comptable. Lors de l''entretien, elle mentionne être enceinte. L''employeur peut-il écarter sa candidature pour ce motif ? Non, cela constituerait une discrimination. La protection de la maternité est un pilier du droit du travail français.' WHERE title = 'Recrutement & Intégration';

UPDATE public.quizzes SET questions = '[
  {"question": "Quelle est la part patronale approximative des cotisations sociales ?", "options": ["10-15%", "20-25%", "40-45%", "60-65%"], "correct_index": 2},
  {"question": "Que signifie CSG ?", "options": ["Cotisation Sociale Globale", "Contribution Sociale Généralisée", "Charge Sociale Groupée", "Calcul Standard de Gestion"], "correct_index": 1},
  {"question": "Le bulletin de paie doit-il obligatoirement mentionner la convention collective ?", "options": ["Oui", "Non", "Seulement si le salarié le demande", "Seulement pour les grandes entreprises"], "correct_index": 0},
  {"question": "Quelle est la périodicité obligatoire du versement du salaire ?", "options": ["Toutes les semaines", "Tous les 15 jours", "Au moins une fois par mois", "Libre"], "correct_index": 2},
  {"question": "L''indemnité de fin de contrat (prime de précarité) en CDD est de :", "options": ["5%", "10%", "15%", "20%"], "correct_index": 1},
  {"question": "Les heures supplémentaires au-delà de 35h sont majorées au minimum de :", "options": ["10%", "25%", "50%", "100%"], "correct_index": 1}
]'::jsonb, casus = 'Un salarié constate une erreur sur son bulletin de paie concernant ses heures supplémentaires. L''employeur dispose d''un délai de prescription de 3 ans pour régulariser les salaires, dans un sens comme dans l''autre. Une communication transparente est la clé pour maintenir le climat social.' WHERE title = 'Gestion de la Paie';
