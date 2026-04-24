# 🚀 GUÍA RÁPIDA - Módulo de Búsqueda

## Estructura de Archivos

```
frontend/app/(tabs)/search/
├── 📄 index.tsx                   ← PANTALLA PRINCIPAL (Búsqueda)
├── 📄 profileresult.tsx           ← PANTALLA TUTOR (Perfil)
├── 📄 _layout.tsx                 ← Navegación (sin cambios)
│
├── 📁 components/
│   ├── 🎨 Header.tsx              ← Logo KOLLABORATE
│   ├── 🔍 SearchBar.tsx           ← Barra búsqueda + filtros
│   └── 👤 TutorCard.tsx           ← Tarjeta tutor reutilizable
│
├── 📁 services/
│   └── 🌐 apiService.ts           ← Llamadas a backend
│
├── 📁 types/
│   └── 📋 index.ts                ← Tipos TypeScript
│
└── 📁 docs/
    ├── 📖 README.md               ← Documentación completa
    ├── ✅ IMPLEMENTACION.md        ← Resumen de lo hecho
    ├── 🔗 integration-guide.tsx    ← Cómo integrar
    └── 🚀 QUICK-START.md          ← Este archivo
```

---

## Importaciones Comunes

### Componentes:
```typescript
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import TutorCard from './components/TutorCard';
```

### Servicios:
```typescript
import {
  getSkills,
  findMatches,
  getUserProfile,
  createSessionRequest,
  getMySessionRequests,
  acceptSessionRequest,
  rejectSessionRequest
} from './services/apiService';
```

### Tipos:
```typescript
import type {
  User,
  TutorProfile,
  Skill,
  FilterOptions,
  SearchResult,
  SessionRequest,
  Rating,
  Modality
} from './types';
```

---

## Componentes Clave

### **Header**
```typescript
<Header 
  title="KOLLABORATE" 
  showLogo={true} 
/>
```

### **SearchBar**
```typescript
<SearchBar
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  onSearch={handleSearch}
  onFilterChange={setFilters}
/>
```

### **TutorCard**
```typescript
<TutorCard
  id={tutor.userId}
  name={tutor.name}
  skill={tutor.skill}
  rating="Oro"
  costPerSession={50}
  onViewProfile={handleViewProfile}
/>
```

---

## Llamadas API Más Comunes

### Buscar Tutores:
```typescript
const matches = await findMatches(currentUserId);
```

### Obtener Perfil de Tutor:
```typescript
const profile = await getUserProfile(tutorId);
```

### Crear Solicitud de Sesión:
```typescript
await createSessionRequest({
  fromUserId: 1,
  toUserId: 2,
  skillOffered: "Diseño",
  skillWanted: "React Native",
  modality: "online",
  scheduledDate: "2026-04-25",
  cost: 50
});
```

### Obtener Mis Solicitudes:
```typescript
const requests = await getMySessionRequests(currentUserId);
```

### Aceptar/Rechazar Solicitud:
```typescript
await acceptSessionRequest(requestId);
await rejectSessionRequest(requestId);
```

---

## Variables de Entorno

Crear `.env` en `frontend/`:
```bash
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

O para producción:
```bash
EXPO_PUBLIC_API_URL=https://api.kollaborate.com/api
```

---

## Colores de la Aplicación

```typescript
// Primarios
#ff743dff  // Naranja (primario)
#4CAF50    // Verde (éxito)

// Fondos
#f8f9fa    // Gris muy claro
#f5f5f5    // Gris claro
#fff       // Blanco

// Texto
#333       // Oscuro
#666       // Medio
#999       // Claro

// Ratings
#FFD700    // Oro
#C0C0C0    // Plata
#CD7F32    // Bronce
```

---

## Estados y Props

### FilterOptions:
```typescript
{
  modality: 'online' | 'presencial' | 'hibrido' | null,
  minRating: 'Bronce' | 'Plata' | 'Oro' | null,
  maxCost: number
}
```

### Tutor:
```typescript
{
  userId: number,
  name: string,
  skill: string,
  rating?: 'Bronce' | 'Plata' | 'Oro',
  costPerSession?: number,
  profileImage?: string
}
```

### SessionRequest:
```typescript
{
  id: number,
  fromUserId: number,
  toUserId: number,
  skillOffered: string,
  skillWanted: string,
  modality: 'online' | 'presencial' | 'hibrido',
  scheduledDate: string,  // YYYY-MM-DD
  cost: number,
  status: 'pendiente' | 'aceptado' | 'rechazado'
}
```

---

## Hooks Útiles

### useSearchTutors (en integration-guide.tsx):
```typescript
const { tutores, loading, filters, setFilters, searchTutors } = 
  useSearchTutors(userId);
```

### useUserProfile:
```typescript
const { profile, loading, error, refetch } = 
  useUserProfile(tutorId);
```

### useCreateSession:
```typescript
const { createSession, loading, error } = useCreateSession();
```

---

## Navegación

### Ir a Perfil de Tutor:
```typescript
router.push({
  pathname: '/search/profileresult',
  params: { tutorId: 2, tutorName: '@AlexDev' }
});
```

### Ir a Búsqueda:
```typescript
router.push('/search');
```

### Volver Atrás:
```typescript
router.back();
```

---

## Errores Comunes

| Problema | Solución |
|----------|----------|
| No se carga perfil del tutor | Verificar que backend está en http://localhost:3000 |
| Fechas no seleccionan | Probar en Android/iOS, datetimepicker tiene comportamiento diferente |
| API devuelve 404 | Verificar userId en la URL es correcto |
| Estilos raros | Limpiar cache: `expo start --clear` |
| Componentes no se renderizan | Verificar imports están correctos |

---

## Checklist de Implementación

- [ ] Backend está corriendo en port 3000
- [ ] Variables de entorno configuradas
- [ ] userId es del usuario autenticado (no hardcodeado)
- [ ] Componentes importados correctamente
- [ ] Navegación enlazada entre pantallas
- [ ] Llamadas API funcionando
- [ ] Errores manejados con alertas
- [ ] Estilos aplicados correctamente

---

## Próximos Pasos

1. **Autenticación**: Reemplaza userId: 1 hardcodeado con userId del usuario logueado
2. **Backend**: Asegúrate que las APIs devuelven datos correctos
3. **Testing**: Prueba cada pantalla en Android e iOS
4. **Ajustes de Diseño**: Personaliza colores y espaciados según branding
5. **Deploy**: Genera APK/IPA y sube a store

---

## Comandos Útiles

```bash
# Iniciar desarrollo
npm start

# Abrir en iOS
npm run ios

# Abrir en Android
npm run android

# Limpiar cache
expo start --clear

# Limpiar node_modules
rm -rf node_modules && npm install

# Ver logs
expo logs

# Eject (si necesitas)
expo prebuild
```

---

## Documentación Completa

- 📖 [README.md](./README.md) - Documentación técnica completa
- 🔗 [integration-guide.tsx](./integration-guide.tsx) - Ejemplos de integración
- 📋 [types/index.ts](./types/index.ts) - Definiciones de tipos
- ✅ [IMPLEMENTACION.md](./IMPLEMENTACION.md) - Resumen de lo implementado

---

## Soporte

Para ayuda:
1. Revisa la documentación en `README.md`
2. Mira ejemplos en `integration-guide.tsx`
3. Verifica tipos en `types/index.ts`
4. Contacta al equipo de frontend

---

**¡Ya estás listo para empezar! 🚀**
