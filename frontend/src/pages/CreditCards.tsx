import { useEffect, useState } from 'react';
import { getCreditCards, deleteCreditCard, CreditCard } from '@/api/creditCards';
import { Plus, Trash2, Edit2, CreditCard as CardIcon } from 'lucide-react';
import CreditCardModal from '@/components/CreditCardModal';

export default function CreditCards() {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);

  const fetchCards = async () => {
    try {
      const data = await getCreditCards();
      setCards(data);
    } catch (err) {
      console.error('Failed to fetch cards', err);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este cartão?')) {
      await deleteCreditCard(id);
      fetchCards();
    }
  };

  const handleEdit = (card: CreditCard) => {
    setEditingCard(card);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Cartões de Crédito</h1>
          <p className="text-slate-400">Gerencie seus cartões e faturas</p>
        </div>
        <button 
          onClick={() => { setEditingCard(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} /> Novo Cartão
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(card => (
          <div key={card.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <CardIcon size={80} />
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h3 className="text-xl font-bold text-white">{card.name}</h3>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(card)} className="text-slate-400 hover:text-blue-400"><Edit2 size={18} /></button>
                <button onClick={() => handleDelete(card.id)} className="text-slate-400 hover:text-rose-400"><Trash2 size={18} /></button>
              </div>
            </div>
            <div className="space-y-4 text-slate-300 relative z-10">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">Uso do Limite</span>
                  <span className="font-medium text-slate-200">
                    {Math.round((card.usedLimit / card.limit) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      (card.usedLimit / card.limit) > 0.9 ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min((card.usedLimit / card.limit) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Disponível</p>
                  <p className="text-lg font-bold text-white">
                    R$ {(card.limit - card.usedLimit).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Limite Total</p>
                  <p className="text-slate-300 font-medium">
                    R$ {card.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/50 flex justify-between text-sm">
                <p><span className="text-slate-500">Fecha dia: </span>{card.closingDay}</p>
                <p><span className="text-slate-500">Vence dia: </span>{card.dueDay}</p>
              </div>
            </div>
          </div>
        ))}
        {cards.length === 0 && (
          <div className="col-span-full p-8 text-center text-slate-500 bg-slate-800/50 border border-dashed border-slate-700 rounded-xl">
            Nenhum cartão cadastrado.
          </div>
        )}
      </div>

      {isModalOpen && (
        <CreditCardModal 
          card={editingCard} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchCards} 
        />
      )}
    </div>
  );
}
