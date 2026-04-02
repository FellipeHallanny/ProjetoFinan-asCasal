import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import JoinSpace from '@/pages/JoinSpace';
import Dashboard from '@/pages/Dashboard';
import Transactions from '@/pages/Transactions';
import CreditCards from '@/pages/CreditCards';
import Goals from '@/pages/Goals';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/join-space" element={<JoinSpace />} />
          
          <Route path="*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/cards" element={<CreditCards />} />
                  <Route path="/goals" element={<Goals />} />
                  {/* Outras rotas entrarão aqui */}
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
