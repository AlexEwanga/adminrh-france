-- S'assurer que les fonctions ne sont pas exécutables par 'public' (anon et authenticated par défaut)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_learning_stats(uuid, date, integer) FROM PUBLIC, anon, authenticated;

-- Autoriser uniquement les rôles nécessaires
-- Le rôle service_role est nécessaire pour les opérations internes
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
GRANT EXECUTE ON FUNCTION public.update_learning_stats(uuid, date, integer) TO service_role;

-- Important: Les politiques RLS qui utilisent has_role() s'exécutent avec les privilèges du propriétaire (postgres)
-- si la fonction est SECURITY DEFINER. Cependant, le linter peut encore râler si 'authenticated' a le droit EXECUTE.
-- Si nous voulons que le code client puisse appeler update_learning_stats via RPC, nous devons garder GRANT TO authenticated.
-- Pour résoudre le linter, le meilleur moyen est de changer le schéma, mais comme il y a des dépendances, 
-- nous allons simplement essayer de réduire au maximum les privilèges.

GRANT EXECUTE ON FUNCTION public.update_learning_stats(uuid, date, integer) TO authenticated;
