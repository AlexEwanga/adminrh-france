DO $$
DECLARE
    q_base jsonb := '[
        {"q": "Quelle est la durée légale du travail ?", "o": ["35h", "39h", "40h", "42h"], "c": 0, "ref": "Art. L3121-27", "art": "La durée légale est de 35h.", "cas": "Un salarié fait 39h."},
        {"q": "Le licenciement doit-il être justifié ?", "o": ["Oui, cause réelle et sérieuse", "Non", "Seulement si le salarié le demande", "Facultatif"], "c": 0, "ref": "Art. L1232-1", "art": "Tout licenciement doit avoir une cause réelle et sérieuse.", "cas": "Un employeur licencie sans motif."},
        {"q": "Délai de rétractation pour une rupture conventionnelle ?", "o": ["15 jours calendaires", "15 jours ouvrables", "7 jours", "30 jours"], "c": 0, "ref": "Art. L1237-13", "art": "Le délai est de 15 jours calendaires.", "cas": "Signature d''une RC."},
        {"q": "Le harcèlement moral est-il puni par la loi ?", "o": ["Oui", "Non", "Seulement si physique", "Uniquement dans le public"], "c": 0, "ref": "Art. L1152-1", "art": "Le harcèlement moral est interdit.", "cas": "Pressions répétées."},
        {"q": "Un CDD peut-il être renouvelé ?", "o": ["Oui, sous conditions", "Non, jamais", "Oui, indéfiniment", "Uniquement 10 fois"], "c": 0, "ref": "Art. L1243-13", "art": "Le CDD est renouvelable.", "cas": "Fin de contrat CDD."}
    ]'::jsonb;
    q_final jsonb := '[]'::jsonb;
    i int;
    curr jsonb;
BEGIN
    FOR i IN 1..950 LOOP
        curr := q_base->((i-1) % 5);
        q_final := q_final || jsonb_build_object(
            'id', i,
            'question', (curr->>'q') || ' (Dossier #' || i || ')',
            'options', curr->'o',
            'correct_index', (curr->'c')::int,
            'casus', curr->>'cas',
            'reference', curr->>'ref',
            'article', curr->>'art'
        );
    END LOOP;
    UPDATE public.quizzes SET questions = q_final WHERE title = 'Droit du travail - Session Ultime';
END $$;
