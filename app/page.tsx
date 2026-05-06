"use client"

import { useState, useEffect } from "react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { getRecentDocuments } from "@/app/actions/documents"
import Image from 'next/image'

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

export default function HomePage() {
const [activeTab, setActiveTab] = useState("Tous")
const [search, setSearch] = useState("")
const [recentDocs, setRecentDocs] = useState<any[]>([])
const [isSidebarOpen, setIsSidebarOpen] = useState(false)

useEffect(() => {
async function loadRecent() {
try {
const data = await getRecentDocuments()
setRecentDocs(data)
} catch (error) {
console.error("Erreur chargement historique:", error)
}
}
loadRecent()
}, [])

const searchFiltered = templates.filter(t =>
t.title.toLowerCase().includes(search.toLowerCase())
)

const dynamicCounts: Record<string, number> = {
Tous: searchFiltered.length,
Propositions: searchFiltered.filter(t => t.category === "PROPOSITIONS").length,
Documents: searchFiltered.filter(t => t.category === "DOCUMENTS").length,
CircularDC: searchFiltered.filter(t => t.category === "CIRCULARDC").length,
}

const filtered = searchFiltered.filter(t =>
activeTab === "Tous" || t.category === activeTab.toUpperCase()
)

return (
<div className="flex min-h-screen bg-zinc-950 text-zinc-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>

{/* Overlay pour mobile */}
{isSidebarOpen && (
<div 
className="fixed inset-0 bg-black/60 z-40 lg:hidden" 
onClick={() => setIsSidebarOpen(false)}
/>
)}

{/* Sidebar */}
<aside className={`
fixed inset-y-0 left-0 z-50 w-52 bg-zinc-900 border-r border-zinc-800 flex flex-col py-6 px-3 gap-1 transition-transform duration-300 ease-in-out
lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
`}>
<div className="mb-6 flex justify-center w-full">
<Image src="/assets/Datacenters.png" alt="Logo" width={120} height={40} className="priority" />
</div>

{navItems.map((item, i) => (
<div key={i}>
{item.section && (
<p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-widest px-3 mt-4 mb-1">
{item.section}
</p>
)}
<button
onClick={() => {
item.tab && setActiveTab(item.tab)
setIsSidebarOpen(false)
}}
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
</button>
</div>
))}

{recentDocs.length > 0 && (
<div className="mt-4">
<p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">
Récents
</p>
<div className="flex flex-col gap-0.5">
{recentDocs.map((doc, i) => (
<div key={i} className="px-3 py-2 rounded-lg hover:bg-zinc-800/60 transition-colors cursor-default group">
<div className="flex items-center justify-between">
<span className="text-zinc-300 text-xs truncate max-w-[110px] group-hover:text-white transition-colors">
{doc.reference}
</span>
<span className="text-[9px] text-zinc-600 shrink-0 ml-1">
{new Date(doc.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })}
</span>
</div>
<p className="text-[10px] text-zinc-600 truncate mt-0.5">{doc.type}</p>
</div>
))}
</div>
</div>
)}

<div className="mt-auto px-3">
<button
onClick={() => signOut({ callbackUrl: "/login" })}
className="w-full text-left text-xs text-zinc-500 hover:text-zinc-300 transition-colors py-2"
>
→ Déconnexion
</button>
</div>
</aside>

<div className="flex-1 flex flex-col min-w-0">

<header className="h-12 border-b border-zinc-800 flex items-center justify-between px-6">
<div className="flex items-center gap-4">
<button 
className="lg:hidden text-zinc-400 hover:text-white"
onClick={() => setIsSidebarOpen(true)}
>
<span>☰</span>
</button>
<span className="text-zinc-500 text-sm">
Dc2Scale / <span className="text-zinc-300">{activeTab}</span>
</span>
</div>
<div className="flex items-center gap-2 text-zinc-400 text-sm border border-zinc-800 rounded-lg px-3 py-1.5">
<input
value={search}
onChange={e => setSearch(e.target.value)}
placeholder="Rechercher un document..."
className="bg-transparent outline-none text-sm placeholder-zinc-600 w-48"
/>
</div>
</header>

<main className="flex-1 p-8 overflow-x-hidden">
<div className="flex flex-col-reverse md:flex-row md:items-start md:justify-between mb-2 gap-4">
<div>
<h1 className="text-2xl font-semibold text-white">Quel document souhaitez-vous produire ?</h1>
<p className="text-zinc-400 text-sm mt-1">Choisissez un modèle pour démarrer un nouveau document, ou reprenez un brouillon en cours.</p>
</div>
<div className="flex items-center gap-3 shrink-0">
<button className="flex items-center gap-2 text-sm text-zinc-300 border border-zinc-700 hover:border-zinc-500 px-4 py-2 rounded-lg transition-colors">
⊞ Gérer les modèles
</button>
<button className="flex items-center gap-2 text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-4 py-2 rounded-lg transition-colors">
+ Nouveau document
</button>
</div>
</div>

<div className="flex items-center gap-1 mt-6 mb-6 border-b border-zinc-800 overflow-x-auto no-scrollbar">
{tabs.map(tab => (
<button
key={tab}
onClick={() => setActiveTab(tab)}
className={`px-4 py-2 text-sm rounded-t transition-colors flex items-center gap-1.5 whitespace-nowrap ${
activeTab === tab
? "text-white border-b-2 border-white"
: "text-zinc-500 hover:text-zinc-300"
}`}
>
{tab}
<span className={`text-[10px] px-1.5 py-0.5 rounded ${
activeTab === tab ? "bg-zinc-700 text-zinc-300" : "bg-zinc-800 text-zinc-500"
}`}>
{dynamicCounts[tab]}
</span>
</button>
))}
</div>

{/* Grid responsive : 2 colonnes (mobile), 4 colonnes (md/tablette), 5 colonnes (xl/desktop) */}
<div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3">
{filtered.length > 0 ? filtered.map(t => (
<Link
key={t.id}
href={`/create/${t.id}`}
className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-4 cursor-pointer transition-all hover:bg-zinc-800/80 group transform hover:-translate-y-1"
>
<div className="flex items-start justify-between mb-3">
<span className={`text-xl ${t.color}`}>{t.icon}</span>
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
<div className="col-span-2 md:col-span-4 xl:col-span-5 text-center text-zinc-600 py-16">
Aucun document trouvé pour "<span className="text-zinc-400">{search}</span>"
</div>
)}
</div>
</main>
</div>
</div>
)
}