-- Rendre les fonctions SECURITY DEFINER privées par défaut (révoquer PUBLIC)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_learning_stats(uuid, date, integer) FROM PUBLIC;

-- Accorder l'exécution uniquement aux rôles nécessaires
-- has_role est utilisée dans les politiques RLS, donc 'authenticated' et 'anon' (si applicable) en ont besoin
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- update_learning_stats est appelée via RPC depuis les server functions authentifiées
GRANT EXECUTE ON FUNCTION public.update_learning_stats(uuid, date, integer) TO authenticated, service_role;
