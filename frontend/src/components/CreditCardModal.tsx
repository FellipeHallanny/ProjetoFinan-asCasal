import { useState } from 'react';
import { CreditCard, createCreditCard, updateCreditCard } from '@/api/creditCards';
import { X } from 'lucide-react';

interface Props {
  card: CreditCard | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreditCardModal({ card, onClose, onSuccess }: Props) {
  const isEditing = !!card;
  const [name, setName] = useState(card?.name || '');
  const [limit, setLimit] = useState(card?.limit?.toString() || '');
  const [closingDay, setClosingDay] = useState(card?.closingDay?.toString() || '');
  const [dueDay, setDueDay] = useState(card?.dueDay?.toString() || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { 
        name, 
        limit: parseFloat(limit),
        closingDay: parseInt(closingDay), 
        dueDay: parseInt(dueDay) 
      };
      if (isEditing) await updateCreditCard(card.id, payload);
      else await createCreditCard(payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar cartão');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-xl shadow-2xl flex flex-col">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-100">{isEditing ? 'Editar Cartão' : 'Novo Cartão'}</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-200"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Nome do Cartão</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Limite Total (R$)</label>
            <input type="number" step="0.01" required value={limit} onChange={e => setLimit(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-blue-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Dia de Fechamento</label>
              <input type="number" min="1" max="31" required value={closingDay} onChange={e => setClosingDay(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Dia de Vencimento</label>
              <input type="number" min="1" max="31" required value={dueDay} onChange={e => setDueDay(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-blue-500 outline-none" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2 font-medium text-slate-300">Cancelar</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
