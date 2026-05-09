# Kollaborate 🎓

Plataforma móvil de intercambio de habilidades entre estudiantes universitarios. Conecta a estudiantes que quieren enseñar con aquellos que quieren aprender, facilitando sesiones de tutoría entre pares mediante un sistema de tokens.

---

##  Características principales

- **Match de habilidades** — Conecta estudiantes según lo que ofrecen y buscan
- **Sistema de solicitudes** — Envía, acepta o rechaza solicitudes de sesión
- **Salón de sesiones** — Agenda y gestiona sesiones con calendario interactivo
- **Sistema de tokens** — Economía interna con recompensas diarias y streak
- **Reseñas** — Califica y comenta las sesiones completadas
- **Traductor** — Traductor integrado con soporte para 6 idiomas
- **Catálogo de habilidades** — Más de 45 habilidades universitarias organizadas por categoría

---

##  Stack tecnológico

### Frontend
- [React Native](https://reactnative.dev/) con [Expo](https://expo.dev/)
- [Expo Router](https://expo.github.io/router/) para navegación
- [TypeScript](https://www.typescriptlang.org/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) para animaciones
- [Expo Secure Store](https://docs.expo.dev/versions/latest/sdk/securestore/) para almacenamiento seguro

### Backend
- [Node.js](https://nodejs.org/) con [Express](https://expressjs.com/)
- [Oracle Database](https://www.oracle.com/database/) con [node-oracledb](https://oracle.github.io/node-oracledb/)
- [JWT](https://jwt.io/) para autenticación
- [bcrypt](https://www.npmjs.com/package/bcrypt) para hash de contraseñas

### API Externa
- [MyMemory Translation API](https://mymemory.translated.net/) para el traductor

---

##  Requisitos previos

- Node.js v18+
- Oracle Database 19c+
- Oracle Instant Client
- Expo CLI
- Android Studio o dispositivo físico Android

---

##  Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tuusuario/kollaborate.git
cd kollaborate
```

### 2. Configurar el backend

```bash
cd backend
npm install
```

Creá un archivo `.env` en la carpeta `backend`:

```env
PORT=3000
JWT_SECRET=tu_clave_secreta_aqui
DB_USER=tu_usuario_oracle
DB_PASSWORD=tu_contraseña_oracle
DB_CONNECTION_STRING=localhost:1521/XEPDB1
```

Iniciá el servidor:

```bash
node src/server.js
```

### 3. Configurar el frontend

```bash
cd frontend
npm install
```

Iniciá la app:

```bash
npx expo start
```

---

## 🗄️ Base de datos

El proyecto usa Oracle Database. Las tablas principales son:

| Tabla | Descripción |
|---|---|
| `usuarios` | Datos de los usuarios registrados |
| `habilidades` | Catálogo de habilidades disponibles |
| `usuario_habilidades` | Relación usuario-habilidad (ofrece/busca) |
| `solicitudes` | Solicitudes de match entre usuarios |
| `sesiones` | Sesiones programadas y completadas |
| `transacciones` | Historial de movimientos de tokens |
| `resenas` | Reseñas y calificaciones de sesiones |
| `estados` | Tabla de estados para solicitudes y sesiones |

### Estados del sistema

**Solicitudes:**
- `1` Pendiente
- `2` Aceptada
- `3` Rechazada

**Sesiones:**
- `4` Programada
- `5` Completada
- `6` Cancelada

---

##  Sistema de tokens

Los tokens son la moneda interna de Kollaborate:

| Acción | Tokens |
|---|---|
| Registro inicial | +50 |
| Login diario | +10 |
| Streak 7 días | +20 bonus |
| Sesión Básico | -10 |
| Sesión Intermedio | -15 |
| Sesión Avanzado | -25 |
| Sesión Experto | -35 |

---

##  Seguridad

- Autenticación con JWT (expira en 5 horas)
- Contraseñas hasheadas con bcrypt
- Validación de inputs en backend
- Token almacenado de forma segura con Expo SecureStore

---

##  Estructura del proyecto

kollaborate/
├── backend/
│   └── src/
│       ├── controllers/
│       ├── services/
│       ├── routes/
│       ├── middlewares/
│       ├── db.js
│       ├── app.js
│       └── server.js
└── frontend/
└── app/
├── (tabs)/
│   ├── home/
│   ├── search/
│   ├── mailbox/
│   ├── classroom/
│   └── profile/
└── _utils/
├── api.ts
└── authStorage.ts