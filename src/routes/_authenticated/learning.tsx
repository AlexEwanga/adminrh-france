import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getRecentMessages } from '@/lib/learning.functions'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'


export const Route = createFileRoute('/_authenticated/learning')({
  component: Learning,
})

function Learning() {
  const [searchQuery, setSearchQuery] = useState('')

  const { data: messagesData } = useSuspenseQuery({
    queryKey: ['recent-messages'],
    queryFn: () => getRecentMessages()
  })
  const messages = messagesData || []

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
    (msg.tag && msg.tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (msg.reference && msg.reference.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (msg.article && msg.article.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-white/50 flex flex-col gap-8 min-h-[calc(100vh-140px)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1E2A4A] tracking-tight">Base de connaissances</h1>
          <p className="text-slate-400 mt-1 font-medium">Explorez plus de 1000 dossiers juridiques et leçons AdminRH-France.</p>

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
      <div className="bg-gradient-to-br from-[#1E2A4A] to-[#2D3142] text-white rounded-[32px] p-8 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-[#D4AF37]/20" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-[#D4AF37] rounded-2xl shadow-lg shadow-[#D4AF37]/20">
              <Search className="text-[#1E2A4A]" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Sources Officielles</h2>
              <p className="text-slate-300 text-sm font-medium">Accès direct aux piliers du droit du travail français.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <OfficialSourceCard 
              name="Code du travail numérique"
              description="Fiches pratiques, simulateurs et modèles de documents officiels."
              url="https://code.travail.gouv.fr"
              label="Accéder au Code"
            />
            <OfficialSourceCard 
              name="Legifrance"
              description="Le texte de loi intégral, conventions collectives et jurisprudence."
              url="https://www.legifrance.gouv.fr"
              label="Consulter la Loi"
            />
            <OfficialSourceCard 
              name="Ministère du Travail"
              description="Actualités sociales, réformes et politiques d'emploi en temps réel."
              url="https://travail-emploi.gouv.fr"
              label="Voir l'actualité"
            />
          </div>
        </div>
      </div>


      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-[#2D3142]">Base de connaissances</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMessages?.map((msg: any) => (
          <Card key={msg.id} className="group border-none shadow-none bg-[#F8F9FA] rounded-[24px] overflow-hidden hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:bg-[#1E2A4A] group-hover:text-white transition-colors">
                  <BookOpen size={20} />
                </div>
                <Badge className="bg-white text-[#2D3142] border border-slate-100 shadow-sm hover:bg-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">{msg.tag || 'Législatif'}</Badge>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#2D3142] mb-2 group-hover:text-[#1E2A4A] transition-colors line-clamp-2">{msg.subject}</h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 font-medium mb-4">
                  {msg.content}
                </p>
              </div>
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Référence</span>
                  <span className="text-[11px] font-bold text-[#2D3142] truncate max-w-[120px]">{msg.reference || msg.source}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="link" 
                    className="text-[#8C7CF0] font-bold p-0 h-auto text-xs hover:text-[#1E2A4A] transition-colors"
                    onClick={() => {
                      // Logic to view details could be added here
                      toast.info("Détails de la leçon", { description: msg.content })
                    }}
                  >
                    Lire la suite
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredMessages?.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-100">
            <Search className="text-slate-200 mb-4" size={48} />
            <h3 className="text-xl font-bold text-slate-400">Aucun résultat trouvé</h3>
            <p className="text-slate-300 mt-2">Essayez de rechercher avec d'autres mots-clés comme "contrat", "essai" ou un numéro d'article.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function OfficialSourceCard({ name, description, url, label }: { name: string, description: string, url: string, label: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all group/card">
      <h3 className="font-bold text-[#D4AF37] mb-2">{name}</h3>
      <p className="text-xs text-slate-300 leading-relaxed mb-4 min-h-[40px]">{description}</p>
      <Button 
        variant="link" 
        className="p-0 h-auto text-[#8C7CF0] font-bold text-xs group-hover/card:translate-x-1 transition-transform"
        asChild
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      </Button>
    </div>
  )
}
