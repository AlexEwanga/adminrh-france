import { createFileRoute, redirect } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'
import { useEffect } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallbackPage,
})

function AuthCallbackPage() {
  useEffect(() => {
    const handleCallback = async () => {
      const { error } = await supabase.auth.getSession()
      const search = new URLSearchParams(window.location.search)
      const redirectPath = search.get('redirect') || '/dashboard'
      
      if (error) {
        toast.error('Erreur lors de la connexion : ' + error.message)
        window.location.href = '/auth'
      } else {
        window.location.href = redirectPath
      }
    }
    handleCallback()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-[#1E2A4A] animate-pulse">Connexion en cours...</h2>
        <p className="text-slate-500 mt-2">Veuillez patienter pendant que nous vous redirigeons.</p>
      </div>
    </div>
  )
}
