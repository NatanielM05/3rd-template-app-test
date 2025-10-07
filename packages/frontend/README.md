# @app/frontend - Web Frontend

## Zweck

Dieses Package enthält das **Web-Frontend** der Anwendung.

**Single-Page-Application** für End-User mit React & Vite.

---

## 📋 Package Contract (API-Schnittstellen)

### Bereitgestellte Endpoints

**Static Files** (via Vite Dev Server / S3 + CloudFront):
```
GET /                              → SPA Entry Point
GET /assets/*                      → Static Assets (JS, CSS, Images)
```

**⚠️ WICHTIG**: Dieses Package stellt keine Backend-APIs bereit!

### Konsumierte APIs

- **Backend API** (`packages/api/`):
  - **Alle Endpoints aus** `packages/openapi/openapi.yaml`
  - KI soll API-Clients basierend auf OpenAPI-Spec generieren

- **@app/openapi** (`packages/openapi/`):
  ```typescript
  // TypeScript Types aus openapi.yaml generieren
  import type { ... } from '@app/openapi';
  ```

### Exportierte Interfaces

Dieses Package exportiert **keine Interfaces** (wird als Static Site deployed).

### Environment Variables

```bash
VITE_API_URL=http://localhost:3001        # Backend API URL
VITE_API_TIMEOUT=30000                     # Request Timeout (ms)
```

---

## 🛠️ Technologie-Stack

### Core
- **React 18.3** - UI Library mit Hooks, Concurrent Features
- **TypeScript 5.6** - Type Safety (strict mode)
- **Vite 5** - Build Tool & Dev Server

### Routing & Navigation
- **React Router 6** - Client-side Routing
  - `react-router-dom` package
  - Nested Routes, Protected Routes, Dynamic Routes

### State Management
- **Zustand** - Lightweight State Management
  - Für **Global Client State** (Auth, Theme, UI-State)
  - Middleware: `persist` für localStorage
- **TanStack Query (React Query)** - Server State Management
  - Für **API-Calls mit Caching**
  - Optimistic Updates, Auto-Refetch

### API Integration
- **Axios** - HTTP Client
  - Request/Response Interceptors (Auth, Error Handling)
  - BaseURL, Timeout Configuration

### Styling
- **Tailwind CSS 3** - Utility-First CSS Framework
- **CSS Modules** - Component-scoped Styles (optional)

### Forms & Validation
- **React Hook Form** - Performantes Form Management
- **Zod** - Schema Validation (Runtime + Type Safety)

### Testing
- **Vitest** - Unit & Integration Tests
- **Testing Library (React)** - Component Testing
- **@testing-library/jest-dom** - Custom Matchers

---

## 📁 Projekt-Setup (von KI zu erstellen)

### 1. index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 2. vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

### 3. tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 4. tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### 5. tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // KI soll Farben basierend auf App-Design hinzufügen
      },
    },
  },
  plugins: [],
}
```

### 6. postcss.config.js

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## 📂 Ordnerstruktur (EXAKT so umsetzen)

```
packages/frontend/
├── public/                 → Static Assets (Favicon, Images)
├── src/
│   ├── main.tsx            → App Entry Point (QueryClient Setup)
│   ├── App.tsx             → Root Component mit Router
│   │
│   ├── components/         → Wiederverwendbare UI-Komponenten
│   │   ├── common/         → Generic UI Components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ... (weitere generische Komponenten)
│   │   │
│   │   └── features/       → Feature-spezifische Komponenten
│   │       └── ... (KI erstellt basierend auf App-Logik)
│   │
│   ├── pages/              → Route Pages (1 Page = 1 Route)
│   │   └── ... (KI erstellt basierend auf Routes)
│   │
│   ├── layouts/            → Layout-Komponenten
│   │   └── MainLayout.tsx  → Shared Layout (Header, Sidebar, Footer)
│   │
│   ├── hooks/              → Custom React Hooks
│   │   ├── useAuth.ts      → Auth-Logik (Login, Logout, Check)
│   │   └── ... (KI erstellt API-Hooks für jedes openapi.yaml Endpoint)
│   │
│   ├── services/           → API-Clients
│   │   └── api.ts          → Axios Instance mit Interceptors
│   │
│   ├── stores/             → Zustand Stores
│   │   ├── authStore.ts    → Auth State (user, token, login, logout)
│   │   ├── themeStore.ts   → Theme State (dark/light mode)
│   │   └── ... (weitere global states)
│   │
│   ├── types/              → TypeScript Types
│   │   └── index.ts        → Re-export from @app/openapi
│   │
│   ├── utils/              → Hilfs-Funktionen
│   │   └── ... (formatDate, validators, etc.)
│   │
│   └── styles/             → Globale Styles
│       └── index.css       → Tailwind Imports + Custom CSS
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🔧 Implementation-Patterns

