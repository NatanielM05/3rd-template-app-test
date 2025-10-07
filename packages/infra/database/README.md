# @app/database (JSON Implementation)

## Zweck

Default-Datenbank für **lokale Entwicklung** und **Prototyping**.

**Technologie**: lowdb (JSON-basierte Datei-Datenbank)

---

## 📋 Package Contract (API-Schnittstellen)

### Bereitgestellte APIs

**Exportiert als `@app/database`**:

```typescript
class Database {
  // Initialization
  init(): Promise<void>

  // User CRUD
  getUserById(id: string): Promise<User | null>
  getUsers(): Promise<User[]>
  createUser(data: CreateUserDto): Promise<User>
  updateUser(id: string, data: UpdateUserDto): Promise<User>
  deleteUser(id: string): Promise<void>

  // ⚠️ WICHTIG: KI muss diese Methoden basierend auf openapi.yaml erweitern!
  // Beispiel: Tasks, Products, Orders, etc.
}

// TypeScript Interfaces
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateUserDto {
  email: string;
  name: string;
}

interface UpdateUserDto {
  name?: string;
  email?: string;
}
```

**⚠️ Schema-Extension**: KI muss neue Entitäten hinzufügen basierend auf `openapi.yaml`!

### Konsumierte APIs

- **lowdb** (npm package):
  ```typescript
  Low, JSONFile - JSON File Database
  ```

### Exportierte Interfaces

```typescript
export { Database } from './index';
export type { User, CreateUserDto, UpdateUserDto } from './index';
```

**Wird konsumiert von**:
- `packages/api/` (Backend Repositories)

### Environment Variables

```bash
DATABASE_PATH=./data/db.json        # JSON-File Location
```

---

## Warum JSON-DB?

✅ **Sofort lauffähig** - Keine Docker, keine Datenbank-Setup
✅ **Zero-Config** - `pnpm install` und fertig
✅ **Perfekt für Prototyping** - Schnell Features testen
✅ **Leicht debuggbar** - Daten in `data/db.json` einsehbar

---

## Verwendung

### In API-Handlers

```typescript
import { db } from '@app/database';

// Initialize once at startup
await db.init();

// CRUD-Operationen
const users = await db.getUsers();
const user = await db.getUserById('123');
const newUser = await db.createUser({ email: 'test@test.com', name: 'Test' });
await db.updateUser('123', { name: 'Updated' });
await db.deleteUser('123');
```

---

## Schema erweitern

Edit `src/index.ts`:

```typescript
export interface DatabaseSchema {
  users: User[];
  tasks: Task[];  // Neu hinzufügen
  _meta: { version: string; createdAt: string };
}

export interface Task {
  id: string;
  title: string;
  status: 'open' | 'done';
  createdAt: string;
}
```

Dann CRUD-Methoden hinzufügen:
```typescript
async getTasks(): Promise<Task[]> {
  await this.db.read();
  return this.db.data.tasks;
}
// ...
```

---

## 📁 Wo werden die Daten gespeichert?

**⚠️ WICHTIG**: Dieser Ordner (`packages/infra/database/`) enthält nur den **CODE**, nicht die **DATEN**!

### Daten-Speicherort

Die `db.json` Datei wird hier erstellt:
```
packages/api/data/db.json  ← Hier landen deine Daten!
```

**Warum dort?**
- Der API-Server läuft von `packages/api/` aus (`pnpm --filter @app/api dev`)
- `process.cwd()` zeigt beim Start auf `packages/api/`
- Die Datenbank wird relativ zu `process.cwd()` erstellt: `./data/db.json`

### Ordnerstruktur (nach erstem Start):

```
packages/
├── infra/database/       ← Code (Database-Klasse)
│   ├── src/index.ts      ← Logik zum Speichern/Laden
│   ├── package.json
│   └── README.md
│
└── api/
    ├── src/              ← API-Server Code
    ├── data/             ← Daten (wird automatisch erstellt!)
    │   └── db.json       ← Deine gespeicherten Daten
    └── package.json
```

### Custom Path (optional):

```bash
# Via Environment Variable
DATABASE_PATH=/custom/path/db.json
```

