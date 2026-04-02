import { useEffect, useState } from 'react';
import { getTransactions, deleteTransaction, Transaction } from '@/api/transactions';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import TransactionModal from '@/components/TransactionModal';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to fetch', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover esta transação?')) {
      await deleteTransaction(id);
      fetchTransactions();
    }
  };

  const handleEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setIsModalOpen(true);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Transações</h1>
          <p className="text-slate-400">Histórico de receitas e despesas</p>
        </div>
        <button 
          onClick={() => { setEditingTx(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} /> Nova Lançamento
        </button>
      </header>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 border-b border-slate-700 text-slate-400">
            <tr>
              <th className="p-4 font-medium">Data</th>
              <th className="p-4 font-medium">Descrição</th>
              <th className="p-4 font-medium">Tipo</th>
              <th className="p-4 font-medium">Pago Por</th>
              <th className="p-4 font-medium text-right">Valor</th>
              <th className="p-4 font-medium text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-slate-300">
            {transactions.map(tx => (
              <tr key={tx.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="p-4">{new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                <td className="p-4">{tx.description}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.type === 'INCOME' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                    {tx.type === 'INCOME' ? 'Receita' : 'Despesa'}
                  </span>
                </td>
                <td className="p-4 font-medium">
                  {tx.paidBy === 'M' ? 'Marido' : tx.paidBy === 'F' ? 'Esposa' : 'Ambos'}
                </td>
                <td className={`p-4 text-right font-medium ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                </td>
                <td className="p-4 flex justify-center gap-3">
                  <button onClick={() => handleEdit(tx)} className="text-slate-400 hover:text-blue-400 transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(tx.id)} className="text-slate-400 hover:text-rose-400 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">Nenhuma transação encontrada no período.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <TransactionModal 
          transaction={editingTx} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchTransactions} 
        />
      )}
    </div>
  );
}
