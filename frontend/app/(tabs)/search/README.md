# 📚 Módulo de Búsqueda de Habilidades - Dokumentación Frontend

## Descripción General

Este módulo implementa la funcionalidad de búsqueda y filtrado de tutores en Kollaborate. Permite que los usuarios encuentren tutores por habilidad, filtren por modalidad, calificación y costo, vean el perfil de tutores y envíen solicitudes de sesión.

## 🏗️ Estructura del Proyecto

```
frontend/app/(tabs)/search/
├── index.tsx                    # Pantalla principal de búsqueda
├── profileresult.tsx            # Pantalla de perfil de tutor
├── _layout.tsx                  # Layout de navegación
├── components/
│   ├── Header.tsx              # Componente logo KOLLABORATE
│   ├── SearchBar.tsx           # Barra de búsqueda con filtros
│   └── TutorCard.tsx           # Tarjeta reutilizable de tutor
├── services/
│   └── apiService.ts           # Servicio centralizado de API
└── README.md                   # Este archivo
```

## 🔧 Componentes

### 1. **Header.tsx**
Componente reutilizable que muestra el logo y nombre de la aplicación.

**Props:**
```typescript
interface HeaderProps {
  title?: string;              // Título a mostrar (default: "KOLLABORATE")
  showLogo?: boolean;          // Mostrar logo (default: true)
}
```

**Uso:**
```typescript
import Header from './components/Header';

<Header title="KOLLABORATE" showLogo={true} />
```

---

### 2. **SearchBar.tsx**
Barra de búsqueda con filtros avanzados.

**Props:**
```typescript
interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterOptions) => void;
}

interface FilterOptions {
  modality: 'online' | 'presencial' | 'hibrido' | null;
  minRating: 'Bronce' | 'Plata' | 'Oro' | null;
  maxCost: number;
}
```

**Características:**
- 🔍 Búsqueda en tiempo real
- 🎚️ Filtros por modalidad (Online, Presencial, Híbrido)
- ⭐ Filtros por calificación (Bronce, Plata, Oro)
- 💰 Filtros por costo máximo
- 🔄 Opción de limpiar filtros

**Uso:**
```typescript
import SearchBar from './components/SearchBar';

const [filters, setFilters] = useState<FilterOptions>({
  modality: null,
  minRating: null,
  maxCost: 200,
});

<SearchBar
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  onSearch={handleSearch}
  onFilterChange={setFilters}
/>
```

---

### 3. **TutorCard.tsx**
Tarjeta reutilizable que muestra información de un tutor.

**Props:**
```typescript
interface TutorCardProps {
  id: number;
  name: string;
  skill: string;
  rating: 'Oro' | 'Plata' | 'Bronce';
  profileImage?: string;
  costPerSession?: number;
  onViewProfile: (tutorId: number, tutorName: string) => void;
}
```

**Información mostrada:**
- 👤 Foto de perfil
- 📝 Nombre del tutor
- 🎓 Habilidad principal
- ⭐ Calificación (5 estrellas dinámicas)
- 💰 Costo por sesión
- 🔗 Botón "Ver Perfil"

**Uso:**
```typescript
import TutorCard from './components/TutorCard';

<TutorCard
  id={1}
  name="@AlexDev"
  skill="React Native"
  rating="Oro"
  costPerSession={50}
  onViewProfile={(id, name) => navigateToProfile(id, name)}
/>
```

---

### 4. **index.tsx - Pantalla de Búsqueda**
Pantalla principal que integra todos los componentes.

**Características:**
- ✅ Tutores destacados por defecto
- ✅ Categorías populares
- ✅ Búsqueda en tiempo real
- ✅ Navegación a perfil del tutor
- ✅ Estado de carga
- ✅ Mensajes de estado vacío

**Estados de la pantalla:**
1. **Inicial**: Muestra categorías populares y tutores destacados
2. **Búsqueda activa**: Muestra resultados filtrados
3. **Sin resultados**: Mensaje amigable sugiriendo otras búsquedas

---

### 5. **profileresult.tsx - Perfil del Tutor**
Pantalla para visualizar el perfil del tutor y enviar solicitud de sesión.

**Funcionalidades:**
- 📋 Ver información del tutor (nombre, institución, calificación)
- 🎓 Seleccionar habilidad a aprender
- 📱 Elegir modalidad (Online/Presencial/Híbrido)
- 📅 Seleccionar fecha de la sesión
- 💰 Costo de la sesión (tokens)
- 📤 Enviar solicitud de sesión
- 🔄 Cancelar solicitud

**Validaciones:**
- Requiere fecha seleccionada
- Valida conexión con API
- Manejo de errores con alertas

---

## 🔌 API Service

El archivo `services/apiService.ts` centraliza todas las llamadas a la API del backend.

### Endpoints disponibles:

#### **SKILLS & SEARCH**
```typescript
// Obtener todas las habilidades
getSkills() → Promise<Skill[]>

// Encontrar tutores que coinciden con búsqueda
findMatches(userId: number) → Promise<Tutor[]>

// Agregar habilidad que ofrece el usuario
addSkillOffer(userId: number, skillId: number) → Promise<Response>

// Agregar habilidad que busca el usuario
addSkillWant(userId: number, skillId: number) → Promise<Response>
```

#### **USER PROFILE**
```typescript
// Obtener perfil de usuario
getUserProfile(userId: number) → Promise<UserProfile>

// Actualizar perfil de usuario
updateUserProfile(userId: number, data: object) → Promise<UserProfile>
```

