import { useState } from 'react';
import { Goal, depositGoal } from '@/api/goals';
import { X, TrendingUp } from 'lucide-react';

interface Props {
  goal: Goal;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DepositModal({ goal, onClose, onSuccess }: Props) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState(`Aporte para: ${goal.title}`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await depositGoal(goal.id, parseFloat(amount), description);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao registrar aporte');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-900/50 w-full max-w-md rounded-xl shadow-2xl flex flex-col">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-emerald-400">
            <TrendingUp size={24} />
            <h2 className="text-xl font-bold text-slate-100">Registrar Aporte</h2>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-200"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-4 bg-slate-800 rounded-lg mb-4 text-sm text-slate-300 border border-slate-700">
            O aporte criará automaticamente uma transação de "Despesa" atrelada à meta <strong>{goal.title}</strong>, descontando do saldo global do mês e aumentando a barra de progresso.
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Valor do Aporte (R$)</label>
            <input type="number" step="0.01" min="0.01" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="Ex: 500.00" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Descrição</label>
            <input type="text" required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-emerald-500 outline-none" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2 font-medium text-slate-300">Cancelar</button>
            <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-lg shadow-emerald-900/20">Confirmar Aporte</button>
          </div>
        </form>
      </div>
    </div>
  );
}
