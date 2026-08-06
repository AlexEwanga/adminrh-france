import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Search,
  ChevronRight,
  ChevronLeft,
  Phone, 
  MessageSquare, 
  Send, 
  FileText, 
  Settings, 
  History,
  XCircle,
  RefreshCw
} from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { toast } from 'sonner'
import allQuestions from '@/lib/all_questions.json'
import { testWhatsAppConnection, getWhatsAppLogs, getWhatsAppTemplates, updateWhatsAppTemplate } from '@/lib/whatsapp.server'
import { useServerFn } from '@tanstack/react-start'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export const Route = createFileRoute('/_authenticated/admin')({
  component: AdminEditorPage,
})

function AdminEditorPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTheme, setSelectedTheme] = useState('Tous')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [questions, setQuestions] = useState(allQuestions)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<any>(null)
  
  const [whatsappPhone, setWhatsappPhone] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  
  const sendTest = useServerFn(testWhatsAppConnection)
  const fetchLogs = useServerFn(getWhatsAppLogs)
  const fetchTemplates = useServerFn(getWhatsAppTemplates)
  const saveTemplate = useServerFn(updateWhatsAppTemplate)

  const [whatsappLogs, setWhatsappLogs] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedTab, setSelectedTab] = useState<'editor' | 'logs' | 'templates'>('editor')

  const loadWhatsApp = async () => {
    try {
      const [l, t] = await Promise.all([fetchLogs(), fetchTemplates()])
      setWhatsappLogs(l || [])
      setTemplates(t || [])
    } catch (err) {
      console.error("Error loading WhatsApp data:", err)
    }
  }

  const handleUpdateTemplate = async (id: string, content: string) => {
    try {
      await saveTemplate({ data: { id, content_template: content } })
      toast.success("Modèle mis à jour")
      const updated = await fetchTemplates()
      setTemplates(updated)
    } catch (err) {
      toast.error("Erreur de mise à jour")
    }
  }

  useEffect(() => {
    loadWhatsApp()
    const savedPhone = localStorage.getItem('admin_whatsapp_phone')
    if (savedPhone) setWhatsappPhone(savedPhone)
  }, [])

  const handleSavePhone = () => {
    localStorage.setItem('admin_whatsapp_phone', whatsappPhone)
    toast.success("Numéro WhatsApp enregistré localement")
  }

  const handleTestWhatsApp = async () => {
    if (!whatsappPhone) {
      toast.error("Veuillez saisir un numéro de téléphone")
      return
    }
    setIsTesting(true)
    try {
      const result = await sendTest({ data: { phone: whatsappPhone } })
      if (result.success) {
        toast.success("Message de test envoyé !")
        loadWhatsApp()
      } else {
        const errorMsg = (result as any).error || "Erreur lors de l'envoi"
        toast.error(errorMsg)
      }
    } catch (error: any) {
      toast.error("Erreur technique: " + error.message)
    } finally {
      setIsTesting(false)
    }
  }

  const themes = useMemo(() => {
    const t = new Set(['Tous'])
    questions.forEach(q => {
      if (q.reference?.includes('L12')) t.add('Contrat (CDI/CDD)')
      else if (q.reference?.includes('L31')) t.add('Durée & Repos')
      else if (q.reference?.includes('L123')) t.add('Rupture')
      else t.add('Autres')
    })
    return Array.from(t)
  }, [questions])

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.reference?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesTheme = selectedTheme === 'Tous' || 
                          (selectedTheme === 'Contrat (CDI/CDD)' && q.reference?.includes('L12')) ||
                          (selectedTheme === 'Durée & Repos' && q.reference?.includes('L31')) ||
                          (selectedTheme === 'Rupture' && q.reference?.includes('L123'))
      
      return matchesSearch && matchesTheme
    })
  }, [questions, searchTerm, selectedTheme])

  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage)

  const handleEdit = (q: any) => {
    setEditingId(q.id)
    setEditForm({ ...q })
  }

  const handleSave = () => {
    if (!editForm.reference.match(/^Art\.\sL\d+-\d+$/)) {
      toast.error("Format de référence invalide (ex: Art. L3121-27)")
      return
    }
    const newQuestions = questions.map(q => q.id === editingId ? editForm : q)
    setQuestions(newQuestions)
    setEditingId(null)
    toast.success("Question validée et enregistrée localement")
  }

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-white/50 flex flex-col gap-8 min-h-[calc(100vh-140px)]">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2D3142]">Administration RH</h1>
          <p className="text-slate-400 mt-1">Banque légale & Automatisation WhatsApp.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Paramètres WhatsApp */}
        <div className="lg:col-span-12">
          <Card className="border-none shadow-sm bg-[#F8F9FA] rounded-[32px] overflow-hidden">
            <CardHeader className="p-6 pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#25D366]/10 rounded-xl flex items-center justify-center">
                  <MessageSquare className="text-[#25D366]" size={20} />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-[#2D3142]">Configuration WhatsApp (CallMeBot)</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-2 flex flex-col md:flex-row items-end gap-4">
              <div className="flex-1 space-y-2 w-full">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Numéro de téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <Input 
                    value={whatsappPhone}
                    onChange={e => setWhatsappPhone(e.target.value)}
                    placeholder="+243821355337"
                    className="pl-10 rounded-xl border-slate-200 bg-white"
                  />
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button onClick={handleSavePhone} variant="outline" className="rounded-xl border-slate-200 font-bold">Enregistrer</Button>
                <Button onClick={handleTestWhatsApp} disabled={isTesting} className="bg-[#25D366] text-white rounded-xl font-bold">
                  {isTesting ? "Envoi..." : <><Send size={16} className="mr-2" /> Tester</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets */}
        <div className="lg:col-span-12">
          <div className="flex bg-[#F8F9FA] p-1 rounded-2xl gap-1">
            <button onClick={() => setSelectedTab('editor')} className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${selectedTab === 'editor' ? 'bg-[#2D3142] text-white' : 'text-slate-500'}`}>
              <FileText size={18} /> Banque Légale
            </button>
            <button onClick={() => setSelectedTab('logs')} className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${selectedTab === 'logs' ? 'bg-[#2D3142] text-white' : 'text-slate-500'}`}>
              <History size={18} /> Historique
            </button>
            <button onClick={() => setSelectedTab('templates')} className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${selectedTab === 'templates' ? 'bg-[#2D3142] text-white' : 'text-slate-500'}`}>
              <Settings size={18} /> Modèles
            </button>
          </div>
        </div>

        {selectedTab === 'editor' && (
          <>
            <div className="lg:col-span-4 space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input placeholder="Rechercher..." className="pl-10 rounded-xl bg-[#F8F9FA] border-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <div className="space-y-3">
                {paginatedQuestions.map((q: any) => (
                  <div key={q.id} onClick={() => handleEdit(q)} className={`p-4 rounded-2xl border cursor-pointer ${editingId === q.id ? 'bg-[#1E2A4A] border-[#D4AF37] text-white' : 'bg-white border-slate-100'}`}>
                    <span className="text-[10px] font-black uppercase block mb-1">{q.reference}</span>
                    <p className="text-sm font-bold line-clamp-2">{q.question}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-8">
              {editForm ? (
                <Card className="rounded-[32px] border-none shadow-xl">
                  <CardContent className="p-8 space-y-6">
                    <Input value={editForm.reference} onChange={e => setEditForm({...editForm, reference: e.target.value})} className="rounded-xl font-bold" />
                    <Textarea value={editForm.question} onChange={e => setEditForm({...editForm, question: e.target.value})} className="rounded-xl min-h-[80px]" />
                    <Textarea value={editForm.article} onChange={e => setEditForm({...editForm, article: e.target.value})} className="rounded-xl min-h-[120px] bg-[#1E2A4A] text-slate-200" />
                    <Button onClick={handleSave} className="w-full bg-[#2D3142] text-white py-6 rounded-2xl font-bold">Sauvegarder</Button>
                  </CardContent>
                </Card>
              ) : <div className="p-12 text-center text-slate-400">Sélectionnez une question</div>}
            </div>
          </>
        )}

        {selectedTab === 'logs' && (
          <div className="lg:col-span-12">
            <Card className="rounded-[32px] border-none shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Date</th>
                      <th className="p-4">Destinataire</th>
                      <th className="p-4">Sujet</th>
                      <th className="p-4">Statut</th>
                      <th className="p-4">Tentatives</th>
                    </tr>
                  </thead>
                  <tbody>
                    {whatsappLogs.map(log => (
                      <tr key={log.id} className="border-t border-slate-100">
                        <td className="p-4">{format(new Date(log.created_at), 'dd/MM HH:mm', { locale: fr })}</td>
                        <td className="p-4 font-mono">{log.phone_number}</td>
                        <td className="p-4 font-bold">{log.subject}</td>
                        <td className="p-4">
                          {log.status === 'success' ? <Badge className="bg-green-100 text-green-700">Livré</Badge> : <Badge className="bg-red-100 text-red-700">Échec</Badge>}
                        </td>
                        <td className="p-4">{log.attempts} / 3</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {selectedTab === 'templates' && (
          <div className="lg:col-span-12 space-y-6">
            {templates.map(tpl => (
              <Card key={tpl.id} className="rounded-[32px] border-none shadow-sm p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-[#2D3142]">{tpl.name} ({tpl.theme})</h3>
                  <Badge variant="outline">{tpl.is_default ? 'Par défaut' : ''}</Badge>
                </div>
                <Textarea 
                  defaultValue={tpl.content_template} 
                  onBlur={(e) => handleUpdateTemplate(tpl.id, e.target.value)}
                  className="rounded-xl min-h-[100px] font-mono text-sm" 
                  placeholder="Utilisez {{subject}} et {{content}}"
                />
                <p className="text-[10px] text-slate-400">Variables disponibles : {"{{subject}}"}, {"{{content}}"}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Edit2(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
    </svg>
  )
}
