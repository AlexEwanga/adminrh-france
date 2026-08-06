-- Verify and Fix RLS for learning_stats
DROP POLICY IF EXISTS "Users can view own stats" ON public.learning_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON public.learning_stats;
DROP POLICY IF EXISTS "Users can insert own stats" ON public.learning_stats;

CREATE POLICY "Users can view own stats" ON public.learning_stats
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON public.learning_stats
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON public.learning_stats
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE ON public.learning_stats TO authenticated;
GRANT ALL ON public.learning_stats TO service_role;

-- Ensure RLS is enabled
ALTER TABLE public.learning_stats ENABLE ROW LEVEL SECURITY;