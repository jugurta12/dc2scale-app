"use client"

interface NdaFormData {
  partnerName: string
  partnerRegNumber: string
  partnerAddress: string
  purpose: string
  effectiveDate: string
}

interface Props {
  formData: NdaFormData
  setFormData: (data: NdaFormData) => void
  inputClass: string
  // Ajout des props pour que le rouge disparaisse dans CreateDocumentPage
  handleTypeAhead?: (e: React.ChangeEvent<HTMLInputElement>) => void
  suggestions?: { type: string, list: any[] }
  selectContact?: (contact: any) => void
}

export default function NdaPartnerBlock({ 
  formData, 
  setFormData, 
  inputClass,
  handleTypeAhead,
  suggestions,
  selectContact 
}: Props) {
  return (
    <>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Informations Partenaire</h2>

        <div className="relative">
          <label className="text-xs text-zinc-500 mb-1.5 block">Nom / Raison sociale *</label>
          <input
            required
            value={formData.partnerName}
            onChange={handleTypeAhead || (e => setFormData({ ...formData, partnerName: e.target.value }))}
            placeholder="Ex: Acme Corp Ltd"
            className={inputClass}
            autoComplete="off"
          />

          {/* Menu des suggestions */}
          {suggestions?.type === 'nda' && suggestions.list.length > 0 && (
            <div className="absolute z-50 w-full bg-zinc-800 border border-zinc-700 mt-1 rounded-lg shadow-2xl max-h-48 overflow-y-auto">
              {suggestions.list.map((c: any, i: number) => (
                <div
                  key={i}
                  onClick={() => selectContact && selectContact(c)}
                  className="px-4 py-2 hover:bg-emerald-500 hover:text-black cursor-pointer text-sm text-zinc-200 border-b border-zinc-700/50 last:border-0 transition-colors"
                >
                  {c.nom}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Numéro d'immatriculation</label>
          <input
            value={formData.partnerRegNumber}
            onChange={e => setFormData({ ...formData, partnerRegNumber: e.target.value })}
            placeholder="Ex: 12345678"
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Adresse du siège social *</label>
          <textarea
            required
            value={formData.partnerAddress}
            onChange={e => setFormData({ ...formData, partnerAddress: e.target.value })}
            placeholder="Ex: 10 Downing Street, London, UK"
            rows={2}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Détails de l'accord</h2>

        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Objet / Purpose *</label>
          <textarea
            required
            value={formData.purpose}
            onChange={e => setFormData({ ...formData, purpose: e.target.value })}
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Date d'effet</label>
          <input
            type="date"
            value={formData.effectiveDate}
            onChange={e => setFormData({ ...formData, effectiveDate: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>
    </>
  )
}