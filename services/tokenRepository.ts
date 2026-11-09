import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SessionRepository } from './sessionCoordinator';
const KEY = 'gdes.secure-session.v1';
const INVALIDATED = 'gdes.secure-session.invalidated.v1';
// AsyncStorage contiene únicamente una marca de invalidación, nunca tokens/identidad.
// Impide restauración tras logout incluso si SecureStore no permite borrar estando bloqueado.
export const tokenRepository: SessionRepository = {
  async read() {
    if (await AsyncStorage.getItem(INVALIDATED) !== null) return null;
    const raw = await SecureStore.getItemAsync(KEY);
    return raw === null ? null : JSON.parse(raw);
  },
  async write(value) {
    await AsyncStorage.setItem(INVALIDATED, 'true');
    // Un solo JSON evita combinar access/refresh de rotaciones distintas.
    await SecureStore.setItemAsync(KEY, JSON.stringify(value), { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY });
    await AsyncStorage.removeItem(INVALIDATED);
  },
  async clear() {
    let markerError: unknown;
    try { await AsyncStorage.setItem(INVALIDATED, 'true'); } catch (error) { markerError = error; }
    // Intentar también el borrado nativo si falla el almacenamiento de la marca.
    await SecureStore.deleteItemAsync(KEY);
    if (markerError) throw markerError;
  },
};
