import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface M2S2AuthUser {
  userId: string;
  username: string;
}

export interface M2S2AuthProvider {
  loggedIn$: Observable<boolean>;
  getCurrentUser(): Promise<M2S2AuthUser | undefined>;
  signOut(): void | Promise<void>;
}

export const M2S2_AUTH_PROVIDER = new InjectionToken<M2S2AuthProvider>('M2S2AuthProvider');
