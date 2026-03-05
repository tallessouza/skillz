# Code Examples: Configurando Aplicacao com OpenTelemetry

## Instalacao das dependencias

```bash
yarn add @opentelemetry/api \
  @opentelemetry/auto-instrumentations-node \
  @opentelemetry/exporter-logs-otlp-proto \
  @opentelemetry/resources \
  @opentelemetry/sdk-logs \
  @opentelemetry/sdk-metrics \
  @opentelemetry/sdk-node \
  @opentelemetry/sdk-trace-node \
  @opentelemetry/semantic-conventions
```

Equivalente com npm:
```bash
npm install @opentelemetry/api @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-logs-otlp-proto @opentelemetry/resources @opentelemetry/sdk-logs @opentelemetry/sdk-metrics @opentelemetry/sdk-node @opentelemetry/sdk-trace-node @opentelemetry/semantic-conventions
```

## Arquivo tracer.ts completo

```typescript
// src/tracer.ts
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { ConsoleMetricExporter } from '@opentelemetry/sdk-metrics';
import { SimpleLogRecordProcessor, ConsoleLogRecordExporter } from '@opentelemetry/sdk-logs';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';

// Exporter de traces via gRPC/proto para o OTEL Collector
const traceExporter = new OTLPTraceExporter();

// Resource define atributos que identificam este servico
const resource = Resource.merge(
  resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'app-rocketseat',
    [ATTR_SERVICE_VERSION]: '1.0.0',
  }),
  Resource.empty(), // Placeholder para merge futuro com outros resources
);

// SDK principal — configura todos os sinais (traces, metrics, logs)
export const sdk = new NodeSDK({
  // Processa spans em batch para enviar ao Collector
  spanProcessors: [new BatchSpanProcessor(traceExporter)],
  // Tambem exibe spans no console (util para debug)
  traceExporter: new ConsoleSpanExporter(),
  // Metricas no console (sera substituido por OTLP exporter depois)
  metricReader: new ConsoleMetricExporter(),
  // Logs processados e exportados
  logRecordProcessors: [
    new SimpleLogRecordProcessor(new ConsoleLogRecordExporter()),
  ],
  // Auto-instrumentacao: metricas e traces default sem codigo manual
  instrumentations: [getNodeAutoInstrumentations()],
  // Resource com identificacao do servico
  resource,
});
```

## Arquivo main.ts com inicializacao correta

```typescript
// src/main.ts
// CRITICO: import do tracer DEVE ser o primeiro import
import { sdk } from './tracer';
sdk.start();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

## Erro comum: SDK nao inicializado

Se o tracer.ts nao for importado e iniciado no main, nenhuma instrumentacao acontece:

```typescript
// ERRADO — tracer nunca e executado
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
// Resultado: zero logs, zero metricas, zero traces
```

## Debugando se o tracer foi carregado

```typescript
// Tecnica do instrutor: adicionar console.log temporario
// src/tracer.ts (temporario)
console.log('peguei'); // Se aparecer no terminal, tracer esta ativo

export const sdk = new NodeSDK({ /* ... */ });
```

## Relacao com otel-collector-config.yaml

O `service.name` do tracer.ts se conecta com a config do Collector:

```yaml
# otel-collector-config.yaml (configurado em aula anterior)
processors:
  resource:
    attributes:
      - key: service.name
        action: upsert
```

Os dados enviados pela aplicacao com `ATTR_SERVICE_NAME: 'app-rocketseat'` serao indexados no Collector e encaminhados para Loki (logs), Tempo (traces) e Prometheus (metricas).

## Variacao: adicionando environment ao resource

```typescript
const resource = Resource.merge(
  resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'app-rocketseat',
    [ATTR_SERVICE_VERSION]: '1.0.0',
  }),
  resourceFromAttributes({
    'deployment.environment': 'production',
  }),
);
```