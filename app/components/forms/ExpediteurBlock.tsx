// app/components/forms/ExpediteurBlock.tsx
interface ExpediteurBlockProps {
  formData: any;
  setFormData: (data: any) => void;
  handleTypeAhead: (e: any, field: any) => void;
  suggestions: any;
  selectContact: (contact: any, type: 'exp' | 'dest') => void;
  inputClass: string;
  inputSmClass: string;
}

export default function ExpediteurBlock({ 
  formData, setFormData, handleTypeAhead, suggestions, selectContact, inputClass, inputSmClass 
}: ExpediteurBlockProps) {
  return (
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
            {suggestions.list.map((s: any, i: number) => (
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
  )
}