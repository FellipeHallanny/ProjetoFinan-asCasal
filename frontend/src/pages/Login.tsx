import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn } from 'lucide-react';

export default function Login() {
  const { user, familyId, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && familyId) {
      navigate('/');
    } else if (user && !familyId) {
      navigate('/join-space');
    }
  }, [user, familyId, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Finanças Casal</h1>
        <p className="text-slate-400 mb-8">Gerencie suas finanças e objetivos a dois.</p>
        
        <button 
          onClick={login}
          className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-4 font-medium transition-colors"
        >
          <LogIn size={20} />
          Entrar com o Google
        </button>
      </div>
    </div>
  );
}
