import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTransactions, Transaction } from '@/api/transactions';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const [txs, setTxs] = useState<Transaction[]>([]);

  useEffect(() => {
    getTransactions().then(setTxs).catch(console.error);
  }, []);

  const totals = useMemo(() => {
    return txs.reduce((acc, tx) => {
      if (tx.type === 'INCOME') acc.income += tx.amount;
      else if (tx.type === 'EXPENSE') acc.expense += tx.amount;
      return acc;
    }, { income: 0, expense: 0 });
  }, [txs]);

  const balance = totals.income - totals.expense;
  
  // Aggregate data for chart (by day)
  const chartData = useMemo(() => {
    const grouped = txs.reduce((acc: any, tx) => {
      const day = new Date(tx.date).getDate().toString().padStart(2, '0');
      if (!acc[day]) acc[day] = { name: day, Receitas: 0, Despesas: 0 };
      if (tx.type === 'INCOME') acc[day].Receitas += tx.amount;
      else if (tx.type === 'EXPENSE') acc[day].Despesas += tx.amount;
      return acc;
    }, {});
    return Object.values(grouped).sort((a: any, b: any) => Number(a.name) - Number(b.name));
  }, [txs]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Visão Geral</h1>
          <p className="text-slate-400">Bem-vindo(a), {user?.displayName || user?.email}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-sm">
          <h3 className="text-slate-400 font-medium mb-1">Saldo Atual</h3>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-white' : 'text-rose-400'}`}>
            {formatCurrency(balance)}
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-sm">
          <h3 className="text-slate-400 font-medium mb-1">Receitas do Mês</h3>
          <p className="text-3xl font-bold text-emerald-400">{formatCurrency(totals.income)}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-sm">
          <h3 className="text-slate-400 font-medium mb-1">Despesas do Mês</h3>
          <p className="text-3xl font-bold text-rose-400">{formatCurrency(totals.expense)}</p>
        </div>
      </div>
      
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 h-80 flex flex-col">
        <h3 className="text-slate-100 font-medium mb-4">Movimentação Diária (Mês Atual)</h3>
        {chartData.length > 0 ? (
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                  itemStyle={{ fontWeight: 500 }}
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                />
                <Bar dataKey="Receitas" fill="#34d399" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Despesas" fill="#fb7185" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Nenhuma movimentação para exibir.
          </div>
        )}
      </div>
    </div>
  );
}
