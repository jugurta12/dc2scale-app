interface DetailsBlockProps {
  formData: any;
  setFormData: (data: any) => void;
  inputClass: string;
}

export default function DetailsBlock({ formData, setFormData, inputClass }: DetailsBlockProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-widest mb-4">3. Détails Techniques & Tarification</p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <input placeholder="Description (ex: Palette serveurs)" value={formData.descriptionTransport} className={`${inputClass} md:col-span-2`} onChange={(e) => setFormData({ ...formData, descriptionTransport: e.target.value })} />
        <input placeholder="Poids (kg)" value={formData.poids} className={inputClass} onChange={(e) => setFormData({ ...formData, poids: e.target.value })} />
        <input placeholder="Dimensions" value={formData.dimensions} className={inputClass} onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest ml-1">Tarification convenue (€)</label>
          <input
            placeholder="ex: 1200"
            value={formData.tarification}
            className="w-full mt-1 bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-4 py-3 text-lg font-semibold text-emerald-400 outline-none focus:border-emerald-500/50 transition-colors placeholder-emerald-900"
            onChange={(e) => setFormData({ ...formData, tarification: e.target.value })}
          />
        </div>
        <div>
          <label className="text-[10px] text-zinc-400 font-semibold uppercase tracking-widest ml-1">Numéro de commande</label>
          <input
            placeholder="ex: BC-2024-001"
            value={formData.numeroCommande}
            className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-lg font-semibold text-zinc-300 outline-none focus:border-zinc-500 transition-colors placeholder-zinc-700"
            onChange={(e) => setFormData({ ...formData, numeroCommande: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}