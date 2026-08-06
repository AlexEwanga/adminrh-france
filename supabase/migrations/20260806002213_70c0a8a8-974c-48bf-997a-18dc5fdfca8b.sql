ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS casus text;

UPDATE public.quizzes 
SET casus = 'Un salarié en CDI depuis 2 ans refuse d''effectuer des heures supplémentaires demandées par son employeur en raison d''un surcroît d''activité.'
WHERE title = 'Bases du Droit du Travail';

UPDATE public.quizzes 
SET casus = 'Une entreprise souhaite embaucher un profil rare et hésite sur la forme juridique de la promesse d''embauche.'
WHERE title = 'Recrutement & Intégration';

UPDATE public.quizzes 
SET casus = 'Le service comptable s''interroge sur l''impact de la nouvelle augmentation du SMIC sur les calculs de cotisations.'
WHERE title = 'Gestion de la Paie';