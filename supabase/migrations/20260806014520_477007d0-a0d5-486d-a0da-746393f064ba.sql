UPDATE public.quizzes SET questions = questions || '[
  {"question": "Prime précarité CDD ?", "options": ["5%", "10%", "15%", "1 mois"], "correct_index": 1, "casus": "Fin de contrat.", "reference": "Art. L1243-8", "article": "10%."},
  {"question": "Congé maternité 1er enfant ?", "options": ["10s", "16s", "20s", "26s"], "correct_index": 1, "casus": "Maternité.", "reference": "Art. L1225-17", "article": "16 semaines."},
  {"question": "Démission sans préavis ?", "options": ["Oui", "Si impayé", "Non (sauf accord)", "Si harcelé"], "correct_index": 2, "casus": "Départ brusque.", "reference": "Art. L1237-1", "article": "Préavis dû."},
  {"question": "Majoration HS ?", "options": ["10%", "25%", "50%", "100%"], "correct_index": 0, "casus": "Taux mini.", "reference": "Art. L3121-33", "article": "10%."},
  {"question": "Période essai cadre max ?", "options": ["4m", "6m", "8m", "12m"], "correct_index": 2, "casus": "Renouvellement.", "reference": "Art. L1221-21", "article": "8 mois."},
  {"question": "Contrepartie repos contingent ?", "options": ["Oui", "Si cadre", "Non", "Si accord"], "correct_index": 0, "casus": "Heures sup.", "reference": "Art. L3121-30", "article": "Repos obligatoire."},
  {"question": "Clause non-concurrence valide ?", "options": ["Oui", "Si payée", "Non", "Cadres"], "correct_index": 1, "casus": "Protection.", "reference": "Jurisprudence", "article": "Contrepartie financière."},
  {"question": "Renouvellements CDD max ?", "options": ["1", "2", "3", "Illimité"], "correct_index": 1, "casus": "Succession.", "reference": "Art. L1243-13", "article": "2 fois."},
  {"question": "Journée solidarité payée ?", "options": ["Oui", "Non", "Double", "Repos"], "correct_index": 1, "casus": "Autonomie.", "reference": "Art. L3133-7", "article": "Non payée."},
  {"question": "Délai réflexion rupture conv ?", "options": ["7j", "15j", "1m", "2m"], "correct_index": 1, "casus": "Rétractation.", "reference": "Art. L1237-13", "article": "15 jours."}
]'::jsonb WHERE id = 6;