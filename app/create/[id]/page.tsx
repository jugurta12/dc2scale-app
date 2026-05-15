"use client"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createFullDocument, getContacts } from "@/app/actions/documents"
import { pdf } from "@react-pdf/renderer"
import { ConfirmationAffretementPDF } from "@/app/components/ConfirmationAffretement"
import { NdaPDF } from "@/app/components/NdaPDF"
import { RemoteHandsPDF } from "@/app/components/RemoteHandsPDF" // Ton nouveau composant
import Image from 'next/image'

import ExpediteurBlock from "@/app/components/forms/ExpediteurBlock"
import DestinataireBlock from "@/app/components/forms/DestinataireBlock"
import DetailsBlock from "../../components/forms/DetailsBlock"
import NdaPartnerBlock from "@/app/components/forms/NdaPartnerBlock"
import RemoteHandsBlock from "@/app/components/forms/RemoteHandsBlock" // Ton nouveau bloc

export default function CreateDocumentPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [dbContacts, setDbContacts] = useState<any[]>([])
  const [dbClients, setDbClients] = useState<any[]>([]) 
  const [suggestions, setSuggestions] = useState<{ type: string, list: any[] }>({ type: '', list: [] })

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
    numeroCommande: "",
    docType: "Confirmation d'Affrètement"
  })

  const [ndaForm, setNdaForm] = useState({
    partnerName: "",
    partnerRegNumber: "",
    partnerAddress: "",
    purpose: "Evaluation of a potential colocation and/or services agreement between the Parties.",
    effectiveDate: new Date().toISOString().split("T")[0],
  })

  // --- CATALOGUE REMOTE HANDS (VALEURS PAR DÉFAUT DU PDF) ---
  const [remoteHandsForm, setRemoteHandsForm] = useState({
    level1HO: "55",   // [cite: 25]
    level1HNO: "240", // [cite: 25]
    level2HO: "90",   // [cite: 25]
    level2HNO: "300", // [cite: 25]
    level3HO: "150",  // [cite: 25]
    level3HNO: "350", // [cite: 25]
    clientName: ""
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await createFullDocument(formData)
      if (result.success) {
        const pdfData = {
          reference: result.reference || `REF-${Date.now()}`,
          numeroCommande: formData.numeroCommande,
          fmNom: "Service Transport",
          fmAdresse: "520 Blochairn Rd\nGlasgow G21 2DZ",
          toNom: formData.destinataireNom,
          expediteurNom: formData.expediteurNom,
          expediteurContact: formData.expediteurContact,
          dateEnlevement: formData.dateEnlevement,
          destinataireNom: formData.destinataireNom,
          destinataireContact: formData.expediteurContact,
          dateLivraison: formData.dateLivraison,
          descriptionTransport: formData.descriptionTransport,
          poids: formData.poids,
          dimensions: formData.dimensions,
          tarification: formData.tarification,
        }
        const blob = await pdf(<ConfirmationAffretementPDF data={pdfData} />).toBlob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `affretement-${formData.numeroCommande || pdfData.reference}.pdf`
        a.click()
        URL.revokeObjectURL(url)
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      console.error(error)
      alert("Erreur lors de l'enregistrement.")
    } finally {
      setLoading(false)
    }
  }

  const handleNdaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await createFullDocument({ ...ndaForm, docType: "NDA / Accord de confidentialité" })
      const reference = result.reference || `NDA-${Date.now()}`
      const blob = await pdf(<NdaPDF data={{ ...ndaForm, reference }} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `NDA-${ndaForm.partnerName.replace(/\s+/g, "-")}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      router.push("/")
      router.refresh()
    } catch (err) {
      console.error(err)
      alert("Erreur lors de la génération.")
    } finally {
      setLoading(false)
    }
  }

  // --- SOUMISSION CATALOGUE (PAS D'ENREGISTREMENT) ---
  const handleRemoteHandsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const blob = await pdf(<RemoteHandsPDF data={remoteHandsForm} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Catalogue-RemoteHands-${remoteHandsForm.clientName || "DC2SCALE"}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert("Erreur lors de la génération du catalogue.")
    } finally {
      setLoading(false)
    }
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
            <p className="text-zinc-400 text-sm mb-8">Les prix sont pré-remplis automatiquement. Modifiez-les si nécessaire.</p>
            <form onSubmit={handleRemoteHandsSubmit} className="space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <label className="text-xs text-zinc-500 mb-1 block">Nom du client (Optionnel)</label>
                <input 
                  className={inputClass} 
                  value={remoteHandsForm.clientName} 
                  onChange={e => setRemoteHandsForm({...remoteHandsForm, clientName: e.target.value})}
                  placeholder="Ex: Google France"
                />
              </div>
              <RemoteHandsBlock formData={remoteHandsForm} setFormData={setRemoteHandsForm} inputClass={inputClass} />
              <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all">
                {loading ? "Génération..." : "Générer le Catalogue PDF"}
              </button>
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