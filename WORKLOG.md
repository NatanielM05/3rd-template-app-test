# Worklog

## Implemented:

### 2025-10-07 - Template-Vervollständigung
- **Basis-Konfiguration**: pnpm-workspace.yaml, tsconfig.json, tsconfig.base.json, .gitignore erstellt
- **Linting & Formatting**: ESLint (flat config), Prettier-Konfiguration hinzugefügt
- **Guardrails**: guardrails.json mit Sicherheits-Patterns, verbotenen Mustern und Required-Commands
- **Package-Struktur**: package.json + tsconfig.json für alle 5 Packages (api, frontend, infra, openapi, routes-portal)
- **Build-Konfiguration**: Vite für Frontend, Next.js für routes-portal, CDK für Infra
- **KI-Dokumentation**: AGENT.md mit detaillierten Instruktionen für KI-Assistenten
- **Einstiegspunkt**: README.md mit Quick-Start, Architektur-Übersicht, Workflow
- **OpenAPI-Spezifikation**: openapi.yaml mit Beispiel-Endpoints (Health, Users CRUD)
- **Package-Designs**: DESIGN.md für jedes Package mit Architektur, Conventions, Testing
- **Validierung**: VALIDATION.md mit automatischen und manuellen Checks, Deployment-Checkliste

### Früher
- Created monorepo skeleton (pnpm, ESLint/Prettier, tsconfig)
- Documented Azure DevOps subtree workflow for `packages/infra`
- Aligned `packages/frontend` and `packages/infra` with workspace tooling
- Installed workspace dependencies via pnpm
- Adopted the frontend-derived OpenAPI spec and regenerated shared types
- Scaffolded `@enercept/api` Lambda handlers
- Added `@enercept/openapi` package with Swagger UI doc builder
- Provisioned temporary public OpenAPI documentation stack (S3 + CloudFront)
- Added workspace build/deploy orchestration scripts
- Introduced docs-only CDK entrypoint
- Centralised OpenAPI-derived typings in `@enercept/shared`
- Created `@enercept/auth-portal` Next.js package with Cognito-based login
- Implemented `AuthPortalStack` CDK construct
- All protected routes secured via API Gateway Cognito Authorizer
- Configured infrastructure to remain in eu-central-1 for GDPR compliance

## Next:
- Deploy auth-portal stack and create initial Cognito users for testing
- Connect frontend prototype (`/app`) to auth-portal via API Gateway
- Integrate OpenSearch Dashboards proxy (`/opensearch`) with Cognito auth
- Re-introduce CI after dependency install succeeds
- Automate OpenAPI type generation in CI
- Install/align infra Lambda dependencies (`@aws-sdk/client-kinesis`, `pg`, etc.)
