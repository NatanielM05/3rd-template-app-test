# @app/openapi - API Specification

## Zweck

Dieses Package enthält die **OpenAPI 3.0 Spezifikation** der gesamten Anwendung.

**Contract-First Approach**: Die API wird hier definiert, bevor sie implementiert wird.

---

## 📋 Package Contract (API-Schnittstellen)

### Bereitgestellte APIs

**openapi.yaml** definiert alle REST-API Endpoints:

```yaml
paths:
  /api/v1/health:
    get: ...
  /api/v1/users:
    get: ...
    post: ...
  /api/v1/users/{id}:
    get: ...
    put: ...
    delete: ...
```

**TypeScript Types** (generiert aus openapi.yaml):
```typescript
export interface User { ... }
export interface CreateUserRequest { ... }
export interface UpdateUserRequest { ... }
export interface UserListResponse { ... }
```

**⚠️ WICHTIG**: KI muss `openapi.yaml` erweitern basierend auf App-Requirements!

### Konsumierte APIs

Keine - dieses Package ist die Quelle für alle API-Definitionen.

### Exportierte Interfaces

```typescript
// Nach Type-Generation verfügbar:
import type { User, CreateUserRequest, ... } from '@app/openapi/types';
```

**Wird konsumiert von**:
- `packages/api/` (Backend - implementiert die Endpoints)
- `packages/frontend/` (Frontend - nutzt Types für API-Calls)
- `packages/routes-portal/` (Portal - nutzt Types für API-Calls)

### Environment Variables

Keine

---

## Was dieses Package macht

✅ **Single Source of Truth** für alle API-Endpoints
✅ **Type-Generation** für Backend & Frontend (aus `openapi.yaml`)
✅ **API-Dokumentation** (Swagger UI, Redoc)
✅ **Validierung** von Request/Response-Strukturen

---

## Struktur

```
packages/openapi/
├── openapi.yaml      → API-Spezifikation (OpenAPI 3.0)
├── package.json      → Scripts für Validierung & Docs
└── README.md         → Diese Datei
```

---

## Workflow für neue Endpoints

### 1. Endpoint definieren
```yaml
paths:
  /tasks:
    get:
      summary: List all tasks
      operationId: listTasks
      tags: [Tasks]
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TaskList'
```

### 2. Schema definieren
```yaml
components:
  schemas:
    Task:
      type: object
      required: [id, title, status]
      properties:
        id:
          type: string
          format: uuid
        title:
          type: string
          minLength: 1
          maxLength: 200
        status:
          type: string
          enum: [open, in_progress, done]
```

### 3. Validieren
```bash
cd packages/openapi
pnpm validate
```

### 4. Types generieren (optional)
```bash
pnpm types:generate  # Generiert TypeScript-Types
```

---

## Conventions

### Naming
- **Endpoints**: kebab-case (`/api/v1/user-profiles`)
- **Schemas**: PascalCase (`UserProfile`, `CreateTaskRequest`)
- **Properties**: camelCase (`userId`, `createdAt`)
- **Operation-IDs**: camelCase (`getUserProfile`, `createTask`)

### Wiederverwendbarkeit
- Schemas in `components/schemas` definieren
- Parameters in `components/parameters`
- Responses in `components/responses`
- Security in `components/securitySchemes`

### Beispiele
Jede Property sollte ein `example` haben:
```yaml
userId:
  type: string
  format: uuid
  example: "123e4567-e89b-12d3-a456-426614174000"
```

---

## Scripts

```bash
# Validierung
pnpm validate

# Dokumentation generieren
pnpm build

# Preview-Server starten
pnpm serve
```

---

## Dependencies

- **@redocly/cli** - OpenAPI-Validierung & Dokumentation

---

## Für KI-Agenten

**Bei neuen Features:**
1. ✅ Zuerst `openapi.yaml` erweitern (Contract-First!)
2. ✅ Dann Backend implementieren (`packages/api/`)
3. ✅ Dann Frontend integrieren (`packages/frontend/`)

**Wichtig:**
- Vollständige Dokumentation (Summary, Description)
- Beispiele für alle Request/Response-Bodies
- Validierung (`minLength`, `maxLength`, `pattern`, `format`)
- Wiederverwendbare Komponenten (keine Inline-Schemas)

---

**Version**: 0.0.1
**Letzte Aktualisierung**: 2025-10-07
