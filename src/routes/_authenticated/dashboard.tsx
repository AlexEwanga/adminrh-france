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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
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
          <h2 className="text-2xl font-bold text-[#2D3142] tracking-tight">Mes objectifs RH</h2>
          <Button size="icon" variant="ghost" className="bg-[#F8F9FA] rounded-xl hover:bg-slate-100 h-10 w-10 border border-slate-100">
            <Plus size={20} className="text-[#2D3142]" />
          </Button>
        </div>

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
            <div className="text-center py-12 space-y-2">
              <Search className="mx-auto text-slate-200 h-12 w-12" />
              <p className="text-slate-400 font-medium">Aucun objectif trouvé.</p>
            </div>
          )}
        </div>

        <Button variant="ghost" className="w-full text-slate-400 font-medium py-6 hover:bg-slate-50 mt-2">
          Voir tous les objectifs RH
        </Button>
      </div>

      {/* Right Column: Planning & Notes */}
      <div className="lg:col-span-5 space-y-6 flex flex-col">
        {/* Mon planning section */}
        <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-white/50 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#2D3142] tracking-tight">Mon planning</h2>
            <div className="flex items-center gap-2 bg-[#F8F9FA] px-4 py-2 rounded-xl border border-slate-100 text-sm font-medium text-[#2D3142]">
              5 Août, Mercredi
            </div>
          </div>

          <div className="space-y-1">
            <ScheduleHeader />
            <div className="divide-y divide-slate-50">
              {filteredMessages && filteredMessages.length > 0 ? (
                filteredMessages.map((msg: any) => (
                  <ScheduleItem 
                    key={msg.id}
                    time={msg.scheduled_hour?.substring(0, 5) || '--:--'} 
                    lesson={msg.tag || 'Leçon'} 
                    theme={msg.subject} 
                    channel="WhatsApp" 
                  />
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-sm">
                  Aucune leçon planifiée.
                </div>
              )}
            </div>
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

function ScheduleHeader() {
  return (
    <div className="grid grid-cols-4 px-2 md:px-4 py-2 text-[10px] md:text-[11px] font-bold text-slate-300 uppercase tracking-wider">
      <span>Heure</span>
      <span>Sujet</span>
      <span className="hidden sm:inline">Thème</span>
      <span className="sm:hidden">Th.</span>
      <span>Canal</span>
    </div>
  )
}

function ScheduleItem({ time, lesson, theme, channel }: any) {
  return (
    <div className="grid grid-cols-4 px-2 md:px-4 py-4 items-center text-[12px] md:text-[13px] group hover:bg-slate-50 transition-colors rounded-xl cursor-pointer">
      <span className="font-bold text-[#2D3142]">{time}</span>
      <span className="font-medium text-[#2D3142] truncate mr-2" title={lesson}>{lesson}</span>
      <div className="flex items-center gap-2 truncate mr-2">
        <span className="text-slate-500 font-medium truncate" title={theme}>{theme}</span>
      </div>
      <Badge className="bg-green-50 text-green-600 hover:bg-green-100 border-none px-2 py-0.5 text-[10px] w-fit">
        {channel}
      </Badge>

    </div>
  )
}

function Avatar({ className, children }: { className?: string, children?: React.ReactNode }) {
  return <div className={`rounded-full overflow-hidden flex items-center justify-center ${className}`}>{children}</div>
}

function AvatarFallback({ className, children }: { className?: string, children?: React.ReactNode }) {
  return <div className={`w-full h-full flex items-center justify-center font-bold ${className}`}>{children}</div>
}
