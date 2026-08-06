DO $$
DECLARE
    q_record RECORD;
    new_questions JSONB;
BEGIN
    FOR q_record IN SELECT id, questions FROM public.quizzes WHERE title ILIKE '%Droit du travail - Ultime%'
    LOOP
        SELECT jsonb_agg(elem) INTO new_questions
        FROM jsonb_array_elements(q_record.questions) AS elem
        WHERE (elem->>'article') LIKE 'Art. L%';
        
        IF new_questions IS NOT NULL THEN
            UPDATE public.quizzes SET questions = new_questions WHERE id = q_record.id;
        END IF;
    END LOOP;
END $$;