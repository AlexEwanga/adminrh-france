import { createFileRoute } from "@tanstack/react-router";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  const promptText = `🚀 PROMPT ULTIME POUR LOVABLE.DEV
## Application : AdminRH-France

---

### 📋 CONTEXTE GLOBAL

Je suis un professionnel des Ressources Humaines qui s'installe en France dans quelques mois. Je dois maîtriser parfaitement l'environnement du travail français (droit du travail, culture d'entreprise, géographie, mode de vie) avant mon arrivée.

L'application **AdminRH-France** est mon assistant personnel d'apprentissage. Elle doit m'envoyer quotidiennement des messages WhatsApp pour m'apprendre progressivement tout ce qu'un RH doit savoir sur la France.

---

### 🎯 OBJECTIF PRINCIPAL

Créer une application web complète qui :
1. **Envoie 5 messages WhatsApp par jour** (de 7h à 18h GMT, à intervalles réguliers)
2. **Contient une base de connaissances exhaustive** sur le droit du travail, la vie en France, la géographie et la culture
3. **Propose des quiz et jeux interactifs** pour tester et renforcer l'apprentissage
4. **Offre un tableau de bord de suivi** pour visualiser la progression

---

### 🛠️ STACK TECHNIQUE OBLIGATOIRE

| Composant | Technologie | Raison |
|-----------|-------------|--------|
| **Frontend** | React + TypeScript (framework Lovable) | Interface moderne et réactive |
| **Backend** | Edge Functions (Supabase) | Exécution de code serveur sans coût |
| **Base de données** | Supabase (PostgreSQL) | Stockage des messages, quiz, progression |
| **Planification** | pg_cron (Supabase) | Planification gratuite des envois WhatsApp |
| **Messagerie** | WPSent API | Envoi WhatsApp gratuit sans quota |
| **Design** | Tailwind CSS + shadcn/ui | Interface professionnelle et moderne |

---

### 📱 FONCTIONNALITÉS DÉTAILLÉES

#### 1. MODULE D'APPRENTISSAGE QUOTIDIEN (ENVOI WHATSAPP)

**Configuration :**
- Envoi de **5 messages par jour** à intervalles réguliers
- Plage horaire : **7h00 à 18h00 GMT** (heures fixes : 7h, 9h45, 12h30, 15h15, 18h00)
- Chaque message contient : un sujet principal, des sources (Legifrance, Code du travail, etc.), une question de réflexion

**Contenu des messages (planning rotatif) :**

| Jour | Thème | Exemple de message |
|------|-------|-------------------|
| **Lundi** | Droit du travail | \"🔴 LICENCIEMENT : Les 3 motifs valables - Faute grave, inaptitude, motif économique. Lisez l'article L1234-1 du Code du travail sur Legifrance. Question : Quelle est la différence entre faute grave et faute lourde ?\" |
| **Mardi** | Géographie & administration | \"🗺️ RÉGIONS FRANÇAISES : La France compte 18 régions (13 métropolitaines + 5 ultramarines). L'Île-de-France concentre 19% de la population. Question : Quelle région produit le plus de vin en France ?\" |
| **Mercredi** | Culture & mode de vie | \"🥖 VIE QUOTIDIENNE : La pause déjeuner en France dure en moyenne 1h30. 78% des salariés mangent à la cantine ou au restaurant. Question : Connaissez-vous le montant du ticket restaurant moyen ?\" |
| **Jeudi** | Droit du travail | \"⚖️ CONTRAT DE TRAVAIL : Les 3 types : CDI (indéterminé), CDD (déterminé), intérim. La période d'essai est de 2 à 4 mois selon les conventions. Question : Combien de renouvellements de période d'essai sont autorisés ?\" |
| **Vendredi** | Culture générale France | \"🎭 CULTURE FRANÇAISE : La France compte 44 sites UNESCO. Le plus visité : le Mont-Saint-Michel (2,5M/an). Question : Quel monument parisien est le plus visité au monde ?\" |
| **Samedi** | Quiz de la semaine | \"🧠 RÉVISION : Cette semaine vous avez appris... Testez-vous ! Quelle est la durée maximale d'un CDD ? Quel est le salaire minimum (Smic) en 2025 ? Réponse demain !\" |
| **Dimanche** | Repos / Culture | \"🎨 DIMANCHE CULTURE : Aujourd'hui, lisez un article sur l'histoire des droits des travailleurs en France (1848-2025). Découvrez comment les acquis sociaux ont évolué.\" |

---

### 📋 CONTENU PRÉ-REMPLI (POUR DÉMARRER)

**Table messages (10 premiers messages) :**

\`\`\`json
[
  {
    "subject": "CDI - Contrat à Durée Indéterminée",
    "content": "Le CDI est la forme normale du contrat de travail en France. Il n'a pas de date de fin. Il peut être rompu par : démission, licenciement, rupture conventionnelle ou départ à la retraite. Article L1221-1 du Code du travail.",
    "source": "https://legifrance.gouv.fr/Code_du_travail/Article_L1221-1",
    "tag": "Droit du travail"
  },
  {
    "subject": "CDD - Contrat à Durée Déterminée",
    "content": "Le CDD est un contrat temporaire. Durée maximale : 18 mois (24 mois dans certains cas). Motifs autorisés : remplacement d'un salarié, accroissement temporaire d'activité, emploi saisonnier. Article L1241-1 du Code du travail.",
    "source": "https://legifrance.gouv.fr/Code_du_travail/Article_L1241-1",
    "tag": "Droit du travail"
  },
  {
    "subject": "Période d'essai",
    "content": "Durée légale : 2 mois pour les ouvriers/employés, 3 mois pour les agents de maîtrise/techniciens, 4 mois pour les cadres. Renouvellement possible une fois, avec accord du salarié. Article L1221-19 du Code du travail.",
    "source": "https://legifrance.gouv.fr/Code_du_travail/Article_L1221-19",
    "tag": "Droit du travail"
  },
  {
    "subject": "Licenciement : motifs et procédure",
    "content": "Motifs valables : faute (grave, lourde), inaptitude, motif économique. Procédure : convocation à entretien préalable, lettre de licenciement, respect du préavis. Article L1234-1 du Code du travail.",
    "source": "https://legifrance.gouv.fr/Code_du_travail/Article_L1234-1",
    "tag": "Droit du travail"
  },
  {
    "subject": "Rupture conventionnelle",
    "content": "Accord entre employeur et salarié pour rompre un CDI. Indemnité légale = minimum 1/5ème de mois par année d'ancienneté. Délai de rétractation : 15 jours. Article L1237-11 du Code du travail.",
    "source": "https://legifrance.gouv.fr/Code_du_travail/Article_L1237-11",
    "tag": "Droit du travail"
  },
  {
    "subject": "Salaire minimum (Smic)",
    "content": "Smic horaire brut 2025 : 11,65€ (estimation). Smic mensuel brut : 1 766,92€ (35h). Revalorisation annuelle. Article L3231-2 du Code du travail.",
    "source": "https://legifrance.gouv.fr/Code_du_travail/Article_L3231-2",
    "tag": "Droit du travail"
  },
  {
    "subject": "Durée du travail",
    "content": "Durée légale : 35h/semaine. Heures supplémentaires : 25% de majoration (8 premières), 50% (suivantes). Contingent annuel : 220h. Article L3121-27 du Code du travail.",
    "source": "https://legifrance.gouv.fr/Code_du_travail/Article_L3121-27",
    "tag": "Droit du travail"
  },
  {
    "subject": "Congés payés",
    "content": "Droit à 2,5 jours ouvrables par mois (30 jours/an). Acquisition du 1er juin au 31 mai. 10% de majoration pour fractionnement. Article L3141-3 du Code du travail.",
    "source": "https://legifrance.gouv.fr/Code_du_travail/Article_L3141-3",
    "tag": "Droit du travail"
  },
  {
    "subject": "Régions françaises : Île-de-France",
    "content": "Capitale : Paris (2,1M d'habitants). 12 millions d'habitants (19% du pays). 1er bassin d'emploi (5,5M d'emplois). PIB : 725 milliards € (25% du PIB français). Aéroports : CDG + Orly.",
    "source": "https://insee.fr/",
    "tag": "Géographie"
  },
  {
    "subject": "Culture : la gastronomie française",
    "content": "La France compte 196 restaurants étoilés Michelin (2ème au monde). 45 fromages AOP. 9 millions de touristes par an visitent les caves à vin. La baguette est inscrite au patrimoine immatériel de l'UNESCO.",
    "source": "https://culture.gouv.fr/",
    "tag": "Culture"
  }
]
\`\`\``;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="bg-[#1E2A4A] px-8 py-10 text-white">
            <h1 className="text-3xl font-bold tracking-tight">AdminRH-France</h1>
            <p className="mt-4 text-slate-300 text-lg leading-relaxed">
              Voici le Prompt Ultime pour Lovable, conçu pour être le plus complet et précis possible. 
              Copiez-collez ce texte directement dans Lovable.
            </p>
          </div>
          
          <div className="p-8">
            <div className="relative group">
              <pre className="bg-slate-900 text-slate-100 p-6 rounded-xl overflow-auto max-h-[600px] text-sm font-mono leading-relaxed selection:bg-blue-500/30">
                {promptText}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(promptText);
                }}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all flex items-center gap-2 border border-white/20 shadow-lg"
              >
                <span>Copier le prompt</span>
              </button>
            </div>
            
            <div className="mt-12 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-[#1E2A4A] flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-sm">1</span>
                  Configuration de Lovable Cloud
                </h2>
                <p className="mt-3 text-slate-600">
                  Le backend (Lovable Cloud) a été activé. Vous disposez désormais d'un accès complet à la base de données PostgreSQL, 
                  à l'authentification et aux fonctions serveur.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-[#1E2A4A] flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-sm">2</span>
                  Prochaines étapes
                </h2>
                <ul className="mt-4 space-y-4">
                  {[
                    "Utilisez le prompt ci-dessus pour générer l'interface complète du dashboard.",
                    "Configurez l'API WPSent pour les envois WhatsApp.",
                    "Initialisez les tables de la base de données avec le script SQL fourni."
                  ].map((step, i) => (
                    <li key={i} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
                      <span className="text-slate-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
          
          <div className="bg-slate-50 px-8 py-6 border-t border-slate-200 flex justify-between items-center">
            <div className="text-sm text-slate-500">
              Prêt pour le déploiement AdminRH-France
            </div>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">Connecté</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
