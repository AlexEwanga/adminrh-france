import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getRecentMessages } from '@/lib/learning.functions'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Search, Filter, X, ExternalLink, Bookmark } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"



export const Route = createFileRoute('/_authenticated/learning')({
  component: Learning,
})

function Learning() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLesson, setSelectedLesson] = useState<any>(null)


  const { data: messagesData } = useQuery({
    queryKey: ['recent-messages'],
    queryFn: () => getRecentMessages()
  })
  const messages = messagesData || []

  useEffect(() => {
    const handleSearch = (e: any) => {
      setSearchQuery(e.detail || '')
    }
    window.addEventListener('global-search-change', handleSearch)
    const initialSearch = localStorage.getItem('zenith-global-search')
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
                localStorage.setItem('zenith-global-search', val)
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
                      setSelectedLesson(msg)
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

      <Dialog open={!!selectedLesson} onOpenChange={(open) => !open && setSelectedLesson(null)}>
        <DialogContent className="sm:max-w-[700px] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
          {selectedLesson && (
            <div className="flex flex-col max-h-[90vh]">
              {/* Header with Background */}
              <div className="bg-[#1E2A4A] p-8 text-white relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-12 -mt-12" />
                <div className="relative z-10">
                  <Badge className="bg-[#D4AF37] text-[#1E2A4A] border-none mb-4 font-bold uppercase tracking-widest text-[10px]">
                    {selectedLesson.tag || 'Législatif'}
                  </Badge>
                  <DialogTitle className="text-2xl md:text-3xl font-extrabold leading-tight">
                    {selectedLesson.subject}
                  </DialogTitle>
                </div>
                <DialogClose className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white outline-none">
                  <X size={20} />
                </DialogClose>
              </div>

              {/* Content Area */}
              <div className="p-8 overflow-y-auto bg-white flex flex-col gap-8 custom-scrollbar">
                {/* Point Clé Section */}
                <section className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <div className="flex items-center gap-2 mb-3 text-[#1E2A4A]">
                    <Bookmark size={18} className="fill-[#1E2A4A]" />
                    <h4 className="font-bold text-sm uppercase tracking-wider">Point Clé</h4>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {selectedLesson.content}
                  </p>
                </section>

                {/* Casus Section */}
                {(selectedLesson.casus || selectedLesson.exus) && (

                  <section>
                    <div className="flex items-center gap-2 mb-4 text-[#2D3142]">
                      <div className="p-2 bg-[#8C7CF0]/10 rounded-lg">
                        <BookOpen size={18} className="text-[#8C7CF0]" />
                      </div>
                      <h4 className="font-bold text-lg">Cas pratique (Casus)</h4>
                    </div>
                    <div className="text-slate-600 leading-relaxed whitespace-pre-wrap pl-4 border-l-4 border-[#8C7CF0]/30 py-1">
                      {selectedLesson.casus || selectedLesson.exus}
                    </div>

                  </section>
                )}

                {/* Article Section */}
                {selectedLesson.article && (
                  <section className="bg-[#1E2A4A]/5 rounded-2xl p-6 border border-[#1E2A4A]/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-[#1E2A4A]">
                        <h4 className="font-bold text-lg">Référence Légale</h4>
                      </div>
                      <span className="bg-white px-3 py-1 rounded-lg text-[#1E2A4A] text-xs font-bold border border-[#1E2A4A]/10">
                        {selectedLesson.reference}
                      </span>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-100 italic text-slate-600 text-sm leading-relaxed shadow-sm">
                      "{selectedLesson.article}"
                    </div>
                  </section>
                )}

                {/* Best Practice Section */}
                {selectedLesson.best_practice && (
                  <section className="bg-green-50 rounded-2xl p-6 border border-green-100">
                    <div className="flex items-center gap-2 mb-3 text-green-700">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <h4 className="font-bold text-sm uppercase tracking-wider">Bonne pratique conseillée</h4>
                    </div>
                    <p className="text-green-800/80 text-sm leading-relaxed font-medium">
                      {selectedLesson.best_practice}
                    </p>
                  </section>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <span>ID: {selectedLesson.id}</span>
                </div>
                <div className="flex items-center gap-3">
                  {selectedLesson.source && (
                    <Button variant="outline" className="rounded-xl border-slate-200 h-10 px-4 font-bold text-xs" asChild>
                      <a href={selectedLesson.source} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={14} className="mr-2" />
                        Voir sur Legifrance
                      </a>
                    </Button>
                  )}
                  <Button 
                    className="bg-[#1E2A4A] hover:bg-[#1E2A4A]/90 text-white rounded-xl h-10 px-6 font-bold text-xs shadow-lg shadow-[#1E2A4A]/20"
                    onClick={() => setSelectedLesson(null)}
                  >
                    Fermer la leçon
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
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
