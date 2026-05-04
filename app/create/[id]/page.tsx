"use client"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createFullDocument, getContacts } from "@/app/actions/documents" // Ajout de getContacts

export default function CreateDocumentPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Cette liste sera remplie par la base de données
  const [dbContacts, setDbContacts] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<{ type: 'exp' | 'dest', list: any[] }>({ type: 'exp', list: [] })

  const [formData, setFormData] = useState({
    expediteurNom: "",
    expediteurRaison: "",
    expediteurAdresse: "",
    expediteurTransport: "",
    expediteurContact: "",
    destinataireNom: "",
    destinataireRaison: "",
    destinataireAdresse: "",
    dateLivraison: new Date().toISOString().split('T')[0],
    dateEnlevement: new Date().toISOString().split('T')[0],
    descriptionTransport: "",
    poids: "",
    dimensions: "",
    tarification: "",
    docType: "Confirmation d'Affrètement"
  })

  // 1. CHARGEMENT DES VRAIS CONTACTS DEPUIS NEON
  useEffect(() => {
    async function loadContacts() {
      try {
        const data = await getContacts()
        // On combine les deux pour la recherche globale
        setDbContacts([...data.expediteurs, ...data.destinataires])
      } catch (error) {
        console.error("Erreur chargement contacts:", error)
      }
    }
    loadContacts()
  }, [])

  // 2. RECHERCHE DANS LES VRAIS CONTACTS
  const handleTypeAhead = (e: React.ChangeEvent<HTMLInputElement>, field: 'expediteurNom' | 'destinataireNom') => {
    const value = e.target.value
    setFormData({ ...formData, [field]: value })
    if (value.length > 1) {
      // On filtre maintenant sur dbContacts (la base réelle)
      const filtered = dbContacts.filter(c => c.nom.toLowerCase().includes(value.toLowerCase()))
      setSuggestions({ type: field === 'expediteurNom' ? 'exp' : 'dest', list: filtered })
    } else {
      setSuggestions({ type: 'exp', list: [] })
    }
  }

  const selectContact = (contact: any, type: 'exp' | 'dest') => {
    if (type === 'exp') {
      setFormData({ ...formData, expediteurNom: contact.nom, expediteurRaison: contact.raison || "", expediteurAdresse: contact.adresse || "", expediteurTransport: contact.transport || "", expediteurContact: contact.contact || "" })
    } else {
      setFormData({ ...formData, destinataireNom: contact.nom, destinataireRaison: contact.raison || "", destinataireAdresse: contact.adresse || "" })
    }
    setSuggestions({ type: 'exp', list: [] })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await createFullDocument(formData)
      if (result.success) {
        alert("Confirmation d'affrètement enregistrée !")
        router.push('/')
        router.refresh() // Force le rafraîchissement des données
      }
    } catch (error) {
      alert("Erreur lors de l'enregistrement.")
    } finally {
      setLoading(false)
    }
  }

  if (id !== "8") return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 items-center justify-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="text-center">
        <p className="text-zinc-500 text-sm mb-4">Modèle non configuré pour l'ID {id}</p>
        <button onClick={() => router.back()} className="text-xs text-zinc-400 hover:text-white border border-zinc-700 px-4 py-2 rounded-lg transition-colors">← Retour</button>
      </div>
    </div>
  )

  const inputClass = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm outline-none focus:border-emerald-500 transition-colors placeholder-zinc-600 text-zinc-100"
  const inputSmClass = "w-full bg-zinc-800/50 border border-zinc-800 rounded-lg px-4 py-2 text-sm outline-none focus:border-zinc-600 transition-colors placeholder-zinc-600 text-zinc-100"

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <aside className="w-52 shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col py-6 px-3 gap-1">
        <div className="px-3 mb-6">
          <span className="text-white font-semibold text-sm tracking-wide">Shelter2</span>
        </div>

        <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-widest px-3 mt-2 mb-1">PRODUCTION</p>
        <button onClick={() => router.push('/')} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200 transition-colors">
          <span>⊞</span> Modèles & brouillons
        </button>
        <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm bg-zinc-800 text-white transition-colors">
          <span className="flex items-center gap-2"><span>♻️</span> CircularDC</span>
          <span className="text-[10px] bg-zinc-700 text-zinc-300 rounded px-1.5 py-0.5">6</span>
        </button>

        <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-widest px-3 mt-4 mb-1">DOCUMENT</p>
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-teal-400 text-xs">♻️</span>
            <span className="text-zinc-300 text-xs font-medium">Confirmation d'affrètement</span>
          </div>
          <div className="text-[10px] text-zinc-600 ml-5">1 p. · 124× ce trim.</div>
        </div>

        <div className="mt-auto px-3">
          <button onClick={() => router.back()} className="w-full text-left text-xs text-zinc-500 hover:text-zinc-300 transition-colors py-2">
            ← Retour aux modèles
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-12 border-b border-zinc-800 flex items-center justify-between px-6">
          <span className="text-zinc-500 text-sm">
            Shelter2 / <span className="text-zinc-400">CircularDC</span> / <span className="text-zinc-300">Confirmation d'affrètement</span>
          </span>
          <span className="text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-1 rounded uppercase tracking-widest">
            Nouveau document
          </span>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-white">Confirmation d'Affrètement</h1>
              <p className="text-zinc-400 text-sm mt-1">Mandat de transport routier — FM/TO, expéditeur, destinataire, prix gré à gré.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* EXPÉDITEUR */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-widest">1. Expéditeur</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">Enlèvement</span>
                </div>

                <div className="relative">
                  <input
                    placeholder="Nom de l'entreprise"
                    className={inputClass}
                    value={formData.expediteurNom}
                    onChange={(e) => handleTypeAhead(e, 'expediteurNom')}
                  />
                  {suggestions.type === 'exp' && suggestions.list.length > 0 && (
                    <div className="absolute z-10 w-full bg-zinc-800 border border-zinc-700 mt-1 rounded-lg shadow-2xl overflow-hidden">
                      {suggestions.list.map((s, i) => (
                        <div key={i} onClick={() => selectContact(s, 'exp')} className="p-3 hover:bg-emerald-500 hover:text-black cursor-pointer text-sm transition-colors">
                          {s.nom} <span className="opacity-50 text-xs ml-2">— {s.adresse}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <input placeholder="Raison Sociale" value={formData.expediteurRaison} className={inputSmClass} onChange={(e) => setFormData({ ...formData, expediteurRaison: e.target.value })} />
                <input placeholder="Adresse complète" value={formData.expediteurAdresse} className={inputSmClass} onChange={(e) => setFormData({ ...formData, expediteurAdresse: e.target.value })} />

                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Type de transport" value={formData.expediteurTransport} className={inputSmClass} onChange={(e) => setFormData({ ...formData, expediteurTransport: e.target.value })} />
                  <input placeholder="Contact / Tél" value={formData.expediteurContact} className={inputSmClass} onChange={(e) => setFormData({ ...formData, expediteurContact: e.target.value })} />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest ml-1">Date d'enlèvement</label>
                  <input type="date" value={formData.dateEnlevement} className={`${inputClass} mt-1`} onChange={(e) => setFormData({ ...formData, dateEnlevement: e.target.value })} />
                </div>
              </div>

              {/* DESTINATAIRE */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-widest">2. Destinataire</span>
                  <span className="text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-1.5 py-0.5 rounded">Livraison</span>
                </div>

                <div className="relative">
                  <input
                    placeholder="Nom du destinataire"
                    className={`${inputClass} focus:border-teal-500`}
                    value={formData.destinataireNom}
                    onChange={(e) => handleTypeAhead(e, 'destinataireNom')}
                  />
                  {suggestions.type === 'dest' && suggestions.list.length > 0 && (
                    <div className="absolute z-10 w-full bg-zinc-800 border border-zinc-700 mt-1 rounded-lg shadow-2xl overflow-hidden">
                      {suggestions.list.map((s, i) => (
                        <div key={i} onClick={() => selectContact(s, 'dest')} className="p-3 hover:bg-teal-500 hover:text-black cursor-pointer text-sm transition-colors">
                          {s.nom} <span className="opacity-50 text-xs ml-2">— {s.adresse}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <input placeholder="Raison Sociale" value={formData.destinataireRaison} className={inputSmClass} onChange={(e) => setFormData({ ...formData, destinataireRaison: e.target.value })} />
                <textarea placeholder="Adresse de livraison" rows={2} value={formData.destinataireAdresse} className={`${inputSmClass} resize-none`} onChange={(e) => setFormData({ ...formData, destinataireAdresse: e.target.value })} />

                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest ml-1">Date de livraison</label>
                  <input type="date" value={formData.dateLivraison} className={`${inputClass} mt-1 focus:border-teal-500`} onChange={(e) => setFormData({ ...formData, dateLivraison: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-widest mb-4">3. Détails Techniques & Tarification</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <input placeholder="Description (ex: Palette serveurs)" className={`${inputClass} md:col-span-2`} onChange={(e) => setFormData({ ...formData, descriptionTransport: e.target.value })} />
                <input placeholder="Poids (kg)" className={inputClass} onChange={(e) => setFormData({ ...formData, poids: e.target.value })} />
                <input placeholder="Dimensions" className={inputClass} onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })} />
              </div>

              <div>
                <label className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest ml-1">Tarification convenue (€)</label>
                <input
                  placeholder="ex: 1200"
                  className="w-full mt-1 bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-4 py-3 text-lg font-semibold text-emerald-400 outline-none focus:border-emerald-500/50 transition-colors placeholder-emerald-900"
                  onChange={(e) => setFormData({ ...formData, tarification: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all ${
                  loading
                    ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                    : "bg-emerald-500 hover:bg-emerald-400 text-black"
                }`}
              >
                {loading ? "Enregistrement..." : "Valider l'affrètement"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-3 rounded-lg text-sm text-zinc-400 border border-zinc-700 hover:border-zinc-500 hover:text-zinc-200 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}