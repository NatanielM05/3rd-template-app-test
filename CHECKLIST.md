# ✅ Pre-Delivery Checklist

**Für KI-Agenten**: Bevor du die App als "fertig" markierst, **ALLE** diese Punkte müssen ✅ sein!

---

## 🔨 Build & Compilation

- [ ] **`pnpm install`** läuft ohne Fehler
- [ ] **`pnpm -r build`** läuft ohne Fehler
  - Keine TypeScript-Compilation Errors
  - Alle Packages bauen erfolgreich
- [ ] **`pnpm -r typecheck`** läuft ohne Fehler (falls implementiert)
- [ ] Keine **TS6133** Errors (unused variables)
  - Fix: Prefix mit `_` oder nutze/lösche die Variable
- [ ] Keine **TS2742** Errors (type inference)
  - Fix: Explizite Type-Annotation hinzufügen

---

## 🗄️ Database

- [ ] **`pnpm --filter @app/database build`** ist ✅ grün
- [ ] **`pnpm --filter @app/database test:init`** ist ✅ grün
  - Output zeigt: `✅ All database operations work!`
  - Kein `ENOENT` Error
- [ ] `packages/api/data/` Ordner wird **automatisch erstellt**
  - `mkdir(dirname(dbPath), { recursive: true })` in `init()` implementiert
- [ ] Mindestens **1 CRUD-Test** existiert und läuft
  - Create, Read, Delete operations getestet

---

## 🚀 Server Start

- [ ] **Backend startet**: `pnpm --filter @app/api dev`
  - Console zeigt: `Server läuft auf Port 3001` (oder ähnlich)
  - **Keine Errors** im Output
  - Server bleibt laufen (crashed nicht nach 5 Sekunden)
- [ ] **Health-Check funktioniert**:
  ```bash
  curl http://localhost:3001/api/v1/health
  ```
  - Response: `{"status":"ok"}` oder ähnlich (200 OK)

---

## 🎨 Frontend Start

- [ ] **Frontend startet**: `pnpm --filter @app/frontend dev`
  - Vite/Dev-Server startet ohne Errors
  - Console zeigt: `Local: http://localhost:3000`
  - **Keine roten Errors** in Terminal
- [ ] **Browser lädt**: http://localhost:3000
  - Seite lädt ohne weiße Seite / Crash
  - **Keine roten Errors** in Browser-Console (F12)
  - UI-Komponenten werden angezeigt

---

## 🧪 Functional Tests

- [ ] **Hauptfunktion manuell getestet**
  - Beispiel Todo-App: Todo erstellen → angezeigt → als erledigt markieren → löschen
  - Jeder Schritt funktioniert wie erwartet
- [ ] **Daten werden persistiert**
  ```bash
  cat packages/api/data/db.json
  ```
  - Datei existiert
  - Enthält erstellte Daten (nicht leer)
- [ ] **UI zeigt Daten korrekt**
  - Erstellte Items erscheinen in der Liste
  - Updates werden sofort sichtbar
  - Gelöschte Items verschwinden

---

## 📝 Documentation

- [ ] **ROADMAP.md**: Alle Tasks als ✅ markiert
  - Keine offenen Tasks für die aktuelle Phase
- [ ] **WORKLOG.md**: Implementation dokumentiert
  - Was wurde gebaut
  - Welche Technologien verwendet
  - Wichtige Entscheidungen festgehalten
- [ ] **Keine `TODO` Comments** im Code
  - Alle TODOs entweder erledigt oder gelöscht
- [ ] **Keine `console.log()` Debug-Statements**
  - Cleanup: Debug-Logs entfernt

---

## 🎯 Final Validation

- [ ] **`pnpm validate`** läuft durch (all-in-one check)
  - Database Test ✅
  - Build ✅
  - Type-Check ✅

---

## ⚠️ Wichtig!

**Wenn auch nur EINER dieser Punkte ❌ ist → Die App ist NICHT fertig!**

Sage dem User NICHT "Die App ist fertig" bevor ALLE Punkte ✅ sind.

---

## 💡 Troubleshooting

Bei Problemen siehe:
- **ARCHITECTURE.md** - Common Pitfalls Sektion
- **AGENT.md** - Phase 6 Validation Details
- **README.md** - Häufige Probleme & Lösungen
- **packages/infra/database/README.md** - Database-Setup

---

**Version**: 1.0
**Letzte Aktualisierung**: 2025-10-07
