import json
import os

# Configuration Supabase mockée pour le script local (on génère le SQL)
# Mais ici on va directement utiliser supabase--read_query via Lovable.
# Donc je vais générer un fichier SQL et l'exécuter.

with open('src/lib/all_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

with open('src/lib/lessons.json', 'r', encoding='utf-8') as f:
    lessons = json.load(f)

# On va vider et remplir les tables messages et quiz_results (stats) pour la cohérence
# Et surtout mettre à jour la banque de dossiers.

sql_statements = []

# Vider les leçons (messages) et les remplir avec les 1000 nouvelles
sql_statements.append("TRUNCATE public.messages CASCADE;")
for l in lessons:
    # Escape single quotes for SQL
    subject = l['subject'].replace("'", "''")
    content = l['content'].replace("'", "''")
    casus = l['casus'].replace("'", "''")
    reference = l['reference'].replace("'", "''")
    article = l['article'].replace("'", "''")
    best_practice = l['best_practice'].replace("'", "''")
    source = l['source'].replace("'", "''")
    tag = l['tag'].replace("'", "''")
    
    sql_statements.append(f"INSERT INTO public.messages (subject, content, casus, reference, article, best_practice, source, tag, is_active) VALUES ('{subject}', '{content}', '{casus}', '{reference}', '{article}', '{best_practice}', '{source}', '{tag}', true);")

# On ne peut pas facilement insérer 1000 questions en SQL via une seule chaîne (limite de taille)
# Mais on a déjà all_questions.json qui est utilisé par le frontend.
# On va s'assurer que le quiz "Session Ultime" existe bien.
sql_statements.append("INSERT INTO public.quizzes (id, title, description, category, difficulty, duration_minutes, questions) VALUES (8, 'Session Ultime', 'La banque complète de 1000 questions sur le Droit du Travail.', 'Droit du Travail', 'Expert', 60, '[]') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;")

with open('update_data.sql', 'w', encoding='utf-8') as f:
    f.write("\n".join(sql_statements))

