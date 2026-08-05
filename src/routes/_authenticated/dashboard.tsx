import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getLearningStats, getRecentMessages } from '@/lib/learning.functions'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Plus, MoreHorizontal, MessageSquare, Trophy, Target, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const [activeFilter, setActiveFilter] = useState('Tout')
  const { data: stats } = useSuspenseQuery({
    queryKey: ['learning-stats'],
    queryFn: () => getLearningStats()
  })

  const { data: messages } = useSuspenseQuery({
    queryKey: ['recent-messages'],
    queryFn: () => getRecentMessages()
  })

  const tasks = [
    { id: 1, title: "Rédaction de contrat de travail", subject: "Droit du Travail", date: "Aujourd'hui", status: "En cours", progress: 65, comments: 3, statusColor: "bg-[#FEEFC3] text-[#F9A825]" },
    { id: 2, title: "Calcul des indemnités de licenciement", subject: "Paie & Social", date: "Demain", status: "À faire", comments: 0, statusColor: "bg-[#E0E7FF] text-[#6366F1]" },
    { id: 3, title: "Géographie des départements français", subject: "Culture & Géo", date: "10 Août 2026", status: "À faire", comments: 2, statusColor: "bg-[#E0E7FF] text-[#6366F1]" },
    { id: 4, title: "Les instances représentatives du personnel", subject: "Droit du Travail", date: "12 Août 2026", status: "À faire", comments: 5, statusColor: "bg-[#E0E7FF] text-[#6366F1]" },
  ]

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'Tout') return true
    return task.status === activeFilter
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
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
          {filteredTasks.map(task => (
            <TaskItem key={task.id} {...task} />
          ))}
          {filteredTasks.length === 0 && (
            <p className="text-center py-12 text-slate-400 font-medium">Aucun objectif trouvé.</p>
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
              <ScheduleItem time="07:00" lesson="Droit du Travail" theme="Contrat CDI/CDD" channel="WhatsApp" />
              <ScheduleItem time="09:45" lesson="Géographie" theme="Régions de France" channel="WhatsApp" />
              <ScheduleItem time="12:30" lesson="Culture" theme="Gastronomie & Codes" channel="WhatsApp" />
              <ScheduleItem time="15:15" lesson="Droit du Travail" theme="Durée du travail" channel="WhatsApp" />
              <ScheduleItem time="18:00" lesson="Culture Générale" theme="Histoire de France" channel="WhatsApp" />
            </div>
          </div>
        </div>

        {/* Mes notes section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-bold text-[#2D3142] tracking-tight">Mes notes</h2>
            <Button size="icon" variant="ghost" className="bg-[#F8F9FA] rounded-xl hover:bg-slate-100 h-10 w-10 border border-slate-100">
              <Plus size={20} className="text-[#2D3142]" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NoteCard 
              title="Droit de grève" 
              content="En France, le droit de grève est un droit constitutionnel. Une grève doit être précédée d'un préavis dans le secteur public." 
              date="5 Août 2026"
              color="bg-[#D1FAE5] text-[#065F46]"
            />
            <NoteCard 
              title="Période d'essai" 
              content="CDI : 2 mois (ouvriers/employés), 3 mois (agents de maîtrise), 4 mois (cadres)." 
              date="4 Août 2026"
              color="bg-[#E0E7FF] text-[#3730A3]"
            />
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
      <span className="font-medium text-[#2D3142] truncate">{lesson}</span>
      <div className="flex items-center gap-2 truncate">
        <span className="text-slate-500 font-medium truncate">{theme}</span>
      </div>
      <span className="text-slate-500 font-medium truncate">{channel}</span>
    </div>
  )
}

function Avatar({ className, children }: { className?: string, children?: React.ReactNode }) {
  return <div className={`rounded-full overflow-hidden flex items-center justify-center ${className}`}>{children}</div>
}

function AvatarFallback({ className, children }: { className?: string, children?: React.ReactNode }) {
  return <div className={`w-full h-full flex items-center justify-center font-bold ${className}`}>{children}</div>
}
