# Prompt Addon für KI-Agenten

## Zweck

Diese Datei enthält einen **Standard-Block**, den du als User **an JEDEN Prompt** (initial + refinement) anhängen solltest.

**Warum?** KI-Assistenten vergessen manchmal wichtige Dateien zu lesen oder Dokumentation zu aktualisieren. Dieser Block erinnert die KI bei jedem Prompt daran.

---

## 📋 Der Copy-Paste Block

**Kopiere diesen Block und füge ihn ans Ende JEDES Prompts ein:**

```
---
📋 KONTEXT-CHECK (PFLICHT):
1. Lies: ARCHITECTURE.md (Setup-Checklist + Common Pitfalls!), AGENT.md (Phase 6 MANDATORY!), ROADMAP.md, WORKLOG.md, packages/*/README.md
2. Setup beachten: tsconfig.base.json, ES Module Pattern (KEIN require.main!), mkdir recursive, Database test:init
3. Nach Task: Aktualisiere ROADMAP.md + WORKLOG.md
4. Befolge 6-Phasen-Workflow - Phase 6 ist MANDATORY (pnpm validate, manuelle Tests!)
5. Checke CHECKLIST.md - ALLE Punkte müssen ✅ sein bevor "fertig"!
---
```

---

## Beispiel-Nutzung

### Initial Prompt (Neue App)

```
Erstelle eine Todo-App mit:
- CRUD-API für Tasks (title, description, status, dueDate)
- React-Frontend mit Task-Liste
- JSON-DB für Persistenz

---
📋 KONTEXT-CHECK (PFLICHT):
1. Lies: ARCHITECTURE.md (Setup-Checklist!), AGENT.md (ES Modules, File System!), ROADMAP.md, WORKLOG.md, packages/*/README.md
2. Setup beachten: tsconfig.base.json, ES Module Pattern (KEIN require.main!), mkdir recursive, process.cwd() Awareness
3. Nach Task: Aktualisiere ROADMAP.md + WORKLOG.md (+ ADR-Template.md falls Architektur-Entscheidung)
4. Befolge 6-Phasen-Workflow aus AGENT.md
5. Beachte Package-Contracts (bereitgestellte/konsumierte APIs)
---
```

### Refinement Prompt (Follow-Up)

```
Füge ein Suchfeld für Tasks hinzu.

---
📋 KONTEXT-CHECK (PFLICHT):
1. Lies: ARCHITECTURE.md (Setup-Checklist!), AGENT.md (ES Modules, File System!), ROADMAP.md, WORKLOG.md, packages/*/README.md
2. Setup beachten: tsconfig.base.json, ES Module Pattern (KEIN require.main!), mkdir recursive, process.cwd() Awareness
3. Nach Task: Aktualisiere ROADMAP.md + WORKLOG.md (+ ADR-Template.md falls Architektur-Entscheidung)
4. Befolge 6-Phasen-Workflow aus AGENT.md
5. Beachte Package-Contracts (bereitgestellte/konsumierte APIs)
---
```

### Bug-Fix Prompt

```
Der Login funktioniert nicht mehr, bitte debuggen.

---
📋 KONTEXT-CHECK (PFLICHT):
1. Lies: ARCHITECTURE.md (Setup-Checklist!), AGENT.md (ES Modules, File System!), ROADMAP.md, WORKLOG.md, packages/*/README.md
2. Setup beachten: tsconfig.base.json, ES Module Pattern (KEIN require.main!), mkdir recursive, process.cwd() Awareness
3. Nach Task: Aktualisiere ROADMAP.md + WORKLOG.md (+ ADR-Template.md falls Architektur-Entscheidung)
4. Befolge 6-Phasen-Workflow aus AGENT.md
5. Beachte Package-Contracts (bereitgestellte/konsumierte APIs)
---
```

---

## Warum ist das nötig?

### Problem
KI-Assistenten haben folgende Tendenz:
- ❌ Vergessen wichtige Kontext-Dateien zu lesen
- ❌ Überspringen Dokumentations-Updates (ROADMAP, WORKLOG)
- ❌ Ignorieren Package-Contracts (API-Schnittstellen)
- ❌ Erstellen Code ohne openapi.yaml zu prüfen

### Lösung
Durch den **Prompt-Addon** am Ende jedes Prompts:
- ✅ Erzwingst du, dass KI die richtigen Dateien liest
- ✅ Stellst du sicher, dass Dokumentation aktualisiert wird
- ✅ Erinnerst du an den definierten Workflow
- ✅ Verhinderst du, dass wichtige Schritte übersprungen werden

---

## Best Practices

### 1. Immer anhängen
Füge den Block **wirklich an JEDEN Prompt** an - auch kurze Follow-Ups!

**Beispiel** (auch bei kurzen Prompts):
```
Ändere Button-Farbe zu blau.

---
📋 KONTEXT-CHECK (PFLICHT):
1. Lies: ARCHITECTURE.md (Setup-Checklist!), AGENT.md (ES Modules, File System!), ROADMAP.md, WORKLOG.md, packages/*/README.md
2. Setup beachten: tsconfig.base.json, ES Module Pattern (KEIN require.main!), mkdir recursive, process.cwd() Awareness
3. Nach Task: Aktualisiere ROADMAP.md + WORKLOG.md (+ ADR-Template.md falls Architektur-Entscheidung)
4. Befolge 6-Phasen-Workflow aus AGENT.md
5. Beachte Package-Contracts (bereitgestellte/konsumierte APIs)
---
```

### 2. Copy-Paste aus dieser Datei
Speichere dir ein Snippet oder öffne diese Datei parallel → Copy-Paste in 2 Sekunden.

### 3. Bei langen Sessions häufiger
Wenn Chat länger als 20 Nachrichten wird, zusätzlich explizit fragen:
```
Hast du ROADMAP.md und WORKLOG.md kürzlich gecheckt?
Bitte kurz zusammenfassen was aktuell läuft.
```

---

## Alternativen (falls zu aufwändig)

Falls dir das Copy-Pasten zu nervig ist:

### Option 1: Kürzere Version
```
---
📋 Lies: ARCHITECTURE, AGENT, ROADMAP, WORKLOG | Update: ROADMAP, WORKLOG
---
```

### Option 2: Slash Command (falls verfügbar)
Erstelle `.claude/commands/check.md` mit dem Inhalt und nutze `/check` vor jedem Task.

### Option 3: Alle 5-10 Prompts
Statt bei jedem Prompt, erinnere nur alle 5-10 Prompts explizit.

---

## FAQ

### Muss ich das wirklich JEDES MAL copy-pasten?
Ja - das ist die einzige zuverlässige Methode, da Claude Code keine persistente System-Prompt-Modifikation erlaubt.

### Kann ich das abkürzen?
Ja, siehe "Alternativen" oben - aber je kürzer, desto größer die Chance dass KI es ignoriert.

### Nervt die KI das nicht?
Nein - es ist Teil deines User-Prompts und wird als Instruktion verstanden, nicht als Spam.

### Gibt es keine automatische Lösung?
Leider nein - `.claude/CLAUDE.md` wird auch manchmal ignoriert. Diese manuelle Methode ist aktuell am zuverlässigsten.

---

**Viel Erfolg beim Vibecoding! 🚀**
