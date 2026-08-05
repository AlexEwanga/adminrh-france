import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getRecentMessages } from '@/lib/learning.functions'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authenticated/learning')({
  component: Learning,
})

function Learning() {
  const { data: messages } = useSuspenseQuery({
    queryKey: ['recent-messages'],
    queryFn: () => getRecentMessages()
  })

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-white/50 flex flex-col gap-8 min-h-[calc(100vh-140px)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2D3142]">Base de connaissances</h1>
          <p className="text-slate-400 mt-1">Explorez les leçons et ressources AdminRH-France.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input className="pl-10 rounded-xl border-slate-100 bg-slate-50 focus-visible:ring-[#8C7CF0]" placeholder="Rechercher..." />
          </div>
          <Button variant="outline" className="rounded-xl border-slate-100">
            <Filter size={18} className="mr-2" />
            Filtres
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages?.map((msg) => (
          <Card key={msg.id} className="group border-none shadow-none bg-[#F8F9FA] rounded-[24px] overflow-hidden hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:bg-[#8C7CF0] group-hover:text-white transition-colors">
                  <BookOpen size={20} />
                </div>
                <Badge className="bg-white text-[#2D3142] border-none shadow-sm hover:bg-white">{msg.tag}</Badge>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2D3142] mb-2">{msg.subject}</h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 font-medium">
                  {msg.content}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 uppercase">Leçon {String(msg.id).split('-')[0]}</span>
                <Button variant="link" className="text-[#8C7CF0] font-bold p-0 h-auto text-xs">Lire la suite</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
