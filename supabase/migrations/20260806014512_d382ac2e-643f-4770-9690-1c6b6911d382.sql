UPDATE public.quizzes SET questions = questions || '[
  {"question": "Quelle est la durée légale du travail effectif ?", "options": ["32h", "35h", "39h", "40h"], "correct_index": 1, "casus": "M. Martin travaille 37h.", "reference": "Art. L3121-27", "article": "35h par semaine."},
  {"question": "Délai prévenance rupture essai (3 mois) ?", "options": ["24h", "48h", "2 semaines", "1 mois"], "correct_index": 3, "casus": "Rupture après 4 mois.", "reference": "Art. L1221-25", "article": "1 mois."},
  {"question": "CDD pour emploi permanent ?", "options": ["Oui", "Si accord", "Non", "Cadres"], "correct_index": 2, "casus": "Remplacement définitif.", "reference": "Art. L1242-1", "article": "Interdit."},
  {"question": "Délai remise bulletin de paie ?", "options": ["Paiement", "15 jours", "Fin mois", "Demande"], "correct_index": 0, "casus": "Remise tardive.", "reference": "Art. L3243-2", "article": "Lors du paiement."},
  {"question": "Repos quotidien minimal ?", "options": ["9h", "11h", "12h", "24h"], "correct_index": 1, "casus": "Repos entre deux jours.", "reference": "Art. L3131-1", "article": "11h."},
  {"question": "Seuil CSE obligatoire ?", "options": ["11", "20", "50", "250"], "correct_index": 0, "casus": "Petite entreprise.", "reference": "Art. L2311-2", "article": "11 salariés."},
  {"question": "Durée max CDD ?", "options": ["12m", "18m", "24m", "36m"], "correct_index": 1, "casus": "Contrat long.", "reference": "Art. L1242-8-1", "article": "18 mois."},
  {"question": "Droit déconnexion ?", "options": ["Eteindre", "Ne pas répondre", "Pas net", "Pas PC"], "correct_index": 1, "casus": "Weekend.", "reference": "Art. L2242-17", "article": "Repos numérique."},
  {"question": "Indemnité licenciement faute grave ?", "options": ["Oui", "Réduite", "Non", "Si 10 ans"], "correct_index": 2, "casus": "Faute lourde.", "reference": "Art. L1234-9", "article": "Aucune."},
  {"question": "Entretien professionnel tous les ?", "options": ["1 an", "2 ans", "3 ans", "5 ans"], "correct_index": 1, "casus": "Evolution.", "reference": "Art. L6315-1", "article": "2 ans."}
]'::jsonb WHERE id = 6;