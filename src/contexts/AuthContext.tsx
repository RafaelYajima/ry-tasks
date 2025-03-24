
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createClient, 
  Session, 
  SupabaseClient, 
  User 
} from '@supabase/supabase-js';
import { toast } from "sonner";

// Inicializa o cliente do Supabase
const supabaseUrl = 'https://qpwnmvywzfxmitcnkpdw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwd25tdnl3emZ4bWl0Y25rcGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU3MjExODUsImV4cCI6MjAzMTI5NzE4NX0.iKfQMoUf8Qb1aNONaNYgVcqmRJPWHgqN-wRZQUAy3No';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica a sessão atual quando o componente monta
    const getSession = async () => {
      setIsLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting session:", error);
        toast.error("Erro ao recuperar sessão");
      } else {
        setSession(session);
        setUser(session?.user || null);
      }
      
      setIsLoading(false);
    };

    getSession();

    // Configura o listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      toast.success("Registro realizado! Verifique seu e-mail para confirmar.");
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast.error(error.message || "Erro ao criar conta");
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      toast.success("Login realizado com sucesso!");
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast.error(error.message || "Erro ao fazer login");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success("Logout realizado com sucesso!");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error(error.message || "Erro ao fazer logout");
      throw error;
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
