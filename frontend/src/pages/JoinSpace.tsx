import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { createSpace, joinSpace } from '@/api/auth';

export default function JoinSpace() {
  const { user, familyId, logout, reloadFamilyData } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'CHOICE' | 'CREATE' | 'JOIN'>('CHOICE');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (familyId) navigate('/');
  }, [familyId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (mode === 'CREATE') {
        await createSpace(inputValue);
      } else if (mode === 'JOIN') {
        await joinSpace(inputValue);
      }
      await reloadFamilyData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ocorreu um erro ao processar o espaço familiar.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-100">Espaço da Família</h2>
          <button onClick={logout} className="text-sm text-slate-400 hover:text-slate-200">Sair</button>
        </div>

        {error && <div className="p-3 mb-4 text-sm text-red-400 bg-red-950/50 border border-red-900 rounded">{error}</div>}

        {mode === 'CHOICE' ? (
          <div className="space-y-4">
            <p className="text-slate-300 text-sm mb-6">
              Para continuar, você precisa criar um novo espaço para suas finanças ou entrar no espaço do seu parceiro(a).
            </p>
            <button 
              onClick={() => setMode('CREATE')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-medium transition-colors"
            >
              Criar Novo Espaço
            </button>
            <button 
              onClick={() => setMode('JOIN')}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-3 font-medium border border-slate-600 transition-colors"
            >
              Já tenho um Código
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-slate-300 text-sm mb-4">
              {mode === 'CREATE' ? 'Dê um nome para o seu espaço familiar:' : 'Digite o código de convite recebido:'}
            </p>
            <input 
              type="text" 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={mode === 'CREATE' ? 'Ex: Familia Silva' : 'Cole aqui o código do espaço'}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-blue-500"
              required 
            />
            <div className="flex gap-3 pt-2">
              <button 
                type="button"
                onClick={() => setMode('CHOICE')}
                className="w-1/3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-2 font-medium"
                disabled={loading}
              >
                Voltar
              </button>
              <button 
                type="submit"
                className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-medium flex justify-center items-center"
                disabled={loading}
              >
                {loading ? 'Aguarde...' : 'Confirmar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
