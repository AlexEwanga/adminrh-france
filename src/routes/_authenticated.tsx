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
  Menu,
  X
} from 'lucide-react'
import { Toaster } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"

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
  const [globalSearch, setGlobalSearch] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  return (
    <div className="flex min-h-screen bg-[#F0F2F5] p-4 md:p-6 gap-4 md:gap-6 font-sans">
      {/* Sidebar - Hidden on mobile */}
      <aside className="w-64 bg-white rounded-3xl shadow-sm hidden md:flex flex-col overflow-hidden border border-white/50">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2D3142] rounded-xl flex items-center justify-center text-white font-bold italic">
            AR
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#2D3142]">AdminRH</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Tableau de bord" />
          <SidebarLink to="/learning" icon={<BookOpen size={20} />} label="Base de connaissances" />
          <SidebarLink to="/quiz" icon={<GraduationCap size={20} />} label="Quiz & Tests" />
          <SidebarLink to="/progression" icon={<BarChart size={20} />} label="Ma Progression" />
          <SidebarLink to="/admin" icon={<Settings size={20} />} label="Administration" />
        </nav>

        <div className="p-4 space-y-1 border-t border-slate-50">
          <SidebarLink to="/admin" icon={<Settings size={20} />} label="Paramètres" />
          <button 
            className="w-full flex items-center gap-3 px-6 py-3 rounded-2xl text-slate-500 hover:text-[#2D3142] hover:bg-slate-50 transition-all active:scale-95"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span className="font-medium text-[15px]">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        {/* Header bar */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 max-w-2xl min-w-0">
            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden bg-white rounded-2xl shadow-sm border border-white/50 h-10 w-10 shrink-0">
                  <Menu size={20} className="text-[#2D3142]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 bg-white border-r-0">
                <SheetHeader className="p-8 pb-4 flex flex-row items-center gap-3 text-left border-b border-slate-50">
                  <div className="w-10 h-10 bg-[#2D3142] rounded-xl flex items-center justify-center text-white font-bold italic">
                    AR
                  </div>
                  <SheetTitle className="text-xl font-bold tracking-tight text-[#2D3142]">AdminRH</SheetTitle>
                </SheetHeader>
                
                <nav className="flex-1 px-4 space-y-1 mt-6">
                  <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Tableau de bord" onClick={() => setIsMobileMenuOpen(false)} />
                  <SidebarLink to="/learning" icon={<BookOpen size={20} />} label="Base de connaissances" onClick={() => setIsMobileMenuOpen(false)} />
                  <SidebarLink to="/quiz" icon={<GraduationCap size={20} />} label="Quiz & Tests" onClick={() => setIsMobileMenuOpen(false)} />
                  <SidebarLink to="/progression" icon={<BarChart size={20} />} label="Ma Progression" onClick={() => setIsMobileMenuOpen(false)} />
                  <SidebarLink to="/admin" icon={<Settings size={20} />} label="Administration" onClick={() => setIsMobileMenuOpen(false)} />
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1 border-t border-slate-50 bg-white">
                  <button 
                    className="w-full flex items-center gap-3 px-6 py-3 rounded-2xl text-slate-500 hover:text-[#2D3142] hover:bg-slate-50 transition-all active:scale-95"
                    onClick={handleLogout}
                  >
                    <LogOut size={20} />
                    <span className="font-medium text-[15px]">Déconnexion</span>
                  </button>
                </div>
              </SheetContent>
            </Sheet>

            <div className="bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-white/50 flex items-center gap-2 flex-1 focus-within:ring-2 focus-within:ring-[#8C7CF0]/50 transition-all min-w-0">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="text-sm text-slate-600 font-medium bg-transparent focus:outline-none w-full truncate"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
            </div>
            
            <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-white/50 cursor-pointer hover:bg-slate-50 transition-colors relative active:scale-95 shrink-0 hidden sm:block">
              <Bell size={18} className="text-slate-400" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#8C7CF0] rounded-full border-2 border-white"></span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white px-2 sm:px-4 py-1.5 rounded-2xl shadow-sm border border-white/50 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors active:scale-95">
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-[#F0F2F5]">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-[#2D3142] text-white text-xs">RH</AvatarFallback>
              </Avatar>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-bold text-[#2D3142]">Profil RH</p>
                <p className="text-[10px] text-slate-400 font-medium">En formation</p>
              </div>
              <MoreVertical size={14} className="text-slate-400 ml-0 sm:ml-2 hidden sm:block" />
            </div>
            
            <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-white/50 cursor-pointer hover:bg-slate-50 transition-colors active:scale-95 hidden md:block">
              <MoreVertical size={18} className="text-slate-400" />
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-auto scrollbar-hide">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" closeButton richColors />
    </div>
  )
}

function SidebarLink({ to, icon, label, badge, onClick }: { to: string, icon: React.ReactNode, label: string, badge?: string, onClick?: () => void }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between px-6 py-3 rounded-2xl text-slate-500 transition-all hover:bg-slate-50 [&.active]:bg-[#2D3142] [&.active]:text-white [&.active]:shadow-lg active:scale-[0.98]"
      onClick={onClick}
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