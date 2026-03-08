---
name: rs-devops-entendendo-o-prom-ql
description: "Applies PromQL query patterns and metric type selection for Prometheus monitoring. Use when user asks to 'write PromQL queries', 'choose metric type', 'filter metrics by labels', or 'understand counter vs gauge vs histogram'. Enforces label filtering, correct metric type selection, separate counters for success/error, and metrics-for-symptoms/logs-for-diagnostics principle. Make sure to use this skill whenever writing PromQL queries or selecting Prometheus metric types. Not for Grafana dashboard creation or alerting rule configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: observabilidade-prometheus
  tags: [promql, prometheus, metrics, counter, gauge, histogram, labels, monitoring]
---

# Entendendo o PromQL

> PromQL e uma linguagem de consulta para series temporais do Prometheus — domine a estrutura metrica + labels + timestamp.

## Rules

1. **Filtre sempre por labels** — use `{service_name="app"}` para escopar metricas por aplicacao
2. **Counters so incrementam** — nunca decremente; crie metricas separadas para sucesso e erro
3. **Metricas sao sintomas, logs sao diagnosticos** — metricas mostram QUE, logs mostram POR QUE
4. **Use labels significativas** — `service_name`, `environment`, `version`
5. **Escolha o tipo de metrica correto** — counter para contagens, gauge para valores volateis, histogram para distribuicao

## Tipos de metricas

### Counter
```promql
ecommerce_transactions_success_total{service_name="checkout"}
ecommerce_transactions_error_total{service_name="checkout"}
```

### Gauge
```promql
node_cpu_usage_percent{environment="production"}
```

### Histogram
```promql
http_request_duration_seconds_bucket{service_name="api"}
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Decrementar counter em caso de erro | Criar counter separado para erros |
| Buscar metrica sem label filter | Sempre filtrar por `service_name` |
| Usar so metrica para diagnosticar | Metrica = sintoma, use logs para causa raiz |
| Uma unica metrica sucesso/erro com +1/-1 | Duas metricas separadas |

## Troubleshooting

### Counter mostra valor que so cresce, impossivel ver taxa por segundo
**Symptom:** Metrica counter mostra numero absoluto crescente, dificil interpretar
**Cause:** Counter por definicao so incrementa — precisa usar funcao `rate()` ou `increase()` para derivar taxa
**Fix:** Usar `rate(metric_total[5m])` para ver taxa por segundo ou `increase(metric_total[1h])` para incremento no periodo

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
