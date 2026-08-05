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
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-[#1E2A4A]">Ma Progression</h1>
        <p className="text-slate-500">Visualisez vos scores et votre temps d'apprentissage.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Score Hebdomadaire</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E2A4A', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#D4AF37' }}
                />
                <Bar dataKey="score" fill="#1E2A4A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Temps d'apprentissage</CardTitle>
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
