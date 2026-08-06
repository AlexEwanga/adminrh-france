ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS best_practice text;

INSERT INTO public.quizzes (id, title, category, difficulty, questions) VALUES
 (101,'Contrat de travail & exécution','Contrat',1,'[]'::jsonb),
 (102,'Licenciement & rupture du CDI','Rupture',2,'[]'::jsonb),
 (103,'Rupture conventionnelle, CDD & intérim','Contrats précaires',2,'[]'::jsonb),
 (104,'Discrimination, harcèlement & libertés','Droits fondamentaux',3,'[]'::jsonb),
 (105,'Discipline & représentation du personnel','Relations sociales',3,'[]'::jsonb),
 (106,'Négociation collective & durée du travail','Temps de travail',2,'[]'::jsonb),
 (107,'Heures supplémentaires, repos & jours fériés','Temps de travail',2,'[]'::jsonb),
 (108,'Congés, rémunération & paie','Paie',2,'[]'::jsonb),
 (109,'Santé, sécurité & prévention','Santé & Sécurité',3,'[]'::jsonb),
 (110,'Formation, handicap & fin de carrière','Développement RH',3,'[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category, difficulty = EXCLUDED.difficulty;

UPDATE public.whatsapp_templates
SET content_template = '*{{subject}}*' || E'\n\n' || '{{content}}' || E'\n\n' || '📌 *Cas pratique :*' || E'\n' || '{{casus}}' || E'\n\n' || '⚖️ *Référence légale :*' || E'\n' || '{{reference}}' || E'\n\n' || '📖 *Article (partie législative) :*' || E'\n' || '{{article}}' || E'\n\n' || '✅ *Bonne pratique RH :*' || E'\n' || '{{best_practice}}' || E'\n\n' || '_AdminRH-France_'
WHERE is_default = true;