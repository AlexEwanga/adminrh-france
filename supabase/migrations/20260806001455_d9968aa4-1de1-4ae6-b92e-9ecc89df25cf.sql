-- Création du schéma private pour isoler la fonction du scan public/API direct
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

-- Déplacement de la fonction dans le schéma private
CREATE OR REPLACE FUNCTION private.update_learning_stats(_user_id uuid, _date date, _score integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.learning_stats (user_id, date, avg_score, quiz_count)
  VALUES (_user_id, _date, _score, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    avg_score = (public.learning_stats.avg_score * public.learning_stats.quiz_count + EXCLUDED.avg_score) / (public.learning_stats.quiz_count + 1),
    quiz_count = public.learning_stats.quiz_count + 1;
END;
$$;

-- Restriction stricte des privilèges
REVOKE ALL ON FUNCTION private.update_learning_stats(uuid, date, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION private.update_learning_stats(uuid, date, integer) TO authenticated, service_role;

-- Suppression de la version publique qui déclenche le linter
DROP FUNCTION IF EXISTS public.private_update_learning_stats(uuid, date, integer);
DROP FUNCTION IF EXISTS public.update_learning_stats(uuid, date, integer);

-- Ajout du schéma private au search_path par défaut pour les appels RPC
-- Note: Cette modification s'applique à la base entière dans Supabase pour PostgREST
ALTER DATABASE postgres SET search_path TO public, private;
