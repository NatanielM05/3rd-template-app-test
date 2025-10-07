# KI-Agent Instruktionen

Diese Datei enthält Anweisungen für KI-Assistenten zur Arbeit mit diesem Template.

---

## 🎯 Zielsetzung

Dieses Template ermöglicht **schnelle Full-Stack-Entwicklung** durch KI-Assistenten.
Von einem Prompt zu lauffähigem Code.

---

## 📚 Bei Session-Start IMMER lesen

**Kontext-Rotation**: Neue Session für jedes Feature/Phase starten!

### Diese Dateien geben dir Orientierung:
1. **ARCHITECTURE.md** - Architektur-Übersicht, Package-Struktur
2. **ROADMAP.md** - Aktuelle Phase & offene Tasks
3. **WORKLOG.md** - Was bereits implementiert wurde
4. **ADR-Template.md** - Architektur-Entscheidungen
5. **packages/*/README.md** - Package-Spezifikationen

**Wichtig**: Diese Dateien sind statisch (nicht pflegen!), nur ROADMAP, WORKLOG und ADR werden aktualisiert.

---

## 🔄 Entwicklungs-Workflow (6 Phasen)

### Phase 1: Anforderungen verstehen
1. User-Prompt analysieren
2. **ROADMAP.md** aktualisieren: Neue Phase mit Tasks erstellen
3. Bei Architektur-Entscheidungen: **ADR** in ADR-Template.md ergänzen

### Phase 2: API-Design (Contract First)
1. **packages/openapi/openapi.yaml** erweitern
2. Endpoints, Schemas, Request/Response definieren
3. Validieren: `cd packages/openapi && pnpm validate`

### Phase 3: Backend-Implementierung
1. Handler in `packages/api/src/handlers/` erstellen
2. Services in `packages/api/src/services/` (Business-Logik)
3. Repositories in `packages/api/src/repositories/` (nutzen `@app/database` aus `infra/database/`)
4. Tests schreiben (`*.test.ts`)

**Database**: Nutze `@app/database` (JSON-DB in `packages/infra/database/` per Default)

### Phase 4: Frontend-Implementierung
1. Komponenten in `packages/frontend/src/components/` erstellen
2. Pages in `packages/frontend/src/pages/`
3. API-Integration (Services)
4. Tests schreiben (`*.test.tsx`)

### Phase 5: Infrastruktur
1. CDK-Stacks in `packages/infra/iac/stacks/` definieren
2. Resources erstellen (Lambda, API Gateway, S3, etc.)
3. IAM-Permissions (Least Privilege)
4. Monitoring (CloudWatch Alarms)

### Phase 6: Validation & Testing (⚠️ MANDATORY - ÜBERSPRINGE NICHTS!)

**🚨 KRITISCH**: Diese Schritte sind PFLICHT! Die App ist NICHT fertig ohne diese Validierung!

#### 1. Database Test (PFLICHT!)

```bash
pnpm --filter @app/database build
pnpm --filter @app/database test:init
```

**Erwartung**: `✅ All database operations work!`

**Bei Fehler**:
- `ENOENT: no such file or directory` → `mkdir` in `init()` fehlt!
- Andere Errors → Database-Implementierung ist kaputt

**⚠️ STOPP hier wenn Test fehlschlägt!** Database MUSS funktionieren!

---

#### 2. Build Test (PFLICHT!)

```bash
pnpm -r build
```

**Erwartung**: Alle Packages bauen ohne Errors

**Häufige Fehler & Lösungen**:

**Error**: `TS6133: 'BadRequestError' is declared but its value is never read`
```typescript
// ❌ Falsch:
import { BadRequestError } from './errors.js';
catch (error) { throw new Error('failed'); }

// ✅ Fix:
import { BadRequestError as _BadRequestError } from './errors.js';
// Oder nutze es, oder lösche den Import!
```

**Error**: `TS2742: The inferred type of 'healthRouter' cannot be named`
```typescript
// ❌ Falsch:
export const healthRouter = Router();

// ✅ Fix:
import type { Router } from 'express';
export const healthRouter: Router = Router();
```

**⚠️ Bei JEDEM Build-Fehler → STOPP und behebe!** Kein Weitermachen mit Errors!

---

#### 3. Type-Check Test (PFLICHT!)

```bash
pnpm -r typecheck
```

**Erwartung**: Keine TypeScript-Errors

---

#### 4. Server-Start Test (PFLICHT!)

**Terminal 1 - Backend**:
```bash
pnpm --filter @app/api dev
```

**Erwartung**:
- `Server läuft auf Port 3001` (oder ähnlich)
- KEINE Errors im Output
- Server bleibt laufen (crashed nicht)

**Terminal 2 - Frontend** (NACH API läuft):
```bash
pnpm --filter @app/frontend dev
```

**Erwartung**:
- Vite startet ohne Errors
- `Local: http://localhost:3000` erscheint
- KEINE roten Errors im Browser-Console

---

#### 5. Funktions-Test (PFLICHT!)

**Backend Health-Check**:
```bash
curl http://localhost:3001/api/v1/health
```
**Erwartung**: `{"status":"ok"}` oder ähnlich (200 OK)

**Frontend Browser**:
- Öffne http://localhost:3000
- **Erwartung**: Seite lädt ohne Errors

**Manuelle Hauptfunktion testen**:
- Beispiel Todo-App: Erstelle Task, markiere als erledigt, lösche Task
- **Erwartung**: Alle Aktionen funktionieren

**Database Persistenz prüfen**:
```bash
cat packages/api/data/db.json
```
**Erwartung**: Daten sind vorhanden (Tasks, Users, etc.)

---

#### 6. Dokumentation (PFLICHT!)

- [ ] **ROADMAP.md**: Alle Tasks als ✅ markiert
- [ ] **WORKLOG.md**: Implementation dokumentiert (was wurde gebaut, welche Technologien)
- [ ] Keine `TODO` Comments im Code

---

### ⚠️ Finale Validierung

**Checke CHECKLIST.md im Root** - ALLE Punkte müssen ✅ sein!

**Wenn EINER dieser Schritte fehlschlägt → Die App ist NICHT fertig!**

Sage dem User NICHT "Die App ist fertig" bevor diese Phase komplett abgeschlossen ist.

---

## 📋 Dateien die du pflegen musst

### ✅ Regelmäßig aktualisieren:
- **ROADMAP.md** - Zu Beginn jeder Phase (Tasks hinzufügen), nach Abschluss (abhaken)
- **WORKLOG.md** - Nach jedem signifikanten Task (was wurde gemacht)
- **ADR-Template.md** - Bei wichtigen Architektur-Entscheidungen (neuer ADR)

### ❌ NICHT pflegen (nur lesen!):
- ARCHITECTURE.md - Statische Architektur-Übersicht
- AGENT.md - Diese Datei
- README.md - Projekt-Dokumentation
- packages/*/README.md - Package-Spezifikationen

