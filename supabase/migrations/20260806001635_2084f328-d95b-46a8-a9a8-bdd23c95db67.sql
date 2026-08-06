-- Correction des permissions pour les quiz
GRANT SELECT ON public.quizzes TO authenticated;
GRANT SELECT ON public.quizzes TO anon;
GRANT ALL ON public.quizzes TO service_role;

-- Vérifier si la politique "Authenticated users can view quizzes" est correcte
DROP POLICY IF EXISTS "Authenticated users can view quizzes" ON public.quizzes;
CREATE POLICY "Anyone can view quizzes" ON public.quizzes
FOR SELECT USING (true);