Oder in Code:
```typescript
import { Database } from '@app/database';
const db = new Database('/custom/path/db.json');
```

---

## ⚠️ Setup: Ordner automatisch erstellen (WICHTIG!)

**Problem**: lowdb erstellt **keine Parent-Ordner** automatisch → Crash wenn `data/` nicht existiert!

### Lösung: Auto-Create in Database-Klasse

**In `src/index.ts` implementieren**:

```typescript
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

export class Database {
  private db!: Low<DatabaseSchema>;
  private dbPath: string;

  constructor(dbPath = './data/db.json') {
    this.dbPath = dbPath;
  }

  async init(): Promise<void> {
    // ⚠️ KRITISCH: Ordner vorher erstellen!
    await mkdir(dirname(this.dbPath), { recursive: true });

    // Jetzt sicher die Datenbank initialisieren
    const adapter = new JSONFile<DatabaseSchema>(this.dbPath);
    this.db = new Low(adapter, this.getDefaultData());
    await this.db.read();

    if (!this.db.data) {
      this.db.data = this.getDefaultData();
      await this.db.write();
    }
  }

  private getDefaultData(): DatabaseSchema {
    return {
      users: [],
      _meta: {
        version: '1.0.0',
        createdAt: new Date().toISOString(),
      },
    };
  }

  // ... CRUD Methoden
}
```

**Warum `{ recursive: true }`?**
- Erstellt alle Parent-Ordner automatisch (`data/sub/folder/db.json` → erstellt `data/sub/folder/`)
- Wirft **keinen Fehler** wenn Ordner bereits existiert
- Sicher und idempotent

---

## Migration zu Production-DB

**⚠️ WICHTIG**: Datenbank-Wechsel = Kompletter `packages/infra/` Austausch!

### PostgreSQL

**Prompt an KI**:
> "Tausche kompletten packages/infra/ Ordner für PostgreSQL:
> 1. Sichere: mv packages/infra packages/infra-json-backup
> 2. Erstelle neuen packages/infra/ mit:
>    - database/ (Prisma + PostgreSQL)
>    - iac/ (CDK Stacks für Deployment)
> 3. Gleiche @app/database API wie vorher
> 4. docker-compose.yml für lokale PostgreSQL
> 5. Dokumentiere in WORKLOG.md"

KI erstellt automatisch:
- Kompletten neuen `packages/infra/` Ordner
- `infra/database/` mit Prisma
- `infra/iac/` mit CDK Stacks
- `docker-compose.yml` (Root)
- API-Code bleibt unverändert!

### DynamoDB

**Prompt an KI**:
> "Tausche kompletten packages/infra/ Ordner für DynamoDB:
> 1. Sichere: mv packages/infra packages/infra-json-backup
> 2. Erstelle neuen packages/infra/ mit:
>    - database/ (AWS SDK v3 + DynamoDB)
>    - iac/ (CDK Stacks für DynamoDB Tables)
> 3. Gleiche @app/database API wie vorher
> 4. Dokumentiere in WORKLOG.md"

---

## Testing

```typescript
import { Database } from '@app/database';

describe('Database', () => {
  let db: Database;

  beforeEach(async () => {
    db = new Database(':memory:'); // In-Memory für Tests
    await db.init();
  });

  it('should create user', async () => {
    const user = await db.createUser({ email: 'test@test.com', name: 'Test' });
    expect(user.id).toBeDefined();
  });
});
```

---

## Best Practices

### Do's
- ✅ Nutze für lokale Entwicklung
- ✅ Perfekt für MVPs und Prototypen
- ✅ Erweitere Schema nach Bedarf

### Don'ts
- ❌ Nicht für Production (keine Transaktionen, kein Concurrency-Handling)
- ❌ Nicht für große Datenmengen (Performance-Issues)
- ❌ Nicht für Multi-User-Szenarien (File-Locking-Issues)

**Für Production**: Migriere zu PostgreSQL, DynamoDB oder anderer DB!

---

**Version**: 0.0.1
**Dependencies**: lowdb ^7.0
**Letzte Aktualisierung**: 2025-10-07
