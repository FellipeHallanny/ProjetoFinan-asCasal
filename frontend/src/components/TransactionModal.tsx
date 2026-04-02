import { useState, useEffect } from 'react';
import { Transaction, createTransaction, updateTransaction } from '@/api/transactions';
import { getCategoryPatterns, CategoryPattern } from '@/api/categories';
import { getCreditCards, CreditCard } from '@/api/creditCards';
import { X } from 'lucide-react';

interface Props {
  transaction: Transaction | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TransactionModal({ transaction, onClose, onSuccess }: Props) {
  const isEditing = !!transaction;
  
  const [description, setDescription] = useState(transaction?.description || '');
  const [amount, setAmount] = useState(transaction?.amount ? transaction.amount.toString() : '');
  const [type, setType] = useState(transaction?.type || 'EXPENSE');
  const [date, setDate] = useState(transaction?.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState(transaction?.paidBy || 'M');
  const [categoryId, setCategoryId] = useState(transaction?.categoryId || '');
  const [creditCardId, setCreditCardId] = useState(transaction?.creditCardId || '');
  const [patterns, setPatterns] = useState<CategoryPattern[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);

  useEffect(() => {
    getCategoryPatterns().then(setPatterns).catch(console.error);
    getCreditCards().then(setCreditCards).catch(console.error);
  }, []);

  // Smart categorization
  useEffect(() => {
    if (isEditing || !description) return;
    const word = description.trim().split(' ')[0].toLowerCase();
    const pattern = patterns.find(p => p.id === word);
    if (pattern && pattern.suggestions) {
      const bestMatch = Object.entries(pattern.suggestions).sort((a, b) => b[1] - a[1])[0];
      if (bestMatch && bestMatch[0] !== categoryId) {
        setCategoryId(bestMatch[0]);
      }
    }
  }, [description, patterns, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        description,
        amount: parseFloat(amount),
        type,
        date: new Date(date).toISOString(),
        paidBy,
        categoryId,
        status: 'PAID' as const
      };

      if (type === 'EXPENSE' && creditCardId) {
        payload.creditCardId = creditCardId;
      }

      if (isEditing) {
        await updateTransaction(transaction.id, payload);
      } else {
        await createTransaction(payload);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save transaction', error);
      alert('Erro ao salvar transação.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
          <h2 className="text-xl font-bold text-slate-100">{isEditing ? 'Editar Transação' : 'Nova Transação'}</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Tipo</label>
              <select 
                value={type} onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-blue-500 focus:outline-none"
              >
                <option value="EXPENSE">Despesa</option>
                <option value="INCOME">Receita</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Data</label>
              <input 
                type="date" required value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Descrição</label>
            <input 
              type="text" required value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Supermercado"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Categoria (Smart Auto-preenchimento)</label>
            <input 
              type="text" required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
              placeholder="Ex: Alimentação"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-emerald-400 focus:border-blue-500 focus:outline-none transition-colors duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Valor (R$)</label>
            <input 
              type="number" step="0.01" min="0" required value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Modelo Misto (Quem Pagou?)</label>
            <select 
              value={paidBy} onChange={(e) => setPaidBy(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-blue-500 focus:outline-none"
            >
              <option value="M">Marido</option>
              <option value="F">Esposa</option>
              <option value="BOTH">Ambos (Divisão Exata)</option>
            </select>
          </div>

          {type === 'EXPENSE' && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Vincular a Cartão de Crédito? (Opcional)</label>
              <select 
                value={creditCardId} onChange={(e) => setCreditCardId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Não (Dinheiro/Débito)</option>
                {creditCards.map(card => (
                  <option key={card.id} value={card.id}>{card.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-slate-300 hover:bg-slate-800 font-medium transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
              {isEditing ? 'Salvar Alterações' : 'Criar Lançamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
