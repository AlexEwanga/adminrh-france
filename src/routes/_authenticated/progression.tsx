import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export const Route = createFileRoute('/_authenticated/progression')({
  component: ProgressionPage,
})


function ProgressionPage() {
  const data = [
    { name: 'Lun', score: 65 },
    { name: 'Mar', score: 72 },
    { name: 'Mer', score: 85 },
    { name: 'Jeu', score: 78 },
    { name: 'Ven', score: 92 },
    { name: 'Sam', score: 88 },
    { name: 'Dim', score: 95 },
  ]

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-white/50 flex flex-col gap-8 min-h-[calc(100vh-140px)]">
      <header>
        <h1 className="text-3xl font-bold text-[#2D3142]">Ma Progression RH</h1>
        <p className="text-slate-400 mt-1">Visualisez votre maîtrise de l'écosystème RH français.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-none bg-[#F8F9FA] rounded-[24px]">
          <CardHeader>
            <CardTitle className="text-[#2D3142]">Score Hebdomadaire (%)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2D3142', color: '#fff', borderRadius: '16px', border: 'none' }}
                  itemStyle={{ color: '#8C7CF0' }}
                />
                <Bar dataKey="score" fill="#8C7CF0" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-none bg-[#F8F9FA] rounded-[24px]">
          <CardHeader>
            <CardTitle className="text-[#2D3142]">Statistiques détaillées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                <span className="font-medium">Cette semaine</span>
                <span className="text-[#D4AF37] font-bold">12h 45m</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                <span className="font-medium">Moyenne quotidienne</span>
                <span className="text-[#D4AF37] font-bold">1h 50m</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                <span className="font-medium">Sujet le plus étudié</span>
                <span className="text-[#D4AF37] font-bold">Droit du travail</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
