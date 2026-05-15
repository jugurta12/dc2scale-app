"use client"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createFullDocument, getContacts } from "@/app/actions/documents"
import { pdf } from "@react-pdf/renderer"
import { ConfirmationAffretementPDF } from "@/app/components/ConfirmationAffretement"
import { NdaPDF } from "@/app/components/NdaPDF"
import { RemoteHandsPDF } from "@/app/components/RemoteHandsPDF"
import { QuotePDF } from "@/app/components/QuotePDF" 
import Image from 'next/image'

import ExpediteurBlock from "@/app/components/forms/ExpediteurBlock"
import DestinataireBlock from "@/app/components/forms/DestinataireBlock"
import DetailsBlock from "../../components/forms/DetailsBlock"
import NdaPartnerBlock from "@/app/components/forms/NdaPartnerBlock"
import RemoteHandsBlock from "@/app/components/forms/RemoteHandsBlock"
import QuoteBlock from "@/app/components/forms/QuoteBlock" 

export default function CreateDocumentPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [dbContacts, setDbContacts] = useState<any[]>([])
  const [dbClients, setDbClients] = useState<any[]>([]) 
  const [suggestions, setSuggestions] = useState<{ type: string, list: any[] }>({ type: '', list: [] })

  // --- 1. AFFRÈTEMENT (ID 8) ---
  const [formData, setFormData] = useState({
    expediteurNom: "", expediteurRaison: "", expediteurAdresse: "", expediteurTransport: "", expediteurContact: "",
    destinataireNom: "", destinataireRaison: "", destinataireAdresse: "",
    dateLivraison: new Date().toISOString().split('T')[0],
    dateEnlevement: new Date().toISOString().split('T')[0],
    descriptionTransport: "", poids: "", dimensions: "", tarification: "", numeroCommande: "",
    docType: "Confirmation d'Affrètement"
  })

  // --- 2. NDA (ID 7) ---
  const [ndaForm, setNdaForm] = useState({
    partnerName: "", partnerRegNumber: "", partnerAddress: "",
    purpose: "Evaluation of a potential colocation and/or services agreement between the Parties.",
    effectiveDate: new Date().toISOString().split("T")[0],
  })

  // --- 3. REMOTE HANDS (ID 6) ---
  const [remoteHandsForm, setRemoteHandsForm] = useState({
    level1HO: "55", level1HNO: "240", level2HO: "90", level2HNO: "300", level3HO: "150", level3HNO: "350", clientName: ""
  })

  // --- 4. PROPOSITION DE COLOCATION (ID 10) ---
  const [quoteForm, setQuoteForm] = useState({
  client: { 
    nom: "", adresse: "", mail: "", tel: "", tva: "",
    banque: "Société Générale",
    iban: "FR76 3000 3022 6500 0200 0708 441",
    bic: "SOGEFRPP"
  },
  mrcItems: [{ name: "Hébergement d'une Baie 2 KVA", description: "Baie APC 42U...", quantity: 1, unitPrice: 670, tvaRate: 20, isRecurring: true }],
  nrcItems: [{ name: "Frais d'activation de la baie", description: "", quantity: 1, unitPrice: 500, tvaRate: 20, isRecurring: false }],
  docType: "Proposition de Colocation"
})

  useEffect(() => {
    async function loadContacts() {
      try {
        const data = await getContacts()
        setDbContacts([...data.expediteurs, ...data.destinataires])
        setDbClients(data.clients || [])
      } catch (error) { console.error(error) }
    }
    loadContacts()
  }, [])

  // --- LOGIQUE DYNAMIQUE QUOTE ---
  const addQuoteItem = (isRecurring: boolean) => {
    const newItem = { name: "", description: "", quantity: 1, unitPrice: 0, tvaRate: 20, isRecurring }
    if (isRecurring) setQuoteForm({ ...quoteForm, mrcItems: [...quoteForm.mrcItems, newItem] })
    else setQuoteForm({ ...quoteForm, nrcItems: [...quoteForm.nrcItems, newItem] })
  }

  const removeQuoteItem = (index: number, isRecurring: boolean) => {
    if (isRecurring) setQuoteForm({ ...quoteForm, mrcItems: quoteForm.mrcItems.filter((_, i) => i !== index) })
    else setQuoteForm({ ...quoteForm, nrcItems: quoteForm.nrcItems.filter((_, i) => i !== index) })
  }

  // --- HANDLERS COMMUNS ---
  const handleTypeAhead = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value
    setFormData({ ...formData, [field as keyof typeof formData]: value })
    if (value.length > 1) {
      const filtered = dbContacts.filter(c => c.nom.toLowerCase().includes(value.toLowerCase()))
      setSuggestions({ type: field, list: filtered })
    } else { setSuggestions({ type: '', list: [] }) }
  }

  const handleNdaTypeAhead = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNdaForm({ ...ndaForm, partnerName: value })
    if (value.length > 1) {
      const filtered = dbClients.filter(c => c.nom.toLowerCase().includes(value.toLowerCase()))
      setSuggestions({ type: 'nda', list: filtered })
    } else { setSuggestions({ type: '', list: [] }) }
  }

  const selectContact = (contact: any, type: string) => {
    if (type === 'nda') {
      setNdaForm({ ...ndaForm, partnerName: contact.nom, partnerRegNumber: contact.numeroImmatriculation || "", partnerAddress: contact.adresse || "" })
    } else if (type === 'expediteurNom') {
      setFormData({ ...formData, expediteurNom: contact.nom, expediteurRaison: contact.raison || "", expediteurAdresse: contact.adresse || "", expediteurTransport: contact.transport || "", expediteurContact: contact.contact || "" })
    } else {
      setFormData({ ...formData, destinataireNom: contact.nom, destinataireRaison: contact.raison || "", destinataireAdresse: contact.adresse || "" })
    }
    setSuggestions({ type: '', list: [] })
  }

  // --- FONCTION DE TÉLÉCHARGEMENT ---
  const downloadPdf = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob); const a = document.createElement("a")
    a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url)
    router.push("/"); router.refresh()
  }

  // --- SOUMISSIONS ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try {
      const result = await createFullDocument(formData)
      if (result.success) {
        const blob = await pdf(<ConfirmationAffretementPDF data={{...formData, reference: result.reference} as any} />).toBlob()
        downloadPdf(blob, `affretement-${result.reference}.pdf`)
      }
    } catch (error) { console.error(error) } finally { setLoading(false) }
  }

  const handleNdaSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try {
      const result = await createFullDocument({ ...ndaForm, docType: "NDA / Accord de confidentialité" })
      if (result.success) {
  const blob = await pdf(<NdaPDF data={{ ...ndaForm, reference: result.reference || "" }} />).toBlob()
  downloadPdf(blob, `NDA-${ndaForm.partnerName}.pdf`)
}
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const handleRemoteHandsSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try {
      const blob = await pdf(<RemoteHandsPDF data={remoteHandsForm} />).toBlob()
      downloadPdf(blob, `Catalogue-RemoteHands.pdf`)
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try {
      const result = await createFullDocument(quoteForm)
      if (result.success) {
        const blob = await pdf(<QuotePDF data={{ ...quoteForm, reference: result.reference || "" }} />).toBlob()
        downloadPdf(blob, `Proposition-${quoteForm.client.nom || "DC2SCALE"}.pdf`)
      }
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const inputClass = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm outline-none focus:border-emerald-500 transition-colors placeholder-zinc-600 text-zinc-100"
  const inputSmClass = "w-full bg-zinc-800/50 border border-zinc-800 rounded-lg px-4 py-2 text-sm outline-none focus:border-zinc-600 transition-colors placeholder-zinc-600 text-zinc-100"

  const SidebarContent = () => (
    <aside className="w-52 shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col py-6 px-3 gap-1">
      <div className="mb-6 flex justify-center w-full">
        <Image src="/assets/Datacenters.png" alt="Logo" width={120} height={40} className="priority" />
      </div>
      <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-widest px-3 mt-2 mb-1">PRODUCTION</p>
      <button onClick={() => router.push('/')} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800/60 transition-colors">
        <span>⊞</span> Modèles
      </button>
    </aside>
  )

  // ── PROPOSITION DE COLOCATION (ID 10) ──
  if (id === "10") return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <SidebarContent />
      <div className="flex-1 flex flex-col">
        <header className="h-12 border-b border-zinc-800 flex items-center px-6 text-zinc-500 text-sm">
          Dc2Scale / Documents / <span className="text-zinc-300 ml-1">Proposition de Colocation</span>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold text-white mb-2">Nouvelle Proposition</h1>
            <p className="text-zinc-400 text-sm mb-8">Saisissez les produits (MRC) et frais (NRC) pour générer le devis.</p>
            <form onSubmit={handleQuoteSubmit} className="space-y-4">
              <QuoteBlock quoteForm={quoteForm} setQuoteForm={setQuoteForm} addQuoteItem={addQuoteItem} removeQuoteItem={removeQuoteItem} inputClass={inputClass} />
              <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all">
                {loading ? "Génération..." : "Valider et Générer la Proposition"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )

  // ── REMOTE HANDS (id 6) ──
  if (id === "6") return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <SidebarContent />
      <div className="flex-1 flex flex-col">
        <header className="h-12 border-b border-zinc-800 flex items-center px-6 text-zinc-500 text-sm">
          Dc2Scale / Documents / <span className="text-zinc-300 ml-1">Remote Hands</span>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-semibold text-white mb-2">Catalogue Remote Hands</h1>
            <form onSubmit={handleRemoteHandsSubmit} className="space-y-4">
              <RemoteHandsBlock formData={remoteHandsForm} setFormData={setRemoteHandsForm} inputClass={inputClass} />
              <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-500 text-black font-bold rounded-xl transition-all">Générer le Catalogue PDF</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )

  // ── NDA (id 7) ──
  if (id === "7") return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <SidebarContent />
      <div className="flex-1 flex flex-col">
        <header className="h-12 border-b border-zinc-800 flex items-center px-6 text-zinc-500 text-sm">
          Dc2Scale / Documents / <span className="text-zinc-300 ml-1">NDA / Accord de confidentialité</span>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-semibold text-white mb-2">NDA / Accord de confidentialité</h1>
            <form onSubmit={handleNdaSubmit} className="space-y-4">
              <NdaPartnerBlock formData={ndaForm} setFormData={setNdaForm} inputClass={inputClass} handleTypeAhead={handleNdaTypeAhead} suggestions={suggestions} selectContact={c => selectContact(c, 'nda')} />
              <button type="submit" disabled={loading} className="w-full py-3 bg-emerald-500 rounded-lg font-medium text-black">Générer le NDA</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )

  if (id !== "8") return <div className="text-white text-center mt-20">Modèle non configuré</div>

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <SidebarContent />
      <div className="flex-1 flex flex-col">
        <header className="h-12 border-b border-zinc-800 flex items-center px-6 text-zinc-500 text-sm">
          Dc2Scale / CircularDC / <span className="text-zinc-300 ml-1">Confirmation d'affrètement</span>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-2xl font-semibold text-white mb-8">Confirmation d'Affrètement</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ExpediteurBlock formData={formData} setFormData={setFormData} handleTypeAhead={handleTypeAhead} suggestions={suggestions} selectContact={selectContact} inputClass={inputClass} inputSmClass={inputSmClass} />
              <DestinataireBlock formData={formData} setFormData={setFormData} handleTypeAhead={handleTypeAhead} suggestions={suggestions} selectContact={selectContact} inputClass={inputClass} inputSmClass={inputSmClass} />
            </div>
            <DetailsBlock formData={formData} setFormData={setFormData} inputClass={inputClass} />
            <button type="submit" disabled={loading} className="w-full py-3 bg-emerald-500 rounded-lg font-medium text-black">Valider l'affrètement</button>
          </form>
        </main>
      </div>
    </div>
  )
}