### 1. Entry Point Pattern

**File**: `src/main.tsx`

**Purpose**: React App initialisieren + QueryClient Setup

**Pattern**:
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import './styles/index.css';

// QueryClient mit Default-Config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
```

**KI soll**: Diesen Entry Point genau so erstellen.

---

### 2. Router Setup Pattern

**File**: `src/App.tsx`

**Purpose**: Routing mit React Router + Protected Routes

**Pattern**:
```tsx
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { useAuthStore } from './stores/authStore';
// Pages importieren

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            {/* KI soll Routes basierend auf App-Logik erstellen */}
            <Route index element={<DashboardPage />} />
            <Route path="..." element={<...Page />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// Protected Route Wrapper
function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
}
```

**KI soll**: Routes basierend auf App-Anforderungen generieren.

---

### 3. Axios Instance Pattern

**File**: `src/services/api.ts`

**Purpose**: Zentraler HTTP Client mit Interceptors

**Pattern**:
```typescript
import axios from 'axios';

// Axios Instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - JWT Token hinzufügen
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logout on 401 Unauthorized
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**KI soll**:
- Diesen API-Client genau so erstellen
- Weitere Interceptor-Logik basierend auf App-Anforderungen hinzufügen

---

### 4. TanStack Query Pattern

**File**: `src/hooks/use[Resource].ts` (z.B. `useUsers.ts`, `useTodos.ts`)

**Purpose**: API-Calls mit Caching, Optimistic Updates

**Pattern für GET (Read)**:
```typescript
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { ResourceType } from '@app/openapi';

export const useResources = () => {
  return useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const { data } = await api.get<ResourceType[]>('/api/v1/resources');
      return data;
    },
  });
};

// Mit ID
export const useResource = (id: string) => {
  return useQuery({
    queryKey: ['resource', id],
    queryFn: async () => {
      const { data } = await api.get<ResourceType>(`/api/v1/resources/${id}`);
      return data;
    },
    enabled: !!id, // Nur fetchen wenn ID vorhanden
  });
};
```

**Pattern für POST/PUT/DELETE (Write)**:
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { ResourceType, CreateResourceRequest } from '@app/openapi';

export const useCreateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateResourceRequest) => {
      const { data } = await api.post<ResourceType>('/api/v1/resources', payload);
      return data;
    },
    onSuccess: () => {
      // Cache invalidieren → Re-fetch
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateResourceRequest }) => {
      const { data } = await api.put<ResourceType>(`/api/v1/resources/${id}`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['resource', variables.id] });
    },
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/resources/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
};
```

**KI soll**:
- Für **jedes Endpoint** in `openapi.yaml` einen Hook erstellen
- Naming: `use[Resource]` für GET, `useCreate[Resource]` für POST, etc.

---

### 5. Zustand Store Pattern

**File**: `src/stores/authStore.ts`, `src/stores/themeStore.ts`, etc.

**Purpose**: Global Client State (nicht Server State!)

**Pattern (Auth Store)**:
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: (token, user) => {
        localStorage.setItem('auth_token', token);
        set({ token, user });
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        set({ token: null, user: null });
      },

      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
```

**Pattern (Theme Store)**:
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'theme-storage',
    }
  )
);
```

**KI soll**:
- Auth Store immer erstellen
- Theme Store erstellen wenn Dark Mode gewünscht
- Weitere Stores basierend auf App-Anforderungen

---

### 6. Component Pattern

**File**: `src/components/common/Button.tsx`, `Input.tsx`, etc.

**Purpose**: Wiederverwendbare, typsichere UI-Komponenten

**Pattern**:
```tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'rounded font-medium transition-colors',
          {
            'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
            'bg-gray-200 text-gray-800 hover:bg-gray-300': variant === 'secondary',
            'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
            'opacity-50 cursor-not-allowed': disabled || isLoading,
          },
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? 'Loading...' : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

**KI soll**:
- Generische Components in `components/common/` erstellen: Button, Input, Card, Modal, etc.
- Feature-spezifische Components in `components/features/` basierend auf App-Logik

---

### 7. Page Pattern

**File**: `src/pages/[PageName].tsx`

**Purpose**: Route Pages - Container für Layout + Logic

**Pattern**:
```tsx
import { useResources, useCreateResource } from '@/hooks/useResources';
import { Button } from '@/components/common/Button';
import { ResourceList } from '@/components/features/ResourceList';
import { useState } from 'react';

export const ResourcePage = () => {
  const { data: resources, isLoading, error } = useResources();
  const createResource = useCreateResource();

  const handleCreate = async (payload: CreateResourceRequest) => {
    await createResource.mutateAsync(payload);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Resources</h1>
      {/* Form, List, etc. */}
      <ResourceList resources={resources || []} />
    </div>
  );
};
```

