import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAccountPreferences } from './accountPreferences';
import { getAccountScope } from './accountScope';
export const localPreferences = createAccountPreferences(AsyncStorage, getAccountScope);
