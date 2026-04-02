import { useEffect, useState } from 'react';
import { getGoals, deleteGoal, Goal } from '@/api/goals';
import { Plus, Trash2, Edit2, Target, TrendingUp } from 'lucide-react';
import GoalModal from '@/components/GoalModal';
import DepositModal from '@/components/DepositModal';

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [depositingGoal, setDepositingGoal] = useState<Goal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (err) {
      console.error('Failed to fetch goals', err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover esta meta?')) {
      await deleteGoal(id);
      fetchGoals();
    }
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Metas</h1>
          <p className="text-slate-400">Acompanhe seus objetivos financeiros a dois</p>
        </div>
        <button 
          onClick={() => { setEditingGoal(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} /> Nova Meta
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => {
          const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          return (
            <div key={goal.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-900/50 rounded-lg text-blue-400">
                    <Target size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{goal.title}</h3>
                    {goal.deadline && (
                      <p className="text-sm text-slate-400">
                        Até {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setDepositingGoal(goal)} className="p-2 text-emerald-400 hover:bg-emerald-950 rounded-lg transition-colors" title="Aportar">
                    <TrendingUp size={20} />
                  </button>
                  <button onClick={() => handleEdit(goal)} className="p-2 text-blue-400 hover:bg-blue-950 rounded-lg transition-colors">
                    <Edit2 size={20} />
                  </button>
                  <button onClick={() => handleDelete(goal.id)} className="p-2 text-rose-400 hover:bg-rose-950 rounded-lg transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 mt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{formatCurrency(goal.currentAmount)}</span>
                  <span className="font-medium text-slate-300">{formatCurrency(goal.targetAmount)}</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-right text-xs text-blue-400 font-medium">{progress}% concluído</p>
              </div>
            </div>
          );
        })}
        {goals.length === 0 && (
          <div className="col-span-full p-8 text-center text-slate-500 bg-slate-800/50 border border-dashed border-slate-700 rounded-xl">
            Nenhuma meta cadastrada.
          </div>
        )}
      </div>

      {isModalOpen && (
        <GoalModal 
          goal={editingGoal} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchGoals} 
        />
      )}

      {depositingGoal && (
        <DepositModal 
          goal={depositingGoal} 
          onClose={() => setDepositingGoal(null)} 
          onSuccess={fetchGoals} 
        />
      )}
    </div>
  );
}
