import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export const Route = createFileRoute('/auth')({
  component: AuthPage,
})

function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message)
      console.error('Login error:', error)
    } else {
      const search = new URLSearchParams(window.location.search)
      const redirectPath = search.get('redirect') || '/dashboard'
      window.location.href = redirectPath
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5] p-6 font-sans">
      <Card className="w-full max-w-md bg-white rounded-[32px] shadow-sm border border-white/50 p-4">
        <CardHeader className="text-center pb-2">
          <img 
            src="/branding/sceau_zenith_hd.png" 
            alt="Zenith Seal" 
            className="mx-auto w-16 h-16 object-contain mb-4"
          />
          <CardTitle className="text-3xl font-bold text-[#2D3142] tracking-tight">Zenith</CardTitle>
          <CardDescription className="text-slate-400 font-medium mt-1">
            Votre assistant d'apprentissage RH en France
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                className="h-12 rounded-2xl border-slate-100 bg-[#F8F9FA] focus-visible:ring-[#8C7CF0]"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                className="h-12 rounded-2xl border-slate-100 bg-[#F8F9FA] focus-visible:ring-[#8C7CF0]"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-[#2D3142] hover:bg-[#8C7CF0] text-white rounded-2xl font-bold shadow-lg shadow-slate-200 transition-all mt-4" 
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-xs text-slate-400 font-medium">
              Plateforme sécurisée • Zenith 2026
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
