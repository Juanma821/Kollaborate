/**
 * Tipos y Interfaces para el módulo de búsqueda
 * Centraliza todas las definiciones de tipos TypeScript
 */

// ========================
// USER & PROFILE TYPES
// ========================

export interface User {
  id: number;
  email: string;
  name: string;
  institution?: string;
  rating?: Rating;
  profileImage?: string;
  modalities?: Modality[];
  costPerSession?: number;
}

export interface TutorProfile extends User {
  skillsOffered?: SkillWithDetails[];
  averageRating?: number;
  totalSessions?: number;
}

// ========================
// SKILL TYPES
// ========================

export interface Skill {
  id: number;
  name: string;
}

export interface SkillWithDetails extends Skill {
  modality?: Modality;
  costPerSession?: number;
  rating?: Rating;
  availability?: string[];
}

export interface UserSkillOffer {
  userId: number;
  skillId: number;
  modality?: Modality;
  costPerSession?: number;
  rating?: Rating;
}

export interface UserSkillWant {
  userId: number;
  skillId: number;
}

// ========================
// SESSION/INTERCAMBIO TYPES
// ========================

export interface SessionRequest {
  id: number;
  fromUserId: number;
  toUserId: number;
  skillOffered: string;
  skillWanted: string;
  modality: Modality;
  scheduledDate: string; // ISO format: YYYY-MM-DD
  cost: number; // en tokens
  status: SessionStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSessionRequestDTO {
  fromUserId: number;
  toUserId: number;
  skillOffered: string;
  skillWanted: string;
  modality: Modality;
  scheduledDate: string;
  cost: number;
}

// ========================
// SEARCH & FILTER TYPES
// ========================

export interface FilterOptions {
  modality: Modality | null;
  minRating: Rating | null;
  maxCost: number;
}

export interface SearchResult {
  userId: number;
  name: string;
  skill: string;
  rating?: Rating;
  profileImage?: string;
  costPerSession?: number;
  modality?: Modality;
}

// ========================
// ENUMS
// ========================

export enum Rating {
  Bronce = 'Bronce',
  Plata = 'Plata',
  Oro = 'Oro',
}

export type RatingType = 'Bronce' | 'Plata' | 'Oro';

export enum Modality {
  Online = 'online',
  Presencial = 'presencial',
  Hibrido = 'hibrido',
}

export type ModalityType = 'online' | 'presencial' | 'hibrido';

export enum SessionStatus {
  Pendiente = 'pendiente',
  Aceptado = 'aceptado',
  Rechazado = 'rechazado',
  Completado = 'completado',
  Cancelado = 'cancelado',
}

export type SessionStatusType = 
  | 'pendiente' 
  | 'aceptado' 
  | 'rechazado' 
  | 'completado' 
  | 'cancelado';

// ========================
// API RESPONSE TYPES
// ========================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

// ========================
// PAGINATION TYPES
// ========================

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// ========================
// COMPONENT PROP TYPES
// ========================

export interface HeaderProps {
  title?: string;
  showLogo?: boolean;
}

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterOptions) => void;
}

export interface TutorCardProps {
  id: number;
  name: string;
  skill: string;
  rating: RatingType;
  profileImage?: string;
  costPerSession?: number;
  onViewProfile: (tutorId: number, tutorName: string) => void;
}

// ========================
// CONTEXT/STATE TYPES
// ========================

export interface SearchContextType {
  searchQuery: string;
  filters: FilterOptions;
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setFilters: (filters: FilterOptions) => void;
  search: (query: string) => Promise<void>;
  clearSearch: () => void;
}

export interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadUser: (userId: number) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  logout: () => void;
}

// ========================
// UTILITY TYPES
// ========================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // milliseconds
}

// ========================
// MOCK DATA TYPES
// ========================

export interface MockDataSet {
  users: User[];
  skills: Skill[];
  userSkillsOffer: UserSkillOffer[];
  userSkillsWant: UserSkillWant[];
  sessions: SessionRequest[];
}
