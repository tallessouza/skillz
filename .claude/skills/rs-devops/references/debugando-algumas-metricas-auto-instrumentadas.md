---
name: rs-devops-debugando-algumas-metricas-auto-instrumentadas
description: "Applies correct OTLP metric exporter configuration for OpenTelemetry auto-instrumented metrics. Use when user asks to 'debug metrics not showing in Prometheus', 'configure OTLPMetricExporter', 'fix ConsoleMetricExporter in production', or 'setup PeriodicExportingMetricReader'. Enforces OTLPMetricExporter over ConsoleMetricExporter, explicit URL configuration, and proper exportIntervalMillis. Make sure to use this skill whenever debugging missing metrics in Prometheus/Mimir or configuring OpenTelemetry metric exporters. Not for log or trace debugging (use debugando-o-envio-de-logs or configurando-tracer-basico)."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: observabilidade-opentelemetry
  tags: [opentelemetry, metrics, otlp, prometheus, grpc, metric-exporter, auto-instrumentation]
---

# Debugando Metricas Auto-Instrumentadas

> Configurar corretamente o exporter de metricas OTLP e o PeriodicExportingMetricReader para que metricas auto-instrumentadas do OpenTelemetry aparecam no Prometheus/Mimir.

## Rules

1. **Nunca use ConsoleMetricExporter em producao** — substitua por `OTLPMetricExporter` com URL explicita
2. **Sempre configure URL no MetricExporter** — `http://127.0.0.1:4317` para gRPC local
3. **Use PeriodicExportingMetricReader** — com `exportIntervalMillis` explicito (ex: 10000ms)
4. **Remova exporters deprecated** — ConsoleSpanExporter, SimpleSpanProcessor nao sao necessarios com OTLP
5. **Diferencie metricas da aplicacao vs metricas do Prometheus** — prefixo `prometheus_` sao internas

## Steps

### Instalar e configurar

```bash
npm install @opentelemetry/exporter-metrics-otlp-grpc
```

```typescript
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

const metricExporter = new OTLPMetricExporter({
  url: 'http://127.0.0.1:4317',
});

const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 10000,
});
```

### Verificar no Prometheus

```promql
http_server_duration{service_name="app-skillz"}
```

## Error handling

- Erro `UNAVAILABLE` no console: URL incorreta ou collector nao esta rodando
- Metricas no console mas nao no Prometheus: ainda usando `ConsoleMetricExporter`
- Metricas com prefixo `prometheus_`: sao internas do Prometheus, nao da aplicacao

## Heuristics

| Situacao | Acao |
|----------|------|
| Metricas no console mas nao no Prometheus | Trocar ConsoleMetricExporter por OTLPMetricExporter |
| Erro UNAVAILABLE | Verificar URL e porta do collector (4317 para gRPC) |
| Quer filtrar por aplicacao | Usar `{service_name="nome"}` no PromQL |

## Troubleshooting

### Metricas aparecem no console mas nao no Prometheus
**Symptom:** Console mostra metricas sendo exportadas, mas Prometheus/Mimir nao recebe nada
**Cause:** Ainda usando `ConsoleMetricExporter` em vez de `OTLPMetricExporter`
**Fix:** Substituir `ConsoleMetricExporter` por `OTLPMetricExporter` com URL `http://127.0.0.1:4317`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
