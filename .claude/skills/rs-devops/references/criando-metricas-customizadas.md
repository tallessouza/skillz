---
name: rs-devops-criando-metricas-customizadas
description: "Enforces OpenTelemetry custom metrics patterns when instrumenting applications with counters, gauges, or histograms. Use when user asks to 'add metrics', 'create counter', 'instrument application', 'track errors', 'monitor requests', or 'setup OpenTelemetry metrics'. Applies MeterProvider configuration, vendor-agnostic instrumentation, and counter patterns for success/error tracking. Make sure to use this skill whenever adding observability metrics to any application. Not for tracing, logging, Prometheus server configuration, or Grafana dashboards."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: observability-opentelemetry
  tags: [opentelemetry, metrics, counter, gauge, histogram, observability, instrumentation]
---

# Métricas Customizadas com OpenTelemetry

> Instrumente métricas via OpenTelemetry API para manter a aplicação 100% agnóstica de vendor — toda complexidade fica no coletor, não no código.

## Rules

1. **Abstraia métricas numa lib da organização** — não espalhe configuração de MeterProvider em cada aplicação, porque com 200+ apps qualquer mudança organizacional vira trabalho massivo
2. **Use OpenTelemetry API, nunca client libraries do vendor** — importe de `@opentelemetry/api` e `@opentelemetry/sdk-metrics`, porque isso permite trocar Prometheus por Datadog/Elastic sem mudar código da aplicação
3. **Separe métricas de sucesso e erro** — crie counters distintos (`hello_success`, `hello_error`) ao invés de um único counter com labels, porque facilita comparações diretas no Prometheus
4. **Counters só incrementam** — nunca tente decrementar; use `gauge` se precisar de valores que sobem e descem, porque counter por definição é monotônico crescente
5. **Nomeie métricas pelo domínio** — `order_created_success` não `metric_1`, porque o nome aparece diretamente nas queries do Prometheus
6. **Coloque métricas no tratamento de exceção** — success no `try`, error no `catch`, porque captura o estado real da operação

## How to write

### MeterProvider setup

```typescript
import { metrics } from '@opentelemetry/api'
import { MeterProvider } from '@opentelemetry/sdk-metrics'

const meterProvider = new MeterProvider({
  resource: resource.merge(resource),
  readers: [metricReader],
})

metrics.setGlobalMeterProvider(meterProvider)
```

### Counter creation and usage

```typescript
import { metrics } from './tracer'

const meter = metrics.getMeter('app-skillz')
const successMetric = meter.createCounter('hello_success')
const errorMetric = meter.createCounter('hello_error')

// No service handler:
try {
  const result = await doWork()
  successMetric.add(1)
  return result
} catch (error) {
  errorMetric.add(1)
  throw error
}
```

## Example

**Before (acoplado ao vendor):**
```typescript
import { Counter } from 'prom-client'
const counter = new Counter({ name: 'requests', help: 'total requests' })
counter.inc()
```

**After (agnóstico via OpenTelemetry):**
```typescript
import { metrics } from '@opentelemetry/api'

const meter = metrics.getMeter('app-skillz')
const requestSuccess = meter.createCounter('request_success')
const requestError = meter.createCounter('request_error')

// No try: requestSuccess.add(1)
// No catch: requestError.add(1)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa contar ocorrências (requests, erros) | `createCounter` |
| Precisa valor que sobe e desce (conexões ativas) | `createGauge` |
| Precisa distribuição de valores (latência) | `createHistogram` |
| Metric reader já existe no NodeSDK | Remova do SDK e configure no MeterProvider separado para evitar conflito de dupla declaração |
| 200+ aplicações na org | Crie uma lib compartilhada que exporta meter configurado |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `import { Counter } from 'prom-client'` | `meter.createCounter('name')` via OpenTelemetry |
| Um counter genérico com label success/error | Dois counters separados: `_success` e `_error` |
| `counter.add(-1)` | Use `createGauge` se precisa decrementar |
| MeterProvider + metricReader no NodeSDK ao mesmo tempo | Escolha um lugar só — conflito causa erro de dupla declaração |
| Configuração de metrics inline no service | Extraia para arquivo `tracer.ts` ou lib separada |

## Troubleshooting

### Erro de dupla declaracao de metricReader
**Symptom:** Aplicacao lanca erro ao inicializar com mensagem sobre metric reader ja registrado ou conflito de MeterProvider.
**Cause:** O metricReader foi configurado tanto no NodeSDK quanto em um MeterProvider separado, causando conflito.
**Fix:** Escolha um unico lugar para configurar o metricReader — ou no NodeSDK ou no MeterProvider separado, nunca em ambos.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
