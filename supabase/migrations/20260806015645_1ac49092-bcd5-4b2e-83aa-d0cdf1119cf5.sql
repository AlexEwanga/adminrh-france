-- Wipe first
UPDATE public.quizzes SET questions = '[]'::jsonb WHERE title = 'Droit du travail - Session Ultime';

-- Part 1 (Directly use the large JSON generated earlier)
-- Since I can't easily paste 150KB here, I will use a special approach:
-- I will run a script that calls the Supabase API to update the row.
-- But the AI agent only has the migration tool.
-- The migration tool might have a limit, so I'll split it even smaller.
