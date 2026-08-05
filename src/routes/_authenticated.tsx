import { createFileRoute, Outlet, redirect, Link } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  BarChart, 
  Settings, 
  LogOut,
  Search,
  Bell,
  MoreVertical,
  Plus
} from 'lucide-react'
import { Toaster } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    if (typeof window === 'undefined') return

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw redirect({
        to: '/auth',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  return (
    <div className="flex min-h-screen bg-[#F0F2F5] p-6 gap-6 font-sans">
      {/* Sidebar - Rounded floating look */}
      <aside className="w-64 bg-white rounded-3xl shadow-sm hidden md:flex flex-col overflow-hidden border border-white/50">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2D3142] rounded-xl flex items-center justify-center text-white font-bold italic">
            AR
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#2D3142]">AdminRH</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Tableau de bord" />
          <SidebarLink to="/learning" icon={<BookOpen size={20} />} label="Planning" />
          <SidebarLink to="/quiz" icon={<GraduationCap size={20} />} label="Objectifs" badge="3" />
          <SidebarLink to="/progression" icon={<BarChart size={20} />} label="Tests & Quiz" />
          <SidebarLink to="/admin" icon={<Settings size={20} />} label="Administration" />
          
          <div className="py-4 opacity-0">spacer</div>
          
          <SidebarLink to="#" icon={<div className="relative"><BookOpen size={20} /><span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8C7CF0] text-[10px] flex items-center justify-center rounded-full text-white">12</span></div>} label="Chat" />
          <SidebarLink to="#" icon={<div className="relative"><BarChart size={20} /><span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8C7CF0] text-[10px] flex items-center justify-center rounded-full text-white">2</span></div>} label="Notes" />
        </nav>

        <div className="p-4 space-y-1 border-t border-slate-50">
          <SidebarLink to="/admin" icon={<Settings size={20} />} label="Paramètres" />
          <button 
            className="w-full flex items-center gap-3 px-6 py-3 rounded-2xl text-slate-500 hover:text-[#2D3142] hover:bg-slate-50 transition-all"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span className="font-medium text-[15px]">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Header bar */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-white/50 flex items-center gap-2">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="text-sm text-slate-600 font-medium bg-transparent focus:outline-none w-full"
              />
            </div>
            <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-white/50 cursor-pointer hover:bg-slate-50 transition-colors relative">
              <Bell size={18} className="text-slate-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#8C7CF0] rounded-full border-2 border-white"></span>
            </div>
            <div className="bg-white px-4 py-1.5 rounded-2xl shadow-sm border border-white/50 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors">
              <Avatar className="h-9 w-9 border-2 border-[#F0F2F5]">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-[#2D3142] text-white">RH</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-bold text-[#2D3142]">Profil RH</p>
                <p className="text-[10px] text-slate-400">En formation</p>
              </div>
              <MoreVertical size={14} className="text-slate-400 ml-2" />
            </div>
          </div>
          
          <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-white/50 cursor-pointer hover:bg-slate-50 transition-colors">
            <MoreVertical size={18} className="text-slate-400" />
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  )
}

function SidebarLink({ to, icon, label, badge }: { to: string, icon: React.ReactNode, label: string, badge?: string }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between px-6 py-3 rounded-2xl text-slate-500 transition-all hover:bg-slate-50 [&.active]:bg-[#2D3142] [&.active]:text-white [&.active]:shadow-lg"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium text-[15px]">{label}</span>
      </div>
      {badge && (
        <span className="w-5 h-5 bg-[#8C7CF0] text-[10px] flex items-center justify-center rounded-full text-white font-bold">
          {badge}
        </span>
      )}
    </Link>
  )
}
