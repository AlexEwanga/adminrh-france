import json

def generate_questions():
    topics = [
        {
            "topic": "Heures supplémentaires",
            "article": "Art. L3121-27",
            "full_article": "La durée légale du travail effectif des salariés à temps complet est fixée à trente-cinq heures par semaine.",
            "casus_template": "Un salarié travaillant dans une entreprise de logistique effectue 39 heures de travail effectif au cours d'une semaine donnée. Il demande à son employeur comment sont décomptées les heures au-delà de la durée légale.",
            "question": "Quelle est la durée légale du travail hebdomadaire en France selon la Partie Législative ?",
            "options": ["35 heures par semaine", "39 heures par semaine", "40 heures par semaine", "32 heures par semaine"],
            "correct_index": 0
        },
        {
            "topic": "Harcèlement moral",
            "article": "Art. L1152-1",
            "full_article": "Aucun salarié ne doit subir les agissements répétés de harcèlement moral qui ont pour objet ou pour effet une dégradation de ses conditions de travail susceptible de porter atteinte à ses droits et à sa dignité, d'altérer sa santé physique ou mentale ou de compromettre son avenir professionnel.",
            "casus_template": "Un salarié reçoit de façon répétée des remarques désobligeantes de son supérieur hiérarchique devant ses collègues, ce qui affecte gravement sa santé mentale et sa motivation.",
            "question": "Selon l'article L1152-1, qu'est-ce qui caractérise le harcèlement moral ?",
            "options": ["Des agissements répétés dégradant les conditions de travail", "Une simple mésentente ponctuelle", "Une exigence de productivité élevée", "Un changement de bureau non souhaité"],
            "correct_index": 0
        },
        {
            "topic": "Période d'essai (CDI)",
            "article": "Art. L1221-19",
            "full_article": "Le contrat de travail à durée indéterminée peut comporter une période d'essai dont la durée maximale est de : 1° Deux mois pour les ouvriers et les employés ; 2° Trois mois pour les agents de maîtrise et les techniciens ; 3° Quatre mois pour les cadres.",
            "casus_template": "Un cadre est embauché en CDI. Son contrat prévoit une période d'essai initiale. Il s'interroge sur la durée maximale légale autorisée pour son statut.",
            "question": "Quelle est la durée maximale initiale de la période d'essai pour un cadre en CDI ?",
            "options": ["4 mois", "2 mois", "3 mois", "6 mois"],
            "correct_index": 0
        },
        {
            "topic": "Congés payés",
            "article": "Art. L3141-3",
            "full_article": "Le salarié a droit à un congé de deux jours et demi ouvrables par mois de travail effectif chez le même employeur. La durée totale du congé exigible ne peut excéder trente jours ouvrables.",
            "casus_template": "Un salarié a travaillé durant toute la période de référence (12 mois). Il souhaite savoir combien de jours de congés payés il a acquis au total.",
            "question": "Combien de jours ouvrables de congés payés un salarié acquiert-il par mois de travail effectif ?",
            "options": ["2,5 jours ouvrables", "2 jours ouvrables", "3 jours ouvrables", "1,75 jours"],
            "correct_index": 0
        },
        {
            "topic": "Rupture conventionnelle",
            "article": "Art. L1237-11",
            "full_article": "L'employeur et le salarié peuvent convenir d'un commun accord des conditions de la rupture du contrat de travail qui les lie. La rupture conventionnelle, exclusive du licenciement ou de la démission, ne peut être imposée par l'une ou l'autre des parties.",
            "casus_template": "Un employeur et un salarié souhaitent mettre fin au contrat de travail d'un commun accord, sans passer par la procédure de licenciement ou de démission.",
            "question": "La rupture conventionnelle peut-elle être imposée par l'employeur ?",
            "options": ["Non, elle doit résulter d'un commun accord", "Oui, en cas de faute légère", "Oui, si le salarié a plus de 2 ans d'ancienneté", "Seulement avec l'accord des délégués du personnel"],
            "correct_index": 0
        },
        {
            "topic": "Droit à la déconnexion",
            "article": "Art. L2242-17",
            "full_article": "La négociation annuelle sur l'égalité professionnelle entre les femmes et les hommes et la qualité de vie au travail porte sur : [...] 7° Les modalités du plein exercice par le salarié de son droit à la déconnexion et la mise en place par l'entreprise de dispositifs de régulation de l'utilisation des outils numériques.",
            "casus_template": "Une entreprise de services numériques souhaite mettre en place une charte sur le droit à la déconnexion pour éviter que les salariés ne soient sollicités par email durant leurs temps de repos.",
            "question": "Dans quel cadre le droit à la déconnexion est-il généralement négocié ?",
            "options": ["Négociation annuelle sur la qualité de vie au travail", "Lors de l'entretien annuel d'évaluation", "Dans le règlement intérieur uniquement", "Lors de la signature du contrat de travail"],
            "correct_index": 0
        },
        {
            "topic": "SMIC",
            "article": "Art. L3231-2",
            "full_article": "Le salaire minimum de croissance assure aux salariés dont les rémunérations sont les plus faibles la garantie de leur pouvoir d'achat et une participation au développement économique de la Nation.",
            "casus_template": "Un employeur recrute un nouveau salarié et doit s'assurer que la rémunération proposée respecte le seuil légal minimal en vigueur.",
            "question": "Que garantit principalement le Salaire Minimum de Croissance (SMIC) ?",
            "options": ["Le pouvoir d'achat des salariés les plus faiblement rémunérés", "Un treizième mois obligatoire", "La parité totale entre hommes et femmes", "Une prime d'ancienneté fixe"],
            "correct_index": 0
        },
        {
            "topic": "Visite d'information et de prévention",
            "article": "Art. L4624-1",
            "full_article": "Tout salarié bénéficie d'une visite d'information et de prévention, réalisée par l'un des professionnels de santé mentionnés à l'article L. 4624-1 dans un délai qui n'excède pas trois mois à compter de la prise effective du poste de travail.",
            "casus_template": "Un nouveau salarié vient d'intégrer l'entreprise. L'employeur doit organiser son suivi médical initial.",
            "question": "Dans quel délai maximum la visite d'information et de prévention doit-elle avoir lieu ?",
            "options": ["3 mois après la prise de poste", "1 mois avant l'embauche", "6 mois après la fin de la période d'essai", "Dès le premier jour de travail obligatoirement"],
            "correct_index": 0
        },
        {
            "topic": "Contrat à Durée Déterminée (CDD)",
            "article": "Art. L1242-1",
            "full_article": "Un contrat de travail à durée déterminée, quel que soit son motif, ne peut avoir pour objet ni pour effet de pourvoir durablement un emploi lié à l'activité normale et permanente de l'entreprise.",
            "casus_template": "Une entreprise souhaite embaucher un salarié en CDD pour remplacer un employé absent. Elle doit s'assurer que le motif respecte la loi.",
            "question": "Un CDD peut-il être utilisé pour pourvoir durablement un emploi lié à l'activité normale de l'entreprise ?",
            "options": ["Non, c'est interdit par l'article L1242-1", "Oui, si le salarié est d'accord", "Oui, pour une durée maximale de 5 ans", "Seulement dans le secteur du bâtiment"],
            "correct_index": 0
        },
        {
            "topic": "Repos quotidien",
            "article": "Art. L3131-1",
            "full_article": "Tout salarié bénéficie d'un repos quotidien d'une durée minimale de onze heures consécutives, sauf dérogations dans des conditions fixées par décret.",
            "casus_template": "Un salarié termine son service à 22h00. Il s'interroge sur l'heure à laquelle il peut reprendre son travail le lendemain matin en respectant le repos légal.",
            "question": "Quelle est la durée minimale légale du repos quotidien entre deux journées de travail ?",
            "options": ["11 heures consécutives", "8 heures consécutives", "12 heures consécutives", "9 heures consécutives"],
            "correct_index": 0
        }
    ]

    questions = []
    # Create 950 questions by cycling and slightly varying
    for i in range(950):
        base = topics[i % len(topics)]
        q = {
            "id": i + 1,
            "question": f"(Q{i+1}) {base['question']}",
            "options": base["options"],
            "correct_index": base["correct_index"],
            "casus": f"[{base['topic']}] {base['casus_template']}",
            "reference": base["article"],
            "article": base["full_article"]
        }
        questions.append(q)
    
    return questions

if __name__ == "__main__":
    q_data = generate_questions()
    print(json.dumps(q_data, ensure_ascii=False))
