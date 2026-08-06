import json
import random

topics = [
    {"topic": "Harcèlement moral", "ref": "Article L1152-1", "article": "Aucun salarié ne doit subir les agissements répétés de harcèlement moral...", "casus": "Un manager envoie systématiquement des emails à minuit..."},
    {"topic": "Période d'essai", "ref": "Article L1221-19", "article": "Le contrat de travail à durée indéterminée peut comporter une période d'essai...", "casus": "Marc est embauché comme cadre. Période d'essai de 4 mois..."},
    {"topic": "Congés payés", "ref": "Article L3141-3", "article": "Le salarié a droit à un congé de deux jours et demi ouvrables par mois...", "casus": "Julie travaille depuis 6 mois. Elle souhaite prendre 15 jours..."},
    {"topic": "Rupture conventionnelle", "ref": "Article L1237-11", "article": "L'employeur et le salarié peuvent convenir d'un commun accord...", "casus": "Un employeur propose une rupture conventionnelle à un salarié protégé..."},
    {"topic": "Heures supplémentaires", "ref": "Article L3121-36", "article": "A défaut d'accord, les heures supplémentaires accomplies au-delà de la durée légale...", "casus": "Léa a travaillé 45 heures cette semaine. L'employeur refuse de payer..."}
]

questions = []
for i in range(100):
    base = random.choice(topics)
    q_id = i + 1
    options = [f"Réponse correcte {q_id}", f"Faux A {q_id}", f"Faux B {q_id}", f"Faux C {q_id}"]
    random.shuffle(options)
    correct_idx = options.index(f"Réponse correcte {q_id}")
    questions.append({
        "id": q_id,
        "question": f"Question {q_id}: {base['topic']} - {base['ref']}",
        "options": options,
        "correct_index": correct_idx,
        "casus": f"Cas {q_id}: {base['casus']}",
        "reference": base['ref'],
        "article": base['article']
    })

sql = f"INSERT INTO public.quizzes (title, category, difficulty, questions) VALUES ('Droit du travail - Ultime', 'Droit du travail', 2, '{json.dumps(questions).replace(\"'\", \"''\")}'::jsonb);"
with open('seed_100.sql', 'w') as f:
    f.write(sql)
