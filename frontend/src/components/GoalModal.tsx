import { useState } from 'react';
import { Goal, createGoal, updateGoal } from '@/api/goals';
import { X } from 'lucide-react';

interface Props {
  goal: Goal | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GoalModal({ goal, onClose, onSuccess }: Props) {
  const isEditing = !!goal;
  const [title, setTitle] = useState(goal?.title || '');
  const [targetAmount, setTargetAmount] = useState(goal?.targetAmount?.toString() || '');
  const [deadline, setDeadline] = useState(goal?.deadline ? goal.deadline.split('T')[0] : '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<Goal> = { 
        title, 
        targetAmount: parseFloat(targetAmount)
      };
      if (deadline) payload.deadline = new Date(deadline).toISOString();
      
      if (isEditing) await updateGoal(goal.id, payload);
      else await createGoal(payload);
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar meta');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-xl shadow-2xl flex flex-col">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-100">{isEditing ? 'Editar Meta' : 'Nova Meta'}</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-200"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Título da Meta</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Viagem para Europa" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Valor Alvo (R$)</label>
            <input type="number" step="0.01" required value={targetAmount} onChange={e => setTargetAmount(e.target.value)} placeholder="Ex: 15000.00" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Prazo (Opcional)</label>
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-blue-500 outline-none" />
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
