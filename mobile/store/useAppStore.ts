import { create } from "zustand";

// Types
export interface User {
  id: string;
  name: string;
}

export type ActionType = "entrada" | "salida" | "ausencia";

export interface AppState {
  // User
  user: User | null;
  
  // Working status
  isWorking: boolean;
  
  // Current registration
  selectedWorkplace: string | null;
  selectedAction: ActionType | null;
  observation: string;
}

export interface AppActions {
  // User actions
  setUser: (user: User | null) => void;
  
  // Working status actions
  setWorkingStatus: (isWorking: boolean) => void;
  
  // Registration actions
  setWorkplace: (workplace: string | null) => void;
  setAction: (action: ActionType | null) => void;
  setObservation: (observation: string) => void;
  
  // Reset registration
  resetRegistration: () => void;
}

export type AppStore = AppState & AppActions;

const initialState: AppState = {
  user: null,
  isWorking: false,
  selectedWorkplace: null,
  selectedAction: "entrada",
  observation: "",
};

export const useAppStore = create<AppStore>((set) => ({
  // Initial state
  ...initialState,

  // User actions
  setUser: (user) => set({ user }),

  // Working status actions
  setWorkingStatus: (isWorking) => set({ isWorking }),

  // Registration actions
  setWorkplace: (selectedWorkplace) => set({ selectedWorkplace }),
  setAction: (selectedAction) => set({ selectedAction }),
  setObservation: (observation) => set({ observation }),

  // Reset registration to initial values
  resetRegistration: () =>
    set({
      selectedWorkplace: null,
      selectedAction: "entrada",
      observation: "",
    }),
}));
