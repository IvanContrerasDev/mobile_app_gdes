import type { AccountScope } from './accountPreferences';
let scope: AccountScope = { ownerId: null };
export const getAccountScope = () => scope;
// Cada transición reemplaza el objeto para descartar lecturas de generaciones anteriores.
export function setAccountOwner(ownerId: string | null) { scope = { ownerId }; }
