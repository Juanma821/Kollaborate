/**
 * API Service para consumir endpoints del backend de Kollaborate
 * Contiene todas las llamadas relacionadas con búsqueda, tutores y sesiones
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// ========================
// SKILLS & SEARCH ENDPOINTS
// ========================

/**
 * Obtiene todas las habilidades disponibles
 */
export const getSkills = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/skills`);
    if (!response.ok) throw new Error('Error fetching skills');
    return await response.json();
  } catch (error) {
    console.error('getSkills error:', error);
    throw error;
  }
};

/**
 * Busca tutores que ofrecen las habilidades que busca el usuario
 * @param userId - ID del usuario que busca
 */
export const findMatches = async (userId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/match/${userId}`);
    if (!response.ok) throw new Error('Error finding matches');
    return await response.json();
  } catch (error) {
    console.error('findMatches error:', error);
    throw error;
  }
};

/**
 * Registra que un usuario ofrece una habilidad
 * @param userId - ID del usuario
 * @param skillId - ID de la habilidad
 */
export const addSkillOffer = async (userId: number, skillId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/skills/${userId}/offer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillId }),
    });
    if (!response.ok) throw new Error('Error adding skill offer');
    return await response.json();
  } catch (error) {
    console.error('addSkillOffer error:', error);
    throw error;
  }
};

/**
 * Registra que un usuario busca una habilidad
 * @param userId - ID del usuario
 * @param skillId - ID de la habilidad
 */
export const addSkillWant = async (userId: number, skillId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/skills/${userId}/want`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillId }),
    });
    if (!response.ok) throw new Error('Error adding skill want');
    return await response.json();
  } catch (error) {
    console.error('addSkillWant error:', error);
    throw error;
  }
};

// ========================
// USER PROFILE ENDPOINTS
// ========================

/**
 * Obtiene los datos del perfil de un usuario
 * @param userId - ID del usuario
 */
export const getUserProfile = async (userId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!response.ok) throw new Error('Error fetching user profile');
    return await response.json();
  } catch (error) {
    console.error('getUserProfile error:', error);
    throw error;
  }
};

/**
 * Actualiza el perfil de un usuario
 * @param userId - ID del usuario
 * @param data - Datos a actualizar
 */
export const updateUserProfile = async (
  userId: number,
  data: {
    name?: string;
    email?: string;
    institution?: string;
    rating?: 'Oro' | 'Plata' | 'Bronce';
    modalities?: ('online' | 'presencial' | 'hibrido')[];
    costPerSession?: number;
  }
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error updating user profile');
    return await response.json();
  } catch (error) {
    console.error('updateUserProfile error:', error);
    throw error;
  }
};

// ========================
// SESSION/INTERCAMBIO ENDPOINTS
// ========================

/**
 * Crea una solicitud de sesión/intercambio
 * @param data - Datos de la solicitud
 */
export const createSessionRequest = async (data: {
  fromUserId: number;
  toUserId: number;
  skillOffered: string;
  skillWanted: string;
  modality: 'online' | 'presencial' | 'hibrido';
  scheduledDate: string; // ISO format: "2026-04-25"
  cost: number; // En tokens
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/intercambios/solicitar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error creating session request');
    return await response.json();
  } catch (error) {
    console.error('createSessionRequest error:', error);
    throw error;
  }
};

/**
 * Obtiene las solicitudes enviadas por un usuario
 * @param userId - ID del usuario
 */
export const getMySessionRequests = async (userId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/intercambios/mis-solicitudes/${userId}`);
    if (!response.ok) throw new Error('Error fetching my requests');
    return await response.json();
  } catch (error) {
    console.error('getMySessionRequests error:', error);
    throw error;
  }
};

/**
 * Obtiene las solicitudes recibidas por un usuario
 * @param userId - ID del usuario
 */
export const getReceivedSessionRequests = async (userId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/intercambios/recibidas/${userId}`);
    if (!response.ok) throw new Error('Error fetching received requests');
    return await response.json();
  } catch (error) {
    console.error('getReceivedSessionRequests error:', error);
    throw error;
  }
};

/**
 * Acepta una solicitud de sesión
 * @param requestId - ID de la solicitud
 */
export const acceptSessionRequest = async (requestId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/intercambios/aceptar/${requestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Error accepting request');
    return await response.json();
  } catch (error) {
    console.error('acceptSessionRequest error:', error);
    throw error;
  }
};

/**
 * Rechaza una solicitud de sesión
 * @param requestId - ID de la solicitud
 */
export const rejectSessionRequest = async (requestId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/intercambios/rechazar/${requestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Error rejecting request');
    return await response.json();
  } catch (error) {
    console.error('rejectSessionRequest error:', error);
    throw error;
  }
};

// ========================
// HEALTH CHECK
// ========================

/**
 * Verifica la salud del servidor
 */
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};
