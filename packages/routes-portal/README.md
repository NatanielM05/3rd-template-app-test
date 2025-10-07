# @app/routes-portal - Admin Dashboard

## Zweck

Dieses Package enthält das **Admin-Dashboard** der Anwendung.

**Next.js-basiertes Portal** für System-Management und Monitoring.

---

## 📋 Package Contract (API-Schnittstellen)

### Bereitgestellte Endpoints

**SSR/Static Pages** (via Next.js App Router):
```
GET /                              → Dashboard Home
GET /users                         → User-Management
GET /settings                      → System-Settings
GET /monitoring                    → System-Monitoring
```

**⚠️ WICHTIG**: Dieses Package stellt keine Backend-APIs bereit!

### Konsumierte APIs

- **Backend API** (`packages/api/`):
  ```
  GET    /api/v1/health
  GET    /api/v1/users               → User-Liste für Admin
  POST   /api/v1/users               → User erstellen
  PUT    /api/v1/users/:id           → User bearbeiten
  DELETE /api/v1/users/:id           → User löschen
  GET    /api/v1/stats               → System-Statistiken (wenn vorhanden)
  ```

- **@app/openapi** (`packages/openapi/`):
  ```typescript
  // TypeScript Types aus openapi.yaml
  import type { User, CreateUserRequest, UpdateUserRequest } from '@app/openapi';
  ```

### Exportierte Interfaces

Dieses Package exportiert **keine Interfaces** (SSR/Static Site).

### Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001  # Backend API URL
NEXT_PUBLIC_API_TIMEOUT=30000              # Request Timeout (ms)
```

---

## Was dieses Package macht

✅ **Admin-UI** - Dashboard für System-Administratoren
✅ **User-Management** - Benutzer, Rollen, Permissions
✅ **Monitoring** - System-Metriken, Logs, Alerts
✅ **Configuration** - System-Einstellungen, Feature-Flags

---

## Struktur

```
packages/routes-portal/src/
├── app/              → Next.js App Router (Next.js 14+)
│   ├── layout.tsx    → Root-Layout
│   ├── page.tsx      → Home-Page
│   ├── dashboard/    → Dashboard-Route
│   │   └── page.tsx
│   ├── users/        → User-Management
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   └── api/          → API-Routes (Backend-for-Frontend)
│       └── [...]/route.ts
├── components/       → Shared Components
│   ├── ui/           → Button, Card, Table, etc.
│   └── features/     → Feature-spezifische Komponenten
├── hooks/            → Custom Hooks
├── services/         → API-Clients
└── middleware.ts     → Next.js Middleware (Auth, etc.)
```

---

## Architektur-Pattern: Next.js App Router

```
┌─────────────────────────┐
│   App Router (Pages)    │  ← Routes, Server Components
├─────────────────────────┤
│   Client Components     │  ← Interaktive UI
├─────────────────────────┤
│   API Routes (BFF)      │  ← Backend-for-Frontend
├─────────────────────────┤
│   Backend API           │  ← @app/api
└─────────────────────────┘
```

**BFF-Pattern**: API-Routes als Proxy zum Backend für zusätzliche Sicherheit.

---

## Naming Conventions

### Pages (App Router)
```tsx
// Dateiname: app/dashboard/page.tsx
export default async function DashboardPage() {
  const data = await fetchDashboardData();
  return <DashboardView data={data} />;
}
```

### Layouts
```tsx
// Dateiname: app/layout.tsx
export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
```

### API-Routes (Backend-for-Frontend)
```tsx
// Dateiname: app/api/users/route.ts
export async function GET(request: Request) {
  const users = await backendApi.getUsers();
  return Response.json(users);
}
```

### Components
```tsx
// Dateiname: components/ui/Button.tsx
export const Button = ({ children }: { children: React.ReactNode }) => (
  <button>{children}</button>
);
```

---

## Server vs. Client Components

### Server Components (Default)
- **Default in Next.js 14+**
- **Data-Fetching**: Direkt in Component
- **Use-Cases**: Statische UI, Data-Fetching

```tsx
// Server Component (kein 'use client')
async function UserList() {
  const users = await fetchUsers(); // Server-Side
  return <ul>{users.map(u => <li>{u.name}</li>)}</ul>;
}
```

### Client Components
- **Opt-In**: `'use client'` Directive
- **Use-Cases**: Interaktivität, Browser-APIs, Hooks

```tsx
// Client Component
'use client';
function UserForm() {
  const [name, setName] = useState('');
  return <input value={name} onChange={e => setName(e.target.value)} />;
}
```

---

## Authentication & Authorization

### Middleware
```tsx
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/users/:path*'],
};
```

---

## Styling

### Strategie
- **Tailwind CSS** (empfohlen) oder CSS Modules
- **Theme**: Zentrale Theme-Definitionen
- **Responsive**: Mobile-First

### Example (Tailwind)
```tsx
export const Button = ({ children }: { children: React.ReactNode }) => (
  <button className="px-4 py-2 bg-blue-500 text-white rounded">
    {children}
  </button>
);
```

---

## Testing

### Unit-Tests
- **Framework**: Vitest + React Testing Library
- **Location**: `__tests__/`

### E2E-Tests
- **Framework**: Playwright
- **Location**: `e2e/`

---

## Dependencies

### Core
- `next` - Framework
- `react` - UI-Library
- `react-dom` - DOM-Rendering

### Add as needed
- `@tanstack/react-query` - Server-State
- `zod` - Validation

---

## Build & Deployment

### Development
```bash
pnpm dev  # Startet Next.js Dev-Server
```

### Production Build
```bash
pnpm build    # Erstellt .next/ Produktions-Build
pnpm start    # Startet Produktions-Server
```

### Deployment
- **Vercel**: `vercel deploy` (empfohlen)
- **Self-Hosted**: Docker oder Node.js-Server

---

## Scripts

```bash
# Entwicklung
pnpm dev              # Dev-Server

# Build
pnpm build            # Production-Build
pnpm start            # Production-Server

# Lint
pnpm lint             # Next.js ESLint
```

---

## Für KI-Agenten

**Bei neuen Routes:**
1. ✅ Ordner in `app/` erstellen (z.B. `app/settings/`)
2. ✅ `page.tsx` erstellen
3. ✅ Optional: `layout.tsx` für route-spezifisches Layout
4. ✅ Optional: `loading.tsx` für Loading-State
5. ✅ Optional: `error.tsx` für Error-Handling

**Best Practices:**
- Server Components für Data-Fetching
- Client Components nur wenn nötig (`'use client'`)
- Middleware für Auth-Protection
- Responsive Design (Mobile-First)
- Keine API-Calls in Client Components
- Keine sensiblen Daten in Client-Bundle

---

**Version**: 0.0.1
**Deployment**: Vercel oder Self-Hosted
**Letzte Aktualisierung**: 2025-10-07
