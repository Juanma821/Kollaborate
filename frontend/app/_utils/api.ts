import Constants from 'expo-constants';
import { Platform } from 'react-native';

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

export type AuthUser = {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  alias: string;
  rol?: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type Institution = {
  id: number;
  nombre: string;
};

const getApiBaseUrl = () => {
  const constants = Constants as unknown as {
    expoConfig?: { hostUri?: string };
    manifest2?: { extra?: { expoClient?: { hostUri?: string } } };
  };

  const hostUri =
    constants.expoConfig?.hostUri ||
    constants.manifest2?.extra?.expoClient?.hostUri ||
    '';

  const host = hostUri.split(':')[0];

  if (host) {
    return `http://${host}:3000/api`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  }

  return 'http://localhost:3000/api';
};

export const API_BASE_URL = getApiBaseUrl();

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
  }

  if (!response.ok) {
    const errorMessage =
      typeof data === 'object' && data !== null && 'error' in data
        ? String((data as { error: unknown }).error)
        : 'No se pudo completar la solicitud';

    throw new Error(errorMessage);
  }

  return data as T;
};

export const loginRequest = (email: string, password: string) =>
  request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });

export const registerRequest = (payload: {
  nombre: string;
  apellido: string;
  alias: string;
  email: string;
  password: string;
}) =>
  request<AuthUser>('/auth/register', {
    method: 'POST',
    body: payload,
  });

export const getInstitutionsRequest = () =>
  request<Institution[]>('/institutions', {
    method: 'GET',
  });
