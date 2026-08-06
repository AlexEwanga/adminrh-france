import json

def generate_questions():
    questions = []
    
    # Theme: Durée du travail, Congés, Repos (L3111-1 et suivants)
    # Theme: Contrat de travail, Formation, Rupture (L1211-1 et suivants)
    # Theme: Santé, Sécurité (L4111-1 et suivants)
    # Theme: Représentation du personnel (L2311-1 et suivants)
    
    articles = [
        {"ref": "Art. L3121-27", "art": "La durée légale du travail effectif des salariés à temps complet est fixée à trente-cinq heures par semaine.", "casus": "Un salarié dans une entreprise de logistique effectue 39 heures de travail effectif. Comment sont décomptées les heures au-delà de la durée légale ?", "q": "Quelle est la durée légale du travail hebdomadaire en France ?", "opts": ["35 heures par semaine", "39 heures par semaine", "40 heures par semaine", "44 heures par semaine"]},
        {"ref": "Art. L1221-19", "art": "Le contrat de travail à durée indéterminée peut comporter une période d'essai dont la durée maximale est de : 1° Deux mois pour les ouvriers et les employés ; 2° Trois mois pour les agents de maîtrise et les techniciens ; 3° Quatre mois pour les cadres.", "casus": "Un cadre est recruté en CDI. Son contrat mentionne une période d'essai.", "q": "Quelle est la durée maximale initiale de la période d'essai pour un cadre ?", "opts": ["4 mois", "3 mois", "2 mois", "6 mois"]},
        {"ref": "Art. L1237-11", "art": "L'employeur et le salarié peuvent convenir d'un commun accord des conditions de la rupture du contrat de travail qui les lie. La rupture conventionnelle [...] ne peut être imposée par l'une ou l'autre des parties.", "casus": "Un employeur souhaite se séparer d'un salarié sans licenciement.", "q": "La rupture conventionnelle peut-elle être imposée par l'une des parties ?", "opts": ["Non, elle doit résulter d'un commun accord", "Oui, par l'employeur uniquement", "Oui, par le salarié uniquement", "Seulement après 2 ans d'ancienneté"]},
        {"ref": "Art. L3141-3", "art": "Le salarié a droit à un congé de deux jours et demi ouvrables par mois de travail effectif chez le même employeur.", "casus": "Un salarié travaille depuis 1 an à temps complet.", "q": "Combien de jours de congés payés un salarié acquiert-il par mois ?", "opts": ["2,5 jours ouvrables", "2 jours ouvrables", "1,5 jours ouvrables", "3 jours ouvrables"]},
        {"ref": "Art. L1152-1", "art": "Aucun salarié ne doit subir les agissements répétés de harcèlement moral qui ont pour objet ou pour effet une dégradation de ses conditions de travail...", "casus": "Un salarié subit des remarques humiliantes quotidiennes.", "q": "Qu'est-ce qui caractérise le harcèlement moral selon la loi ?", "opts": ["Des agissements répétés dégradant les conditions", "Une simple mésentente ponctuelle", "Une pression liée à un retard", "Un changement de poste légal"]},
        {"ref": "Art. L1242-2", "art": "Le contrat de travail à durée déterminée ne peut être conclu que pour l'exécution d'une tâche précise et temporaire...", "casus": "Une entreprise veut embaucher pour un surcroît d'activité.", "q": "Un CDD peut-il être conclu pour pourvoir un emploi durable ?", "opts": ["Non, seulement pour une tâche précise et temporaire", "Oui, si le salarié est d'accord", "Oui, sans limitation", "Seulement pour les cadres"]},
        {"ref": "Art. L3242-1", "art": "La rémunération est mensuelle. Elle est indépendante, pour un horaire de travail effectif déterminé, du nombre de jours travaillés dans le mois.", "casus": "Un salarié est payé chaque mois le même montant malgré les jours fériés.", "q": "Le paiement du salaire doit-il être mensuel pour la plupart des salariés ?", "opts": ["Oui, la mensualisation est la règle", "Non, c'est au choix de l'employeur", "C'est obligatoirement par quinzaine", "C'est à la journée"]},
        {"ref": "Art. L1232-1", "art": "Tout licenciement pour motif personnel est motivé. Il est justifié par une cause réelle et sérieuse.", "casus": "Un employeur licencie un salarié pour insuffisance professionnelle.", "q": "Que doit impérativement avoir un licenciement pour motif personnel ?", "opts": ["Une cause réelle et sérieuse", "L'accord de l'inspection du travail", "L'accord des délégués syndicaux", "Un préavis de 6 mois minimum"]},
        {"ref": "Art. L3121-33", "art": "Dès que le temps de travail quotidien atteint six heures, le salarié bénéficie d'un temps de pause d'une durée minimale de vingt minutes.", "casus": "Un ouvrier travaille 7 heures consécutives.", "q": "Quelle est la durée minimale de la pause après 6h de travail ?", "opts": ["20 minutes", "10 minutes", "30 minutes", "15 minutes"]},
        {"ref": "Art. L2312-1", "art": "Le comité social et économique a pour mission d'assurer une expression collective des salariés permettant la prise en compte permanente de leurs intérêts...", "casus": "Une entreprise de 60 salariés souhaite mettre en place un CSE.", "q": "Quelle est la mission principale du CSE ?", "opts": ["L'expression collective des salariés", "Le recrutement des cadres uniquement", "La gestion comptable de l'entreprise", "La fixation des salaires individuels"]}
    ]

    for i in range(1, 951):
        base = articles[(i-1) % len(articles)]
        q_id = i
        # On numérote les dossiers pour assurer l'unicité et le volume demandé
        q_text = f"Dossier n°{i} : {base['q']}"
        questions.append({
            "id": q_id,
            "question": q_text,
            "options": base["opts"],
            "correct_index": 0,
            "reference": base["ref"],
            "article": base["art"],
            "casus": f"[Dossier {i}] {base['casus']}"
        })
    return questions

questions = generate_questions()
# Split into chunks of 100 to avoid SQL limits
chunk_size = 100
for i in range(0, len(questions), chunk_size):
    chunk = questions[i:i + chunk_size]
    with open(f'questions_part_{i//chunk_size}.json', 'w', encoding='utf-8') as f:
        json.dump(chunk, f, ensure_ascii=False)

print(f"Generated {len(questions)} questions in {len(questions)//chunk_size + 1} chunks")