**KI soll**:
- Pages basierend auf Routes erstellen
- Logic in Hooks auslagern (nicht direkt in Page)
- Loading/Error States behandeln

---

### 8. Form with Validation Pattern

**File**: `src/components/features/LoginForm.tsx`, etc.

**Purpose**: Type-safe Forms mit Validation

**Pattern**:
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema definieren
const formSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormData = z.infer<typeof formSchema>;

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    // API call
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register('email')} placeholder="Email" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <input {...register('password')} type="password" placeholder="Password" />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
};
```

**KI soll**:
- Zod Schemas basierend auf OpenAPI Schemas erstellen
- React Hook Form für alle Forms verwenden

---

## 🎨 Styling Approach

### 1. Global Styles

**File**: `src/styles/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }

  h1 {
    @apply text-3xl font-bold;
  }

  h2 {
    @apply text-2xl font-semibold;
  }
}

@layer components {
  .card {
    @apply bg-white rounded-lg shadow p-6;
  }

  .btn {
    @apply px-4 py-2 rounded font-medium transition-colors;
  }
}
```

**KI soll**:
- Tailwind Utilities verwenden (keine custom CSS files)
- `@layer components` für wiederverwendbare Styles

---

### 2. Component Styles

**Ansatz**: Tailwind Utilities direkt in JSX

```tsx
<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
  Click
</button>
```

**Optional**: CSS Modules für komplexe Component Styles

```tsx
import styles from './Button.module.css';

<button className={styles.button}>Click</button>
```

---

## 🧪 Testing Pattern

**File**: `src/components/common/Button.test.tsx`

**Pattern**:
```tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Button isLoading>Click me</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { rerender } = render(<Button variant="primary">Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');

    rerender(<Button variant="danger">Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-red-600');
  });
});
```

**KI soll**:
- Tests für alle Components in `components/common/` schreiben
- Tests für kritische Features

---

## 📦 Dependencies (package.json)

**KI soll diese Dependencies hinzufügen wenn nicht vorhanden:**

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.22.0",
    "@tanstack/react-query": "^5.28.0",
    "zustand": "^4.5.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "clsx": "^2.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.0.0",
    "typescript": "^5.6.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "@tanstack/react-query-devtools": "^5.28.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0"
  }
}
```

---

## 🚀 Scripts (package.json)

**KI soll diese Scripts hinzufügen:**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit"
  }
}
```

---

## ⚙️ Environment Setup

### .env.example (im Root des Repos)

```bash
VITE_API_URL=http://localhost:3001
VITE_API_TIMEOUT=30000
```

### Usage in Code

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

**⚠️ WICHTIG**: `VITE_` Prefix ist Pflicht für Vite!

---

## 🎯 Best Practices

### Do's ✅
- **TypeScript strict mode** verwenden
- **TanStack Query** für Server State (API-Calls)
- **Zustand** für Client State (Auth, Theme, UI)
- **React Hook Form + Zod** für Forms
- **Tailwind CSS** für Styling
- **Wiederverwendbare Components** in `components/common/`
- **Logic in Hooks** auslagern (nicht in Pages)
- **React Router** für Navigation
- **Vitest + Testing Library** für Tests

### Don'ts ❌
- ❌ Kein **Redux** (use Zustand instead)
- ❌ Keine **inline styles** (use Tailwind)
- ❌ Keine **`any` types**
- ❌ Keine **Logic in Pages** (use hooks)
- ❌ Kein **global CSS** (use Tailwind utilities)
- ❌ Kein **prop drilling** (use Zustand for global state)

---

## 🔥 Hot-Swap zu anderen Frameworks

**Wenn du zu Svelte, Vue, Angular, Solid wechseln willst:**

1. Lösche `packages/frontend`
2. Erstelle neuen Ordner mit neuer `README.md`
3. Schreibe README mit Framework-Specs (analog zu diesem Dokument)
4. Prompt an KI: "Frontend getauscht auf [Framework]. Lies README und implementiere."
5. KI generiert komplette App basierend auf README-Specs
6. **API-Contracts bleiben gleich** (`openapi.yaml`) → funktioniert sofort!

**Beispiele für Hot-Swap**:
- React → **Svelte**: SvelteKit + Svelte 5, Fetch API, Stores
- React → **Vue**: Vue 3 + Vite, Pinia, Composition API
- React → **Angular**: Angular 17, RxJS, Standalone Components
- React → **Solid**: SolidJS + Vite, Solid Query, Stores

---

**Version**: 0.0.1
**Tech-Stack**: React 18 + Vite 5 + TypeScript 5
**Letzte Aktualisierung**: 2025-10-07
