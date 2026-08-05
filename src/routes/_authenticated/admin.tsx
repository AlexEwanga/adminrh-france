import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit2, Trash2, Send, ExternalLink, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useServerFn } from '@tanstack/react-start'
import { testWhatsAppConnection } from '@/lib/whatsapp.server'

import { getRecentMessages } from '@/lib/learning.functions'
import { useSuspenseQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/_authenticated/admin')({
  component: AdminPage,
})


function AdminPage() {
  const [testPhone, setTestPhone] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const testWhatsApp = useServerFn(testWhatsAppConnection)
  const { data: messages } = useSuspenseQuery({
    queryKey: ['recent-messages'],
    queryFn: () => getRecentMessages()
  })

  const handleTestConnection = async () => {
    if (!testPhone) {
      toast.error("Veuillez entrer un numéro de téléphone (ex: +336...)")
      return
    }
    setIsTesting(true)
    try {
      const result = await testWhatsApp({ data: { phone: testPhone } })
      if (result.success) {
        toast.success(result.simulated ? "Simulation réussie (Clé API manquante)" : "Message de test envoyé !")
      } else {
        toast.error((result as any).error || "Erreur lors du test")
      }
    } catch (err) {
      toast.error("Erreur de connexion")
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-white/50 flex flex-col gap-8 min-h-[calc(100vh-140px)]">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2D3142]">Administration RH</h1>
          <p className="text-slate-400 mt-1">Gérez les messages, les quiz et la configuration de l'assistant.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl border-slate-100 font-bold text-[#2D3142]">
            <ShieldCheck size={18} className="mr-2" />
            Vérifier RLS
          </Button>
          <Button className="bg-[#2D3142] hover:bg-[#8C7CF0] text-white rounded-2xl px-6 py-6 font-bold shadow-lg shadow-slate-200 transition-all">
            <Plus size={18} className="mr-2" />
            Ajouter un contenu
          </Button>
        </div>
      </header>

      {/* Configuration WhatsApp Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-none shadow-none bg-[#F8F9FA] rounded-[24px]">
          <CardHeader>
            <CardTitle className="text-[#2D3142] flex items-center gap-2">
              <Send size={20} className="text-[#8C7CF0]" />
              Configuration WhatsApp (CallMeBot)
            </CardTitle>
            <CardDescription className="text-slate-400">
              Configurez CallMeBot pour envoyer les leçons quotidiennes gratuitement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-50">
              <h4 className="font-bold text-sm mb-3 text-[#2D3142]">Instructions de configuration :</h4>
              <ol className="text-sm text-slate-500 list-decimal ml-4 space-y-2 font-medium">
                <li>Ajoutez le numéro CallMeBot à vos contacts WhatsApp.</li>
                <li>Envoyez <code className="bg-[#F0F2F5] px-2 py-0.5 rounded text-[#8C7CF0]">I allow callmebot to send me messages</code> au bot.</li>
                <li>Récupérez votre <strong>API Key</strong>.</li>
                <li>Clé configurée : <code className="bg-[#E0E7FF] text-[#6366F1] px-2 py-0.5 rounded font-mono font-bold">4109899</code></li>
                <li>Lien : <a href="https://www.callmebot.com/blog/free-api-whatsapp-messages/" target="_blank" className="text-[#8C7CF0] hover:underline flex items-center gap-1 inline-flex">Documentation CallMeBot <ExternalLink size={12} /></a></li>
              </ol>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input 
                  className="rounded-xl border-slate-100 bg-white h-12"
                  placeholder="Numéro de test (ex: +33612345678)" 
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleTestConnection} 
                disabled={isTesting}
                className="bg-[#8C7CF0] hover:bg-[#8C7CF0]/90 text-white rounded-xl px-8 h-12 font-bold transition-all shadow-md shadow-[#8C7CF0]/20"
              >
                {isTesting ? "Envoi..." : "Tester l'envoi"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-none bg-[#F8F9FA] rounded-[24px]">
          <CardHeader>
            <CardTitle className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Statut API</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4 bg-white p-4 rounded-2xl shadow-sm">
              <div className="w-3 h-3 rounded-full bg-[#A3E635] shadow-[0_0_12px_rgba(163,230,53,0.5)]" />
              <span className="font-bold text-[#2D3142]">Connecté</span>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              L'envoi via CallMeBot est actif. Vos messages quotidiens sont planifiés.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input className="pl-10 rounded-xl border-slate-100 bg-[#F8F9FA] h-11" placeholder="Rechercher..." />
        </div>
        <Button variant="outline" className="rounded-xl border-slate-100 font-bold h-11">Filtrer</Button>
      </div>

      <Card className="border-none shadow-none bg-[#F8F9FA] rounded-[32px] overflow-hidden">
        <CardContent className="p-0">
          <table className="w-full text-left">
            <thead className="bg-[#F1F3F6] text-slate-400 text-[11px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-6">Sujet</th>
                <th className="px-8 py-6">Catégorie</th>
                <th className="px-8 py-6">Statut</th>
                <th className="px-8 py-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {messages && messages.length > 0 ? (
                messages.map((msg: any) => (
                  <tr key={msg.id} className="hover:bg-white transition-all group">
                    <td className="px-8 py-6">
                      <div className="font-bold text-[#2D3142]">{msg.subject}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {msg.created_at ? new Date(msg.created_at).toLocaleDateString('fr-FR') : 'Date inconnue'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge className="bg-white text-[#2D3142] border-none shadow-sm">{msg.tag || 'Sans catégorie'}</Badge>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${msg.is_active !== false ? 'bg-[#A3E635]' : 'bg-slate-300'}`} />
                        <span className="text-sm font-bold text-[#2D3142]">{msg.is_active !== false ? 'Actif' : 'Inactif'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-[#8C7CF0] hover:bg-slate-50">
                          <Edit2 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-medium">
                    Aucun message dans la base de données.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
