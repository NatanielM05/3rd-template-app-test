# Architektur-Übersicht

Diese Datei dient als **zentrale Orientierung** für KI-Assistenten und Entwickler.

---

## 🔥 Template-Konzept: "Hot-Swap Package System"

**Kernprinzip**: Jedes Package ist **austauschbar durch README-Contracts**!

### Wie es funktioniert:

1. **Jedes Package hat eine README.md** = Contract/Specification
2. **README definiert**:
   - Bereitgestellte APIs/Endpoints
   - Konsumierte APIs/Endpoints
   - Exportierte Interfaces
   - Technologie-Stack
3. **Package austauschen** = Ordner löschen → Neuer Ordner mit neuer README → Prompt an KI
4. **KI liest** README + ARCHITECTURE.md → Generiert Package nach Contract

### Beispiel: Frontend-Wechsel (React → Svelte)

```bash
# 1. Altes Package entfernen
rm -rf packages/frontend

# 2. Neuer Ordner mit NEUER README
mkdir packages/frontend
# packages/frontend/README.md schreiben (Svelte-Specs)

# 3. Prompt an KI:
"Frontend-Package getauscht. Jetzt Svelte statt React.
Lies packages/frontend/README.md und ARCHITECTURE.md.
Erstelle das Package basierend auf den Specs."
```

**Ergebnis**: KI erstellt Svelte-App die **gleiche APIs** konsumiert → **Kommunikation funktioniert sofort**!

### Weitere Beispiele:

- **Backend**: Express → Fastify (gleiche Endpoints)
- **Infra**: AWS CDK → Vercel (gleiche Database-API)
- **Portal**: Next.js → Nuxt.js (gleiche API-Integration)

**Vorteil**: Kein Framework-Lock-in, schnelles Experimentieren, minimale manuelle Arbeit!

---

## 📦 Package-Struktur

Das Monorepo besteht aus 5 Packages, die zusammen eine Full-Stack-Anwendung bilden:

```
packages/
├── openapi/          → API-Spezifikation (Contract-First)
├── api/              → Backend API (Implementation)
├── frontend/         → Web-Anwendung (Consumer)
├── routes-portal/    → Admin-Dashboard (Consumer)
└── infra/            → Infrastruktur + Datenbank (gekoppelt)
    └── database/     → Datenbank-Implementation (JSON/PostgreSQL/DynamoDB)
```

**⚠️ ALLE Packages sind austauschbar!**
- Jedes Package = README.md mit Contract
- Package austauschen = Neue README + Prompt an KI
- KI generiert Code basierend auf Contract

**Beispiel: Datenbank ist Teil von `infra/`** - Infrastruktur und Datenbank sind zusammen!
- Wechsel der Datenbank = Austausch des kompletten `infra/` Ordners
- JSON-DB = `infra/` mit lokaler JSON-Datenbank
- PostgreSQL = `infra/` mit Docker + Prisma
- DynamoDB = `infra/` mit AWS CDK Stacks

---

## 🔧 Template-Setup Checklist (für KI - VOR Implementation!)

**⚠️ KRITISCH**: Diese Schritte MÜSSEN beim Initial-Prompt durchgeführt werden!

### 1. Basis-Konfiguration prüfen
- ✅ `tsconfig.base.json` existiert im Root (wird von allen Packages referenced)
- ✅ Alle `package.json` Scripts korrekt (KEIN `"echo '⚠️  ...'"` - echte Scripts!)
- ✅ `.env.example` als Basis für `.env.local`

### 2. ES Module Patterns beachten
- ✅ Alle Packages nutzen `"type": "module"`
- ❌ **KEIN** `if (require.main === module)` verwenden (funktioniert nicht!)
- ✅ Server-Code direkt starten: `app.listen(PORT)` (siehe AGENT.md)

### 3. File System Operations
- ✅ Ordner mit `mkdir(dirname(path), { recursive: true })` erstellen
- ✅ **NICHT** davon ausgehen dass Ordner existieren
- ✅ Database-Klasse erstellt `data/` Ordner automatisch in `init()`

### 4. process.cwd() Awareness
- ✅ API-Server läuft von `packages/api/` aus
- ✅ `process.cwd()` = `packages/api/` beim Start
- ✅ Database-Daten landen in `packages/api/data/db.json`
- ✅ Dokumentiere in README wo Daten vs. Code liegen

