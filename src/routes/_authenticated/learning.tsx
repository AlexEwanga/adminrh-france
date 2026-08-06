import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getRecentMessages } from '@/lib/learning.functions'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/_authenticated/learning')({
  component: Learning,
})

function Learning() {
  const [searchQuery, setSearchQuery] = useState('')

  const { data: messages } = useSuspenseQuery({
    queryKey: ['recent-messages'],
    queryFn: () => getRecentMessages()
  })

  useEffect(() => {
    const handleSearch = (e: any) => {
      setSearchQuery(e.detail || '')
    }
    window.addEventListener('global-search-change', handleSearch)
    const initialSearch = localStorage.getItem('adminrh-global-search')
    if (initialSearch) setSearchQuery(initialSearch)
    return () => window.removeEventListener('global-search-change', handleSearch)
  }, [])

  const filteredMessages = messages?.filter((msg: any) => 
    msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
    msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (msg.tag && msg.tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

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
            <Input 
              className="pl-10 rounded-xl border-slate-100 bg-slate-50 focus-visible:ring-[#8C7CF0]" 
              placeholder="Dsi moi, le Code du travail français a combien d'articles au total ?" 
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value
                setSearchQuery(val)
                // Also update global search to keep header in sync
                window.dispatchEvent(new CustomEvent('global-search-change', { detail: val }))
                localStorage.setItem('adminrh-global-search', val)
              }}
            />
          </div>
          <Button variant="outline" className="rounded-xl border-slate-100">
            <Filter size={18} className="mr-2" />
            Filtres
          </Button>
        </div>
      </div>

      {/* Section des Sources Officielles */}
      <div className="bg-[#1E2A4A] text-white rounded-[24px] p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#D4AF37] rounded-lg">
            <Search className="text-[#1E2A4A]" size={20} />
          </div>
          <h2 className="text-xl font-bold">Les trois sources officielles à connaître absolument</h2>
        </div>
        <p className="text-slate-300 mb-6 text-sm leading-relaxed">
          Ces sites sont la base de toute information fiable en droit du travail. Ils sont publics, gratuits et régulièrement mis à jour.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-3 pr-4 font-bold text-[#D4AF37]">Source</th>
                <th className="pb-3 pr-4 font-bold text-[#D4AF37]">Rôle</th>
                <th className="pb-3 font-bold text-[#D4AF37]">Adresse</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-4 pr-4 font-bold">Code du travail numérique</td>
                <td className="py-4 pr-4 text-slate-300">L'outil principal pour comprendre le droit du travail avec des fiches pratiques, des simulateurs et des modèles de documents.</td>
                <td className="py-4">
                  <a href="https://code.travail.gouv.fr" target="_blank" rel="noopener noreferrer" className="text-[#8C7CF0] hover:underline">code.travail.gouv.fr</a>
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold">Legifrance</td>
                <td className="py-4 pr-4 text-slate-300">Le texte de loi officiel : le Code du travail dans son intégralité, ainsi que les conventions collectives et la jurisprudence.</td>
                <td className="py-4">
                  <a href="https://www.legifrance.gouv.fr" target="_blank" rel="noopener noreferrer" className="text-[#8C7CF0] hover:underline">legifrance.gouv.fr</a>
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-4 font-bold">Ministère du Travail</td>
                <td className="py-4 pr-4 text-slate-300">Pour l'actualité, les réformes, les politiques d'emploi (ex : "Emplois francs") et des fiches pratiques très complètes.</td>
                <td className="py-4">
                  <a href="https://travail-emploi.gouv.fr" target="_blank" rel="noopener noreferrer" className="text-[#8C7CF0] hover:underline">travail-emploi.gouv.fr</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-[#2D3142]">Base de connaissances</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMessages?.map((msg: any) => (
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
                <div className="flex items-center gap-2">
                  {msg.source && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-[#8C7CF0]"
                      asChild
                    >
                      <a href={msg.source} target="_blank" rel="noopener noreferrer">
                        <Search size={14} />
                      </a>
                    </Button>
                  )}
                  <Button variant="link" className="text-[#8C7CF0] font-bold p-0 h-auto text-xs">Lire la suite</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredMessages?.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 font-medium">
            Aucun résultat trouvé pour "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  )
}