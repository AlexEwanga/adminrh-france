import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { useState, useMemo } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getProgressionData, getLearningStats } from '@/lib/learning.functions'

export const Route = createFileRoute('/_authenticated/progression')({
  component: ProgressionPage,
})

function ProgressionPage() {
  const [activeTab, setActiveTab] = useState('Semaine')
  
  const { data: progressionData } = useSuspenseQuery({
    queryKey: ['progression-data'],
    queryFn: () => getProgressionData()
  })

  const { data: stats } = useSuspenseQuery({
    queryKey: ['learning-stats'],
    queryFn: () => getLearningStats()
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

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-white/50 flex flex-col gap-8 min-h-[calc(100vh-140px)]">
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
