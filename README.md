# AI-First App Development Template

Monorepo-Template für **KI-gestützte Full-Stack-Entwicklung**.
Von einem Prompt zu lauffähigem Code.

---

## 🎯 Was ist das?

Ein **"Application as Specification"** Template für KI-Assistenten (Claude, GPT-4, etc.):

✅ **Hot-Swap Packages** - Jedes Package austauschbar durch README-Contract
✅ **Kein Framework-Lock-in** - React → Svelte, AWS → Vercel mit 1 Prompt
✅ **README = Contract** - KI generiert Code basierend auf Specs
✅ **Minimale manuelle Arbeit** - Ordner austauschen + Prompt = Fertig
✅ **Contract-First** - OpenAPI als Single Source of Truth
✅ **Context-Rotation** - Session-Neustart ohne Informationsverlust

---

## 📦 Struktur

```
packages/
├── openapi/          → API-Spezifikation (OpenAPI 3.0)
├── api/              → Backend (Node.js, TypeScript, Lambda)
├── frontend/         → Web-App (React, Vite)
├── routes-portal/    → Admin-Dashboard (Next.js)
└── infra/            → Infrastructure (AWS CDK) + Database (JSON/PostgreSQL/DynamoDB)
    └── database/     → Datenbank-Implementation

Root-Dokumentation:
├── SETUP.md          → Setup-Anleitung (START HERE!)
├── ARCHITECTURE.md   → Architektur-Übersicht + Hot-Swap Konzept
├── AGENT.md          → KI-Instruktionen (statisch)
├── PROMPT-ADDON.md   → Copy-Paste Block für JEDEN Prompt ⚠️
├── ROADMAP.md        → Phasen & Tasks (dynamisch)
├── WORKLOG.md        → Historie (dynamisch)
└── ADR-Template.md   → Architektur-Entscheidungen (dynamisch)
```

**⚠️ Jedes Package ist austauschbar!** Siehe [ARCHITECTURE.md](ARCHITECTURE.md) für Hot-Swap Workflow.

---

## 🚀 Quick Start (2 Minuten)

### 1. Voraussetzungen