#### **SESSION/INTERCAMBIO**
```typescript
// Crear solicitud de sesión
createSessionRequest(data: {
  fromUserId: number;
  toUserId: number;
  skillOffered: string;
  skillWanted: string;
  modality: 'online' | 'presencial' | 'hibrido';
  scheduledDate: string;    // ISO format
  cost: number;
}) → Promise<Session>

// Obtener mis solicitudes enviadas
getMySessionRequests(userId: number) → Promise<Session[]>

// Obtener solicitudes recibidas
getReceivedSessionRequests(userId: number) → Promise<Session[]>

// Aceptar solicitud
acceptSessionRequest(requestId: number) → Promise<Session>

// Rechazar solicitud
rejectSessionRequest(requestId: number) → Promise<Session>
```

---

## 🎨 Estilos y Temas

### Paleta de colores:
```typescript
Primary:      '#ff743dff'  // Naranja
Success:      '#4CAF50'    // Verde
Background:   '#f8f9fa'    // Gris claro
Text:         '#333'       // Gris oscuro
Secondary:    '#999'       // Gris medio
Error:        '#ff4444'    // Rojo

Gold:   '#FFD700'   // Oro (rating)
Silver: '#C0C0C0'   // Plata (rating)
Bronze: '#CD7F32'   // Bronce (rating)
```

### Fuentes:
- **Bold**: fontWeight: 'bold' (800)
- **SemiBold**: fontWeight: '600'
- **Regular**: fontWeight: '500'
- **Light**: fontWeight: 'normal'

---

## 📱 Flujo de Navegación

```
┌─────────────────────────────────────┐
│   Search (index.tsx)                │
│  - Categorías Populares             │
│  - Tutores Destacados               │
└──────────┬──────────────────────────┘
           │
           ├─→ [Clic en categoría]
           │   ↓
           │  Búsqueda activada
           │   ↓
           │  Mostrar resultados
           │
           ├─→ [Clic en "Ver Perfil"]
           │   ↓
┌───────────┴──────────────────────────┐
│  Profile Result (profileresult.tsx)  │
│  - Info del Tutor                   │
│  - Formulario de Solicitud           │
│  - Botones Enviar/Cancelar           │
└──────────────────────────────────────┘
           │
           ├─→ [Clic "Enviar Solicitud"]
           │   ↓
           │  Llamar API
           │  createSessionRequest()
           │   ↓
           │  Volver a Search
           │
           └─→ [Clic "Cancelar"]
               ↓
              Volver atrás
```

---

## 🚀 Configuración Inicial

### Variables de entorno

Crear archivo `.env` en la raíz del frontend:

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

O para producción:
```bash
EXPO_PUBLIC_API_URL=https://api.kollaborate.com/api
```

### Instalación de dependencias

```bash
cd frontend
npm install
# o
yarn install
```

---

## 🧪 Testing

### Ejemplo de integración con Mock Data

El componente Search incluye data mock para desarrollo sin necesidad del backend:

```typescript
const tutoresDestacados: Tutor[] = [
  {
    userId: 1,
    name: '@AlexDev',
    skill: 'React Native',
    rating: 'Oro',
    costPerSession: 50,
  },
  // ...más tutores
];
```

### Para usar la API real:

1. Asegúrate que el backend esté corriendo en `http://localhost:3000`
2. Reemplaza las llamadas mock con las del `apiService`
3. Actualiza los IDs de usuario según tu sistema de autenticación

---

## 🐛 Troubleshooting

### Problema: No se cargan los tutores
**Solución:**
- Verifica que el backend esté corriendo
- Comprueba la URL de la API en `apiService.ts`
- Revisa la consola del navegador (F12) para errores de CORS

### Problema: Las imágenes de perfil no se muestran
**Solución:**
- Las imágenes usan `ProfileIcon` como placeholder
- Para imágenes reales, proporciona URL en `profileImage` prop
- Asegúrate de que las URLs sean accesibles

### Problema: Fechas no seleccionan correctamente
**Solución:**
- El picker funciona diferente en iOS y Android
- En iOS se muestra modal, en Android spinner
- Prueba en ambas plataformas

---

## 📚 Datos esperados del Backend

### DTO: User
```typescript
{
  id: number;
  email: string;
  name: string;
  institution?: string;
  rating?: 'Oro' | 'Plata' | 'Bronce';
}
```

### DTO: Skill
```typescript
{
  id: number;
  name: string;
}
```

### DTO: UserSkillOffer
```typescript
{
  userId: number;
  skillId: number;
  modality?: 'online' | 'presencial' | 'hibrido';
  costPerSession?: number;
  rating?: string;
}
```

### DTO: Session/Intercambio
```typescript
{
  id: number;
  fromUserId: number;
  toUserId: number;
  skillOffered: string;
  skillWanted: string;
  modality: 'online' | 'presencial' | 'hibrido';
  scheduledDate: string;
  cost: number;
  status: 'pendiente' | 'aceptado' | 'rechazado';
}
```

---

## 🔐 Seguridad

**Nota importante:** 
- Los IDs de usuario están hardcodeados en el ejemplo (userId: 1)
- Reemplaza con el ID del usuario autenticado desde tu contexto de autenticación
- Implementa tokens JWT para autenticar las solicitudes al backend

---

## 📝 Próximas Mejoras

- [ ] Integración con sistema de autenticación
- [ ] Paginación de resultados
- [ ] Búsqueda avanzada (filtros múltiples simultáneos)
- [ ] Cache de resultados
- [ ] Favoritos/Guardar tutores
- [ ] Reseñas y comentarios
- [ ] Historial de búsquedas
- [ ] Recomendaciones personalizadas

---

## 📞 Contacto y Soporte

Para reportar bugs o sugerencias, contacta al equipo de desarrollo de Kollaborate.

---

**Versión:** 1.0.0  
**Última actualización:** Abril 2026  
**Autor:** Frontend Team Kollaborate
