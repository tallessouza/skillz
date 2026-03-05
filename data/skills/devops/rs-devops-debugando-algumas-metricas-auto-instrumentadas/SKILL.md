---
name: rs-devops-debugando-metricas-auto-instrumentadas
description: "Applies OpenTelemetry auto-instrumented metrics debugging patterns when configuring metric exporters for Prometheus/Mimir. Use when user asks to 'setup metrics', 'configure OpenTelemetry metrics', 'debug metric exporter', 'fix metrics not showing', or 'auto-instrument application'. Covers OTLP metric exporter setup, PeriodicExportingMetricReader config, and PromQL filtering. Make sure to use this skill whenever working with OpenTelemetry metrics export or troubleshooting missing metrics in Prometheus/Mimir. Not for custom business metrics creation, tracing setup, or log configuration."
---

# Debugando Metricas Auto-Instrumentadas

> Configurar corretamente o exporter de metricas OTLP e o PeriodicExportingMetricReader para que metricas auto-instrumentadas do OpenTelemetry aparecam no Prometheus/Mimir.

## Prerequisites

- Aplicacao Node.js com OpenTelemetry SDK configurado
- Mimir rodando (Prometheus por debaixo dos panos)
- Prometheus acessivel para queries
- Pacote `@opentelemetry/exporter-metrics-otlp-grpc` instalado

## Rules

1. **Nunca use ConsoleMetricExporter em producao** — substitua por `OTLPMetricExporter` com URL explicita, porque ConsoleMetricExporter apenas imprime no console sem exportar de fato
2. **Sempre configure URL no MetricExporter** — `http://127.0.0.1:4317` para gRPC local, porque sem URL a aplicacao falha com erro de conexao (UNAVAILABLE)
3. **Use PeriodicExportingMetricReader** — com `exportIntervalMillis` explicito (ex: 10000ms), porque controla a frequencia de envio das metricas
4. **Remova exporters deprecated** — ConsoleSpanExporter, SimpleSpanProcessor nao sao necessarios quando OTLPTraceExporter ja esta configurado
5. **Extraia serviceName em variavel** — evite duplicacao entre resources e outras configs, porque o serviceName aparece em multiplos lugares
6. **Diferencie metricas da aplicacao vs metricas do Prometheus** — metricas com prefixo `prometheus_` sao do proprio Prometheus, as demais sao da aplicacao

## Steps

### Step 1: Instalar o exporter gRPC de metricas

```bash
npm install @opentelemetry/exporter-metrics-otlp-grpc
```

### Step 2: Configurar o MetricExporter com URL

```typescript
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';

const metricExporter = new OTLPMetricExporter({
  url: 'http://127.0.0.1:4317',
});
```

### Step 3: Configurar o PeriodicExportingMetricReader

```typescript
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 10000, // 10 segundos
});
```

### Step 4: Limpar exporters deprecated

Remover do NodeSDK:
- `ConsoleSpanExporter` — usar apenas `OTLPTraceExporter`
- `SimpleSpanProcessor` — nao necessario com exporter OTLP
- `ConsoleMetricExporter` — substituido pelo `OTLPMetricExporter`

### Step 5: Verificar no Prometheus/Mimir

Acessar Prometheus e buscar metricas HTTP auto-instrumentadas:
- `http_server_duration` — duracao das requisicoes (histograma, ms)
- `http_server_request_count` — contagem total de requisicoes

Filtrar por aplicacao usando PromQL:
```promql
http_server_duration{service_name="app-skillz"}
```

## Error handling

- Se aparecer erro `UNAVAILABLE` no console → URL do MetricExporter esta incorreta ou collector nao esta rodando na porta configurada
- Se metricas aparecem no console mas nao no Prometheus → voce ainda esta usando `ConsoleMetricExporter` em vez de `OTLPMetricExporter`
- Se metricas aparecem no Prometheus com prefixo `prometheus_` → essas sao metricas internas do Prometheus, nao da aplicacao

## Verification

1. Acesse um endpoint da aplicacao (ex: `/health`) varias vezes
2. Aguarde o intervalo de exportacao (ex: 10s)
3. No Prometheus, busque `http_server_duration` — deve retornar resultados
4. Filtre com `{service_name="seu-app"}` para confirmar que sao metricas da sua aplicacao
5. No console, nao devem aparecer erros de conexao UNAVAILABLE

## Heuristics

| Situacao | Acao |
|----------|------|
| Metricas no console mas nao no Prometheus | Trocar ConsoleMetricExporter por OTLPMetricExporter |
| Erro UNAVAILABLE no console | Verificar URL e porta do collector (4317 para gRPC) |
| Metricas aparecem mas so do Prometheus | Procurar metricas SEM prefixo `prometheus_` |
| Quer filtrar por aplicacao | Usar `{service_name="nome"}` no PromQL |
| serviceName duplicado no codigo | Extrair para variavel ou env var |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
