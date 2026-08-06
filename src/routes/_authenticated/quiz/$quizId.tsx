import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authenticated/quiz/$quizId')({
  component: QuizTakePage,
})

function QuizTakePage() {
  const { quizId } = Route.useParams()
  const navigate = useNavigate()
  
  // In a real app, load this via query
  const quiz = {
    id: quizId,
    title: "Bases du Droit du Travail",
    questions: [
      { question: "En France, la durée légale du travail est de :", options: ["35h", "37h", "39h", "40h"], correct_index: 0 },
      { question: "La durée maximale d'un CDD est de :", options: ["12 mois", "18 mois", "24 mois", "36 mois"], correct_index: 1 }
    ]
  }

  const [currentIdx, setCurrentIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx)
    setTimeout(() => {
      if (idx === quiz.questions[currentIdx].correct_index) {
        setScore(s => s + 1)
        toast.success("Bonne réponse !")
      } else {
        toast.error("Mauvaise réponse.")
      }

      if (currentIdx + 1 < quiz.questions.length) {
        setCurrentIdx(c => c + 1)
        setSelectedIdx(null)
      } else {
        setFinished(true)
      }
    }, 1000)
  }

  if (finished) {
    return (
      <div className="bg-white rounded-[32px] p-8 text-center flex flex-col items-center gap-6">
        <h2 className="text-3xl font-bold">Quiz terminé !</h2>
        <p className="text-xl">Votre score : {score} / {quiz.questions.length}</p>
        <Button onClick={() => navigate({ to: '/quiz' })} className="rounded-2xl">Retour aux quiz</Button>
      </div>
    )
  }

  const q = quiz.questions[currentIdx]

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-white/50 max-w-2xl mx-auto">
      <div className="mb-8">
        <span className="text-sm font-bold text-[#8C7CF0]">Question {currentIdx + 1} / {quiz.questions.length}</span>
        <h2 className="text-2xl font-bold mt-2">{q.question}</h2>
      </div>
      <div className="flex flex-col gap-4">
        {q.options.map((opt, i) => (
          <Button
            key={i}
            variant={selectedIdx === null ? "outline" : i === q.correct_index ? "default" : "destructive"}
            className="justify-start text-left h-auto py-4 px-6 rounded-2xl"
            onClick={() => handleSelect(i)}
            disabled={selectedIdx !== null}
          >
            {opt}
          </Button>
        ))}
      </div>
    </div>
  )
}
