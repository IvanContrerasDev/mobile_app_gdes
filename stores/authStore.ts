import { create } from 'zustand';
import type { SessionState } from '../services/sessionCoordinator';
export type { AuthUser } from '../services/sessionCoordinator';
// Estado de UI únicamente. Ningún booleano persistido puede instalar una identidad.
export const useAuthStore = create<SessionState>(() => ({ user: null, isAuthenticated: false, hydrated: false, error: null }));
