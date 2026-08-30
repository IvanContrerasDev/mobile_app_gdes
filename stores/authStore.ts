import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Auth user model
export interface AuthUser {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  legajo: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  // Indicates whether the persisted session has finished loading
  hydrated: boolean;
}

export interface AuthActions {
  login: (user: AuthUser) => void;
  logout: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      hydrated: false,

      // Actions
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "gdes-auth-session",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the session-related fields
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Mark hydration complete once persisted state is loaded
        state?.setHydrated(true);
      },
    }
  )
);
