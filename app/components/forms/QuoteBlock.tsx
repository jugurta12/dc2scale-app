"use client"

import { Trash2, Plus } from "lucide-react"

// On ajoute handleTypeAhead, suggestions et selectContact dans les props
export default function QuoteBlock({ 
  quoteForm, 
  setQuoteForm, 
  addQuoteItem, 
  removeQuoteItem, 
  inputClass,
  handleTypeAhead,    // Ajouté
  suggestions,        // Ajouté
  selectContact       // Ajouté
}: any) {
  
  const updateItem = (index: number, field: string, value: any, isRecurring: boolean) => {
    const listKey = isRecurring ? 'mrcItems' : 'nrcItems';
    const newItems = [...quoteForm[listKey]];
    newItems[index] = { ...newItems[index], [field]: value };
    setQuoteForm({ ...quoteForm, [listKey]: newItems });
  };

  const updateClient = (field: string, value: string) => {
    setQuoteForm({ ...quoteForm, client: { ...quoteForm.client, [field]: value } });
  };

  return (
    <div className="space-y-6">
      {/* SECTION CLIENT & PAIEMENT */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Informations Client</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* --- INPUT NOM AVEC SUGGESTIONS --- */}
          <div className="relative">
            <input 
              placeholder="Nom du client" 
              className={inputClass} 
              value={quoteForm.client.nom} 
              onChange={handleTypeAhead} // On utilise handleQuoteTypeAhead passé par le parent
              autoComplete="off"
            />
            
            {suggestions?.type === 'quote' && suggestions.list.length > 0 && (
              <div className="absolute z-50 w-full bg-zinc-800 border border-zinc-700 mt-1 rounded-lg shadow-2xl max-h-48 overflow-y-auto">
                {suggestions.list.map((c: any, i: number) => (
                  <div
                    key={i}
                    onClick={() => selectContact(c)}
                    className="px-4 py-2 hover:bg-emerald-500 hover:text-black cursor-pointer text-sm text-zinc-200 border-b border-zinc-700/50 last:border-0 transition-colors"
                  >
                    {c.nom} <span className="text-[10px] opacity-50 ml-2">— {c.adresse?.substring(0, 20)}...</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* ---------------------------------- */}

          <input placeholder="N° de TVA" className={inputClass} value={quoteForm.client.tva} onChange={e => updateClient('tva', e.target.value)} />
          <textarea placeholder="Adresse complète" className={`${inputClass} md:col-span-2`} rows={2} value={quoteForm.client.adresse} onChange={e => updateClient('adresse', e.target.value)} />
          <input placeholder="Email" className={inputClass} value={quoteForm.client.mail} onChange={e => updateClient('mail', e.target.value)} />
          <input placeholder="Téléphone" className={inputClass} value={quoteForm.client.tel} onChange={e => updateClient('tel', e.target.value)} />
        </div>

        {/* INFORMATION DE PAIEMENT */}
        <div className="pt-4 border-t border-zinc-800 mt-4">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Informations de paiement</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase ml-1">Établissement</label>
              <input placeholder="Banque" className={inputClass} value={quoteForm.client.banque} onChange={e => updateClient('banque', e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase ml-1">IBAN</label>
              <input placeholder="IBAN" className={inputClass} value={quoteForm.client.iban} onChange={e => updateClient('iban', e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase ml-1">BIC</label>
              <input placeholder="BIC" className={inputClass} value={quoteForm.client.bic} onChange={e => updateClient('bic', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION MRC (Récurrent Mensuel) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Récurrent mensuel (MRC)</h2>
          <button type="button" onClick={() => addQuoteItem(true)} className="text-emerald-500 hover:text-emerald-400 flex items-center gap-1 text-xs font-medium">
            <Plus size={14} /> Ajouter un produit
          </button>
        </div>
        
        {quoteForm.mrcItems.map((item: any, index: number) => (
          <div key={index} className="grid grid-cols-12 gap-3 items-start border-b border-zinc-800 pb-4 last:border-0 last:pb-0">
            <div className="col-span-5 space-y-2">
              <input placeholder="Nom du produit (ex: Hébergement)" className={inputClass} value={item.name} onChange={e => updateItem(index, 'name', e.target.value, true)} />
              <textarea placeholder="Détails techniques..." className={`${inputClass} text-xs py-1`} rows={2} value={item.description} onChange={e => updateItem(index, 'description', e.target.value, true)} />
            </div>
            <div className="col-span-2">
              <input type="number" placeholder="Qté" className={inputClass} value={item.quantity} onChange={e => updateItem(index, 'quantity', e.target.value, true)} />
            </div>
            <div className="col-span-2">
              <input type="number" placeholder="Prix HT" className={inputClass} value={item.unitPrice} onChange={e => updateItem(index, 'unitPrice', e.target.value, true)} />
            </div>
            <div className="col-span-2">
              <input type="number" placeholder="TVA %" className={inputClass} value={item.tvaRate} onChange={e => updateItem(index, 'tvaRate', e.target.value, true)} />
            </div>
            <div className="col-span-1 pt-2 text-right">
              <button type="button" onClick={() => removeQuoteItem(index, true)} className="text-zinc-500 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION NRC (Frais non récurrents) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Frais non récurrents (NRC)</h2>
          <button type="button" onClick={() => addQuoteItem(false)} className="text-emerald-500 hover:text-emerald-400 flex items-center gap-1 text-xs font-medium">
            <Plus size={14} /> Ajouter un frais
          </button>
        </div>
        
        {quoteForm.nrcItems.map((item: any, index: number) => (
          <div key={index} className="grid grid-cols-12 gap-3 items-center border-b border-zinc-800/50 pb-3 last:border-0 last:pb-0">
            <input className={`${inputClass} col-span-5`} placeholder="Nom du frais" value={item.name} onChange={e => updateItem(index, 'name', e.target.value, false)} />
            <input className={`${inputClass} col-span-2`} type="number" placeholder="Qté" value={item.quantity} onChange={e => updateItem(index, 'quantity', e.target.value, false)} />
            <input className={`${inputClass} col-span-2`} type="number" placeholder="Prix HT" value={item.unitPrice} onChange={e => updateItem(index, 'unitPrice', e.target.value, false)} />
            <input className={`${inputClass} col-span-2`} type="number" placeholder="TVA %" value={item.tvaRate} onChange={e => updateItem(index, 'tvaRate', e.target.value, false)} />
            <div className="col-span-1 text-right">
              <button type="button" onClick={() => removeQuoteItem(index, false)} className="text-zinc-500 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}