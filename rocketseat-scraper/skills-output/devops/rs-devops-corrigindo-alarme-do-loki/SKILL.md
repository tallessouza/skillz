---
name: rs-devops-corrigindo-alarme-do-loki
description: "Applies LogQL alerting patterns when configuring Loki alerts in Grafana. Use when user asks to 'create alert for logs', 'monitor Loki errors', 'alert on log entries', 'count_over_time LogQL', or 'Grafana alarm from logs'. Enforces count_over_time wrapping for log-based alerts since logs are not natively countable like metrics. Make sure to use this skill whenever creating alerting rules from Loki log queries. Not for Prometheus metric alerts, dashboard visualization, or log pipeline configuration."
---

# Alertas no Loki com count_over_time

> Logs nao sao metricas — para alertar sobre logs, sempre envolva a query com `count_over_time` para transformar entradas de log em valores numericos contaveis.

## Rules

1. **Sempre use `count_over_time` em alertas de log** — logs nao sao contaveis nativamente como metricas, e alertas dependem de calculos numericos. Sem `count_over_time`, o alerta nao funciona
2. **Defina a janela de tempo adequada** — `[5m]` para deteccao rapida, `[15m]` para reducao de ruido, porque janelas muito grandes escondem picos e muito pequenas geram falsos positivos
3. **Filtre antes de contar** — aplique filtros de label e texto (`|= "error"`, `{status_code="500"}`) dentro do `count_over_time`, porque contar tudo sem filtro gera alertas sem significado
4. **Use threshold `> 0` como baseline** — para erros criticos, qualquer ocorrencia ja justifica alerta. Ajuste o threshold conforme o contexto
5. **Extraia queries de dashboards existentes** — se ja existe um painel mostrando os logs, use a mesma query como base do alerta, adicionando `count_over_time`

## How to write

### Alerta basico de logs (qualquer entrada)

```yaml
# Grafana Alert Rule - Loki
# Query A:
count_over_time({job="my-app"}[5m]) > 0
```

### Alerta filtrando por erro

```yaml
# Query A:
count_over_time({job="my-app"} |= "error"[5m])

# Condition:
# WHEN last() OF A IS ABOVE 0
```

### Alerta por status code 500

```yaml
# Query A:
count_over_time({job="my-app"} | json | status_code="500"[5m])

# Condition:
# WHEN last() OF A IS ABOVE 0
```

## Example

**Before (erro comum — query de log crua no alerta):**
```
{job="my-app"} |= "error"
# Resultado: alerta nao dispara porque log nao e contavel
```

**After (com count_over_time):**
```
count_over_time({job="my-app"} |= "error"[5m]) > 0
# Resultado: conta entradas de erro nos ultimos 5m, alerta dispara se > 0
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Alerta sobre metrica (Prometheus) | Use query normal, sem `count_over_time` |
| Alerta sobre log (Loki) | Sempre envolva com `count_over_time` |
| Muitos falsos positivos | Aumente a janela de tempo ou o threshold |
| Precisa de alerta rapido | Use janela `[1m]` ou `[5m]` |
| Query ja existe em dashboard | Copie e adicione `count_over_time` ao redor |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `{job="app"} \|= "error"` como alerta | `count_over_time({job="app"} \|= "error"[5m])` |
| Alertar sem threshold definido | `count_over_time(...) > 0` com threshold explicito |
| Contar todos os logs sem filtro | Filtrar por nivel, status code ou texto especifico |
| Janela de 6h para alerta de erro critico | Janela de 1-5m para erros que precisam de acao rapida |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
