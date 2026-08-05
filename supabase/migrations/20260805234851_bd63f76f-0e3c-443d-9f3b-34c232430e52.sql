-- Supprimer les données de démonstration
DELETE FROM public.messages;
DELETE FROM public.quizzes;

-- Créer la table des objectifs (tasks)
CREATE TABLE public.objectives (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    subject TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'À faire',
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.objectives TO authenticated;
GRANT ALL ON public.objectives TO service_role;

ALTER TABLE public.objectives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own objectives" ON public.objectives
    FOR ALL TO authenticated USING (auth.uid() = user_id);
