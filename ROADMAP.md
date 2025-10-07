# Projekt Roadmap

Die Roadmap beschreibt die Entwicklung in **Phasen**.  
Jede Phase umfasst abgeschlossene Arbeitspakete (Features, Integrationen, Infrastruktur).  
Eine Phase ist abgeschlossen, wenn **alle Punkte** erledigt und getestet sind.

---

## Pflegehinweise für KI-Agents

- Phasen-Status: `open` | `in-progress` | `closed`.  
- Phasen **nicht löschen**, nur den Status ändern.  
- Einzelne Tasks in einer Phase:  
  - ✅ markieren = erledigt (mit Datum, z. B. [2025-10-07]).  
  - ❌ markieren = verworfen (mit Datum).  
- Änderungen **immer chronologisch** dokumentieren.  
- Verweise auf ADRs ergänzen, falls eine Entscheidung betroffen ist.  
- Roadmap **nicht mit Business-Logik füllen** → nur Struktur + Fortschritt.  

---

## Struktur einer Phase

### Phase X – [Titel] – *Status*
- [ ] Task 1  
- [ ] Task 2  
- [ ] Task 3  

*(bei Erledigung/Verwerfung entsprechend mit ✅ oder ❌ markieren)*

---

## Phase 0 – Bootstrap – closed
- ✅ [2025-10-07] Initiales Monorepo eingerichtet
- ✅ [2025-10-07] CI-Basis erstellt

---

## Phase 1 – ToDo-App: Planung – closed
- ✅ [2025-10-07] ROADMAP.md erstellt
- ✅ [2025-10-07] Architektur-Dokumente gelesen (ARCHITECTURE.md, AGENT.md)
- ✅ [2025-10-07] Package-Contracts analysiert (alle packages/*/README.md)
- ✅ [2025-10-07] Feature-Requirements dokumentiert

### Feature-Requirements
**Aufgabenverwaltung**
- Neue Aufgaben (Titel, Beschreibung, Fälligkeitsdatum)
- Status: offen/erledigt
- Bearbeiten & Löschen

**Aufgabenübersicht**
- Liste offener Aufgaben
- Erledigte Aufgaben ein-/ausblenden
- Sortierung nach Fälligkeitsdatum

**Erweiterungen**
- Kategorien/Tags
- Suchfeld
- Lokale Speicherung (JSON-DB)

---

## Phase 2 – ToDo-App: API-Design (Contract-First) – closed
- ✅ [2025-10-07] openapi.yaml erweitert
  - ✅ `/api/v1/tasks` Endpoints (GET, POST, PUT, DELETE, PATCH)
  - ✅ Task-Schema definiert
  - ✅ Request/Response-Schemas erstellt
- ✅ [2025-10-07] Validierung durchgeführt

---

## Phase 3 – ToDo-App: Backend-Implementation – closed
- ✅ [2025-10-07] Database (infra/database/)
  - ✅ Task-Schema implementiert
  - ✅ Init-Test erfolgreich
- ✅ [2025-10-07] API (api/)
  - ✅ Ordnerstruktur erstellt
  - ✅ Routes implementiert (health.ts, tasks.ts)
  - ✅ Error-Handler Middleware
  - ✅ Build-Test erfolgreich

---

## Phase 4 – ToDo-App: Frontend-Implementation – closed
- ✅ [2025-10-07] Frontend (React + Vite)
  - ✅ Config-Files (vite, tsconfig, tailwind, postcss)
  - ✅ Entry Point (main.tsx, App.tsx)
  - ✅ API-Client + TanStack Query Hooks
  - ✅ Components (TaskList, TaskItem, TaskForm)
  - ✅ Pages (TasksPage)
  - ✅ Build-Test erfolgreich
- ⚠️ Admin Portal (Next.js) - übersprungen (optional)

---

## Phase 5 – ToDo-App: Infrastructure – closed
- ✅ [2025-10-07] Database-Package (JSON-DB)
  - ✅ src/index.ts implementiert
  - ✅ Init-Logic mit mkdir
  - ✅ CRUD-Operationen (Tasks)
  - ✅ Test: `pnpm --filter @app/database test:init` erfolgreich

---

## Phase 6 – ToDo-App: Validation & Testing – closed
- ✅ [2025-10-07] Database-Tests (build + test:init)
- ✅ [2025-10-07] Build-Tests (pnpm -r build) - alle erfolgreich
- ✅ [2025-10-07] Server-Start-Tests (API läuft auf Port 3001)
- ✅ [2025-10-07] Funktions-Tests (CRUD erfolgreich)
- ✅ [2025-10-07] Daten-Persistenz geprüft (db.json wird erstellt)
- ✅ [2025-10-07] WORKLOG.md erstellt
- ✅ [2025-10-07] Keine TODO-Comments  
