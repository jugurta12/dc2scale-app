"use client"

import { Trash2, Plus } from "lucide-react"

export default function QuoteBlock({ quoteForm, setQuoteForm, addQuoteItem, removeQuoteItem, inputClass }: any) {
  
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
      {/* SECTION CLIENT */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Informations Client</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Nom du client" className={inputClass} value={quoteForm.client.nom} onChange={e => updateClient('nom', e.target.value)} />
          <input placeholder="N° de TVA" className={inputClass} value={quoteForm.client.tva} onChange={e => updateClient('tva', e.target.value)} />
          <textarea placeholder="Adresse complète" className={`${inputClass} md:col-span-2`} rows={2} value={quoteForm.client.adresse} onChange={e => updateClient('adresse', e.target.value)} />
          <input placeholder="Email" className={inputClass} value={quoteForm.client.mail} onChange={e => updateClient('mail', e.target.value)} />
          <input placeholder="Téléphone" className={inputClass} value={quoteForm.client.tel} onChange={e => updateClient('tel', e.target.value)} />
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
            <div className="col-span-1 pt-2">
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
          <div key={index} className="grid grid-cols-12 gap-3 items-center">
            <input className={`${inputClass} col-span-5`} placeholder="Nom du frais" value={item.name} onChange={e => updateItem(index, 'name', e.target.value, false)} />
            <input className={`${inputClass} col-span-2`} type="number" placeholder="Qté" value={item.quantity} onChange={e => updateItem(index, 'quantity', e.target.value, false)} />
            <input className={`${inputClass} col-span-2`} type="number" placeholder="Prix HT" value={item.unitPrice} onChange={e => updateItem(index, 'unitPrice', e.target.value, false)} />
            <input className={`${inputClass} col-span-2`} type="number" placeholder="TVA %" value={item.tvaRate} onChange={e => updateItem(index, 'tvaRate', e.target.value, false)} />
            <button type="button" onClick={() => removeQuoteItem(index, false)} className="col-span-1 text-zinc-500 hover:text-red-500 justify-self-center">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}