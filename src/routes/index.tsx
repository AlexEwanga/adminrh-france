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
        <a 
          href="/auth" 
          className="inline-flex items-center justify-center h-12 px-8 bg-[#2D3142] hover:bg-[#8C7CF0] text-white rounded-2xl font-bold shadow-lg transition-all active:scale-95"
        >
          Accéder à l'application
        </a>
      </div>
    </div>
  ),
})



