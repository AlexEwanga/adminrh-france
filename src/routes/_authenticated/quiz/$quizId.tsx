import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getQuizById, submitQuizResult } from '@/lib/learning.functions'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, ArrowLeft, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import { useServerFn } from '@tanstack/react-start'

export const Route = createFileRoute('/_authenticated/quiz/$quizId')({
  component: QuizTakePage,
})

function QuizTakePage() {
  const { quizId } = Route.useParams()
  const navigate = useNavigate()
  const submitResult = useServerFn(submitQuizResult)
  
  const { data: quiz } = useSuspenseQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => getQuizById({ data: { id: quizId } })
  })

  const [currentIdx, setCurrentIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showNextButton, setShowNextButton] = useState(false)
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([])
  const [showCasus, setShowCasus] = useState(false)

  // For the Ultimate session (id 8), use the local file if the DB is incomplete
  const questions = (quiz?.questions as any[]) || []

  // Initialize and shuffle once
  useState(() => {
    const init = async () => {
      let pool = questions;
      if (quizId === '8' && pool.length < 950) {
        try {
          const allQuestions = await import('@/lib/all_questions.json').then(m => m.default);
          pool = allQuestions;
        } catch (e) {
          console.error("Failed to load questions from file", e);
        }
      }
      
      if (pool.length > 0) {
        const uniquePool = [...pool].sort(() => Math.random() - 0.5);
        setShuffledQuestions(uniquePool.slice(0, 10));
      }
    };
    init();
  })



  const currentQuestion = shuffledQuestions[currentIdx]

  const handleSelect = async (idx: number) => {
    setSelectedIdx(idx)
    
    const correctIndex = currentQuestion.correct_index ?? 
      currentQuestion.options.findIndex((opt: string) => opt === currentQuestion.correctAnswer);
      
    const isCorrect = idx === correctIndex;
    if (isCorrect) {
      setScore(s => s + 1)
      toast.success("Bonne réponse !", { duration: 2000 })
    } else {
      const correctText = currentQuestion.options[correctIndex] || currentQuestion.correctAnswer;
      toast.error(`Mauvaise réponse. La bonne réponse était : ${correctText}`, { duration: 3000 })
    }

    setShowNextButton(true)
    setShowCasus(true)
  }

  const handleNext = async () => {
    if (currentIdx + 1 < shuffledQuestions.length) {
      setCurrentIdx(c => c + 1)
      setSelectedIdx(null)
      setShowNextButton(false)
      setShowCasus(false)
    } else {
      setIsSubmitting(true)
      try {
        const finalScore = Math.round((score / shuffledQuestions.length) * 100)
        await submitResult({ 
          data: { 
            quiz_id: Number(quizId), 
            score: finalScore 
          } 
        })
        setFinished(true)
      } catch (error) {
        toast.error("Erreur lors de l'enregistrement du score")
        setFinished(true)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  if (finished) {
    const finalPercentage = Math.round((score / shuffledQuestions.length) * 100)
    return (
      <div className="bg-white rounded-[32px] p-12 text-center flex flex-col items-center gap-8 shadow-sm border border-white/50 min-h-[500px] justify-center max-w-2xl mx-auto">
        <div className="p-6 bg-[#FEEFC3] rounded-full">
          <Trophy className="text-[#F9A825]" size={64} />
        </div>
        <div>
          <h2 className="text-4xl font-bold text-[#2D3142]">Quiz terminé !</h2>
          <p className="text-slate-500 mt-2 text-lg">Félicitations pour avoir complété ce défi.</p>
        </div>
        <div className="flex gap-8">
          <div className="text-center">
            <div className="text-3xl font-black text-[#2D3142]">{score} / {shuffledQuestions.length}</div>
            <div className="text-xs uppercase tracking-widest font-bold text-slate-400">Réponses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-[#8C7CF0]">{finalPercentage}%</div>
            <div className="text-xs uppercase tracking-widest font-bold text-slate-400">Score</div>
          </div>
        </div>
        <Button 
          onClick={() => navigate({ to: '/quiz' })} 
          className="rounded-2xl bg-[#2D3142] hover:bg-[#8C7CF0] text-white px-10 py-6 font-bold text-lg shadow-xl transition-all"
        >
          Retour aux quiz
        </Button>
      </div>
    )
  }

  if (!currentQuestion) {
    return <div className="p-8 text-center">Chargement des questions...</div>
  }

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-white/50 max-w-3xl mx-auto min-h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate({ to: '/quiz' })}
          className="rounded-xl text-slate-400 hover:text-[#2D3142]"
        >
          <ArrowLeft size={18} className="mr-2" /> Quitter
        </Button>
        <div className="flex items-center gap-2">
          <div className="text-sm font-bold text-slate-400">Progression</div>
          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#8C7CF0] transition-all duration-500" 
              style={{ width: `${((currentIdx) / shuffledQuestions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-8">
        {showCasus && currentQuestion.casus && (
          <div className="bg-[#E0E7FF]/30 p-6 rounded-[24px] border border-[#E0E7FF] animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6366F1] mb-2">Cas pratique (Casus)</h4>
                <div className="bg-white/80 p-5 rounded-2xl border border-white shadow-sm">
                  <p className="text-[#1E2A4A] text-[15px] font-semibold leading-relaxed">
                    {currentQuestion.casus}
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-[#E0E7FF]">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-2">Référence Légale & Article Complet (Partie Législative)</h4>
                <div className="bg-[#1E2A4A] p-6 rounded-[20px] shadow-xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BookOpen size={80} className="text-white" />
                  </div>
                  <p className="text-[14px] font-bold text-[#D4AF37] mb-3 flex items-center gap-2 relative z-10">
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></span>
                    {currentQuestion.reference || "Code du travail - Partie Législative"}
                  </p>
                  <div className="text-[14px] text-slate-200 leading-relaxed font-medium whitespace-pre-wrap border-l-2 border-[#D4AF37]/50 pl-5 py-1 relative z-10">
                    {currentQuestion.article}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        <div>
          <span className="inline-block px-3 py-1 bg-slate-100 rounded-lg text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">
            Question {currentIdx + 1} sur {shuffledQuestions.length}
          </span>
          <h2 className="text-2xl font-bold text-[#2D3142] leading-tight">
            {currentQuestion.question}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.options.map((opt: string, i: number) => {
            const isSelected = selectedIdx === i
            const correctIndex = currentQuestion.correct_index ?? 
              currentQuestion.options.findIndex((opt: string) => opt === currentQuestion.correctAnswer);
            const isCorrect = i === correctIndex;
            
            let btnClass = "justify-start text-left h-auto py-6 px-8 rounded-[24px] text-lg font-medium transition-all duration-300 border-2 "
            
            if (selectedIdx === null) {
              btnClass += "bg-[#F8F9FA] border-transparent hover:border-[#8C7CF0] hover:bg-white text-[#2D3142]"
            } else if (isSelected) {
              btnClass += isCorrect ? "bg-[#DCFCE7] border-[#22C55E] text-[#166534]" : "bg-[#FEE2E2] border-[#EF4444] text-[#991B1B]"
            } else if (isCorrect && selectedIdx !== null) {
              btnClass += "bg-[#DCFCE7] border-[#22C55E] text-[#166534] ring-4 ring-[#22C55E]/20"
            } else {
              btnClass += "bg-[#F8F9FA] border-transparent opacity-50 text-slate-400"
            }

            return (
              <button
                key={i}
                className={btnClass}
                onClick={() => handleSelect(i)}
                disabled={selectedIdx !== null || isSubmitting}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{opt}</span>
                  {selectedIdx !== null && isCorrect && <CheckCircle2 size={24} />}
                  {selectedIdx !== null && isSelected && !isCorrect && <AlertCircle size={24} />}
                </div>
              </button>
            )
          })}
        </div>
      </div>
      
      {showNextButton && (
        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleNext}
            className="bg-[#8C7CF0] hover:bg-[#7a6ae0] text-white rounded-2xl py-6 px-8 font-bold shadow-lg transition-all active:scale-95"
          >
            {currentIdx + 1 < shuffledQuestions.length ? "Question suivante" : "Voir les résultats"}
          </Button>
        </div>
      )}
      
      {isSubmitting && (
        <div className="mt-8 text-center text-slate-400 font-medium animate-pulse">
          Enregistrement de votre score...
        </div>
      )}
    </div>
  )
}