---

## 🏗️ Code-Konventionen

### Naming
- **Dateien**: kebab-case (`user-service.ts`)
- **Klassen**: PascalCase (`UserService`)
- **Funktionen**: camelCase (`getUserById`)
- **Konstanten**: UPPER_SNAKE_CASE (`MAX_RETRIES`)

### Struktur (siehe packages/*/README.md für Details)
Jedes Package hat eine klare Ordnerstruktur - siehe jeweilige README.md.

### Database (Teil von Infra!)
- **Default**: JSON-DB (`@app/database` → `packages/infra/database/`)
- **Verwendung**: `import { db } from '@app/database';`
- **⚠️ WICHTIG**: Datenbank ist in `packages/infra/database/` - gekoppelt mit Infrastruktur!
- **Datenbank-Wechsel**: Kompletter `packages/infra/` Austausch (siehe ARCHITECTURE.md)
- **Warum?**: Datenbank + Infrastruktur gehören zusammen (Docker, CDK-Stacks, etc.)

**Wichtig**: API-Code nutzt immer `@app/database` (abstrahiert)

### Testing
- Tests neben Code: `*.test.ts` oder `*.test.tsx`
- Mindestens 70% Coverage anstreben
- Integration-Tests in `__tests__/integration/`

### ES Module Patterns (⚠️ KRITISCH!)

**Alle Packages verwenden `"type": "module"` in package.json!**

#### ❌ NICHT verwenden (CommonJS-Pattern):
```typescript
// FALSCH - funktioniert NICHT mit ES Modules!
if (require.main === module) {
  startServer();
}
```

#### ✅ Stattdessen verwenden (ES Module-Patterns):

**Option 1: Direkt ausführen (EMPFOHLEN für Backend)**
```typescript
// src/index.ts
import express from 'express';

const app = express();
// ... setup

const PORT = process.env.API_PORT || 3001;

// Direkt starten - kein if-Block nötig!
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
```

