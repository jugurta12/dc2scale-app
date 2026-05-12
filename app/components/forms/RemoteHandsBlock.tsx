"use client"

export default function RemoteHandsBlock({ formData, setFormData, inputClass }: any) {
  // Les prix par défaut sont injectés via l'état initial dans la page parente
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
      <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Catalogue Remote Hands (Tarifs)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Level 1 */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-emerald-500">Level 1 (Basic)</p>
          <div>
            <label className="text-[10px] text-zinc-500 block mb-1">HO Rate (€)</label>
            <input type="number" value={formData.level1HO} onChange={(e) => handleChange('level1HO', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-[10px] text-zinc-500 block mb-1">HNO Rate (€)</label>
            <input type="number" value={formData.level1HNO} onChange={(e) => handleChange('level1HNO', e.target.value)} className={inputClass} />
          </div>
        </div>

        {/* Level 2 */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-emerald-500">Level 2 (Advanced)</p>
          <div>
            <label className="text-[10px] text-zinc-500 block mb-1">HO Rate (€)</label>
            <input type="number" value={formData.level2HO} onChange={(e) => handleChange('level2HO', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-[10px] text-zinc-500 block mb-1">HNO Rate (€)</label>
            <input type="number" value={formData.level2HNO} onChange={(e) => handleChange('level2HNO', e.target.value)} className={inputClass} />
          </div>
        </div>

        {/* Level 3 */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-emerald-500">Level 3 (Expert)</p>
          <div>
            <label className="text-[10px] text-zinc-500 block mb-1">HO Rate (€)</label>
            <input type="number" value={formData.level3HO} onChange={(e) => handleChange('level3HO', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-[10px] text-zinc-500 block mb-1">HNO Rate (€)</label>
            <input type="number" value={formData.level3HNO} onChange={(e) => handleChange('level3HNO', e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>
    </div>
  )
}