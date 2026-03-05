---
name: rs-devops-histogramas
description: "Applies Prometheus histogram patterns when instrumenting applications with metrics. Use when user asks to 'create histogram', 'monitor request duration', 'add metrics', 'instrument application', 'create dashboard', or 'monitor latency'. Covers bucket/count/sum triple, PromQL queries with rate and sum, and histogram_record instrumentation. Make sure to use this skill whenever working with Prometheus histograms or application observability. Not for logging, tracing, or non-Prometheus monitoring systems."
---

# Histogramas no Prometheus

> Ao instrumentar aplicacoes com histogramas, sempre considere a triade bucket/count/sum e use PromQL para extrair distribuicoes significativas.

## Rules

1. **Toda metrica histograma gera 3 series automaticamente** — `_bucket`, `_count` e `_sum`, porque o Prometheus precisa dessas 3 dimensoes para calcular distribuicoes e medias
2. **Sempre filtre por service_name e version** — porque em ambientes distribuidos com multiplas instancias, metricas sem filtro misturam dados de aplicacoes diferentes
3. **Use `le` (less or equal) para consultas de bucket** — porque o bucket distribui valores por intervalos e `le` permite saber quantas requisicoes ficaram abaixo de um threshold
4. **Calcule media com sum(rate(bucket[range])) / sum(rate(count[range]))** — porque essa formula da a media real de duracao no intervalo, nao apenas o total acumulado
5. **Armazene metricas com volume persistente** — porque sem persistencia, um `docker compose down` perde todas as metricas, e dados de observabilidade sao criticos
6. **Use `histogram.record(value)` para instrumentacao manual** — porque diferente do counter que usa `add()`, o histograma registra valores observados com `record()`

## How to write

### Criar histograma na aplicacao

```typescript
// Histograma gera automaticamente: _bucket, _count, _sum
const requestDuration = meter.createHistogram('request_duration', {
  description: 'Duracao das requisicoes em milissegundos',
  unit: 'ms',
});

// Registrar valor observado
requestDuration.record(1000); // 1 segundo em ms
```

### Consulta PromQL — media de duracao

```promql
# Media de milissegundos nos ultimos 5 minutos
sum(rate(http_client_duration_milliseconds_bucket{service_name="api-skillz"}[5m]))
/
sum(rate(http_client_duration_milliseconds_count{service_name="api-skillz"}[5m]))
```

### Consulta PromQL — filtrar por threshold

```promql
# Quantas requisicoes levaram menos que 250ms
http_client_duration_milliseconds_bucket{
  service_name="api-skillz",
  le="250"
}
```

### Filtrar por rota especifica

```promql
http_client_duration_milliseconds_bucket{
  service_name="api-skillz",
  http_route="/api/users"
}
```

## Example

**Before (counter generico sem distribuicao):**
```typescript
const counter = meter.createCounter('request_total');
counter.add(1); // So sabe quantidade, nao duracao
```

**After (histograma com distribuicao completa):**
```typescript
const histogram = meter.createHistogram('request_duration', {
  unit: 'ms',
});
histogram.record(elapsed); // Gera bucket + count + sum automaticamente
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Medir tempo de requisicao | Use histograma, nao counter |
| Multiplas instancias enviando metricas | Sempre filtre por `service_name` |
| Montar dashboard de latencia | Use formula `sum(rate(bucket)) / sum(rate(count))` |
| Precisa saber % abaixo de threshold | Use label `le` no bucket |
| Ambiente com Docker Compose | Configure volume persistente para Prometheus |
| Auto-instrumentacao ja cobre a metrica | Nao crie histograma manual duplicado |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `histogram.add(1)` | `histogram.record(valorEmMs)` |
| Consultar bucket sem `service_name` | Sempre filtrar `{service_name="..."}` |
| Rodar Prometheus sem volume persistente | Configurar persistent volume |
| Usar counter para medir duracao | Usar histograma que da distribuicao |
| Criar metrica sem unit no nome | Incluir unidade: `_milliseconds`, `_bytes` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
