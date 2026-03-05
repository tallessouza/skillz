---
name: rs-devops-entendendo-o-prom-ql
description: "Applies PromQL query language patterns and Prometheus metric design principles when building observability dashboards or writing monitoring queries. Use when user asks to 'create a dashboard', 'write a PromQL query', 'add metrics', 'monitor application', or 'setup Prometheus'. Covers metric types (counter, gauge, histogram), label filtering, and metric-as-symptom philosophy. Make sure to use this skill whenever designing metrics or querying Prometheus, even for auto-instrumented metrics. Not for log queries (LogQL), trace queries (TraceQL), or alerting rules."
---

# Entendendo o PromQL

> PromQL e uma linguagem de consulta para series temporais do Prometheus — domine a estrutura metrica + labels + timestamp para filtrar e agregar dados de observabilidade.

## Rules

1. **Filtre sempre por labels** — use `{service_name="app"}` para escopar metricas por aplicacao, porque multiplas aplicacoes compartilham os mesmos nomes de metrica e sem label voce nao sabe de quem e a metrica
2. **Counters so incrementam** — nunca decremente um counter; crie metricas separadas para sucesso e erro, porque decrementar corrompe a semantica temporal da serie
3. **Metricas sao sintomas, logs sao diagnosticos** — metricas mostram QUE algo esta errado, logs mostram POR QUE esta errado, porque a metrica sozinha nao carrega contexto suficiente
4. **Use labels significativas** — `service_name`, `environment`, `container_tag`, `version` sao exemplos uteis, porque permitem escopar e cruzar dados entre ambientes e versoes
5. **Escolha o tipo de metrica correto** — counter para contagens cumulativas, gauge para valores volateis, histogram para distribuicao temporal, porque cada tipo tem semantica e funcoes PromQL diferentes

## Estrutura do PromQL

```
nome_da_metrica{label1="valor1", label2="valor2"}
```

### Componentes

| Componente | Exemplo | Funcao |
|------------|---------|--------|
| Nome da metrica | `http_requests_total` | Identifica o que esta sendo medido |
| Labels | `{service_name="skillz"}` | Filtra por aplicacao, ambiente, versao |
| Timestamp | (implicito) | Horario da coleta da metrica |

## Tipos de metricas

### Counter (contagem cumulativa)
```promql
# Total de transacoes com sucesso
ecommerce_transactions_success_total{service_name="checkout"}

# Total de transacoes com erro (metrica SEPARADA)
ecommerce_transactions_error_total{service_name="checkout"}
```

### Gauge (valor volatil)
```promql
# Temperatura, uso de CPU, conexoes ativas
node_cpu_usage_percent{environment="production"}
```

### Histogram (distribuicao temporal)
```promql
# Duracao de requisicoes — calcula diff entre start e end
http_request_duration_seconds_bucket{service_name="api"}
```

## Example

**Before (sem filtro de label):**
```promql
http_requests_total
```
Retorna metricas de TODAS as aplicacoes misturadas — impossivel saber qual app esta com problema.

**After (com label filtering):**
```promql
http_requests_total{service_name="skillz", environment="production"}
```
Retorna apenas metricas da aplicacao skillz em producao.

## Heuristics

| Situacao | Faca |
|----------|------|
| Contar eventos (requests, transacoes) | Use counter, nunca decremente |
| Medir algo que sobe e desce (CPU, memoria) | Use gauge |
| Medir duracao de operacoes | Use histogram (start/end diff) |
| Metrica subiu anormalmente | Olhe os logs para diagnosticar a causa |
| Multiplas apps com mesma metrica | Filtre por `service_name` na label |
| Deploy recente causou pico | Use histogram para comparar antes/depois |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Decrementar counter em caso de erro | Criar counter separado para erros |
| Buscar metrica sem label filter | Sempre filtrar por `service_name` no minimo |
| Usar so metrica para diagnosticar problema | Metrica = sintoma, use logs para causa raiz |
| Uma unica metrica sucesso/erro com +1/-1 | Duas metricas: `_success_total` e `_error_total` |
| Ignorar `honor_labels` no scrape config | Configurar para evitar conflito entre labels |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-entendendo-o-prom-ql/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-entendendo-o-prom-ql/references/code-examples.md)
