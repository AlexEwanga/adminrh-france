UPDATE public.quizzes SET questions = questions || '[
  {"question": "Licenciement verbal ?", "options": ["Valable", "Irrégulier", "Sans cause", "Nul"], "correct_index": 2, "casus": "Pas d''écrit.", "reference": "Jurisprudence", "article": "Ecrit obligatoire."},
  {"question": "Durée max travail hebdo ?", "options": ["44h", "48h", "50h", "60h"], "correct_index": 1, "casus": "Pic activité.", "reference": "Art. L3121-20", "article": "48h max."},
  {"question": "Repos hebdo min ?", "options": ["24h", "35h", "48h", "Aucun"], "correct_index": 1, "casus": "Weekend.", "reference": "Art. L3132-2", "article": "35h."},
  {"question": "Règlement intérieur à ?", "options": ["11", "20", "50", "100"], "correct_index": 2, "casus": "PME.", "reference": "Art. L1311-2", "article": "50 salariés."},
  {"question": "Heures nuit ?", "options": ["21h-6h", "22h-5h", "23h-6h", "20h-7h"], "correct_index": 0, "casus": "Travail nocturne.", "reference": "Art. L3122-2", "article": "21h à 6h."},
  {"question": "Contesté licenciement éco ?", "options": ["6m", "12m", "2 ans", "5 ans"], "correct_index": 1, "casus": "Eco.", "reference": "Art. L1235-7", "article": "12 mois."},
  {"question": "Portefeuille client clause ?", "options": ["Oui", "Si cadre", "Non", "Si secret"], "correct_index": 1, "casus": "Non-concurrence.", "reference": "Jurisprudence", "article": "Financière."},
  {"question": "Visite médicale embauche ?", "options": ["Avant", "Dans 3 mois", "Dans 6 mois", "Optionnel"], "correct_index": 1, "casus": "Arrivée.", "reference": "Art. R4624-10", "article": "3 mois max."},
  {"question": "Grève salaire ?", "options": ["Maintenu", "Supprimé", "Réduit", "Prime"], "correct_index": 1, "casus": "Conflit.", "reference": "Jurisprudence", "article": "Retenue salaire."},
  {"question": "Télétravail imposé ?", "options": ["Non", "Si pandémie", "Oui", "Accord CSE"], "correct_index": 1, "casus": "Circonstances.", "reference": "Art. L1222-11", "article": "Force majeure."}
]'::jsonb WHERE id = 6;