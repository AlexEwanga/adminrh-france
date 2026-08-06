-- Insertion des quiz par défaut pour l'application AdminRH-France
INSERT INTO public.quizzes (title, category, difficulty, questions) VALUES
(
  'Bases du Droit du Travail',
  'Droit du Travail',
  1,
  '[
    {"question": "Quelle est la durée légale du travail hebdomadaire en France ?", "options": ["32h", "35h", "39h", "40h"], "correctAnswer": "35h"},
    {"question": "Quel est le délai de prévenance pour une rupture de période d''essai après 1 mois de présence ?", "options": ["24 heures", "48 heures", "2 semaines", "1 mois"], "correctAnswer": "48 heures"},
    {"question": "Quelle est la durée maximale d''un CDD (renouvellements compris) en règle générale ?", "options": ["6 mois", "12 mois", "18 mois", "24 mois"], "correctAnswer": "18 mois"}
  ]'::jsonb
),
(
  'Recrutement & Intégration',
  'RH Management',
  2,
  '[
    {"question": "Quelle mention est obligatoire dans une promesse d''embauche ?", "options": ["La couleur des bureaux", "La rémunération", "Le nom du précédent titulaire", "La marque de l''ordinateur"], "correctAnswer": "La rémunération"},
    {"question": "Le registre unique du personnel est-il obligatoire dès le 1er salarié ?", "options": ["Oui", "Non, à partir de 11", "Non, à partir de 50", "Seulement pour les CDD"], "correctAnswer": "Oui"}
  ]'::jsonb
),
(
  'Gestion de la Paie',
  'Paie',
  3,
  '[
    {"question": "Qu''est-ce que le plafond mensuel de la sécurité sociale (PMSS) ?", "options": ["Le salaire maximum", "Une base de calcul des cotisations", "Le montant du SMIC", "Une aide de l''État"], "correctAnswer": "Une base de calcul des cotisations"},
    {"question": "Quel taux de CSG est majoritairement appliqué sur les salaires ?", "options": ["6.8%", "9.2%", "15%", "20%"], "correctAnswer": "9.2%"}
  ]'::jsonb
);

-- S'assurer que les permissions sont en place
GRANT SELECT ON public.quizzes TO authenticated;
GRANT SELECT ON public.quizzes TO anon;
