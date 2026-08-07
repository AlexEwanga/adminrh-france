import { createFileRoute } from "@tanstack/react-router";
import zenithLogo from "@/assets/zenith_hd.png.asset.json";

export const Route = createFileRoute('/')({
  component: () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F2F5] p-6 text-center">
      <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-white/50 max-w-lg w-full">
        <img 
          src={zenithLogo.url} 
          alt="Zenith HD Seal" 
          className="w-64 h-64 mx-auto object-contain mb-8 drop-shadow-xl"
        />
        <h1 className="text-3xl font-bold text-[#2D3142] mb-4">Zenith HD Seal</h1>
        <p className="text-slate-500 font-medium mb-8">
          Voici le sceau officiel en haute définition généré pour l'identité visuelle de Zenith.
        </p>
        
        <div className="bg-slate-50 rounded-3xl p-6 mb-8 text-left border border-slate-100">
          <h2 className="text-sm font-black uppercase tracking-widest text-[#2D3142] mb-4">Architecture FSD Générée</h2>
          <p className="text-xs text-slate-400 mb-4 italic">
            L'application AdminRH-France suit désormais la méthodologie Feature-Sliced Design.
          </p>
          <ul className="space-y-2 text-xs font-bold text-slate-600">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#8C7CF0] rounded-full"></span>
              📁 app (Configuration & Entry points)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#8C7CF0] rounded-full"></span>
              📁 pages (Dashboard, Learning, Quiz, etc.)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#8C7CF0] rounded-full"></span>
              📁 shared (UI Kit, API Clients, Libs)
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <a 
            href="/auth" 
            className="inline-flex items-center justify-center h-12 px-8 bg-[#2D3142] hover:bg-[#8C7CF0] text-white rounded-2xl font-bold shadow-lg transition-all active:scale-95"
          >
            Accéder à l'application
          </a>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
            Analyse de structure terminée — Prêt à exécuter
          </p>
        </div>
      </div>
    </div>
  ),
})



