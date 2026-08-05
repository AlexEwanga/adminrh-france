CREATE TABLE IF NOT EXISTS public.notes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    color text DEFAULT 'bg-[#D1FAE5] text-[#065F46]',
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

GRANT ALL ON public.notes TO authenticated;
GRANT ALL ON public.notes TO service_role;

CREATE POLICY "Users can manage their own notes"
    ON public.notes
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
