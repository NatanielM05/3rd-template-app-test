# @app/infra - Infrastructure as Code + Database

## Zweck

Dieses Package enthält **Infrastruktur + Datenbank** - beides ist gekoppelt!

**⚠️ WICHTIG**: Datenbank-Wechsel = Kompletter Austausch dieses Packages!

---

## Was dieses Package macht

✅ **Datenbank** - JSON-DB, PostgreSQL, DynamoDB (in `database/` Sub-Package)
✅ **Cloud-Resources** - Lambda, API Gateway, S3, CloudFront, etc. (in `iac/`)
✅ **Deployment** - Automatisiertes Deployment zu AWS
✅ **Environment-Management** - Dev, Staging, Production
✅ **Monitoring** - CloudWatch Alarms, Logs, Dashboards

**⚠️ Template-Varianten**:
- **JSON-DB** (aktuell): `database/` mit lowdb + keine CDK-Stacks
- **PostgreSQL**: `database/` mit Prisma + Docker + optionale RDS-Stacks
- **DynamoDB**: `database/` mit AWS SDK + DynamoDB CDK-Stacks

---

## Struktur

```
packages/infra/
├── database/         → Datenbank-Implementation (siehe database/README.md)
│   ├── package.json  → lowdb (JSON-DB)
│   └── README.md
├── iac/              → AWS CDK Infrastruktur (KI erstellt nach Prompt)
│   ├── app.ts            → CDK-App Entry-Point
│   ├── stacks/           → CDK-Stacks
│   │   ├── api-stack.ts      → API-Gateway + Lambda
│   │   ├── frontend-stack.ts → S3 + CloudFront
│   │   └── network-stack.ts  → VPC, Subnets (optional)
│   ├── constructs/       → Wiederverwendbare CDK-Constructs
│   │   └── lambda-api.construct.ts
│   └── config/           → Environment-Konfiguration
│       └── env.config.ts
├── package.json      → aws-cdk-lib Dependencies
└── README.md         → Diese Datei
```

**⚠️ WICHTIG FÜR KI**: Nur `database/package.json` und READMEs existieren im Template!
- Die KI erstellt `database/src/`, `iac/`, Config-Files nach dem initiellen Prompt
- Die KI folgt den Vorgaben aus den README.md Dateien

---

## Architektur-Pattern: CDK-Stacks

```
┌─────────────────────────┐
│      CDK App            │
├─────────────────────────┤
│      Stacks             │  ← Gruppierung von Resources
│  - API-Stack            │
│  - Frontend-Stack       │
│  - Database-Stack       │
│  - Network-Stack        │
├─────────────────────────┤
│      Constructs         │  ← Wiederverwendbare Komponenten
├─────────────────────────┤
│   AWS CloudFormation    │  ← Deployment
└─────────────────────────┘
```

---

## Naming Conventions

### Stacks
```typescript
// Dateiname: stacks/api-stack.ts
export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambda = new Function(this, 'ApiFunction', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: Code.fromAsset('../api/dist'),
    });

    new RestApi(this, 'ApiGateway', {
      // ...
    });
  }
}
```

### Constructs
```typescript
// Dateiname: constructs/lambda-api.construct.ts
export class LambdaApiConstruct extends Construct {
  public readonly function: Function;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.function = new Function(this, 'Function', {
      // ...
    });
  }
}
```

---

## Environment-Management

### Strategie
- **Multi-Environment**: Dev, Staging, Production
- **Configuration**: Environment-spezifische Config-Files

### Example
```typescript
// config/env.config.ts
export const envConfig = {
  dev: {
    region: 'eu-central-1',
    vpcCidr: '10.0.0.0/16',
  },
  prod: {
    region: 'eu-central-1',
    vpcCidr: '10.1.0.0/16',
  },
};
```

---

## Best Practices

### Tagging
Alle Resources taggen für Cost-Tracking:
```typescript
Tags.of(this).add('Environment', 'production');
Tags.of(this).add('Project', 'my-app');
```

### Security
- **Least Privilege**: Minimale IAM-Permissions
- **Encryption**: At-Rest und In-Transit
- **Secrets**: AWS Secrets Manager / SSM Parameter Store

### Monitoring
- **CloudWatch Alarms** für kritische Metriken
- **X-Ray Tracing** für Lambda-Functions
- **CloudWatch Logs** mit Retention-Policies

---

## Typische Stacks

### API-Stack
- API-Gateway + Lambda-Functions
- IAM-Roles mit Least-Privilege
- CloudWatch-Logs

### Frontend-Stack
- S3-Bucket für Static-Hosting
- CloudFront-Distribution (CDN)
- Route53-DNS (optional)
- ACM-Certificate (SSL)

### Database-Stack
- RDS (PostgreSQL) oder DynamoDB
- VPC-Integration
- Backup-Policies

### Network-Stack
- VPC, Subnets (Public + Private)
- NAT-Gateway
- Security-Groups

---

## Deployment

### Synthesize (Preview)
```bash
cd packages/infra
pnpm synth
# Generiert CloudFormation-Template in cdk.out/
```

### Deploy
```bash
pnpm deploy
# Deployed alle Stacks zu AWS
```

### Deploy Specific Stack
```bash
cdk deploy ApiStack
```

### Destroy (VORSICHT!)
```bash
pnpm destroy
# Löscht alle Stacks
```

---

## Testing

### Snapshot-Tests
```typescript
import { Template } from 'aws-cdk-lib/assertions';

test('ApiStack creates Lambda', () => {
  const template = Template.fromStack(stack);
  template.resourceCountIs('AWS::Lambda::Function', 1);
});
```

---

## Dependencies

### Core
- `aws-cdk-lib` - CDK-Framework
- `constructs` - CDK-Constructs
- `aws-cdk` - CDK-CLI (devDependency)

### Add as needed
- `@aws-cdk/aws-lambda-nodejs` - Node.js-Lambda-Bundling

---

## Environment-Variables

```bash
# .env für CDK-Deployment
CDK_DEFAULT_ACCOUNT=123456789012
CDK_DEFAULT_REGION=eu-central-1
STACK_PREFIX=myapp
ENVIRONMENT=dev
```

---

## Scripts

```bash
# Synthesize
pnpm synth            # Preview CloudFormation

# Deploy
pnpm deploy           # Deploy to AWS

# Diff
pnpm diff             # Vergleiche mit deployed Stack

# Destroy
pnpm destroy          # Lösche Stack
```

---

## Für KI-Agenten

**Bei neuen Resources:**
1. ✅ Entscheide, zu welchem Stack die Resource gehört
2. ✅ Stack in `iac/stacks/` erstellen/erweitern
3. ✅ IAM-Permissions definieren (Least Privilege)
4. ✅ Tagging hinzufügen
5. ✅ Monitoring (CloudWatch Alarms) konfigurieren
6. ✅ Tests schreiben (`__tests__/`)

**Best Practices:**
- Stack-Dependencies über Props weitergeben
- Environment-Config zentral in `config/`
- Stabile Ressourcen-IDs (über Deployments hinweg)
- Keine Hardcoded Secrets in Stacks
- Keine unbegrenzten IAM-Permissions (`*`)
- Alle Resources taggen

---

**Version**: 0.0.1
**Cloud-Provider**: AWS
**Letzte Aktualisierung**: 2025-10-07
