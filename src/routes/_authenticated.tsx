import { createFileRoute, Outlet, redirect, Link } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, BookOpen, GraduationCap, BarChart, Settings, LogOut } from 'lucide-react'
import { Toaster } from 'sonner'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
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
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E2A4A] text-white hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tight text-[#D4AF37]">AdminRH</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors [&.active]:bg-slate-800 [&.active]:text-[#D4AF37]"
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link
            to="/learning"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors [&.active]:bg-slate-800 [&.active]:text-[#D4AF37]"
          >
            <BookOpen size={20} />
            <span className="font-medium">Apprentissage</span>
          </Link>
          <Link
            to="/quiz"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors [&.active]:bg-slate-800 [&.active]:text-[#D4AF37]"
          >
            <GraduationCap size={20} />
            <span className="font-medium">Quiz</span>
          </Link>
          <Link
            to="/progression"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors [&.active]:bg-slate-800 [&.active]:text-[#D4AF37]"
          >
            <BarChart size={20} />
            <span className="font-medium">Progression</span>
          </Link>
          <Link
            to="/admin"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors [&.active]:bg-slate-800 [&.active]:text-[#D4AF37]"
          >
            <Settings size={20} />
            <span className="font-medium">Administration</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-2" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
}
