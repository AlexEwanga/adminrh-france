import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getQuizzes, getLearningStats } from '@/lib/learning.functions'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Trophy } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authenticated/quiz/')({
  component: QuizSelectionPage,
})

function QuizSelectionPage() {
  const { data: quizzes } = useSuspenseQuery({
    queryKey: ['learning-quizzes'],
    queryFn: () => getQuizzes()
  })

  const { data: stats } = useSuspenseQuery({
    queryKey: ['learning-stats'],
    queryFn: () => getLearningStats()
  })

  const navigate = useNavigate()
  const handleStartQuiz = (id: number) => {
    navigate({ to: `/quiz/${id}` })
  }


  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-white/50 flex flex-col gap-8 min-h-[calc(100vh-140px)]">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2D3142]">Quiz & Défis RH</h1>
          <p className="text-slate-400 mt-1">Méthodologie : 1000 questions structurées par thèmes (CDI, Durée, Rupture) basées sur la Partie Législative.</p>
        </div>
        <div className="bg-[#FEEFC3] px-6 py-3 rounded-2xl flex items-center gap-3 shadow-sm border border-[#FDE68A]">
          <Trophy className="text-[#F9A825]" size={24} />
          <span className="font-bold text-[#2D3142]">{Math.round(stats?.avg_score || 0) * 10} pts</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes?.map((quiz) => (
          <Card key={quiz.id} className="group border-none shadow-none bg-[#F8F9FA] rounded-[24px] overflow-hidden hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
            <CardContent className="p-8 flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <Badge className="bg-white text-[#2D3142] border-none shadow-sm">{quiz.category}</Badge>
                <Badge className="bg-[#E0E7FF] text-[#6366F1] border-none shadow-sm">
                  {quiz.difficulty === 1 ? 'Débutant' : quiz.difficulty === 2 ? 'Intermédiaire' : 'Expert'}
                </Badge>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2D3142] mb-2">{quiz.title}</h3>
                <p className="text-sm text-slate-500 font-medium">
                  {quiz.id === 8 ? '950' : (Array.isArray(quiz.questions) ? quiz.questions.length : 0)} questions • 5-10 minutes
                </p>
              </div>
              <Button 
                onClick={() => handleStartQuiz(quiz.id)}
                className="w-full bg-[#2D3142] hover:bg-[#8C7CF0] text-white rounded-2xl py-6 font-bold shadow-lg shadow-slate-200 transition-all active:scale-95"
              >
                <GraduationCap className="mr-2" size={20} />
                Commencer le Quiz
              </Button>
            </CardContent>
          </Card>
        ))}
        {quizzes?.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 font-medium">
            Aucun quiz disponible pour le moment.
          </div>
        )}
      </div>
    </div>
  )
}
