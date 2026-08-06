import json
import os

def create_sql_script():
    sql = "DO $$\nDECLARE\n    q_list jsonb := '[]'::jsonb;\nBEGIN\n"
    
    parts = []
    for i in range(10):
        with open(f'questions_part_{i}.json', 'r') as f:
            parts.append(json.load(f))
    
    # We will build the JSON list in the migration
    # Since it's still large, we'll do it part by part in SQL
    for idx, part in enumerate(parts):
        part_json = json.dumps(part, ensure_ascii=False).replace("'", "''")
        sql += f"    q_list := q_list || '{part_json}'::jsonb;\n"
    
    sql += "    UPDATE public.quizzes SET questions = q_list WHERE id = 8;\n"
    sql += "END $$;"
    
    with open('update_quiz.sql', 'w') as f:
        f.write(sql)

if __name__ == "__main__":
    create_sql_script()
