---
name: rs-devops-dashboards-metricas-customizadas
description: "Applies Grafana dashboard creation patterns with custom Prometheus metrics when user asks to 'create a dashboard', 'add metrics panel', 'monitor custom metrics', 'setup Grafana visualization', or 'configure thresholds'. Enforces actionable dashboards with error-focused panels, service_name scoping, threshold configuration, and environment segmentation. Make sure to use this skill whenever building observability dashboards or configuring Grafana panels. Not for alerting rules configuration, Prometheus scraping setup, or metrics instrumentation in application code."
---

# Dashboards com Metricas Customizadas

> Dashboards devem ser acionaveis — cada painel precisa responder a pergunta "o que eu faco quando esse numero sobe?"

## Rules

1. **Priorize metricas de erro** — dashboards de acompanhamento de sucesso sao bonitos mas nao acionaveis, porque metricas de erro permitem acao imediata quando o numero cresce
2. **Sempre scope por service_name** — metricas podem ser globais e multiplas aplicacoes podem emitir a mesma metrica, o `service_name` diferencia a origem
3. **Configure thresholds visuais** — use cores (verde base, vermelho acima do limite) para trazer acionabilidade visual imediata ao bater o olho no dashboard
4. **Segmente por environment** — staging e producao devem ter paineis ou filtros separados, porque o mesmo dashboard sem filtro mistura dados e gera falsos positivos
5. **Use o tipo de visualizacao correto** — Time Series para counters, Histogram para histogramas (buckets), porque o grafico de barra segmenta melhor por bucket
6. **Organize com rows** — agrupe paineis em rows nomeadas (ex: "Metricas", "Erros") para navegacao rapida no dashboard

## How to write

### Painel basico com counter (Prometheus)

```promql
# Selecione a metrica counter com scope de service_name
hello_success_total{service_name="app-rocketseat"}
```

### Painel de erro (acionavel)

```promql
# Metricas de erro sao prioridade — numero crescente = acao necessaria
hello_error_total{service_name="app-rocketseat"}
```

### Painel de histograma (duracao)

```promql
# Use visualizacao Histogram para metricas de duracao com buckets
request_duration_bucket{service_name="app-rocketseat"}
```

## Example

**Before (dashboard sem acionabilidade):**
- Painel unico mostrando `hello_success_total` sem filtro de service_name
- Sem thresholds configurados
- Sem segmentacao por environment
- Visualizacao Time Series para histograma

**After (com esta skill aplicada):**
- Row "Metricas de Erro" com `hello_error_total{service_name="app-rocketseat"}`
- Row "Acompanhamento" com `hello_success_total{service_name="app-rocketseat"}`
- Threshold: verde como base, vermelho acima de 30 (ou limite definido pelo time)
- Filtro de environment (staging/production) no dashboard
- Histogram para `request_duration_bucket`, Time Series para counters
- Cada save do dashboard com comentario descritivo (funciona como um commit)

## Heuristics

| Situacao | Faca |
|----------|------|
| Metrica e um counter de sucesso | Crie o painel mas priorize o equivalente de erro |
| Metrica e um histograma | Use visualizacao Histogram, nao Time Series |
| Multiplas apps emitem mesma metrica | Filtre por `service_name` no painel |
| Dashboard serve staging e prod | Adicione variavel de environment como filtro |
| Numero pode indicar problema acima de X | Configure threshold com cor vermelha |
| Salvando alteracoes no dashboard | Adicione comentario descritivo (funciona como commit) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Dashboard so com metricas de sucesso | Priorize paineis de erro (acionaveis) |
| Metrica sem filtro de `service_name` | Sempre scope: `metric{service_name="app"}` |
| Threshold sem cor de alerta | Verde base + vermelho acima do limite |
| Histograma renderizado como Time Series | Use visualizacao Histogram para buckets |
| Paineis soltos sem organizacao | Agrupe em rows nomeadas |
| Staging e prod no mesmo painel sem filtro | Segmente por environment |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
