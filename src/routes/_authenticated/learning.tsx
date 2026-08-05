import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/learning')({
  component: LearningPage,
})

function LearningPage() {
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
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Droit du travail</Badge>
                <BookOpen size={16} className="text-slate-400" />
              </div>
              <CardTitle className="text-lg mt-2">Le Contrat à Durée Indéterminée (CDI)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 line-clamp-3">
                Le CDI est la forme normale et générale de la relation de travail. Il n'a pas de durée limitée et garantit une stabilité au salarié...
              </p>
              <div className="mt-4 text-xs font-medium text-[#D4AF37] uppercase tracking-wider">
                Lire la suite →
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
