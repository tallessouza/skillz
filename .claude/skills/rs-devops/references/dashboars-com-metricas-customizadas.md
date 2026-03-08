---
name: rs-devops-dashboards-metricas-customizadas
description: "Applies Grafana dashboard patterns for custom OpenTelemetry metrics when building actionable monitoring views. Use when user asks to 'create metrics dashboard', 'visualize custom metrics', 'grafana prometheus panel', 'dashboard for errors', or 'monitor custom counters'. Enforces error-first panel priority, service_name scoping, correct visualization types, and row organization. Make sure to use this skill whenever creating Grafana dashboards for custom application metrics. Not for log dashboards, trace visualization, or alerting configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: observability-grafana
  tags: [grafana, dashboard, custom-metrics, prometheus, promql, counters, histograms]
---

# Dashboards com Metricas Customizadas

> Dashboards devem ser acionaveis — cada painel precisa responder a pergunta "o que eu faco quando esse numero sobe?"

## Rules

1. **Priorize metricas de erro** — metricas de erro permitem acao imediata
2. **Sempre scope por service_name** — multiplas apps podem emitir mesma metrica
3. **Configure thresholds visuais** — verde base, vermelho acima do limite
4. **Segmente por environment** — staging e producao separados
5. **Use o tipo de visualizacao correto** — Time Series para counters, Histogram para histogramas
6. **Organize com rows** — agrupe paineis em rows nomeadas

## How to write

```promql
# Painel de erro (acionavel)
hello_error_total{service_name="app-skillz"}

# Painel de histograma
request_duration_bucket{service_name="app-skillz"}
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Dashboard so com metricas de sucesso | Priorize paineis de erro |
| Metrica sem filtro de `service_name` | Sempre scope: `metric{service_name="app"}` |
| Histograma renderizado como Time Series | Use visualizacao Histogram para buckets |
| Paineis soltos sem organizacao | Agrupe em rows nomeadas |

## Troubleshooting

### Metrica aparece sem dados no painel do Grafana
**Symptom:** O painel mostra "No data" mesmo com a aplicacao rodando e emitindo metricas.
**Cause:** A query PromQL nao filtra por `service_name`, e o Prometheus pode ter multiplas aplicacoes emitindo metricas com nomes diferentes.
**Fix:** Adicione o filtro `{service_name="app-skillz"}` na query PromQL para garantir que esta consultando a aplicacao correta.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
