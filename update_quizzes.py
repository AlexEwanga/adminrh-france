import json
import os
import subprocess

for i in range(10):
    file_path = f'questions_part_{i}.json'
    with open(file_path, 'r', encoding='utf-8') as f:
        questions = json.load(f)
        q_json = json.dumps(questions, ensure_ascii=False).replace("'", "''")
        
        if i == 0:
            # First chunk: overwrite with NEW array
            sql = f"UPDATE public.quizzes SET questions = '{q_json}'::jsonb WHERE id = 8;"
        else:
            # Subsequent chunks: append to existing array
            sql = f"UPDATE public.quizzes SET questions = questions || '{q_json}'::jsonb WHERE id = 8;"
        
        # We use the dispatcher via a temporary shell command or just prepare the SQL
        # Actually, let's just print the SQL commands to be executed via dispatch
        print(f"--- START SQL PART {i} ---")
        print(sql)
        print(f"--- END SQL PART {i} ---")

