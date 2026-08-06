-- Renommer la fonction pour être sûr de l'appel via RPC si le client ne supporte pas les schémas dans les appels rpc
CREATE OR REPLACE FUNCTION public.private_update_learning_stats(_user_id uuid, _date date, _score integer)
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

-- Accorder l'exécution uniquement au rôle authenticated
REVOKE ALL ON FUNCTION public.private_update_learning_stats(uuid, date, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.private_update_learning_stats(uuid, date, integer) TO authenticated, service_role;

-- Nettoyage du schéma private temporaire
DROP FUNCTION IF EXISTS private.update_learning_stats(uuid, date, integer);
DROP SCHEMA IF EXISTS private CASCADE;
