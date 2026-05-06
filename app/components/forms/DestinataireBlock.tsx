// app/components/forms/DestinataireBlock.tsx
interface DestinataireBlockProps {
  formData: any;
  setFormData: (data: any) => void;
  handleTypeAhead: (e: any, field: any) => void;
  suggestions: any;
  selectContact: (contact: any, type: 'exp' | 'dest') => void;
  inputClass: string;
  inputSmClass: string;
}

export default function DestinataireBlock({ 
  formData, setFormData, handleTypeAhead, suggestions, selectContact, inputClass, inputSmClass 
}: DestinataireBlockProps) {
  return (
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
            {suggestions.list.map((s: any, i: number) => (
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
  )
}