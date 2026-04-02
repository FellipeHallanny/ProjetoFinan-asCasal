import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, CreditCard, Target, LogOut, List } from 'lucide-react';

export default function Layout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItemClass = (path: string) => 
    `flex items-center gap-3 p-3 rounded-lg transition-colors w-full text-left ${location.pathname === path ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Finanças<span className="text-blue-500">Casal</span></h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => navigate('/')} className={navItemClass('/')}>
            <LayoutDashboard size={20} /> Visão Geral
          </button>
          <button onClick={() => navigate('/transactions')} className={navItemClass('/transactions')}>
            <List size={20} /> Lançamentos
          </button>
          <button onClick={() => navigate('/cards')} className={navItemClass('/cards')}>
            <CreditCard size={20} /> Cartões
          </button>
          <button onClick={() => navigate('/goals')} className={navItemClass('/goals')}>
            <Target size={20} /> Metas
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 p-3 w-full rounded-lg text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors">
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 text-slate-100 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
