import { createElement, createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface M2S2AuthUser {
  userId:   string;
  username: string;
}

export interface M2S2AuthContextValue {
  user:     M2S2AuthUser | undefined;
  loggedIn: boolean;
  loading:  boolean;
  signOut(): Promise<void>;
}

export interface M2S2AuthProviderImpl {
  getCurrentUser(): Promise<M2S2AuthUser | undefined>;
  subscribeToAuthState(callback: (loggedIn: boolean) => void): () => void;
  signOut(): void | Promise<void>;
}

export interface AuthProviderProps {
  provider: M2S2AuthProviderImpl;
  children: ReactNode;
}

const AuthContext = createContext<M2S2AuthContextValue | null>(null);

export function AuthProvider({ provider, children }: AuthProviderProps) {
  const [user,     setUser]     = useState<M2S2AuthUser | undefined>(undefined);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    provider.getCurrentUser().then(u => {
      setUser(u);
      setLoggedIn(!!u);
      setLoading(false);
    });

    return provider.subscribeToAuthState(authenticated => {
      setLoggedIn(authenticated);
      if (!authenticated) setUser(undefined);
    });
  }, [provider]);

  async function signOut() {
    await provider.signOut();
    setUser(undefined);
    setLoggedIn(false);
  }

  return createElement(AuthContext.Provider, { value: { user, loggedIn, loading, signOut } }, children);
}

export function useAuth(): M2S2AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an <AuthProvider>');
  return ctx;
}
