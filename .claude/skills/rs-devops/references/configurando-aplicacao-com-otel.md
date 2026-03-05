---
name: rs-devops-configurando-aplicacao-com-otel
description: "Applies OpenTelemetry auto-instrumentation setup for Node.js/NestJS applications. Use when user asks to 'add observability', 'configure OpenTelemetry', 'setup OTEL', 'instrument application', 'send logs and metrics to Grafana', or 'configure tracing'. Enforces vendor-agnostic instrumentation via OTEL Collector pattern, correct SDK initialization order, and resource attribute conventions. Make sure to use this skill whenever setting up observability in Node.js applications. Not for Prometheus configuration, Grafana dashboard setup, or manual instrumentation of custom metrics."
---

# Configurando Aplicacao com OpenTelemetry

> Configure OpenTelemetry como camada de abstracao entre sua aplicacao e ferramentas de observabilidade — a aplicacao conhece apenas o OTEL, nunca o vendor.

## Rules

1. **Aplicacao nunca conhece o vendor** — nao importe libs do Loki, Tempo, Prometheus ou Grafana na aplicacao, porque o Collector do OTEL e quem exporta para cada ferramenta
2. **SDK deve iniciar antes de tudo** — `sdk.start()` deve ser chamado no topo do arquivo main, antes de qualquer import de framework, porque a instrumentacao precisa interceptar modulos antes do carregamento
3. **Use auto-instrumentacao primeiro** — `getNodeAutoInstrumentations()` fornece metricas default sem codigo manual, porque instrumentacao manual e significativamente mais complexa e so necessaria para metricas customizadas
4. **Resource attributes identificam o servico** — sempre defina `service.name` e `service.version` no resource, porque esses atributos indexam seu servico no Collector e nas ferramentas de visualizacao
5. **Exporte via gRPC/proto** — use `OTLPTraceExporter` com proto, porque e o protocolo padrao do OTEL Collector
6. **Prepare para escalar com merge** — use `Resource.merge()` mesmo com um unico resource, porque permite concatenar atributos adicionais no futuro sem refatorar

## How to write

### Arquivo tracer.ts (auto-instrumentacao)

```typescript
// src/tracer.ts
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { ConsoleMetricExporter } from '@opentelemetry/sdk-metrics';
import { SimpleLogRecordProcessor, ConsoleLogRecordExporter } from '@opentelemetry/sdk-logs';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { Resource } from '@opentelemetry/resources';

const traceExporter = new OTLPTraceExporter();

const resource = Resource.merge(
  resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'app-skillz',
    [ATTR_SERVICE_VERSION]: '1.0.0',
  }),
  Resource.empty(),
);

export const sdk = new NodeSDK({
  spanProcessors: [new BatchSpanProcessor(traceExporter)],
  traceExporter: new ConsoleSpanExporter(),
  metricReader: new ConsoleMetricExporter(),
  logRecordProcessors: [new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())],
  instrumentations: [getNodeAutoInstrumentations()],
  resource,
});
```

### Inicializacao no main (topo do arquivo)

```typescript
// src/main.ts — import DEVE ser o primeiro do arquivo
import { sdk } from './tracer';
sdk.start();

// Somente depois importar o framework
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

## Example

**Before (acoplado ao vendor):**
```typescript
// Aplicacao conhece Loki, Prometheus diretamente
import { LokiClient } from 'loki-client';
import { PrometheusExporter } from 'prometheus-exporter';
// Migrar de vendor = alterar TODA aplicacao
```

**After (vendor-agnostic com OTEL):**
```typescript
// Aplicacao conhece apenas OpenTelemetry
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
// Migrar de vendor = alterar apenas o Collector config
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Nova aplicacao Node.js precisa de observabilidade | Instalar 9 libs OTEL + criar tracer.ts + iniciar no main |
| Trocar de ferramenta (ex: Loki → Elasticsearch) | Alterar apenas o Collector do OTEL, nao a aplicacao |
| Precisa de metricas customizadas | Primeiro auto-instrumentacao, depois instrumentacao manual |
| Multiplos servicos no parque | Cada um com seu `service.name` unico no resource |
| Testar se OTEL esta funcionando | Adicionar `console.log` no tracer e verificar se executa ao iniciar |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Importar libs de vendor na aplicacao | Importar apenas libs `@opentelemetry/*` |
| Iniciar SDK depois dos imports do framework | `sdk.start()` no topo absoluto do main |
| Pular auto-instrumentacao e ir direto para manual | Comecar com `getNodeAutoInstrumentations()` |
| Deixar `service.name` generico ou ausente | Definir nome descritivo: `app-skillz` |
| Instalar dependencias com npm quando projeto usa yarn | Usar `yarn add` consistentemente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-configurando-aplicacao-com-otel/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-configurando-aplicacao-com-otel/references/code-examples.md)
