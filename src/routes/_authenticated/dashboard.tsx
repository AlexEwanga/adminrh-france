import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getLearningStats, getRecentMessages, getNotes, addNote, getObjectives, getDashboardSummary } from '@/lib/learning.functions'
import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, MoreHorizontal, Trophy, Target, BookOpen, Search, Send, Loader2, Flame, CheckCircle2, Clock, TrendingUp, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ReTooltip, 
  ResponsiveContainer,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
})

// Créneaux quotidiens d'envoi WhatsApp (UTC)
const DAILY_SLOTS = ['07:00', '10:00', '13:00', '16:00', '19:00']

function Dashboard() {
  const [activeFilter, setActiveFilter] = useState('Tout')
  const [searchTerm, setSearchTerm] = useState('')
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [newNoteContent, setNewNoteContent] = useState('')
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [showObjectiveForm, setShowObjectiveForm] = useState(false)
  const [newObjectiveTitle, setNewObjectiveTitle] = useState('')
  const [newObjectiveSubject, setNewObjectiveSubject] = useState('')
  const [isAddingObjective, setIsAddingObjective] = useState(false)

  const queryClient = useQueryClient()

  useEffect(() => {
    const handleSearch = (e: any) => {
      setSearchTerm(e.detail || '')
    }
    window.addEventListener('global-search-change', handleSearch)
    const initialSearch = localStorage.getItem('adminrh-global-search')
    if (initialSearch) setSearchTerm(initialSearch)
    return () => window.removeEventListener('global-search-change', handleSearch)
  }, [])

  const { data: stats } = useQuery({
    queryKey: ['learning-stats'],
    queryFn: () => getLearningStats()
  })

  const { data: summary } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => getDashboardSummary()
  })

  const { data: messagesData } = useQuery({
    queryKey: ['recent-messages'],
    queryFn: () => getRecentMessages()
  })
  const messages = messagesData || []

  const { data: notes } = useQuery({
    queryKey: ['notes'],
    queryFn: () => getNotes()
  })

  const { data: objectivesData } = useQuery({
    queryKey: ['objectives'],
    queryFn: () => getObjectives()
  })

  const filteredMessages = useMemo(() => {
    if (!messages) return []
    return messages.filter((msg: any) => 
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (msg.tag && msg.tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (msg.content && msg.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (msg.reference && msg.reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (msg.article && msg.article.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [messages, searchTerm])

  const filteredNotes = useMemo(() => {
    if (!notes) return []
    return notes.filter((note: any) => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [notes, searchTerm])

  // Planning du jour : 5 créneaux réels, statut calculé sur les envois WhatsApp
  const todaySchedule = useMemo(() => {
    const logs = summary?.todayLogs || []
    const nowMinutes = new Date().getUTCHours() * 60 + new Date().getUTCMinutes()
    return DAILY_SLOTS.map((slot, i) => {
      const log = logs[i]
      const [h, m] = slot.split(':').map(Number)
      const slotMinutes = (h || 0) * 60 + (m || 0)
      return {
        time: slot,
        subject: log?.subject || (messages[i]?.subject ?? 'Leçon à programmer'),
        status: log
          ? (log.status === 'success' ? 'Envoyé' : 'Échec')
          : slotMinutes <= nowMinutes ? 'En attente' : 'Planifié',
      }
    })
  }, [summary, messages])

  const chartData = useMemo(() => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    const today = new Date()
    const result = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      const isToday = i === 0
      result.push({
        name: days[d.getDay()],
        score: isToday ? (stats?.avg_score || 0) : 0,
        messages: isToday ? (summary?.todayLogs?.length || 0) : 0
      })
    }
    return result
  }, [stats, summary])

  const filteredTasks = useMemo(() => {
    const tasks = objectivesData || []
    return tasks.filter((task: any) => {
      const matchesFilter = activeFilter === 'Tout' || task.status === activeFilter
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (task.subject && task.subject.toLowerCase().includes(searchTerm.toLowerCase()))
      return matchesFilter && matchesSearch
    })
  }, [activeFilter, searchTerm, objectivesData])


  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNoteTitle || !newNoteContent) return

    setIsAddingNote(true)
    try {
      await addNote({ data: { title: newNoteTitle, content: newNoteContent } })
      setNewNoteTitle('')
      setNewNoteContent('')
      toast.success('Note ajoutée avec succès')
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la note")
    } finally {
      setIsAddingNote(false)
    }
  }

  const todayLabel = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  const sentToday = summary?.todayLogs?.length || 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
      {/* Bandeau de bienvenue */}
      <div className="lg:col-span-12 bg-gradient-to-r from-[#1E2A4A] to-[#2D3142] rounded-[32px] p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-24 -mt-24" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-[#D4AF37] font-bold text-xs uppercase tracking-widest mb-2">{todayLabel}</p>
            <h1 className="text-3xl font-extrabold tracking-tight">Bonjour, prêt à progresser ?</h1>
            <p className="text-slate-300 mt-2 font-medium text-sm">
              {sentToday}/5 leçons WhatsApp reçues aujourd'hui — {summary?.totalLessons || 0} dossiers disponibles dans votre base.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#1E2A4A] font-bold rounded-2xl h-12 px-6 shadow-lg">
              <Link to="/quiz">
                <GraduationCap size={18} className="mr-2" />
                Lancer un Quiz
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-white/5 border-white/20 hover:bg-white/10 text-white rounded-2xl h-12 px-6 font-bold">
              <Link to="/learning">Base de connaissances</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="lg:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <KpiCard icon={<Trophy size={20} />} label="Points d'expertise" value={summary?.points ?? 0} accent="bg-[#D4AF37]/10 text-[#B8942F]" />
        <KpiCard icon={<TrendingUp size={20} />} label="Score moyen" value={`${summary?.avgScore ?? 0}%`} accent="bg-[#8C7CF0]/10 text-[#8C7CF0]" />
        <KpiCard icon={<CheckCircle2 size={20} />} label="Quiz réalisés" value={summary?.quizTaken ?? 0} accent="bg-emerald-50 text-emerald-600" />
        <KpiCard icon={<Flame size={20} />} label="Série d'apprentissage" value={`${summary?.streak ?? 0} j`} accent="bg-orange-50 text-orange-500" />
      </div>

      {/* Top Row: Charts & Stats */}
      <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card className="rounded-[32px] border-white/50 shadow-sm overflow-hidden bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-[#2D3142]">Performance Hebdomadaire</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F2F5" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12 }} 
                />
                <YAxis hide />
                <ReTooltip 
                  cursor={{ fill: '#F8F9FA' }}
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 shadow-xl rounded-2xl border border-slate-100">
                          <p className="text-xs font-bold text-[#2D3142]">{payload[0].payload.name}</p>
                          <p className="text-sm text-[#8C7CF0] font-bold">{payload[0].value}% de réussite</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="score" radius={[8, 8, 8, 8]} barSize={35}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#A3E635' : '#8C7CF0'} />
                  ))}
                </Bar>
              </ReBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-white/50 shadow-sm overflow-hidden bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-[#2D3142]">Engagement WhatsApp</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F2F5" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12 }} 
                />
                <YAxis hide />
                <ReTooltip />
                <Line 
                  type="monotone" 
                  dataKey="messages" 
                  stroke="#2D3142" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#2D3142', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#8C7CF0' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Left Column: Mes objectifs RH */}
      <div className="lg:col-span-7 bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-white/50 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#2D3142] tracking-tight">Mes objectifs RH</h2>
            <p className="text-xs text-slate-400 font-medium mt-1">{filteredTasks.length} objectif(s) affiché(s)</p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="bg-[#F8F9FA] rounded-xl hover:bg-slate-100 h-10 w-10 border border-slate-100"
            onClick={() => setShowObjectiveForm((v) => !v)}
          >
            <Plus size={20} className={`text-[#2D3142] transition-transform ${showObjectiveForm ? 'rotate-45' : ''}`} />
          </Button>
        </div>

        {showObjectiveForm && (
          <form onSubmit={handleAddObjective} className="bg-[#F8F9FA] rounded-2xl p-4 border border-slate-100 flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Nouvel objectif (ex: Maîtriser la rupture conventionnelle)"
              className="bg-white border-slate-100 rounded-xl"
              value={newObjectiveTitle}
              onChange={(e) => setNewObjectiveTitle(e.target.value)}
            />
            <Input
              placeholder="Thème"
              className="bg-white border-slate-100 rounded-xl sm:w-40"
              value={newObjectiveSubject}
              onChange={(e) => setNewObjectiveSubject(e.target.value)}
            />
            <Button type="submit" disabled={!newObjectiveTitle || isAddingObjective} className="bg-[#1E2A4A] hover:bg-[#1E2A4A]/90 rounded-xl font-bold px-6">
              {isAddingObjective ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ajouter'}
            </Button>
          </form>
        )}

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
          {['Tout', 'À faire', 'En cours', 'Terminé'].map(filter => (
            <TaskFilter 
              key={filter} 
              label={filter} 
              active={activeFilter === filter} 
              onClick={() => setActiveFilter(filter)}
              className="shrink-0 whitespace-nowrap"
            />
          ))}
        </div>

        <div className="space-y-4">
          {filteredTasks.map((task: any) => (
            <TaskItem key={task.id} {...task} />
          ))}
          {filteredTasks.length === 0 && (
            <div className="text-center py-12 space-y-3 bg-slate-50/60 rounded-[24px] border-2 border-dashed border-slate-100">
              <Target className="mx-auto text-slate-200 h-12 w-12" />
              <p className="text-slate-400 font-medium">Aucun objectif pour le moment.</p>
              <Button
                variant="link"
                className="text-[#8C7CF0] font-bold"
                onClick={() => setShowObjectiveForm(true)}
              >
                Créer mon premier objectif
              </Button>
            </div>
          )}
        </div>

        {/* Leçons récentes */}
        <div className="pt-4 border-t border-slate-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#2D3142] flex items-center gap-2">
              <BookOpen size={18} className="text-[#8C7CF0]" />
              Dernières leçons reçues
            </h3>
            <Button asChild variant="link" className="text-[#8C7CF0] font-bold text-xs p-0 h-auto">
              <Link to="/learning">Tout voir</Link>
            </Button>
          </div>
          <div className="space-y-2">
            {filteredMessages.slice(0, 4).map((msg: any) => (
              <div key={msg.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-[#1E2A4A]/5 flex items-center justify-center shrink-0">
                  <BookOpen size={16} className="text-[#1E2A4A]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#2D3142] truncate">{msg.subject}</p>
                  <p className="text-[11px] text-slate-400 font-medium truncate">{msg.reference || 'Code du travail'}</p>
                </div>
              </div>
            ))}
            {filteredMessages.length === 0 && (
              <p className="text-sm text-slate-400 italic py-4 text-center">Aucune leçon disponible.</p>
            )}
          </div>
        </div>
      </div>


      {/* Right Column: Planning & Notes */}
      <div className="lg:col-span-5 space-y-6 flex flex-col">
        {/* Mon planning section */}
        <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-white/50 flex flex-col gap-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-[#2D3142] tracking-tight">Mon planning</h2>
              <p className="text-xs text-slate-400 font-medium mt-1">5 leçons WhatsApp par jour (heure UTC)</p>
            </div>
            <div className="flex items-center gap-2 bg-[#F8F9FA] px-4 py-2 rounded-xl border border-slate-100 text-xs font-bold text-[#2D3142] capitalize whitespace-nowrap">
              {todayLabel}
            </div>
          </div>

          <div className="space-y-3">
            {todaySchedule.map((slot) => (
              <div key={slot.time} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="flex flex-col items-center justify-center bg-[#F8F9FA] rounded-xl w-14 h-14 shrink-0 border border-slate-100">
                  <Clock size={12} className="text-slate-300 mb-0.5" />
                  <span className="text-[11px] font-extrabold text-[#2D3142]">{slot.time}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#2D3142] truncate" title={slot.subject}>{slot.subject}</p>
                  <p className="text-[11px] text-slate-400 font-medium">Canal WhatsApp</p>
                </div>
                <Badge
                  className={`border-none text-[10px] font-bold px-2.5 py-1 rounded-lg shrink-0 ${
                    slot.status === 'Envoyé'
                      ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-50'
                      : slot.status === 'Échec'
                      ? 'bg-red-50 text-red-600 hover:bg-red-50'
                      : slot.status === 'En attente'
                      ? 'bg-amber-50 text-amber-600 hover:bg-amber-50'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {slot.status}
                </Badge>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <span className="text-xs font-bold text-slate-400">Progression du jour</span>
            <span className="text-xs font-extrabold text-[#1E2A4A]">{sentToday}/5 envoyées</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden -mt-3">
            <div className="h-full bg-[#1E2A4A] rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (sentToday / 5) * 100)}%` }} />
          </div>
        </div>


        {/* Mes notes section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-bold text-[#2D3142] tracking-tight">Mes notes</h2>
          </div>
          
          {/* Quick Add Note */}
          <Card className="rounded-[24px] border-dashed border-2 border-slate-200 bg-white/50 p-4 shadow-none">
            <form onSubmit={handleAddNote} className="space-y-3">
              <Input 
                placeholder="Titre de la note..." 
                className="border-none bg-transparent font-bold focus-visible:ring-0 px-0 h-auto text-sm"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
              />
              <textarea 
                placeholder="Écrivez votre contenu ici..." 
                className="w-full bg-transparent border-none text-xs text-slate-500 focus:outline-none resize-none min-h-[60px]"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
              />
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  size="sm" 
                  disabled={!newNoteTitle || !newNoteContent || isAddingNote}
                  className="bg-[#2D3142] hover:bg-[#2D3142]/90 rounded-xl px-4 text-xs h-8"
                >
                  {isAddingNote ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3 mr-2" />}
                  Ajouter
                </Button>
              </div>
            </form>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredNotes && filteredNotes.length > 0 ? (
              filteredNotes.map((note: any) => (
                <NoteCard 
                  key={note.id}
                  title={note.title} 
                  content={note.content} 
                  date={new Date(note.created_at).toLocaleDateString('fr-FR')}
                  color={note.color}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-slate-400 text-sm italic">Aucune note pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function TaskFilter({ label, active, onClick, className }: { label: string, active?: boolean, onClick: () => void, className?: string }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${
        active ? 'bg-[#2D3142] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
      } ${className}`}
    >
      {label}
    </button>
  )
}

function TaskItem({ title, subject, date, status, statusColor, progress, comments }: any) {
  return (
    <div className="group flex flex-col gap-3 p-1 rounded-2xl transition-all">
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <h3 className="font-bold text-[#2D3142] group-hover:text-[#8C7CF0] transition-colors">{title}</h3>
          <p className="text-xs text-slate-400">{subject}</p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${statusColor}`}>
          {status}
        </span>
      </div>
      
      {progress !== undefined && (
        <div className="space-y-2">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#A3E635] rounded-full transition-all duration-1000" 
              style={{ width: `${progress}%`, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)' }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium">
        <span>{date}</span>
        <span>{comments} commentaires</span>
      </div>
      <div className="h-[1px] bg-slate-50 w-full mt-1" />
    </div>
  )
}

function NoteCard({ title, content, date, color }: any) {
  return (
    <div className={`${color} rounded-[24px] p-6 flex flex-col gap-4 shadow-sm border border-white/20 h-full relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer`}>
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-base">{title}</h3>
        <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full hover:bg-white/20">
          <MoreHorizontal size={14} />
        </Button>
      </div>
      <p className="text-[13px] leading-relaxed opacity-90 line-clamp-4 font-medium">{content}</p>
      <div className="mt-auto pt-4 text-[11px] font-bold opacity-70">
        {date}
      </div>
      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-current opacity-20 pointer-events-none" />
    </div>
  )
}

function KpiCard({ icon, label, value, accent }: { icon: React.ReactNode, label: string, value: string | number, accent: string }) {
  return (
    <div className="bg-white rounded-[28px] p-6 shadow-sm border border-white/50 flex flex-col gap-4 hover:shadow-lg hover:shadow-slate-200/50 transition-all">
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-extrabold text-[#1E2A4A] tracking-tight leading-none">{value}</p>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-2">{label}</p>
      </div>
    </div>
  )
}


function AvatarFallback({ className, children }: { className?: string, children?: React.ReactNode }) {
  return <div className={`w-full h-full flex items-center justify-center font-bold ${className}`}>{children}</div>
}
