import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSessionCoordinator } from './sessionCoordinator';
import { tokenRepository } from './tokenRepository';
import { httpClient } from './httpClient';
import { useAuthStore } from '../stores/authStore';
import { useAppStore } from '../store/useAppStore';
import { setAccountOwner } from './accountScope';
export type { LoginChallenge } from './sessionCoordinator';
export const sessionCoordinator = createSessionCoordinator({
  http: httpClient,
  repository: tokenRepository,
  clearLegacy: () => AsyncStorage.removeItem('gdes-auth-session'),
  onChange: (state) => useAuthStore.setState(state),
  onAccountChange: (ownerId) => {
    setAccountOwner(ownerId);
    useAppStore.getState().resetAccount();
  },
});
export const login = sessionCoordinator.login;
export const verifyOTP = sessionCoordinator.verify;
export const resendOTP = sessionCoordinator.resend;
export const logout = sessionCoordinator.logout;
export const bootstrapSession = sessionCoordinator.bootstrap;
/** Transporte autenticado único para consumidores M-04/M-06; conserva HTTP común. */
export const authenticatedRequest = sessionCoordinator.request;
