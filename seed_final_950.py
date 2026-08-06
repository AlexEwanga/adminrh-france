import json
import random

def generate_question(q_id):
    topics = [
        {
            "topic": "Licenciement pour motif personnel",
            "ref": "Article L1232-1",
            "article": "Tout licenciement pour motif personnel doit être justifié par une cause réelle et sérieuse.",
            "casus": "Un employeur licencie un salarié pour 'incompatibilité d'humeur' sans faits précis. Le salarié conteste.",
            "q": "Le licenciement pour 'incompatibilité d'humeur' sans faits matériellement vérifiables est-il valable ?",
            "options": ["Non, il manque une cause réelle et sérieuse", "Oui, c'est un motif personnel suffisant", "Seulement si le salarié est cadre", "Oui, si c'est mentionné dans le contrat"],
            "correct": 0
        },
        {
            "topic": "Heures supplémentaires",
            "ref": "Article L3121-27",
            "article": "La durée légale du travail effectif des salariés à temps complet est fixée à trente-cinq heures par semaine.",
            "casus": "Jean a effectué 42 heures de travail effectif cette semaine. Son contrat ne prévoit pas de convention de forfait.",
            "q": "Combien d'heures supplémentaires Jean a-t-il effectuées ?",
            "options": ["7 heures", "5 heures", "2 heures", "Aucune, s'il est payé au mois"],
            "correct": 0
        },
        {
            "topic": "Congés payés - Période de référence",
            "ref": "Article L3141-10",
            "article": "Un accord d'entreprise ou d'établissement peut fixer le début de la période de référence.",
            "casus": "Dans l'entreprise X, il n'y a pas d'accord. Un salarié demande quand commence l'acquisition de ses congés.",
            "q": "À défaut d'accord, quelle est la date de début de la période de référence pour les congés ?",
            "options": ["1er juin", "1er janvier", "Date d'embauche", "1er septembre"],
            "correct": 0
        },
        {
            "topic": "Rupture conventionnelle - Délai de rétractation",
            "ref": "Article L1237-13",
            "article": "À compter de la date de la signature par les deux parties, chacune d'entre elles dispose d'un délai de quinze jours calendaires pour exercer son droit de rétractation.",
            "casus": "La rupture a été signée le 1er du mois. L'employeur change d'avis le 10.",
            "q": "L'employeur peut-il se rétracter le 10ème jour après la signature ?",
            "options": ["Oui, le délai est de 15 jours calendaires", "Non, seul le salarié peut se rétracter", "Non, le délai est de 7 jours", "Oui, mais il doit payer une indemnité"],
            "correct": 0
        },
        {
            "topic": "Harcèlement moral - Charge de la preuve",
            "ref": "Article L1154-1",
            "article": "Le salarié présente des éléments de fait laissant supposer l'existence d'un harcèlement. Au vu de ces éléments, il incombe à la partie défenderesse de prouver que ces agissements ne constituent pas un harcèlement.",
            "casus": "Une salariée se plaint de brimades répétées. Elle apporte des emails et des témoignages.",
            "q": "Qui doit prouver que les agissements ne sont pas du harcèlement ?",
            "options": ["L'employeur (partie défenderesse)", "La salariée exclusivement", "L'inspecteur du travail", "Le juge"],
            "correct": 0
        }
    ]
    
    base = topics[q_id % len(topics)]
    options = list(base["options"])
    correct_val = options[base["correct"]]
    random.shuffle(options)
    correct_idx = options.index(correct_val)
    
    return {
        "id": q_id,
        "question": f"({q_id}) {base['q']}",
        "options": options,
        "correct_index": correct_idx,
        "casus": base["casus"],
        "reference": base["ref"],
        "article": base["article"]
    }

all_questions = [generate_question(i) for i in range(1, 951)]

# Split into 4 chunks to avoid migration size limits
chunks = []
for i in range(0, 950, 240):
    chunks.append(all_questions[i:i+240])

for i, chunk in enumerate(chunks):
    with open(f"seed_part_{i+1}.sql", "w") as f:
        json_data = json.dumps(chunk).replace("'", "''")
        if i == 0:
            f.write(f"UPDATE public.quizzes SET questions = '{json_data}'::jsonb WHERE title = 'Droit du travail - Session Ultime';")
        else:
            # PostgreSQL jsonb concatenation
            f.write(f"UPDATE public.quizzes SET questions = questions || '{json_data}'::jsonb WHERE title = 'Droit du travail - Session Ultime';")
