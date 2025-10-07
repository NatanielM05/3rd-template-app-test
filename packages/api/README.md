# @app/api - Backend API

## Zweck

Dieses Package enthält die **Backend-API** der Anwendung.

**Implementation basierend auf OpenAPI-Spec** (`packages/openapi/openapi.yaml`)

---

## 📋 Package Contract (API-Schnittstellen)

### Bereitgestellte Endpoints

**HTTP REST API** (basierend auf `packages/openapi/openapi.yaml`):

```
GET    /api/v1/health              → Health-Check
GET    /api/v1/users               → Liste aller User
POST   /api/v1/users               → Neuen User erstellen
GET    /api/v1/users/:id           → User by ID
PUT    /api/v1/users/:id           → User aktualisieren
DELETE /api/v1/users/:id           → User löschen
```

**⚠️ WICHTIG**: Diese Endpoints müssen von KI implementiert werden basierend auf `openapi.yaml`!

### Konsumierte APIs

- **@app/database** (`packages/infra/database/`):
  ```typescript
  getUserById(id: string): Promise<User>
  getUsers(): Promise<User[]>
  createUser(data: CreateUserDto): Promise<User>
  updateUser(id: string, data: UpdateUserDto): Promise<User>
  deleteUser(id: string): Promise<void>
  ```

- **@app/openapi** (`packages/openapi/`):
  ```typescript
  TypeScript Types generiert aus openapi.yaml
  ```

### Exportierte Interfaces

Dieses Package exportiert **keine direkten Interfaces** (nur HTTP API).

API wird konsumiert von:
- `packages/frontend/` (Web-App)
- `packages/routes-portal/` (Admin-Dashboard)

---

## Was dieses Package macht

✅ **REST/GraphQL API** - HTTP-Endpoints für Clients
✅ **Business-Logik** - Domain-Logik, Validierung, Orchestrierung
✅ **Datenzugriff** - Database, External APIs, Caching
✅ **Authentication** - JWT, OAuth, API-Keys

---

## Struktur

```
packages/api/src/
├── handlers/         → HTTP-Handler (Lambda-Functions, API-Endpoints)
│   └── users.handler.ts
├── services/         → Business-Logik (Domain-Layer)
│   └── user.service.ts
├── repositories/     → Datenzugriff (Database, External APIs)
│   └── user.repository.ts
├── models/           → Datenmodelle, Schemas
│   └── user.model.ts
├── utils/            → Hilfs-Funktionen
│   └── jwt.util.ts
├── config/           → Konfiguration, Environment-Variables
│   └── database.config.ts
└── index.ts          → Entry-Point
```

---

## Architektur-Pattern: Layered Architecture

```
┌─────────────────┐
│    Handler      │  ← HTTP Request/Response
├─────────────────┤
│    Service      │  ← Business-Logik
├─────────────────┤
│   Repository    │  ← Datenzugriff
├─────────────────┤
│    Database     │  ← PostgreSQL, DynamoDB, etc.
└─────────────────┘
```

**Dependency-Flow**: Handler → Service → Repository → Database

**Wichtig**: Business-Logik gehört in Services, nicht in Handler!

---

## Naming Conventions

### Handler (HTTP-Layer)
```typescript
// Dateiname: users.handler.ts
export const createUserHandler = async (
  event: APIGatewayEvent
): Promise<APIGatewayResponse> => {
  // Request-Handling, Validation, Serialization
};
```

### Service (Business-Logic)
```typescript
// Dateiname: user.service.ts
export class UserService {
  async createUser(data: CreateUserDto): Promise<User> {
    // Business-Logik, Validierung, Orchestrierung
  }
}
```

### Repository (Data-Access)
```typescript
// Dateiname: user.repository.ts
export class UserRepository {
  async save(user: User): Promise<User> {
    // Database-Zugriff
  }
}
```

### Models
```typescript
// Dateiname: user.model.ts
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}
```

---

## Testing

### Unit-Tests
- **Location**: Neben der zu testenden Datei (`*.test.ts`)
- **Framework**: Vitest
- **Example**:
```typescript
// user.service.test.ts
describe('UserService', () => {
  it('should create user', async () => {
    const service = new UserService(mockRepo);
    const user = await service.createUser({ email: 'test@test.com' });
    expect(user).toBeDefined();
  });
});
```

### Integration-Tests
- **Location**: `src/__tests__/integration/`
- **Scope**: End-to-End API-Tests mit echter Database

---

## Environment-Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/myapp

# Authentication
JWT_SECRET=your-secret-here
JWT_EXPIRY=1h

# AWS
AWS_REGION=eu-central-1

# Logging
LOG_LEVEL=info
NODE_ENV=development
```

---

## Dependencies

### Core
- `typescript` - Type-Safety
- `vitest` - Testing
- `@app/database` - Datenbank-Zugriff (aus `packages/infra/database/`)

### Add as needed
- `zod` - Schema-Validation
- `@aws-sdk/client-*` - AWS-Services
- `jsonwebtoken` - JWT-Authentication

**⚠️ WICHTIG**: Database-Package kommt aus `packages/infra/database/`!
```typescript
import { db } from '@app/database';  // ← aus infra/database/
```

---

## Deployment

### AWS Lambda
```typescript
// Handler-Format
export const handler = async (event, context) => {
  // Lambda-Logic
};
```

**Configuration**:
- Runtime: Node.js 20
- Memory: 512 MB (adjust as needed)
- Timeout: 30s
- Environment: siehe `.env`

---

## Scripts

```bash
# Entwicklung
pnpm dev              # Watch-Mode (TypeScript)

# Build
pnpm build            # Kompiliert zu dist/

# Tests
pnpm test             # Alle Tests
pnpm test:watch       # Watch-Mode
```

---

## Für KI-Agenten

**Bei neuen Endpoints:**
1. ✅ Prüfe `packages/openapi/openapi.yaml` für Spec
2. ✅ Handler in `src/handlers/` erstellen
3. ✅ Service-Logik in `src/services/` implementieren
4. ✅ Repository in `src/repositories/` (falls Datenzugriff nötig)
5. ✅ Tests schreiben (`*.test.ts`)

**Best Practices:**
- SOLID-Prinzipien befolgen
- Type-Safety nutzen (`strict: true`)
- Fehler-Handling von Anfang an
- Strukturiertes Logging (keine `console.log`)
- Keine Business-Logik in Handlern

---

**Version**: 0.0.1
**Deployment**: AWS Lambda (Serverless)
**Letzte Aktualisierung**: 2025-10-07
