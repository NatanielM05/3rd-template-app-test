# Architekturentscheidungen (ADR)

Dieses Dokument dient zur Sammlung aller Architektur-Entscheidungen des Projekts.  
Jede Entscheidung wird als eigener Abschnitt nach dem untenstehenden Template eingetragen.

---

## Index

- [ADR-0001: …](#adr-0001)  
- [ADR-0002: …](#adr-0002)  

*(fülle die Liste, wenn neue ADRs hinzukommen)*

---

## ADR-Template

### ADR-XXXX: Titel
- **Status:** Proposed | Accepted | Rejected | Superseded
- **Date:** YYYY-MM-DD

#### Kontext
- Welches Problem soll gelöst werden?
- Welche Kräfte oder Anforderungen beeinflussen die Entscheidung?

#### Entscheidung
- Kurze, prägnante Formulierung der gewählten Lösung.

#### Konsequenzen
- **Positiv:** Welche Vorteile bringt die Entscheidung?
- **Negativ:** Welche Nachteile oder Risiken entstehen?

#### Verwandte Dokumente
- Links zu Diskussionen, Issues, Pull Requests oder anderen ADRs.

---

## Beispiel (kann nach dem Start entfernt werden)

### ADR-0001: Projekt startet mit pnpm Workspaces
- **Status:** Accepted  
- **Date:** 2025-10-07  

#### Kontext
Wir benötigen ein Monorepo-Setup für mehrere Packages (api, frontend, infra, openapi, routes-portal).  

#### Entscheidung
Wir nutzen `pnpm` als Package Manager mit Workspaces.  

#### Konsequenzen
- **Positiv:** Schneller Build, einfache Abhängigkeiten zwischen Paketen, bessere Performance als npm/yarn.  
- **Negativ:** Neue Entwickler müssen ggf. pnpm installieren.  

#### Verwandte Dokumente
- [pnpm Workspaces Docs](https://pnpm.io/workspaces)
