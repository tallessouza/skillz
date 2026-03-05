# Code Examples: OpenTelemetry

## Arquitetura sem OpenTelemetry (problema)

```
┌─────────────┐     ┌──────────────┐
│ Microservice │────→│   New Relic   │  ← SDK específico do New Relic
│     App 1    │     │              │
└─────────────┘     └──────────────┘

┌─────────────┐     ┌──────────────┐
│ Microservice │────→│   New Relic   │  ← Mesmo SDK em cada serviço
│     App 2    │     │              │
└─────────────┘     └──────────────┘

┌─────────────┐     ┌──────────────┐
│ Microservice │────→│   New Relic   │  ← Para migrar: tocar em TODOS
│     App N    │     │              │
└─────────────┘     └──────────────┘
```

**Problema:** Para migrar de New Relic para Datadog, precisa mudar a lib e a instrumentação em TODOS os microserviços.

## Arquitetura com OpenTelemetry (solução)

```
┌─────────────┐
│ Microservice │──┐
│     App 1    │  │   ┌─────────────────────┐     ┌──────────────┐
└─────────────┘  │   │                     │     │              │
                 ├──→│  OTEL Collector     │────→│  New Relic   │
┌─────────────┐  │   │  (ponto único)      │     │  (ou outro)  │
│ Microservice │──┤   │                     │     │              │
│     App 2    │  │   │  Receivers:         │     └──────────────┘
└─────────────┘  │   │   - OTLP gRPC       │
                 │   │   - OTLP HTTP        │
┌─────────────┐  │   │                     │
│ Microservice │──┘   │  Exporters:         │
│     App N    │      │   - newrelic        │  ← Mudar SÓ aqui
└─────────────┘      │   (ou datadog, etc) │
                     └─────────────────────┘
```

## Docker Compose típico com OTEL Collector

```yaml
# docker-compose.yaml
services:
  otel-collector:
    image: otel/opentelemetry-collector-contrib:latest
    command: ["--config=/etc/otel-collector-config.yaml"]
    volumes:
      - ./otel-collector-config.yaml:/etc/otel-collector-config.yaml
    ports:
      - "4317:4317"   # OTLP gRPC
      - "4318:4318"   # OTLP HTTP

  app:
    build: .
    environment:
      - OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317
    depends_on:
      - otel-collector
```

## Configuração do OTEL Collector

```yaml
# otel-collector-config.yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:
    timeout: 5s
    send_batch_size: 1000

exporters:
  # Para Grafana Stack (Prometheus + Loki + Tempo)
  prometheus:
    endpoint: "0.0.0.0:8889"
  loki:
    endpoint: "http://loki:3100/loki/api/v1/push"
  otlp/tempo:
    endpoint: "tempo:4317"
    tls:
      insecure: true

service:
  pipelines:
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheus]
    logs:
      receivers: [otlp]
      processors: [batch]
      exporters: [loki]
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp/tempo]
```

## Migração de provedor — só muda o exporter

```yaml
# ANTES: exportando para Grafana Stack
exporters:
  prometheus:
    endpoint: "0.0.0.0:8889"

# DEPOIS: exportando para Datadog (exemplo)
exporters:
  datadog:
    api:
      key: ${DD_API_KEY}
      site: datadoghq.com
```

A aplicação não muda nada. Só o arquivo de configuração do Collector.

## Auto-instrumentação Node.js (conceitual)

```typescript
// Com auto-instrumentação, o OTEL SDK captura automaticamente:
// - HTTP requests (express, fastify, etc.)
// - Database queries (pg, mysql, mongodb)
// - Chamadas entre serviços (gRPC, HTTP)
// - Sem precisar adicionar código manual

// Basta configurar o SDK na inicialização:
import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'http://otel-collector:4317',
  }),
  metricReader: new OTLPMetricExporter({
    url: 'http://otel-collector:4317',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
})

sdk.start()
```

## Evolução: lib interna da organização

```typescript
// packages/telemetry/src/index.ts — lib interna
// A aplicação importa esta lib, não o OTEL diretamente

import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'

export function initTelemetry(serviceName: string) {
  const sdk = new NodeSDK({
    serviceName,
    instrumentations: [getNodeAutoInstrumentations()],
    // Toda config centralizada aqui
  })
  sdk.start()
  return sdk
}

// Na aplicação:
// import { initTelemetry } from '@org/telemetry'
// initTelemetry('order-service')
// Pronto. A app não sabe nada sobre OTEL, provedores, exporters.
```