- **Node.js >= 20** - [Download](https://nodejs.org/)
- **pnpm >= 9** - Package Manager (schneller als npm/yarn)
  ```bash
  # pnpm installieren (falls noch nicht installiert):
  npm install -g pnpm@9

  # Prüfen ob installiert:
  pnpm --version
  # Sollte ausgeben: 9.x.x
  ```
- **Keine Datenbank nötig!** (JSON-DB)

### 2. Installation

```bash
git clone https://github.com/yourusername/ai-app-template.git my-app
cd my-app

# Dependencies installieren
pnpm install

# Environment einrichten
cp .env.example .env.local
```

### 3. Entwicklung starten

```bash
# Alle Services parallel starten
pnpm dev

# Oder einzeln:
pnpm --filter @app/api dev         # Port 3001
pnpm --filter @app/frontend dev    # Port 3000
pnpm --filter @app/routes-portal dev  # Port 3002
```

**Das war's! Template läuft sofort.**

### 4. Mit KI entwickeln (Vibecoder-Workflow)

**Riesen-Prompt:**

> "Lies ARCHITECTURE.md und AGENT.md.
>
> Erstelle eine Todo-App:
> - CRUD-API für Tasks (title, description, status, dueDate)
> - React-Frontend mit Task-Liste und Formular
> - Admin-Portal mit Statistiken
> - Daten persistent in JSON-DB
> - OpenAPI-Spezifikation
> - Tests für API und Frontend
>
> Befolge den 6-Phasen-Workflow aus AGENT.md.
> Dokumentiere in ROADMAP.md und WORKLOG.md."

KI generiert automatisch komplette App → `pnpm dev` → läuft!

### 5. Package Hot-Swap (Optional)

**Frontend wechseln (React → Svelte):**

```bash
# 1. Package entfernen
rm -rf packages/frontend

# 2. Neuer Ordner mit neuer README
mkdir packages/frontend
# packages/frontend/README.md schreiben (Svelte-Specs + API-Contracts)

# 3. Prompt an KI:
"Frontend-Package getauscht. Jetzt Svelte statt React.
Lies packages/frontend/README.md und ARCHITECTURE.md.
Erstelle das Package basierend auf den Specs."
```

**Ergebnis**: KI erstellt Svelte-App die gleiche APIs konsumiert → funktioniert sofort!

**Weitere Beispiele**: Backend-Framework, Datenbank, Infra - siehe [ARCHITECTURE.md](ARCHITECTURE.md)

**Detaillierte Setup-Anleitung**: Siehe [SETUP.md](SETUP.md)

---

## 📚 Dokumentation

### Für Entwickler & Vibecoders
1. **[SETUP.md](SETUP.md)** - ⚡ Setup-Anleitung (START HERE!)
2. **[README.md](README.md)** - Diese Übersicht
3. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detaillierte Architektur

### Für KI-Assistenten (IMMER bei Session-Start lesen!)
1. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Architektur, Packages, Workflow
2. **[AGENT.md](AGENT.md)** - KI-Instruktionen, Conventions
3. **[ROADMAP.md](ROADMAP.md)** - Aktuelle Phase & Tasks
4. **[WORKLOG.md](WORKLOG.md)** - Was wurde bereits implementiert
5. **[ADR-Template.md](ADR-Template.md)** - Architektur-Entscheidungen
6. **packages/*/README.md** - Package-Spezifikationen

---

## 🔄 Context-Rotation

**Problem**: Lange Chat-Sessions führen zu Context-Rot (KI vergisst Entscheidungen).

**Lösung**: Neue Session für jedes Feature starten!

### Bei Session-Start liest KI:
1. ARCHITECTURE.md (Übersicht)
2. ROADMAP.md (Was ist zu tun?)
3. WORKLOG.md (Was wurde gemacht?)
4. ADR-Template.md (Welche Entscheidungen?)
5. packages/*/README.md (Package-Details)

**Vorteil**: Kein Kontext-Verlust, klarer Fokus!

---

## 🛠️ Befehle

```bash
# Alle Packages
pnpm -r build         # Build
pnpm test             # Tests
pnpm typecheck        # TypeScript-Check
pnpm lint             # ESLint + Prettier
pnpm guardrails       # Security & Quality-Check

# Deployment
cd packages/infra
pnpm synth            # Preview CloudFormation
pnpm deploy           # Deploy to AWS
```

---

## 🔒 Guardrails

Automatische Checks (via [guardrails.json](guardrails.json)):

❌ Hardcoded Secrets (Passwörter, API-Keys)
❌ `eval()` / `Function()` (Code-Injection)
❌ Sensible Daten in Logs

✅ TypeScript strict mode
✅ ESLint Regeln
✅ Test-Coverage

---

## 🎓 Workflow (6 Phasen)

Siehe [AGENT.md](AGENT.md) für Details:

1. **Anforderungen** → ROADMAP.md aktualisieren
2. **API-Design** → openapi.yaml erweitern
3. **Backend** → Handler, Services, Repositories
4. **Frontend** → Komponenten, Pages, Services
5. **Infrastruktur** → CDK-Stacks, Resources
6. **Abschluss** → Tests, Build, Dokumentation

---

## 🧩 Package-Übersicht

| Package | Zweck | Technologie | Deployment | **Austauschbar?** |
|---------|-------|-------------|------------|-------------------|
| **openapi** | API-Spec | OpenAPI 3.0 | Static Docs | ✅ (andere Spec-Formate) |
| **api** | Backend | Node.js, TypeScript | AWS Lambda | ✅ (Express → Fastify, etc.) |
| **frontend** | Web-App | React, Vite | S3 + CloudFront | ✅ (React → Svelte, Vue, etc.) |
| **routes-portal** | Admin-Dashboard | Next.js | Vercel | ✅ (Next → Nuxt, Remix, etc.) |
| **infra** | Infrastructure + DB | AWS CDK + JSON-DB | AWS | ✅ (AWS → Vercel, DB-Wechsel) |

**Details**: Siehe `packages/*/README.md` (enthält API-Contracts!)

**Package Hot-Swap**: Jedes Package austauschbar - siehe [ARCHITECTURE.md](ARCHITECTURE.md#-template-konzept-hot-swap-package-system)

---

## ✅ Best Practices

### Contract-First
1. OpenAPI-Spec zuerst (`packages/openapi/openapi.yaml`)
2. Backend implementieren
3. Frontend integrieren

### Dokumentation
- **ROADMAP.md** - Planung (zu Beginn jeder Phase)
- **WORKLOG.md** - Historie (nach jedem Task)
- **ADR-Template.md** - Entscheidungen (bei Bedarf)

### Testing
- Unit-Tests neben Code (`*.test.ts`)
- Integration-Tests in `__tests__/integration/`
- Mindestens 70% Coverage

---

## ⚠️ Häufige Probleme & Lösungen

### Problem 1: `Cannot read file 'tsconfig.base.json'`

**Fehler**:
```
error TS5083: Cannot read file '/path/to/tsconfig.base.json'
```

**Ursache**: Die Datei `tsconfig.base.json` fehlt im Root.

**Lösung**: Datei sollte bereits im Template existieren. Falls nicht:
```bash
# Erstelle tsconfig.base.json im Root
cat > tsconfig.base.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
EOF
```

---

### Problem 2: `require is not defined in ES module scope`

**Fehler**:
```
ReferenceError: require is not defined in ES module scope
```

**Ursache**: Code verwendet CommonJS-Pattern (`require.main === module`) mit ES Modules.

**Lösung**: Siehe [AGENT.md](AGENT.md) - Sektion "ES Module Patterns". Verwende direkten Server-Start statt Conditional.

**Richtig**:
```typescript
// src/index.ts
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
```

**Falsch**:
```typescript
if (require.main === module) {  // ❌ Funktioniert nicht mit ES Modules
  app.listen(PORT);
}
```

---

### Problem 3: `ENOENT: no such file or directory, open '.../data/db.json'`

**Fehler**:
```
ENOENT: no such file or directory, open '.../packages/api/data/db.json'
```

**Ursache**: lowdb erstellt keine Parent-Ordner automatisch.

**Lösung**: Database-Klasse sollte Ordner automatisch erstellen (siehe [packages/infra/database/README.md](packages/infra/database/README.md)).

Falls nicht implementiert:
```bash
# Manuell erstellen:
mkdir -p packages/api/data
```

**Besser**: In `packages/infra/database/src/index.ts` implementieren:
```typescript
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

async init() {
  await mkdir(dirname(this.dbPath), { recursive: true });
  // ... rest of init
}
```

---

### Problem 4: `pnpm: command not found`

**Fehler**:
```
zsh: command not found: pnpm
```

**Ursache**: pnpm ist nicht installiert.

**Lösung**:
```bash
# pnpm global installieren
npm install -g pnpm@9

# Prüfen
pnpm --version
```

**Alternative**: Template mit npm nutzen (langsamer):
```bash
npm install
npm run dev
```

---

### Problem 5: Ports bereits belegt

**Fehler**:
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Ursache**: Ein anderer Prozess nutzt den Port bereits.

**Lösung**:
```bash
# Port finden und killen (macOS/Linux):
lsof -ti:3001 | xargs kill -9

# Oder Port in .env.local ändern:
API_PORT=3002
```

---

## 🤝 Contributing

### Für Menschen
1. Fork → Feature-Branch → Commit → Push → PR

### Für KI-Assistenten
Folge [AGENT.md](AGENT.md) - insbesondere Sektion "Bei Session-Start IMMER lesen".

---

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE)

---

## 🆘 Support

- **KI-Fragen**: [AGENT.md](AGENT.md)
- **Bug-Reports**: GitHub Issues
- **Feature-Requests**: GitHub Discussions

---

**Happy Coding mit KI! 🤖**
