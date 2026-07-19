import { inject, type InjectionKey } from "vue";

export interface M2S2AuthUser {
  userId: string;
  username: string;
}

export interface M2S2AuthContext {
  user: M2S2AuthUser | undefined;
  loggedIn: boolean;
  loading: boolean;
  signOut(): Promise<void>;
}

export interface M2S2AuthProviderImpl {
  getCurrentUser(): Promise<M2S2AuthUser | undefined>;
  subscribeToAuthState(callback: (loggedIn: boolean) => void): () => void;
  signOut(): void | Promise<void>;
}

export const AUTH_KEY: InjectionKey<M2S2AuthContext> = Symbol("auth");

export function useAuth(): M2S2AuthContext {
  const ctx = inject(AUTH_KEY);
  if (!ctx) throw new Error("useAuth must be used within an <AuthProvider>");
  return ctx;
}
