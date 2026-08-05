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

export const Route = createFileRoute('/_authenticated/admin')({
  component: AdminPage,
})


function AdminPage() {
  const [testPhone, setTestPhone] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [activeProvider, setActiveProvider] = useState<'wpsent' | 'callmebot'>('wpsent')
  const testWhatsApp = useServerFn(testWhatsAppConnection)

  const handleTestConnection = async () => {
    if (!testPhone) {
      toast.error("Veuillez entrer un numéro de téléphone (ex: +336...)")
      return
    }
    setIsTesting(true)
    try {
      const result = await testWhatsApp({ data: { phone: testPhone, provider: activeProvider } })
      if (result.success) {
        toast.success(result.simulated ? "Simulation réussie (Clé API manquante)" : `Message de test envoyé via ${activeProvider} !`)
      } else {
        toast.error(result.error || "Erreur lors du test")
      }
    } catch (err) {
      toast.error("Erreur de connexion")
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1E2A4A]">Administration</h1>
          <p className="text-slate-500">Gérez les messages, les quiz et la configuration WhatsApp (CallMeBot / WPSent).</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10">
            <ShieldCheck size={18} className="mr-2" />
            Vérifier RLS
          </Button>
          <Button className="bg-[#1E2A4A]">
            <Plus size={18} className="mr-2" />
            Ajouter un message
          </Button>
        </div>
      </header>

      {/* Configuration WhatsApp Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-[#1E2A4A] flex items-center gap-2">
              <Send size={20} className="text-[#D4AF37]" />
              Configuration WhatsApp
            </CardTitle>
            <CardDescription>
              Choisissez et configurez votre solution d'envoi préférée.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit">
              <Button 
                variant={activeProvider === 'wpsent' ? 'default' : 'ghost'} 
                size="sm"
                className={activeProvider === 'wpsent' ? 'bg-[#1E2A4A]' : ''}
                onClick={() => setActiveProvider('wpsent')}
              >
                WPSent
              </Button>
              <Button 
                variant={activeProvider === 'callmebot' ? 'default' : 'ghost'} 
                size="sm"
                className={activeProvider === 'callmebot' ? 'bg-[#1E2A4A]' : ''}
                onClick={() => setActiveProvider('callmebot')}
              >
                CallMeBot (Gratuit)
              </Button>
            </div>

            {activeProvider === 'wpsent' ? (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-sm mb-2 text-[#1E2A4A]">Instructions WPSent :</h4>
                <ol className="text-sm text-slate-600 list-decimal ml-4 space-y-1">
                  <li>Allez sur <a href="https://wpsent.com" target="_blank" className="text-blue-600 hover:underline">WPSent.com <ExternalLink size={12} className="inline ml-1" /></a></li>
                  <li>Récupérez votre <strong>API Key</strong> dans les paramètres.</li>
                  <li>Dans Lovable Cloud, ajoutez un secret nommé <code className="bg-slate-200 px-1 rounded">WPSENT_API_KEY</code>.</li>
                </ol>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-sm mb-2 text-[#1E2A4A]">Instructions CallMeBot :</h4>
                <ol className="text-sm text-slate-600 list-decimal ml-4 space-y-1">
                  <li>Ajoutez le numéro CallMeBot à vos contacts WhatsApp.</li>
                  <li>Envoyez <code className="bg-slate-200 px-1 rounded">I allow callmebot to send me messages</code> au +34 621 07 34 86 (ou le numéro indiqué sur le site).</li>
                  <li>Vous recevrez votre <strong>API Key</strong>.</li>
                  <li>Dans Lovable Cloud, ajoutez un secret nommé <code className="bg-slate-200 px-1 rounded">CALLMEBOT_API_KEY</code>.</li>
                  <li>Lien : <a href="https://www.callmebot.com/blog/free-api-whatsapp-messages/" target="_blank" className="text-blue-600 hover:underline">Documentation CallMeBot <ExternalLink size={12} className="inline ml-1" /></a></li>
                </ol>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input 
                  placeholder="Numéro de test (ex: +33612345678)" 
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleTestConnection} 
                disabled={isTesting}
                className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white"
              >
                {isTesting ? "Envoi..." : `Tester ${activeProvider}`}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase text-slate-500">Statut API</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
              <span className="font-medium">En attente de clé</span>
            </div>
            <p className="text-xs text-slate-500">
              L'envoi est actuellement en mode simulation. Les messages sont loggués dans la console serveur.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input className="pl-10" placeholder="Rechercher un message ou un sujet..." />
        </div>
        <Button variant="outline">Filtrer</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Sujet</th>
                <th className="px-6 py-4 font-medium">Catégorie</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#1E2A4A]">Le licenciement économique</div>
                    <div className="text-xs text-slate-400">Dernière modif: Il y a 2 jours</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary">Droit du travail</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm">Actif</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600">
                        <Edit2 size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