**Option 2: Export + Conditional (für Tests)**
```typescript
// src/index.ts
export const startServer = async () => {
  const app = express();
  // ... setup
  return app.listen(PORT);
};

// Nur starten wenn direkt ausgeführt
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}
```

**Option 3: Separater Entry Point**
```typescript
// src/server.ts - Logik
export const createApp = () => {
  const app = express();
  // ... setup
  return app;
};

// src/index.ts - Entry Point
import { createApp } from './server.js';
createApp().listen(PORT); // Direkt starten
```

**⚠️ WICHTIG für Backend (`packages/api/`)**:
- Verwende Option 1 (direkt starten) für einfache API-Server
- Server-Code gehört in `src/index.ts` und wird IMMER direkt ausgeführt
- Kein Conditional nötig - `pnpm dev` startet mit `tsx watch src/index.ts`

### File System Operations (⚠️ KRITISCH!)

**Ordner erstellen IMMER mit `{ recursive: true }`!**

#### ❌ NICHT davon ausgehen dass Ordner existieren:
```typescript
// FALSCH - crash wenn Ordner nicht existiert!
const db = new JSONFile('data/db.json');
```

#### ✅ Ordner vorher erstellen:
```typescript
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

async init() {
  const dbPath = 'data/db.json';

  // Erstelle Parent-Ordner falls nicht vorhanden
  await mkdir(dirname(dbPath), { recursive: true });

  // Jetzt sicher die Datei erstellen
  const db = new JSONFile(dbPath);
}
```

**Für `packages/infra/database/`**:
- Database-Klasse MUSS Ordner selbst erstellen in `init()`
- Nutze `mkdir(recursive: true)` - wirft keinen Fehler wenn Ordner existiert
- Dokumentiere in README.md wo die Daten gespeichert werden

---

## 🔒 Guardrails & Sicherheit

### Automatisch geprüft (via guardrails.json):
- ❌ Hardcoded Secrets (Passwörter, API-Keys)
- ❌ `eval()` oder `Function()` (dynamische Code-Execution)
- ❌ Sensible Daten in Console-Logs

### Nur diese Dateien darfst du ändern:
- Source-Code (`*.ts`, `*.tsx`, `*.js`, `*.jsx`)
- Konfiguration (`*.json`, `*.yaml`, `*.config.*`)
- Dokumentation (`*.md`)

### Diese Dateien sind blockiert:
- `.git/**`, `node_modules/**`, `pnpm-lock.yaml`
- `dist/**`, `build/**`, `cdk.out/**`
- `.env`, `.env.*`

---

## 🔥 Package Hot-Swap Workflow

**Kernfeature**: Jedes Package ist austauschbar durch README-Contract!

### Wie funktioniert Package-Austausch?

1. **Altes Package entfernen**:
   ```bash
   rm -rf packages/<package-name>
   ```

2. **Neues Package mit neuer README erstellen**:
   ```bash
   mkdir packages/<package-name>
   # Schreibe neue README.md mit:
   # - Bereitgestellte Endpoints/APIs
   # - Konsumierte Endpoints/APIs
   # - Exportierte Interfaces
   # - Technologie-Stack
   ```

3. **Du wirst gefragt** (Prompt vom User):
   > "Package `<package-name>` getauscht. Neue Specs in README.md.
   > Lies ARCHITECTURE.md und packages/<package-name>/README.md.
   > Erstelle das Package basierend auf den Specs."

4. **Du liest**:
   - `ARCHITECTURE.md` → Verstehe Gesamtarchitektur
   - `packages/<package-name>/README.md` → Verstehe Package-Contract
   - `packages/openapi/openapi.yaml` → API-Definitionen
   - Andere Package-READMEs → Verstehe Dependencies

5. **Du erstellst**:
   - `package.json` mit Dependencies
   - Config-Files (tsconfig.json, vite.config.ts, etc.)
   - `src/` mit Implementation basierend auf README-Contract
   - Tests

6. **⚠️ WICHTIG**: Beachte API-Contracts!
   - **Bereitgestellte APIs** müssen identisch bleiben
   - **Konsumierte APIs** müssen mit anderen Packages matchen
   - Technologie-Stack kann sich ändern, aber Interfaces bleiben gleich

### Beispiel: Frontend-Swap (React → Svelte)

**User macht**:
```bash
rm -rf packages/frontend
mkdir packages/frontend
# Schreibt neue README.md mit Svelte-Specs
```

