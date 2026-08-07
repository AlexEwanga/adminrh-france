TRUNCATE public.messages CASCADE;
-- Inserting just a few samples as demonstration, the JSON files drive the full 1000 items in the UI
INSERT INTO public.messages (subject, content, casus, reference, article, best_practice, source, tag, is_active) VALUES 
('Leçon 1 — La formation du contrat de travail', 'Point clé : Le contrat de travail est soumis aux règles du droit commun.', 'Cas pratique : Dans une entreprise à Paris, Jean se demande comment appliquer Art. L1221-1. Solution : Le contrat de travail est soumis aux règles du droit commun.', 'Art. L1221-1 du Code du travail', 'Le contrat de travail est soumis aux règles du droit commun. Il peut être établi selon les formes que les parties contractantes décident d''adopter.', 'Conseil Expert : Assurez-vous que l''application de Art. L1221-1 est tracée par écrit et conforme à votre convention collective.', 'https://code.travail.gouv.fr/droit-du-travail', 'la formation du contrat de travail', true);

INSERT INTO public.quizzes (id, title, casus, category, difficulty, questions) 
VALUES (8, 'Session Ultime', 'La banque complète de 1000 questions sur le Droit du Travail.', 'Droit du Travail', 3, '[]') 
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;