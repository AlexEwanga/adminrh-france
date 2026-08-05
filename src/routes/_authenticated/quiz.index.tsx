import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getQuizzes } from '@/lib/learning.functions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Trophy } from 'lucide-react'


export const Route = createFileRoute('/_authenticated/quiz/')({
  component: QuizSelectionPage,
})

function QuizSelectionPage() {
  const { data: quizzes } = useSuspenseQuery({
    queryKey: ['learning-quizzes'],
    queryFn: () => getQuizzes()
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-[#1E2A4A]">Quiz & Défis</h1>
          <p className="text-slate-500">Testez vos connaissances et gagnez des points.</p>
        </div>
        <div className="bg-[#D4AF37]/10 px-4 py-2 rounded-lg border border-[#D4AF37]/20 flex items-center gap-2">
          <Trophy className="text-[#D4AF37]" size={20} />
          <span className="font-bold text-[#1E2A4A]">0 pts</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes?.map((quiz) => (
          <Card key={quiz.id} className="relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37] transition-all group-hover:w-2" />
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant="secondary">{quiz.category}</Badge>
                <Badge variant="outline">{quiz.difficulty === 1 ? 'Débutant' : 'Intermédiaire'}</Badge>
              </div>
              <CardTitle className="text-xl mt-4">{quiz.title}</CardTitle>
              <CardDescription>{Array.isArray(quiz.questions) ? quiz.questions.length : 0} questions • 5-10 minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-[#1E2A4A] group-hover:bg-[#D4AF37] transition-colors">
                <GraduationCap className="mr-2" size={18} />
                Commencer le Quiz
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

