import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getLearningStats, getRecentMessages } from '@/lib/learning.functions'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Plus, MoreHorizontal, MessageSquare, Trophy, Target, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const { data: stats } = useSuspenseQuery({
    queryKey: ['learning-stats'],
    queryFn: () => getLearningStats()
  })

  const { data: messages } = useSuspenseQuery({
    queryKey: ['recent-messages'],
    queryFn: () => getRecentMessages()
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
      {/* Left Column: My Tasks */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-white/50 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#2D3142]">My tasks</h2>
          <Button size="icon" variant="ghost" className="bg-[#F8F9FA] rounded-xl hover:bg-slate-100 h-10 w-10 border border-slate-100">
            <Plus size={20} className="text-[#2D3142]" />
          </Button>
        </div>

        <div className="flex gap-2">
          <TaskFilter label="All task" active />
          <TaskFilter label="To do" />
          <TaskFilter label="In progress" />
          <TaskFilter label="Done" />
        </div>

        <div className="space-y-4">
          <TaskItem 
            title="Read poem & answer questions" 
            subject="English Literature" 
            date="Apr 28, 2025" 
            status="In progress"
            progress={45}
            comments={12}
            statusColor="bg-[#FEEFC3] text-[#F9A825]"
          />
          <TaskItem 
            title="Create a comic strip with a story" 
            subject="Social Studies" 
            date="May 17, 2025" 
            status="To do"
            comments={0}
            statusColor="bg-[#E0E7FF] text-[#6366F1]"
          />
          <TaskItem 
            title="Prepare for the math test" 
            subject="Math" 
            date="May 11, 2025" 
            status="To do"
            comments={2}
            statusColor="bg-[#E0E7FF] text-[#6366F1]"
          />
          <TaskItem 
            title="Read poem & answer questions" 
            subject="English Literature" 
            date="Apr 28, 2025" 
            status="To do"
            comments={12}
            statusColor="bg-[#E0E7FF] text-[#6366F1]"
          />
        </div>

        <Button variant="ghost" className="w-full text-slate-400 font-medium py-6 hover:bg-slate-50 mt-2">
          View all tasks
        </Button>
      </div>

      {/* Right Column: Notes & Schedule */}
      <div className="space-y-6 flex flex-col">
        {/* My Notes section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#2D3142]">My notes</h2>
            <Button size="icon" variant="ghost" className="bg-[#F8F9FA] rounded-xl hover:bg-slate-100 h-10 w-10 border border-slate-100">
              <Plus size={20} className="text-[#2D3142]" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NoteCard 
              title="Math conspect" 
              content="A linear equation is an equation of the form: ax+b=c, where x is the variable, a,b, and c are constants, and a!=0." 
              date="May 05, 2025"
              color="bg-[#D1FAE5] text-[#065F46]"
            />
            <NoteCard 
              title="Biology conspect" 
              content="A cell is the basic structural, functional, and biological unit of all living organisms. It is the smallest unit capable of performing life functions." 
              date="Apr 29, 2025"
              color="bg-[#E0E7FF] text-[#3730A3]"
            />
          </div>
        </div>

        {/* My Schedule section */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-white/50 flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#2D3142]">My schedule</h2>
            <div className="flex items-center gap-2 bg-[#F8F9FA] px-4 py-2 rounded-xl border border-slate-100 text-sm font-medium text-[#2D3142] cursor-pointer">
              May 14, Mon
              <Target size={14} className="ml-1 rotate-90" />
            </div>
          </div>

          <div className="space-y-1">
            <ScheduleHeader />
            <div className="divide-y divide-slate-50">
              <ScheduleItem time="8:30 AM" lesson="Math" teacher="Mrs. Goodman" location="B3, Room 124" />
              <ScheduleItem time="8:30 AM" lesson="Math" teacher="Mrs. Goodman" location="B3, Room 124" />
              <ScheduleItem time="10:30 AM" lesson="ELA" teacher="Ms. Melton" location="B2, Room 158" />
              <ScheduleItem time="12:00 AM" lesson="Biology" teacher="Mr. Hodge" location="B3, Room 310" />
              <ScheduleItem time="02:00 PM" lesson="Social Studies" teacher="Mrs. Murray" location="B1, Room 112" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TaskFilter({ label, active }: { label: string, active?: boolean }) {
  return (
    <button className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${
      active ? 'bg-[#2D3142] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
    }`}>
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
              className="h-full bg-[#A3E635] rounded-full" 
              style={{ width: `${progress}%`, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)' }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium">
        <span>{date}</span>
        <span>{comments} comments</span>
      </div>
      <div className="h-[1px] bg-slate-50 w-full mt-1" />
    </div>
  )
}

function NoteCard({ title, content, date, color }: any) {
  return (
    <div className={`${color} rounded-[24px] p-6 flex flex-col gap-4 shadow-sm border border-white/20 h-full relative overflow-hidden group`}>
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
      {/* Decorative dot */}
      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-current opacity-20 pointer-events-none" />
    </div>
  )
}

function ScheduleHeader() {
  return (
    <div className="grid grid-cols-4 px-4 py-2 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
      <span>Time</span>
      <span>Lesson</span>
      <span>Teacher</span>
      <span>Location</span>
    </div>
  )
}

function ScheduleItem({ time, lesson, teacher, location }: any) {
  return (
    <div className="grid grid-cols-4 px-4 py-4 items-center text-[13px] group hover:bg-slate-50 transition-colors rounded-xl">
      <span className="font-bold text-[#2D3142]">{time}</span>
      <span className="font-medium text-[#2D3142]">{lesson}</span>
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarFallback className="bg-slate-100 text-[10px]">{teacher[0]}</AvatarFallback>
        </Avatar>
        <span className="text-slate-500 font-medium">{teacher}</span>
      </div>
      <span className="text-slate-500 font-medium">{location}</span>
    </div>
  )
}

function Avatar({ className, children }: { className?: string, children?: React.ReactNode }) {
  return <div className={`rounded-full overflow-hidden flex items-center justify-center ${className}`}>{children}</div>
}

function AvatarFallback({ className, children }: { className?: string, children?: React.ReactNode }) {
  return <div className={`w-full h-full flex items-center justify-center font-bold ${className}`}>{children}</div>
}
