-- Function to update learning stats incrementally
CREATE OR REPLACE FUNCTION public.update_learning_stats(_user_id UUID, _date DATE, _score INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.learning_stats (user_id, date, quiz_taken, avg_score)
    VALUES (_user_id, _date, 1, _score)
    ON CONFLICT (user_id, date)
    DO UPDATE SET 
        avg_score = (public.learning_stats.avg_score * public.learning_stats.quiz_taken + EXCLUDED.avg_score) / (public.learning_stats.quiz_taken + 1),
        quiz_taken = public.learning_stats.quiz_taken + 1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_learning_stats(UUID, DATE, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_learning_stats(UUID, DATE, INTEGER) TO service_role;
