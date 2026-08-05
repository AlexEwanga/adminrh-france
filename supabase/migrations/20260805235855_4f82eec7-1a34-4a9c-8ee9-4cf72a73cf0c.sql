-- Ensure RLS is enabled and policies allow authenticated users to see lessons
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'messages' AND policyname = 'Authenticated users can view messages'
    ) THEN
        CREATE POLICY "Authenticated users can view messages" 
        ON public.messages FOR SELECT TO authenticated USING (true);
    END IF;
END $$;

-- Insert the core content based on the provided sources
INSERT INTO public.messages (subject, content, tag, source, scheduled_hour)
VALUES 
('Le Harcèlement Moral Institutionnel', 'La Cour de Cassation a confirmé la notion de harcèlement moral institutionnel (arrêt France Télécom). Une entreprise peut être condamnée pour une politique managériale dégradante, même sans viser un salarié précis. En tant que RH, vous avez une obligation de vigilance.', 'Droit du Travail', 'https://www.legifrance.gouv.fr', '07:00'),
('Embauche des Étrangers', 'La France a durci les autorisations de travail. L''employeur doit publier l''offre sur France Travail pendant 3 semaines et obtenir une attestation de vigilance URSSAF. Vérifiez scrupuleusement les pièces pour tout salarié hors UE.', 'Administration', 'https://www.service-public.fr', '09:45'),
('Obligation de Loyauté RH', 'Le métier de RH exige une neutralité absolue. La jurisprudence a validé le licenciement d''un DRH pour manquement à son obligation de loyauté (liaison avec une syndicaliste créant un conflit d''intérêts). Discrétion totale requise.', 'Éthique', 'https://www.courdecassation.fr', '12:30'),
('La Rupture Conventionnelle', 'Procédure permettant à l''employeur et au salarié de convenir d''un commun accord de la rupture du contrat. Elle nécessite un entretien, une homologation par la DREETS et le versement d''une indemnité au moins égale à l''indemnité légale de licenciement.', 'Contrats', 'https://www.code-du-travail.fr', '15:15'),
('Culture d''Entreprise en France', 'Le respect de la hiérarchie et la ponctualité sont clés. Le déjeuner est un moment important de socialisation. Le droit à la déconnexion est protégé par la loi pour garantir l''équilibre vie pro/perso.', 'Culture', 'https://www.vie-publique.fr', '18:00');

-- Grant permissions
GRANT SELECT ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