**User's Prompt**:
> "Frontend-Package getauscht. Jetzt Svelte statt React.
> Lies README.md und ARCHITECTURE.md.
> Erstelle Svelte-App die gleiche APIs konsumiert."

**Du liest**:
- `packages/frontend/README.md` → Svelte + Vite, konsumiert `/api/v1/users`, etc.
- `packages/api/README.md` → Stellt `/api/v1/users` bereit
- `packages/openapi/openapi.yaml` → User-Schema

**Du erstellst**:
- `package.json` (Svelte, Vite Dependencies)
- `vite.config.ts`
- `tsconfig.json`
- `src/` mit Svelte-Components die **gleiche APIs** nutzen wie React-Version

**Ergebnis**: Svelte-App funktioniert sofort mit existierendem Backend!

### Package-Swap Checklist für KI

Beim Erstellen eines neuen Packages nach Swap:

- [ ] README.md gelesen und verstanden
- [ ] ARCHITECTURE.md für Kontext gelesen
- [ ] Bereitgestellte APIs identifiziert
- [ ] Konsumierte APIs identifiziert und mit anderen Packages abgeglichen
- [ ] package.json mit korrekten Dependencies erstellt
- [ ] Config-Files erstellt (tsconfig, vite/next config, etc.)
- [ ] src/ Struktur basierend auf README erstellt
- [ ] API-Contracts eingehalten
- [ ] Tests geschrieben

---

## 🎯 Typische Use-Cases

### Neue API-Endpoint
1. `packages/openapi/openapi.yaml` erweitern
2. `packages/api/src/handlers/` Handler erstellen
3. `packages/api/src/services/` Service-Logik
4. Tests schreiben

### Neue UI-Komponente
1. `packages/frontend/src/components/` Komponente erstellen
2. `packages/frontend/src/pages/` Integration
3. Tests schreiben

### Neue AWS-Resource
1. `packages/infra/iac/stacks/` Stack erweitern
2. IAM-Permissions definieren
3. Tagging hinzufügen
4. CloudWatch Alarms konfigurieren

### Package austauschen (Hot-Swap)
Siehe [Package Hot-Swap Workflow](#-package-hot-swap-workflow) oben!

---

## ✅ Do's & ❌ Don'ts

### ✅ DO
- **Contract-First**: OpenAPI zuerst, dann Implementation
- **Tests während Entwicklung** schreiben
- **Dokumentation sofort** aktualisieren (ROADMAP, WORKLOG, ADR)
- **SOLID-Prinzipien** befolgen
- **Type-Safety** nutzen (TypeScript `strict: true`)
- **Kleine Commits** (fokussiert)

### ❌ DON'T
- Implementation ohne OpenAPI-Spec
- Tests nachträglich schreiben
- Dokumentation "später" machen
- Hardcoded Werte (nutze Config)
- `any` Type (außer explizit nötig)
- Große Funktionen (>50 Zeilen)
- Dependencies ohne Begründung hinzufügen

---

## 🚀 Wichtige Befehle

```bash
# Installation
pnpm install

# Entwicklung (Package-spezifisch)
pnpm --filter @app/api dev
pnpm --filter @app/frontend dev
pnpm --filter @app/routes-portal dev

# Build & Test (alle Packages)
pnpm -r build
pnpm test
pnpm typecheck
pnpm lint

# Guardrails (vor Commit)
pnpm guardrails

# Deployment
cd packages/infra
pnpm synth    # Preview
pnpm deploy   # Deploy to AWS
```

---

## 🆘 Bei Problemen

1. **Dokumentation prüfen**: ARCHITECTURE.md, packages/*/README.md, ADR-Template.md
2. **Bestehenden Code analysieren**: Patterns erkennen
3. **User fragen**: Bei Unklarheiten
4. **Alternativen vorschlagen**: Mehrere Optionen präsentieren
5. **ADR erstellen**: Bei Entscheidungsbedarf

---

## ✅ Erfolgskriterien

Eine Implementation ist **erfolgreich**, wenn:

✅ `pnpm guardrails` passiert (keine Sicherheits-Issues)
✅ `pnpm test` grün (alle Tests bestehen)
✅ `pnpm -r build` erfolgreich (alle Packages bauen)
✅ ROADMAP.md aktualisiert (Tasks abgehakt)
✅ WORKLOG.md aktualisiert (Implementierung dokumentiert)
✅ ADR-Template.md ergänzt (falls Architektur-Entscheidung)

---

**Version**: 1.0
**Letzte Aktualisierung**: 2025-10-07
