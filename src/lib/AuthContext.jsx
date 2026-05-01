import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '@/api/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authMessage, setAuthMessage] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoadingAuth(false);
      return undefined;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) {
        setAuthMessage(error.message);
      }
      setSession(data.session);
      setIsLoadingAuth(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthMessage('');
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async ({ email, password }) => {
    setAuthMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthMessage(error.message);
      throw error;
    }
  };

  const signUp = async ({ email, password }) => {
    setAuthMessage('');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setAuthMessage(error.message);
      throw error;
    }

    if (!data.session) {
      setAuthMessage('Account created. Check your email to confirm your sign up, then log in.');
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = useMemo(() => ({
    authMessage,
    isLoadingAuth,
    isSupabaseConfigured,
    session,
    signIn,
    signOut,
    signUp,
    user: session?.user || null,
  }), [authMessage, isLoadingAuth, session]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
