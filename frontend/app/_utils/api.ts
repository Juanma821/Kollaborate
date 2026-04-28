import Constants from 'expo-constants';
import { Platform } from 'react-native';

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  token?: string;
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

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

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
  institucion_id?: number | null;
}) =>
  request<AuthUser>('/auth/register', {
    method: 'POST',
    body: payload,
  });

export const getInstitutionsRequest = () =>
  request<Institution[]>('/institutions', {
    method: 'GET',
  });

export const forgotPasswordRequest = (email: string) =>
  request<{ success: boolean; message: string; codigo?: string }>('/auth/forgot-password', {
    method: 'POST',
    body: { email },
  });

export const resetPasswordRequest = (email: string, codigo: string, newPassword: string) =>
  request<{ success: boolean; message: string }>('/auth/reset-password', {
    method: 'PUT',
    body: { email, codigo, newPassword },
  });

export const changePasswordRequest = (
  token: string,
  currentPassword: string,
  newPassword: string
) =>
  request<{ success: boolean; message: string }>('/users/change-password', {
    method: 'PUT',
    token,
    body: { currentPassword, newPassword },
  });

export type UserProfile = {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  alias: string;
  rol?: string;
  institucion_id?: number | null;
  institucion_nombre?: string | null;
  fecha_nacimiento?: string | null;
  ofrezco?: { id: number; nombre: string }[];
  busco?: { id: number; nombre: string }[];
};

export const getUserProfileRequest = (token: string, userId: number) =>
  request<UserProfile>(`/users/${userId}`, {
    method: 'GET',
    token,
  });

export const updateUserProfileRequest = (
  token: string,
  userId: number,
  payload: {
    nombre: string;
    apellido: string;
    alias: string;
    email?: string;
    institucion_id?: number | null;
    fecha_nacimiento?: string | null;
  }
) =>
  request<UserProfile>(`/users/${userId}`, {
    method: 'PUT',
    token,
    body: payload,
  });

export type MatchItem = {
  id: number;
  nombre: string;
  apellido: string;
  alias: string;
  habilidades: string[];
};

export type MatchProfile = {
  id: number;
  nombre: string;
  apellido: string;
  alias: string;
  reputacion: number;
  rol?: string;
  institucion_nombre?: string | null;
  ofrezco: { id: number; nombre: string }[];
  busco: { id: number; nombre: string }[];
};

export const getMatchesRequest = (token: string) =>
  request<MatchItem[]>('/match', {
    method: 'GET',
    token,
  });

export const getMatchProfileRequest = (token: string, userId: number) =>
  request<MatchProfile>(`/match/${userId}`, {
    method: 'GET',
    token,
  });

export const createSolicitudRequest = (
  token: string,
  payload: {
    receptor_id: number;
    habilidad_id: number;
  }
) =>
  request<{ id: number; message: string }>('/solicitudes', {
    method: 'POST',
    token,
    body: payload,
  });

  export type SolicitudItem = {
  id: number;
  usuario: string;
  habilidad: string;
  estado_id: number;
  fecha: string;
};

export type SolicitudesResponse = {
  recibidas: SolicitudItem[];
  enviadas: SolicitudItem[];
};

export const getSolicitudesRequest = (token: string) =>
  request<SolicitudesResponse>('/solicitudes', {
    method: 'GET',
    token,
  });

export const aceptarSolicitudRequest = (token: string, solicitudId: number) =>
  request<{ message: string }>(`/solicitudes/${solicitudId}/aceptar`, {
    method: 'PUT',
    token,
  });

export const rechazarSolicitudRequest = (token: string, solicitudId: number) =>
  request<{ message: string }>(`/solicitudes/${solicitudId}/rechazar`, {
    method: 'PUT',
    token,
  });


