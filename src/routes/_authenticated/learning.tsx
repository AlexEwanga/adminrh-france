import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/_authenticated/learning')({
  component: Learning,
})

function Learning() {
  const [search, setSearch] = useState('')

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-white/50 flex flex-col gap-8 min-h-[calc(100vh-140px)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2D3142]">Base de connaissances</h1>
          <p className="text-slate-400 mt-1">Explorez les leçons et ressources AdminRH-France.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="pl-4 pr-4 py-2 rounded-xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#8C7CF0] w-64"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="px-4 py-2 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 font-medium text-[#2D3142] transition-colors">
            Filtres
          </button>
        </div>
      </div>
      {/* Grid content would go here, filtered by 'search' state */}
    </div>
  )
}
