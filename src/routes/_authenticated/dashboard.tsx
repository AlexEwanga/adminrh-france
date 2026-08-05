import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getLearningStats, getRecentMessages } from '@/lib/learning.functions'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Trophy, MessageSquare, Target } from 'lucide-react'

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
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-[#1E2A4A]">AdminRH-France</h1>
        <p className="text-slate-500">Bienvenue dans votre assistant personnel d'apprentissage.</p>

      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Messages Reçus" value="147" icon={<MessageSquare className="text-blue-500" />} />
        <StatCard title="Quiz Complétés" value="12" icon={<Trophy className="text-yellow-500" />} />
        <StatCard title="Score Moyen" value="85%" icon={<Target className="text-green-500" />} />
        <StatCard title="Sujets Maîtrisés" value="8" icon={<BookOpen className="text-purple-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Derniers Messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {messages?.map((msg) => (
              <div key={msg.id} className="p-4 rounded-lg border border-slate-100 bg-white hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-[#1E2A4A]">{msg.subject}</h3>
                  <Badge variant="secondary">{msg.tag}</Badge>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2">{msg.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ma Progression</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Droit du travail</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Culture RH</span>
                <span>40%</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Géographie</span>
                <span>90%</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-2xl font-bold text-[#1E2A4A] mt-1">{value}</h3>
          </div>
          <div className="p-3 bg-slate-50 rounded-full">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