### 5. Package-Struktur erstellen
Für JEDES Package:
- ✅ `package.json` mit korrekten Dependencies & Scripts
- ✅ `tsconfig.json` (extends `../../../tsconfig.base.json`)
- ✅ `src/` Ordner mit kompletter Implementation
- ✅ Config-Files (vite.config.ts, next.config.mjs, etc.)
- ✅ Tests (`*.test.ts`, `*.test.tsx`)

### 6. Sofort lauffähig nach Initial-Prompt
- ✅ `pnpm install` funktioniert
- ✅ `pnpm dev` startet ALLE Services
- ✅ API erreichbar (http://localhost:3001)
- ✅ Frontend erreichbar (http://localhost:3000)
- ✅ Keine Errors beim Start

---

## ⚠️ Common Pitfalls (für KI-Agenten)

**Diese Fehler treten häufig auf - vermeide sie!**

### 1. Database-Initialisierung nicht getestet

**Problem**: `data/` Ordner fehlt → lowdb crasht beim Schreiben

**Symptom**:
```
ENOENT: no such file or directory, open '.../data/db.json'
```

**Root Cause**: `mkdir(dirname(dbPath), { recursive: true })` fehlt in `init()`

**Validation**:
```bash
pnpm --filter @app/database build
pnpm --filter @app/database test:init
```
**MUSS grün sein!** Falls nicht → Database-Init ist kaputt!

**Fix in `packages/infra/database/src/index.ts`**:
```typescript
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

async init() {
  // ⚠️ KRITISCH: Ordner vorher erstellen!
  await mkdir(dirname(this.dbPath), { recursive: true });

  // Jetzt sicher DB initialisieren
  const adapter = new JSONFile(this.dbPath);
  // ...
}
```

---

### 2. TypeScript Unused Variables (TS6133)

**Problem**: Build schlägt fehl wegen `error TS6133: 'x' is declared but never used`

**Symptom**:
```typescript
import { BadRequestError } from './errors.js';  // ❌ Error: never used
catch (error) { throw new Error('failed'); }
```

**Lösungen**:

**Option 1**: Nutze die Variable
```typescript
import { BadRequestError } from './errors.js';
catch (error) {
  throw new BadRequestError('failed');  // ✅ Jetzt verwendet
}
```

**Option 2**: Prefix mit `_`
```typescript
import { BadRequestError as _BadRequestError } from './errors.js';  // ✅ OK
```

**Option 3**: Lösche den Import
```typescript
// Import komplett entfernt ✅
catch (error) { throw new Error('failed'); }
```

---

### 3. Router Type-Inference (TS2742)

**Problem**: `error TS2742: The inferred type of 'healthRouter' cannot be named`

**Symptom**:
```typescript
import { Router } from 'express';
export const healthRouter = Router();  // ❌ Error
```

**Fix**: Explizite Type-Annotation
```typescript
import { Router } from 'express';
export const healthRouter: Router = Router();  // ✅ OK
```

**Alternative**: Type als separate Declaration
```typescript
import type { Router } from 'express';
import { Router as ExpressRouter } from 'express';

export const healthRouter: Router = ExpressRouter();  // ✅ OK
```

---

### 4. Build nicht validiert

**Problem**: `pnpm dev` funktioniert, aber `pnpm build` schlägt fehl

**Root Cause**: TypeScript-Errors werden in Dev-Mode ignoriert (tsx/ts-node), aber Build mit `tsc` schlägt fehl

**Lösung**: **IMMER** `pnpm -r build` in Phase 6 ausführen!

```bash
# Phase 6 - MANDATORY!
pnpm -r build  # ← Muss grün sein!
```

**Wenn Build fehlschlägt**:
1. Lies Error-Message genau
2. Fixe den Fehler (siehe Pitfalls oben)
3. Re-run `pnpm -r build`
4. Wiederhole bis grün

---

### 5. Fehlende process.cwd() Awareness

**Problem**: Code geht davon aus dass Paths relativ zum Package-Root sind

**Symptom**:
```typescript
// In packages/infra/database/src/index.ts
const dbPath = './data/db.json';
// → Erstellt packages/infra/database/data/db.json ❌ Falsch!
```

**Root Cause**: API-Server läuft von `packages/api/` aus → `process.cwd()` = `packages/api/`

**Fix**: Dokumentiere wo Daten gespeichert werden
```typescript
// Default path ist relativ zu process.cwd() (= packages/api/)
constructor(dbPath = './data/db.json') {
  this.dbPath = dbPath;  // → packages/api/data/db.json ✅ Richtig!
}
```

**Siehe**: `packages/infra/database/README.md` - Sektion "Wo werden die Daten gespeichert?"

---

## 🔄 Entwicklungs-Workflow

### 1. OpenAPI zuerst (`packages/openapi/`)
**Zweck**: Definiere API-Contract bevor du implementierst

```
openapi/
├── openapi.yaml      → Minimal placeholder, KI erweitert basierend auf Prompt
├── package.json      → Dependencies für Validation
└── README.md         → Package-Spezifikation
```

**⚠️ WICHTIG FÜR KI**: Die `openapi.yaml` ist nur ein Placeholder!
- Die KI erstellt die komplette API-Spezifikation nach dem initiellen Prompt
- Die KI folgt den Vorgaben aus `README.md`
- Das Template enthält nur minimales Grundgerüst

---

### 2. Infrastruktur + Datenbank (`packages/infra/`)
**Zweck**: Infrastruktur und Datenbank sind gekoppelt

```
infra/
├── database/         → Datenbank-Implementation
│   ├── package.json  → Dependencies (lowdb für JSON-DB)
│   └── README.md     → Datenbank-Spezifikation
├── package.json      → Infra Dependencies (aws-cdk-lib)
└── README.md         → Infra-Spezifikation
```

**⚠️ WICHTIG FÜR KI**: Beide haben KEINE Implementierung im Template!
- Die KI erstellt alle Dateien nach dem initiellen Prompt
- Die KI folgt den Vorgaben aus den README.md Dateien

**⚠️ WICHTIG**: Datenbank-Wechsel = Kompletter `infra/` Austausch!
- **JSON-DB Template**: `infra/database/` mit lowdb (aktuell)
- **PostgreSQL Template**: Komplett neuer `infra/` Ordner mit Docker + Prisma
- **DynamoDB Template**: Komplett neuer `infra/` Ordner mit CDK Stacks

**Warum JSON-DB als Default?**
- ✅ **Sofort lauffähig**: Keine Docker, keine Datenbank-Setup
- ✅ **Zero-Config**: `pnpm install` und fertig
- ✅ **Perfekt für Prototyping**: Schnell Features testen

**Migration zu Production-DB**:
Siehe [Database-Migration](#-database-migration) unten.

---

### 3. Backend-API (`packages/api/`)
**Zweck**: Implementiere API-Endpoints basierend auf OpenAPI-Spec

```
api/
├── package.json      → Dependencies
└── README.md         → Package-Spezifikation
```

**⚠️ WICHTIG FÜR KI**: Dieses Package hat KEINE Implementierung im Template!
- Die KI erstellt die komplette Struktur nach dem initiellen Prompt
- Die KI folgt den Vorgaben aus `README.md`

**Dependencies**:
- ✅ Liest von: `packages/openapi/` (Types)
- ✅ Nutzt: `packages/infra/database/` (Data-Access via @app/database)
- ❌ Keine direkten Abhängigkeiten zu Frontend/Portal

---

### 4. Frontend (`packages/frontend/`)
**Zweck**: Web-Anwendung für End-User

```
frontend/
├── package.json      → Dependencies (React, Vite)
└── README.md         → Package-Spezifikation
```

**⚠️ WICHTIG FÜR KI**: Dieses Package hat KEINE Implementierung im Template!
- Die KI erstellt `vite.config.ts`, `tsconfig.json` und `src/` nach dem initiellen Prompt
- Die KI folgt den Vorgaben aus `README.md`

**Dependencies**:
- ✅ Liest von: `packages/openapi/` (Types)
- ✅ Ruft auf: `packages/api/` (Runtime)

---

### 5. Admin-Portal (`packages/routes-portal/`)
**Zweck**: Admin-Dashboard für System-Management

```
routes-portal/
├── package.json      → Dependencies (Next.js)
└── README.md         → Package-Spezifikation
```

**⚠️ WICHTIG FÜR KI**: Dieses Package hat KEINE Implementierung im Template!
- Die KI erstellt `next.config.mjs`, `tsconfig.json` und `src/app/` nach dem initiellen Prompt
- Die KI folgt den Vorgaben aus `README.md`

**Dependencies**:
- ✅ Liest von: `packages/openapi/` (Types)
- ✅ Ruft auf: `packages/api/` (Runtime)

---


---

## 🎯 Dependency-Graph

```
      ┌──────────────┐
      │   openapi    │  ← Single Source of Truth
      └──────┬───────┘
             │
             ├─────────────┬─────────────┬──────────────┐
             │             │             │              │
             ▼             ▼             ▼              ▼
        ┌────────┐   ┌──────────┐  ┌──────────┐  ┌─────────────────┐
        │   api  │   │ frontend │  │  portal  │  │  infra          │
        └────┬───┘   └──────────┘  └──────────┘  │  └─ database/   │
             │             │             │        └─────────────────┘
             │             │             │              │
             └─────────────┴─────────────┴──────────────┘
                           (Runtime)

⚠️  infra + database sind ein Package - Wechsel beider immer zusammen!
```

---

## 📋 Entwicklungs-Phasen

Jede neue Feature-Entwicklung folgt diesem Ablauf:

### Phase 1: Planung
1. **ROADMAP.md** aktualisieren: Neue Phase mit Tasks erstellen
2. **ADR** erstellen (falls Architektur-Entscheidung nötig)

### Phase 2: API-Design
1. `packages/openapi/openapi.yaml` erweitern
2. Schemas definieren, Endpoints dokumentieren
3. Validierung: `pnpm validate`

### Phase 3: Implementation
1. **Backend**: Handler → Services → Repositories
2. **Frontend**: Components → Pages → Services
3. **Infrastruktur**: Stacks → Constructs → Deployment
4. **Tests**: Unit-Tests + Integration-Tests

### Phase 4: Dokumentation
1. **WORKLOG.md** aktualisieren: Was wurde implementiert
2. **ROADMAP.md** aktualisieren: Tasks abhaken
3. **ADR** ergänzen (falls Entscheidungen getroffen)

### Phase 5: Deployment
1. Build: `pnpm -r build`
2. Tests: `pnpm test`
3. Guardrails: `pnpm guardrails`
4. Deploy: `cd packages/infra && pnpm deploy`

---

## 🔄 Session-Rotation (Context-Reset)

**Problem**: Lange Chat-Sessions führen zu Context-Rot (KI vergisst frühere Entscheidungen)

**Lösung**: Starte neue Session für jedes Feature/Phase

### Bei Session-Start liest KI:
1. ✅ **ARCHITECTURE.md** (diese Datei) - Übersicht
2. ✅ **ROADMAP.md** - Aktuelle Phase & Tasks
3. ✅ **WORKLOG.md** - Was bereits implementiert wurde
4. ✅ **ADR-Template.md** - Architektur-Entscheidungen
5. ✅ **packages/*/README.md** - Package-Spezifikationen

### KI kann damit:
- ✅ Verstehen, was bereits existiert
- ✅ Wissen, was als Nächstes zu tun ist
- ✅ Architektur-Entscheidungen nachvollziehen
- ✅ Ohne Kontext-Verlust weiterarbeiten

---

## 📝 Datei-Kategorien

### Statische Orientierung (Einmalig erstellt, nicht gepflegt)
- `ARCHITECTURE.md` - Diese Datei
- `AGENT.md` - KI-Instruktionen
- `README.md` - Projekt-Übersicht
- `packages/*/README.md` - Package-Spezifikationen

### Dynamische Pflege (Kontinuierlich aktualisiert)
- `ROADMAP.md` - Phasen & Features
- `WORKLOG.md` - Entwicklungs-Historie
- `ADR-Template.md` - Architektur-Entscheidungen

### Code & Konfiguration
- `openapi.yaml` - API-Spezifikation
- `package.json` - Dependencies & Scripts
- `tsconfig.json` - TypeScript-Konfiguration
- `guardrails.json` - Code-Quality-Regeln

---

## 🎯 Conventions

### Naming
- **Dateien**: kebab-case (`user-service.ts`)
- **Klassen**: PascalCase (`UserService`)
- **Funktionen**: camelCase (`getUserById`)
- **Konstanten**: UPPER_SNAKE_CASE (`MAX_RETRIES`)

### Testing
- Tests neben Code: `user-service.test.ts`
- Mindestens 70% Coverage anstreben
- Integration-Tests in `__tests__/integration/`

### Git Commits
- Format: `[package] kurze beschreibung`
- Beispiel: `[api] add user authentication`

---

## 🗄️ Database-Migration (Infra-Austausch)

**⚠️ WICHTIG**: Datenbank-Wechsel = Kompletter `packages/infra/` Austausch!

### Von JSON-DB zu PostgreSQL

**Wann**: Wenn App production-ready wird oder mehr Features braucht (Transaktionen, Concurrency)

**Prompt an KI**:
```
Tausche kompletten infra/ Ordner für PostgreSQL:

1. Sichere aktuellen infra/ Ordner: mv packages/infra packages/infra-json-backup
2. Erstelle neuen packages/infra/ mit:
   - database/ (Prisma + PostgreSQL)
   - iac/ (CDK Stacks für Deployment)
3. infra/database/ nutzt Prisma als ORM
4. Gleiche API wie vorher (@app/database Interface bleibt gleich)
5. docker-compose.yml für lokale PostgreSQL
6. Dokumentiere in WORKLOG.md

WICHTIG: API-Code bleibt unverändert, nur infra/ wird ausgetauscht!
```

**Neue Struktur**:
```
packages/infra/
├── database/
│   ├── package.json         → prisma, @prisma/client
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma    → Datenbank-Schema
│   │   └── migrations/      → Migrations
│   ├── src/
│   │   └── index.ts         → Gleiche API wie vorher
│   └── README.md
├── iac/
│   └── stacks/
│       └── database-stack.ts → RDS Stack (optional)
├── package.json
└── README.md

docker-compose.yml           → PostgreSQL-Container (Root)
```

---

### Von JSON-DB zu DynamoDB

**Wann**: Wenn Serverless-Deployment auf AWS gewünscht

**Prompt an KI**:
```
Tausche kompletten infra/ Ordner für DynamoDB:

1. Sichere aktuellen infra/ Ordner: mv packages/infra packages/infra-json-backup
2. Erstelle neuen packages/infra/ mit:
   - database/ (AWS SDK v3 + DynamoDB)
   - iac/ (CDK Stacks für DynamoDB Tables)
3. Implementiere Single-Table-Design
4. Gleiche API wie vorher (@app/database Interface bleibt gleich)
5. Dokumentiere in WORKLOG.md

WICHTIG: API-Code bleibt unverändert, nur infra/ wird ausgetauscht!
```

**Neue Struktur**:
```
packages/infra/
├── database/
│   ├── package.json         → @aws-sdk/client-dynamodb
│   ├── tsconfig.json
│   ├── src/
│   │   └── index.ts         → AWS SDK Integration
│   └── README.md
├── iac/
│   └── stacks/
│       └── database-stack.ts → DynamoDB Tables
├── package.json             → aws-cdk-lib
└── README.md
```

---

### Migration-Checkliste

**Vor Migration**:
- [ ] Alle Tests grün (`pnpm test`)
- [ ] Aktuelles Schema dokumentiert
- [ ] Backup: `mv packages/infra packages/infra-backup`

**Nach Migration**:
- [ ] Neuer infra/ Ordner funktioniert lokal
- [ ] @app/database API ist identisch (API-Tests noch grün)
- [ ] docker-compose.yml (falls PostgreSQL)
- [ ] CDK-Stack deployed (falls DynamoDB)
- [ ] WORKLOG.md aktualisiert
- [ ] ADR erstellt

---

## 🚀 Quick Reference

### Installation
```bash
pnpm install
```

### Entwicklung
```bash
pnpm --filter @app/api dev          # Backend
pnpm --filter @app/frontend dev     # Frontend
pnpm --filter @app/routes-portal dev # Portal
```

### Build & Test
```bash
pnpm -r build        # Alle Packages bauen
pnpm test            # Alle Tests
pnpm typecheck       # TypeScript-Check
pnpm lint            # ESLint + Prettier
pnpm guardrails      # Code-Quality-Check
```

### Deployment
```bash
cd packages/infra
pnpm synth           # Preview CloudFormation
pnpm deploy          # Deploy to AWS
```

---

**Letzte Aktualisierung**: 2025-10-07
**Bei Fragen**: Siehe `AGENT.md` oder frage den Projekt-Owner
