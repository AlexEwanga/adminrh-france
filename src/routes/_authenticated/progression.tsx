import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts'
import { useState, useMemo } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getProgressionData, getLearningStats, getRecentLogs, getWhatsAppStats } from '@/lib/learning.functions'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, ChevronLeft, ChevronRight, MessageCircle, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"


export const Route = createFileRoute('/_authenticated/progression')({
  component: ProgressionPage,
})

function ProgressionPage() {
  const [activeTab, setActiveTab] = useState('Semaine')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const pageSize = 5

  const { data: progressionData } = useSuspenseQuery({
    queryKey: ['progression-data'],
    queryFn: () => getProgressionData()
  })

  const { data: stats } = useSuspenseQuery({
    queryKey: ['learning-stats'],
    queryFn: () => getLearningStats()
  })

  const { data: logsData } = useSuspenseQuery({
    queryKey: ['whatsapp-logs', page, search, dateFilter],
    queryFn: () => getRecentLogs({ 
      data: { 
        page, 
        pageSize, 
        search, 
        startDate: dateFilter ? `${dateFilter}T00:00:00Z` : undefined,
        endDate: dateFilter ? `${dateFilter}T23:59:59Z` : undefined
      } 
    })
  })
  
  const { data: whatsappStats } = useSuspenseQuery({
    queryKey: ['whatsapp-stats'],
    queryFn: () => getWhatsAppStats()
  })

  const chartData = useMemo(() => {
    if (!progressionData || progressionData.length === 0) {
      return [
        { name: 'Lun', score: 0 },
        { name: 'Mar', score: 0 },
        { name: 'Mer', score: 0 },
        { name: 'Jeu', score: 0 },
        { name: 'Ven', score: 0 },
        { name: 'Sam', score: 0 },
        { name: 'Dim', score: 0 },
      ]
    }
    return progressionData.map((d: any) => ({
      name: new Date(d.date).toLocaleDateString('fr-FR', { weekday: 'short' }),
      score: d.avg_score || 0
    }))
  }, [progressionData])

  const totalPages = Math.ceil((logsData?.total || 0) / pageSize)

  return (
    <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-white/50 flex flex-col gap-8 min-h-[calc(100vh-140px)]">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2D3142]">Ma Progression RH</h1>
          <p className="text-slate-400 mt-1">Visualisez votre maîtrise de l'écosystème RH français.</p>
        </div>
        <div className="flex gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
          {['Semaine', 'Mois'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab ? 'bg-white text-[#2D3142] shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-none bg-[#F8F9FA] rounded-[24px] overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#2D3142] text-xl font-bold">Score {activeTab} (%)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] p-6 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(140, 124, 240, 0.05)' }}
                  contentStyle={{ 
                    backgroundColor: '#2D3142', 
                    color: '#fff', 
                    borderRadius: '16px', 
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: '#8C7CF0', fontWeight: 'bold' }}
                />
                <Bar dataKey="score" fill="#8C7CF0" radius={[8, 8, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-none bg-[#F8F9FA] rounded-[24px]">
          <CardHeader>
            <CardTitle className="text-[#2D3142] text-xl font-bold">Statistiques détaillées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <StatItem label="Quiz terminés" value={`${stats?.quiz_taken || 0}`} />
              <StatItem label="Leçons reçues" value={`${stats?.messages_received || 0}`} />
              <StatItem label="Domaine d'expertise" value={stats?.tags_covered?.[0] || "Droit du travail"} />
              <StatItem label="Score moyen" value={`${stats?.avg_score || 0}%`} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-4">
          <Card className="lg:col-span-2 border-none shadow-none bg-[#F8F9FA] rounded-[24px] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[#2D3142] text-xl font-bold">Activité WhatsApp (7 jours)</CardTitle>
              <Badge variant="outline" className="rounded-lg border-slate-200 text-slate-500 font-bold">
                {whatsappStats?.reduce((acc: number, curr: any) => acc + curr.total, 0)} messages
              </Badge>
            </CardHeader>
            <CardContent className="h-[250px] p-6 pt-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={whatsappStats}>
                  <defs>
                    <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                    tickFormatter={(str) => format(new Date(str), 'dd MMM', { locale: fr })}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#2D3142', 
                      color: '#fff', 
                      borderRadius: '16px', 
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="success" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorSuccess)" 
                    strokeWidth={3}
                    name="Succès"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="failure" 
                    stroke="#f43f5e" 
                    fill="transparent"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Échecs"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-[#8C7CF0] rounded-[24px] p-6 text-white flex flex-col justify-between shadow-lg shadow-[#8C7CF0]/20">
              <div>
                <p className="text-white/70 text-sm font-bold uppercase tracking-wider mb-1">Taux de délivrabilité</p>
                <h3 className="text-4xl font-black">
                  {Math.round((whatsappStats?.reduce((acc: number, curr: any) => acc + curr.success, 0) / (whatsappStats?.reduce((acc: number, curr: any) => acc + curr.total, 0) || 1)) * 100)}%
                </h3>
              </div>
              <div className="mt-4 flex items-center gap-2 text-white/80 text-xs font-bold bg-white/10 p-2 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                Service CallMeBot Actif
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-6 border border-slate-100 flex flex-col justify-between shadow-sm">
              <div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Moyenne quotidienne</p>
                <h3 className="text-3xl font-black text-[#2D3142]">
                  {(whatsappStats?.reduce((acc: number, curr: any) => acc + curr.total, 0) / 7).toFixed(1)}
                </h3>
              </div>
              <p className="text-slate-400 text-xs font-medium mt-2">Leçons par jour sur la semaine</p>
            </div>
          </div>
        </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#8C7CF0]/10 rounded-xl text-[#8C7CF0]">
              <MessageCircle size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#2D3142]">Historique WhatsApp</h2>
              <p className="text-slate-400 text-sm font-medium">Suivi de vos leçons quotidiennes</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                placeholder="Rechercher une leçon..." 
                className="pl-9 w-64 rounded-xl border-slate-100 bg-slate-50 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                type="date"
                className="pl-9 w-44 rounded-xl border-slate-100 bg-slate-50 text-sm"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#F8F9FA] rounded-[24px] overflow-hidden border border-slate-100 shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="font-bold text-[#2D3142]">Date</TableHead>
                <TableHead className="font-bold text-[#2D3142]">Sujet</TableHead>
                <TableHead className="font-bold text-[#2D3142]">Destinataire</TableHead>
                <TableHead className="font-bold text-[#2D3142] text-center">Statut</TableHead>
                <TableHead className="font-bold text-[#2D3142] text-right">Détails</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logsData?.logs.map((log: any) => (
                <TableRow key={log.id} className="hover:bg-white border-slate-50 transition-colors">
                  <TableCell className="font-medium text-slate-500">
                    {format(new Date(log.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                  </TableCell>
                  <TableCell className="font-bold text-[#2D3142]">
                    {log.subject}
                  </TableCell>
                  <TableCell className="text-slate-400 font-medium">
                    {log.phone_number}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={`rounded-lg border-none ${
                      log.status === 'success' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-rose-50 text-rose-600'
                    }`}>
                      {log.status === 'success' ? 'Envoyé' : 'Échec'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-[#8C7CF0] font-bold hover:text-[#8C7CF0] hover:bg-[#8C7CF0]/5 gap-2">
                          <Eye size={14} />
                          Visualiser
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px] rounded-[32px] border-none shadow-2xl p-0 overflow-hidden bg-white">
                        <DialogHeader className="p-8 bg-[#2D3142] text-white">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/10 rounded-xl">
                              <MessageCircle size={20} className="text-[#8C7CF0]" />
                            </div>
                            <DialogTitle className="text-xl font-bold tracking-tight">Détails du message</DialogTitle>
                          </div>
                          <div className="flex flex-col gap-1 opacity-80 text-sm">
                            <p>Envoyé le : {format(new Date(log.created_at), 'PPPP à HH:mm', { locale: fr })}</p>
                            <p>Destinataire : {log.phone_number}</p>
                          </div>
                        </DialogHeader>
                        <div className="p-8">
                          <div className="mb-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Sujet de la leçon</h4>
                            <p className="text-lg font-bold text-[#2D3142] leading-tight">{log.subject}</p>
                          </div>
                          <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Contenu intégral</h4>
                            <ScrollArea className="h-[300px] w-full rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
                              <div className="text-[#2D3142] font-medium leading-relaxed whitespace-pre-wrap text-[15px]">
                                {log.content}
                              </div>
                            </ScrollArea>
                          </div>
                          {log.error_message && (
                            <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-100">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-1">Erreur technique</h4>
                              <p className="text-rose-600 text-xs font-bold">{log.error_message}</p>
                            </div>
                          )}
                        </div>
                        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                          <DialogClose asChild>
                            <Button 
                              variant="outline" 
                              className="rounded-xl border-slate-200 text-[#2D3142] font-bold"
                            >
                              Fermer
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>

                </TableRow>
              ))}
              {logsData?.logs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-400 font-medium">
                    Aucun message trouvé pour ces critères.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold">
              Affichage de {logsData?.logs.length} sur {logsData?.total} messages
            </span>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl h-8 w-8 p-0"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft size={16} />
              </Button>
              <span className="text-xs font-bold text-[#2D3142]">Page {page} / {totalPages || 1}</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl h-8 w-8 p-0"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-sm border border-slate-50 hover:border-[#8C7CF0]/30 transition-colors group">
      <span className="font-bold text-[#2D3142]">{label}</span>
      <span className="text-[#8C7CF0] font-black text-lg group-hover:scale-105 transition-transform">{value}</span>
    </div>
  )
}
