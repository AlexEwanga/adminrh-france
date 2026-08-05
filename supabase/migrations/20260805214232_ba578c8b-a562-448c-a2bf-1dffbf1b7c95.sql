-- Fix RLS policy for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Fix security definer function permissions
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM public;
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, app_role) TO service_role;
