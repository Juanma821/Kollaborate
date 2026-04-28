import * as SecureStore from 'expo-secure-store';
import type { AuthUser } from './api';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const saveAuthSession = async (token: string, user: AuthUser) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
};

export const clearAuthSession = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
};
