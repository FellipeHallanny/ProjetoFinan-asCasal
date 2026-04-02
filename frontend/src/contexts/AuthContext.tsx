import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  familyId: string | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  reloadFamilyData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFamilyId = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setFamilyId(userDoc.data().familyId || null);
      } else {
        setFamilyId(null);
      }
    } catch (error) {
      console.error('Error fetching familyId', error);
      setFamilyId(null);
    }
  };

  const login = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      setUser(cred.user);
      await fetchFamilyId(cred.user.uid);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setFamilyId(null);
  };

  const reloadFamilyData = async () => {
    if (user) await fetchFamilyId(user.uid);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchFamilyId(currentUser.uid);
      } else {
        setFamilyId(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, familyId, loading, login, logout, reloadFamilyData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
