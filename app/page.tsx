"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import Link from "next/link"

const templates = [
  {
    id: 1, icon: "≡", category: "PROPOSITIONS", title: "Proposition de colocation",
    desc: "Devis détaillé : baies, énergie kVA, cross-connects, Remote Hands. Synchronisé PennyLane.",
    pages: "9-14 p.", uses: 142, color: "text-emerald-400",
  },
  {
    id: 2, icon: "≡", category: "PROPOSITIONS", title: "Renouvellement contrat",
    desc: "Reconduction et avenant tarifaire avec indexation IPC.",
    pages: "4-6 p.", uses: 38, color: "text-emerald-400",
  },
  {
    id: 3, icon: "≡", category: "PROPOSITIONS", title: "Forfait Remote Hands",
    desc: "Souscription mensuelle d'heures Mains & Yeux.",
    pages: "3-5 p.", uses: 27, color: "text-emerald-400",
  },
  {
    id: 4, icon: "⊟", category: "DOCUMENTS", title: "Contrat SLA",
    desc: "Engagements de service, pénalités, périmètre, escalade.",
    pages: "9-8 p.", uses: 51, color: "text-blue-400",
  },
  {
    id: 5, icon: "⊟", category: "DOCUMENTS", title: "Mémoire technique (AO)",
    desc: "Réponse appel d'offres : architecture, sécurité, RSE.",
    pages: "35-60 p.", uses: 18, color: "text-blue-400",
  },
  {
    id: 6, icon: "⊟", category: "DOCUMENTS", title: "Catalogue Remote Hands",
    desc: "Grille HO/HNO niveaux 1/2/3 — feuille de service & prix.",
    pages: "2 p.", uses: 33, color: "text-blue-400",
  },
  {
    id: 7, icon: "⊟", category: "DOCUMENTS", title: "NDA / Accord de confidentialité",
    desc: "Accord mutuel pour visite ou échange technique.",
    pages: "3 p.", uses: 22, color: "text-blue-400",
  },
  {
    id: 8, icon: "↺", category: "CIRCULARDC", title: "Confirmation d'affrètement",
    desc: "Mandat de transport routier : FM/TO, expéditeur, destinataire, prix gré à gré.",
    pages: "1 p.", uses: 124, color: "text-teal-400",
  },
  {
    id: 9, icon: "↺", category: "CIRCULARDC", title: "Bon de livraison",
    desc: "Réception matériel sur site avec QR code traçabilité.",
    pages: "2 p.", uses: 89, color: "text-teal-400",
  },
  {
    id: 10, icon: "↺", category: "CIRCULARDC", title: "Bordereau de retrait DEEE",
    desc: "Sortie matériel reconditionnement / valorisation.",
    pages: "2 p.", uses: 50, color: "text-teal-400",
  },
  {
    id: 11, icon: "↺", category: "CIRCULARDC", title: "Éco-bilan reconditionnement",
    desc: "Traçabilité tonnes CO₂eq évitées, pesée DEEE.",
    pages: "3 p.", uses: 41, color: "text-teal-400",
  },
]

const tabs = ["Tous", "Propositions", "Documents", "CircularDC"]

const navItems = [
  { label: "Modèles & brouillons", icon: "⊞", section: "PRODUCTION", tab: "Tous", badge: null },
  { label: "Propositions", icon: "≡", section: null, tab: "Propositions", badge: null },
  { label: "Documents", icon: "⊟", section: null, tab: "Documents", badge: null },
  { label: "CircularDC", icon: "↺", section: null, tab: "CircularDC", badge: null },
  { label: "Intégrations", icon: "⚭", section: "CONNEXIONS", tab: null, badge: null },
  { label: "Paramètres", icon: "⚙", section: "SYSTÈME", tab: null, badge: null },
]

const counts: Record<string, number> = {
  Tous: templates.length,
  Propositions: templates.filter(t => t.category === "PROPOSITIONS").length,
  Documents: templates.filter(t => t.category === "DOCUMENTS").length,
  CircularDC: templates.filter(t => t.category === "CIRCULARDC").length,
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("Tous")
  const [search, setSearch] = useState("")

  const filtered = templates
    .filter(t => activeTab === "Tous" || t.category === activeTab.toUpperCase())
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Sidebar */}
      <aside className="w-52 shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col py-6 px-3 gap-1">
        <div className="px-3 mb-6">
          <span className="text-white font-semibold text-sm tracking-wide">Shelter2</span>
        </div>

        {navItems.map((item, i) => (
          <div key={i}>
            {item.section && (
              <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-widest px-3 mt-4 mb-1">
                {item.section}
              </p>
            )}
            <button
              onClick={() => item.tab && setActiveTab(item.tab)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                item.tab && activeTab === item.tab
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{item.icon}</span>
                {item.label}
              </span>
              {item.badge && (
                <span className="text-[10px] bg-zinc-700 text-zinc-300 rounded px-1.5 py-0.5">{item.badge}</span>
              )}
            </button>
          </div>
        ))}

        <div className="mt-auto px-3">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full text-left text-xs text-zinc-500 hover:text-zinc-300 transition-colors py-2"
          >
            → Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <header className="h-12 border-b border-zinc-800 flex items-center justify-between px-6">
          <span className="text-zinc-500 text-sm">
            Shelter2 / <span className="text-zinc-300">Templates</span>
          </span>
          <div className="flex items-center gap-2 text-zinc-400 text-sm border border-zinc-800 rounded-lg px-3 py-1.5">
            <span>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un document..."
              className="bg-transparent outline-none text-sm placeholder-zinc-600 w-48"
            />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-2xl font-semibold text-white">Quel document souhaitez-vous produire ?</h1>
              <p className="text-zinc-400 text-sm mt-1">Choisissez un modèle pour démarrer un nouveau document, ou reprenez un brouillon en cours.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 text-sm text-zinc-300 border border-zinc-700 hover:border-zinc-500 px-4 py-2 rounded-lg transition-colors">
                ⊞ Gérer les modèles
              </button>
              <button className="flex items-center gap-2 text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-4 py-2 rounded-lg transition-colors">
                + Nouveau document
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mt-6 mb-6 border-b border-zinc-800">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm rounded-t transition-colors flex items-center gap-1.5 ${
                  activeTab === tab
                    ? "text-white border-b-2 border-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab}
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  activeTab === tab ? "bg-zinc-700 text-zinc-300" : "bg-zinc-800 text-zinc-500"
                }`}>
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-5 gap-3">
            {filtered.length > 0 ? filtered.map(t => (
              <Link
                key={t.id}
                href={`/create/${t.id}`}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-4 cursor-pointer transition-all hover:bg-zinc-800/80 group transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-lg ${t.color}`}>{t.icon}</span>
                  <span className="text-[10px] text-zinc-500">{t.uses}× ce trim.</span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1 leading-snug group-hover:text-emerald-400 transition-colors">
                  {t.title}
                </h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed mb-3">{t.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider">{t.category}</span>
                  <span className="text-[10px] text-zinc-600">{t.pages}</span>
                </div>
              </Link>
            )) : (
              <div className="col-span-5 text-center text-zinc-600 py-16">
                Aucun document trouvé pour "<span className="text-zinc-400">{search}</span>"
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}