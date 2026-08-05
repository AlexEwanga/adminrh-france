import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getRecentMessages } from '@/lib/learning.functions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, ExternalLink } from 'lucide-react'


export const Route = createFileRoute('/_authenticated/learning')({
  component: LearningPage,
})


function LearningPage() {
  const { data: messages } = useSuspenseQuery({
    queryKey: ['learning-messages'],
    queryFn: () => getRecentMessages()
  })

  const categories = ['Droit du travail', 'Géographie', 'Culture', 'Mode de vie']

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-[#1E2A4A]">Base de Connaissances</h1>
        <p className="text-slate-500">Explorez tous les sujets par catégorie.</p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Badge key={cat} variant="outline" className="px-4 py-1 cursor-pointer hover:bg-slate-100">
            {cat}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages?.map((msg) => (
          <Card key={msg.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">{msg.tag}</Badge>
                <BookOpen size={16} className="text-slate-400" />
              </div>
              <CardTitle className="text-lg mt-2">{msg.subject}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 line-clamp-4">
                {msg.content}
              </p>
              {msg.source && (
                <a 
                  href={msg.source} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium text-[#D4AF37] hover:underline uppercase tracking-wider"
                >
                  Source officielle <ExternalLink size={12} />
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

