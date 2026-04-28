import * as SecureStore from 'expo-secure-store';
import type { AuthUser } from './api';

export type StoredUser = AuthUser & {
  institucion_id?: number | null;
  institucion_nombre?: string | null;
};

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const RECOVERY_EMAIL_KEY = 'recovery_email';
const RECOVERY_CODE_KEY = 'recovery_code';

export const saveAuthSession = async (token: string, user: AuthUser) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
};

export const getToken = async () => {
  return SecureStore.getItemAsync(TOKEN_KEY);
};

export const getStoredUser = async (): Promise<StoredUser | null> => {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
};

export const updateStoredUser = async (user: StoredUser) => {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
};


export const clearAuthSession = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
};

export const saveRecoveryEmail = async (email: string) => {
  await SecureStore.setItemAsync(RECOVERY_EMAIL_KEY, email);
};

export const getRecoveryEmail = async () => {
  return SecureStore.getItemAsync(RECOVERY_EMAIL_KEY);
};

export const saveRecoveryCode = async (code: string) => {
  await SecureStore.setItemAsync(RECOVERY_CODE_KEY, code);
};

export const getRecoveryCode = async () => {
  return SecureStore.getItemAsync(RECOVERY_CODE_KEY);
};

export const clearRecoveryData = async () => {
  await SecureStore.deleteItemAsync(RECOVERY_EMAIL_KEY);
  await SecureStore.deleteItemAsync(RECOVERY_CODE_KEY);
};

