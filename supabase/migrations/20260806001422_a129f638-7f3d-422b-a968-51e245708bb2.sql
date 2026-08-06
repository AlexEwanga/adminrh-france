-- 1. Créer le schéma private si inexistant
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

-- 2. Créer la nouvelle version de update_learning_stats dans private
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

-- 3. Accorder l'exécution au rôle authenticated pour le schéma private
GRANT EXECUTE ON FUNCTION private.update_learning_stats(uuid, date, integer) TO authenticated, service_role;

-- 4. Supprimer l'ancienne fonction du schéma public (pas de dépendances directes SQL pour celle-ci)
DROP FUNCTION IF EXISTS public.update_learning_stats(uuid, date, integer);

-- 5. Pour has_role, on révoque EXECUTE de PUBLIC et authenticated car elle est utilisée en interne dans les RLS
-- (le linter râle car elle est dans 'public')
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, authenticated, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
