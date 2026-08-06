import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Search,
  Filter,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { toast } from 'sonner'
import allQuestions from '@/lib/all_questions.json'
import { testWhatsAppConnection } from '@/lib/whatsapp.server'
import { useServerFn } from '@tanstack/react-start'
import { Phone, MessageSquare, Send } from 'lucide-react'

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

  useEffect(() => {
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
          <h1 className="text-3xl font-bold text-[#2D3142]">Éditeur de Banque Légale</h1>
          <p className="text-slate-400 mt-1">Gérez et validez les 1000 dossiers du Code du Travail.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-[#E0E7FF] text-[#6366F1] px-4 py-2 rounded-xl border-none">
            {questions.length} Questions totales
          </Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
                  <p className="text-xs text-slate-400">Configurez l'envoi des leçons quotidiennes.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-2 flex flex-col md:flex-row items-end gap-4">
              <div className="flex-1 space-y-2 w-full">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Numéro de téléphone (Format international)</label>
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
                <Button 
                  onClick={handleSavePhone}
                  variant="outline"
                  className="rounded-xl border-slate-200 font-bold flex-1 md:flex-none"
                >
                  Enregistrer
                </Button>
                <Button 
                  onClick={handleTestWhatsApp}
                  disabled={isTesting}
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-bold flex-1 md:flex-none"
                >
                  {isTesting ? "Envoi..." : (
                    <span className="flex items-center gap-2">
                      <Send size={16} /> Tester l'envoi
                    </span>
                  )}
                </Button>
              </div>
              <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex items-start gap-3 w-full md:max-w-xs">
                <AlertTriangle className="text-amber-500 shrink-0" size={16} />
                <p className="text-[10px] text-amber-700 leading-tight">
                  Assurez-vous que la clé <strong>CALLMEBOT_API_KEY</strong> est bien configurée dans les secrets de l'application.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste & Filtres */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Rechercher un article..." 
                className="pl-10 rounded-xl bg-[#F8F9FA] border-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {themes.map(t => (
                <button
                  key={t}
                  onClick={() => { setSelectedTheme(t); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedTheme === t 
                    ? 'bg-[#2D3142] text-white shadow-md' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {paginatedQuestions.map((q: any) => (
              <div 
                key={q.id}
                onClick={() => handleEdit(q)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                  editingId === q.id 
                  ? 'bg-[#1E2A4A] border-[#D4AF37] text-white' 
                  : 'bg-white border-slate-100 hover:border-[#8C7CF0]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${editingId === q.id ? 'text-[#D4AF37]' : 'text-slate-400'}`}>
                    {q.reference}
                  </span>
                  {editingId === q.id && <CheckCircle2 size={14} className="text-[#D4AF37]" />}
                </div>
                <p className={`text-sm font-bold line-clamp-2 ${editingId === q.id ? 'text-white' : 'text-[#2D3142]'}`}>
                  {q.question}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="text-xs font-bold text-slate-400">Page {currentPage} / {totalPages}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        {/* Éditeur */}
        <div className="lg:col-span-8">
          {editForm ? (
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[32px] overflow-hidden">
              <CardHeader className="bg-[#F8F9FA] border-b border-slate-100 p-8">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold text-[#2D3142]">Modification du Dossier</CardTitle>
                  <Badge className="bg-[#1E2A4A] text-[#D4AF37] border-none px-3 py-1">Mode Expert</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Référence Légale</label>
                    <Input 
                      value={editForm.reference}
                      onChange={e => setEditForm({...editForm, reference: e.target.value})}
                      className="rounded-xl border-slate-100 font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Difficulté</label>
                    <div className="flex gap-2">
                      {[1, 2, 3].map(d => (
                        <Button
                          key={d}
                          variant={editForm.difficulty === d ? 'default' : 'outline'}
                          className={`flex-1 rounded-xl h-10 font-bold ${editForm.difficulty === d ? 'bg-[#2D3142]' : ''}`}
                          onClick={() => setEditForm({...editForm, difficulty: d})}
                        >
                          {d === 1 ? 'Facile' : d === 2 ? 'Moyen' : 'Expert'}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Question Centrale</label>
                  <Textarea 
                    value={editForm.question}
                    onChange={e => setEditForm({...editForm, question: e.target.value})}
                    className="rounded-xl border-slate-100 min-h-[80px] font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Cas Pratique (Casus)</label>
                  <Textarea 
                    value={editForm.casus}
                    onChange={e => setEditForm({...editForm, casus: e.target.value})}
                    className="rounded-xl border-slate-100 min-h-[100px] bg-slate-50/50"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Article Complet (Legifrance)</label>
                    <a 
                      href={`https://www.legifrance.gouv.fr/search/all?query=${editForm.reference}`} 
                      target="_blank"
                      className="text-[10px] font-bold text-[#8C7CF0] flex items-center gap-1"
                    >
                      <BookOpen size={12} /> Vérifier la source
                    </a>
                  </div>
                  <Textarea 
                    value={editForm.article}
                    onChange={e => setEditForm({...editForm, article: e.target.value})}
                    className="rounded-xl border-slate-100 min-h-[120px] bg-[#1E2A4A] text-slate-200 font-medium"
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <Button 
                    className="flex-1 bg-[#2D3142] hover:bg-[#8C7CF0] text-white rounded-2xl py-6 font-bold shadow-lg transition-all"
                    onClick={handleSave}
                  >
                    <Save size={18} className="mr-2" /> Valider le dossier
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-2xl py-6 px-8 border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50"
                    onClick={() => { setEditingId(null); setEditForm(null); }}
                  >
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-[#F8F9FA] rounded-[32px] border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
                <Edit2 size={32} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-[#2D3142] mb-2">Sélectionnez un dossier</h3>
              <p className="text-slate-400 max-w-xs mx-auto">
                Choisissez une question dans la liste de gauche pour modifier son contenu, son casus ou sa référence légale.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Edit2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
    </svg>
  )
}
