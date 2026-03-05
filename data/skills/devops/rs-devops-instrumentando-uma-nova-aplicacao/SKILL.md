---
name: rs-devops-instrumentando-nova-app
description: "Applies OpenTelemetry instrumentation setup when creating a new NestJS microservice for distributed tracing. Use when user asks to 'instrument a service', 'add observability', 'setup tracing for new app', 'configure OpenTelemetry', or 'add a microservice to tracing'. Follows patterns: shared tracer initialization, log configuration with Pino, OTLP exporter setup, service name/version differentiation. Make sure to use this skill whenever adding observability to a new Node.js/NestJS service. Not for frontend monitoring, infrastructure provisioning, or Prometheus metrics configuration."
---

# Instrumentando uma Nova Aplicacao com OpenTelemetry

> Cada novo microservico deve ser instrumentado com tracer e logs desde o primeiro deploy, usando configuracao identica ao servico existente (ou melhor, uma lib compartilhada).

## Regra de Ouro

**Nunca duplique codigo de instrumentacao entre servicos.** Crie uma lib compartilhada com o tracer e log config. Aqui documentamos o processo manual para entendimento, mas em producao use uma lib porque atualizar instrumentacao em massa nao escala.

## Prerequisites

- Collector OpenTelemetry rodando (docker-compose ou standalone)
- Grafana + Tempo + Loki configurados para receber traces e logs
- Aplicacao NestJS existente ja instrumentada (referencia)

## Steps

### Step 1: Criar a aplicacao

```bash
nest new app2 --package-manager yarn
cd app2
```

### Step 2: Copiar arquivos de instrumentacao

Copiar do servico existente:
- `src/tracer.ts` — inicializacao do OpenTelemetry tracer
- `src/infra/log.ts` — configuracao do Pino logger

### Step 3: Instalar dependencias de OpenTelemetry

```bash
yarn add @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node \
  @opentelemetry/exporter-trace-otlp-grpc @opentelemetry/exporter-logs-otlp-grpc \
  @opentelemetry/sdk-logs @opentelemetry/resources @opentelemetry/semantic-conventions \
  pino pino-pretty
```

### Step 4: Configurar identidade do servico

No `tracer.ts`, diferenciar o servico:

```typescript
// Cada microservico DEVE ter service name e version unicos
const serviceName = 'app-skillz-2';
const serviceVersion = '2.0';
```

### Step 5: Inicializar tracer no main.ts

```typescript
import './tracer'; // DEVE ser a primeira linha do arquivo
import { log } from './infra/log';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3002; // Porta diferente do app1
  await app.listen(port);
  log.info(`Aplicacao 2 subiu na porta ${port}`);
}
bootstrap().catch((err) => {
  log.error('Aplicacao 2 nao subiu', err);
});
```

### Step 6: Configurar endpoint do collector

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

## Verificacao

1. Iniciar o servico: `yarn run start:dev`
2. No Grafana > Loki: filtrar por `service_name` — ambos servicos devem aparecer
3. No Grafana > Tempo: verificar que o novo servico aparece com `service.version` correto
4. Confirmar que `service_name` e `service_version` diferenciam os servicos nos logs e traces

## Heuristics

| Situacao | Acao |
|----------|------|
| 2+ microservicos com mesmo tracer.ts | Criar lib compartilhada imediatamente |
| Servico nao aparece no Tempo | Verificar `OTEL_EXPORTER_OTLP_ENDPOINT` e conexao com collector |
| Conflito de porta ao subir app2 | Garantir que cada servico usa porta unica no main.ts |
| Precisa atualizar instrumentacao | Com lib: bump version. Sem lib: alterar em TODOS os servicos (nao escala) |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Copiar tracer.ts em 5+ servicos | Criar uma lib `@org/observability` compartilhada |
| Usar mesmo `serviceName` em apps diferentes | Cada servico tem nome e versao unicos |
| Esquecer `import './tracer'` como primeira linha | Sempre primeiro import no main.ts, porque instrumentacao deve iniciar antes de tudo |
| Hardcodar endpoint do collector | Usar variavel de ambiente `OTEL_EXPORTER_OTLP_ENDPOINT` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
