# Code Examples: Debugando Metricas Auto-Instrumentadas

## Configuracao ANTES (com ConsoleMetricExporter)

```typescript
// tracer.ts - configuracao inicial (apenas console)
import { ConsoleMetricExporter } from '@opentelemetry/sdk-metrics';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';

const sdk = new NodeSDK({
  spanProcessor: new SimpleSpanProcessor(new ConsoleSpanExporter()),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(), // apenas imprime no console
  }),
  instrumentations: [getNodeAutoInstrumentations()],
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'app-rocketseat',
  }),
});
```

## Configuracao DEPOIS (com OTLP exporters)

```typescript
// tracer.ts - configuracao correta para exportacao
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

const serviceName = 'app-rocketseat';

const traceExporter = new OTLPTraceExporter({
  url: 'http://127.0.0.1:4317',
});

const metricExporter = new OTLPMetricExporter({
  url: 'http://127.0.0.1:4317',
});

const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 10000, // 10 segundos
});

const sdk = new NodeSDK({
  traceExporter,
  metricReader,
  instrumentations: [getNodeAutoInstrumentations()],
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: serviceName,
  }),
});

sdk.start();
```

## Instalacao da dependencia

```bash
npm install @opentelemetry/exporter-metrics-otlp-grpc
```

## Output do ConsoleMetricExporter (para referencia)

Quando configurado com ConsoleMetricExporter, o console mostra:

```json
{
  "descriptor": {
    "name": "http_server_duration",
    "type": "HISTOGRAM",
    "unit": "ms"
  },
  "dataPoints": [
    {
      "startTime": [1709123456, 0],
      "endTime": [1709123466, 0],
      "attributes": {
        "http.method": "GET",
        "http.route": "/health",
        "http.status_code": 200,
        "net.host.port": 3000
      },
      "value": {
        "min": 1.2,
        "max": 3.5,
        "sum": 15.7,
        "buckets": { }
      }
    }
  ]
}
```

Isso NAO e um log — nao aparece no Loki/sistema de logs.

## Queries PromQL para metricas auto-instrumentadas

```promql
# Duracao das requisicoes HTTP (histograma)
http_server_duration

# Filtrar por servico especifico
http_server_duration{service_name="app-rocketseat"}

# Filtrar por servico e versao
http_server_duration{service_name="app-rocketseat", service_version="1.0.0"}

# Contagem total de requisicoes
http_server_request_count

# Contagem de requisicoes de um servico
http_server_request_count{service_name="app-rocketseat"}

# Soma de duracao em milissegundos
http_server_duration_sum{service_name="app-rocketseat"}
```

## Erro comum: UNAVAILABLE

```typescript
// ERRADO - sem URL, causa erro UNAVAILABLE
const metricExporter = new OTLPMetricExporter();

// CORRETO - URL explicita para o collector
const metricExporter = new OTLPMetricExporter({
  url: 'http://127.0.0.1:4317',
});
```

## Dica do instrutor: serviceName como env var

```typescript
// Evolucao sugerida: usar variavel de ambiente
const serviceName = process.env.OTEL_SERVICE_NAME || 'app-rocketseat';
```