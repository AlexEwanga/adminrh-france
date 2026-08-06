import json
import os
from supabase import create_client

url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("sb_publishable_Ro609uhV9sEp-QSZ3_VgmQ_LaK63auE") # Using publishable key for read
supabase = create_client(url, key)

res = supabase.table("quizzes").select("id, questions").eq("id", 8).execute()
if res.data:
    questions = res.data[0].get("questions", [])
    print(f"Total questions in DB for Quiz 8: {len(questions)}")
    
    # Check for duplicates or missing data
    ids = [q.get('id') for q in questions]
    unique_ids = set(ids)
    print(f"Unique IDs: {len(unique_ids)}")
    
    # Check first and last for quality
    if len(questions) > 0:
        print("\nFirst Question Sample:")
        print(json.dumps(questions[0], indent=2, ensure_ascii=False))
    if len(questions) > 1:
        print("\nLast Question Sample:")
        print(json.dumps(questions[-1], indent=2, ensure_ascii=False))
else:
    print("Quiz 8 not found")
