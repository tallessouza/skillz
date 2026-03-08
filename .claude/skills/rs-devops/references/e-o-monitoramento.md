---
name: rs-devops-e-o-monitoramento
description: "Applies monitoring vs observability distinction when designing alerting, metrics, and dashboards for production systems. Use when user asks to 'setup monitoring', 'create alerts', 'add custom metrics', 'configure dashboards', or 'implement golden signals'. Covers Golden Signals, custom counters in try/catch, actionable alerts with runbooks, and the macro (monitoring) vs micro (observability) mental model. Make sure to use this skill whenever designing monitoring strategy or creating Prometheus/Grafana alerts. Not for OpenTelemetry instrumentation, log aggregation setup, or distributed tracing configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: observabilidade
  tags: [monitoring, observability, golden-signals, prometheus, alerting, metrics, grafana]
---

# Monitoramento vs Observabilidade

> Monitoramento fornece a visao macro atraves de indicadores e alertas; observabilidade permite o mergulho micro para identificar a causa raiz.

## Rules

1. **Monitoramento e indicadores macro** — mostra ESTADO, nao a causa
2. **Observabilidade e o micro** — traces, logs, spans para causa raiz
3. **Sempre implemente Golden Signals** — erros, latencia, saturacao, satisfacao (Apdex)
4. **Crie metricas customizadas por fluxo** — incrementar contadores em try/catch
5. **Transacional primeiro, analitico como complemento**
6. **Alertas acionaveis** — todo alerta deve levar a uma acao

## How to write

### Metricas customizadas
```typescript
const userRegistrationSuccess = new Counter('user_registration_success_total')
const userRegistrationError = new Counter('user_registration_error_total')

async function registerUser(data: CreateUserInput) {
  try {
    const user = await repository.create(data)
    userRegistrationSuccess.inc()
    return user
  } catch (error) {
    userRegistrationError.inc()
    throw error
  }
}
```

### Alerta acionavel
```yaml
- alert: HighErrorRate
  expr: rate(http_errors_total[5m]) / rate(http_requests_total[5m]) > 0.40
  for: 2m
  annotations:
    summary: "Taxa de erros acima de 40%"
    runbook: "Abrir painel de observabilidade e filtrar por status 500"
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Alerta sem runbook/acao | Alerta com link para dashboard |
| So metricas auto-instrumentadas | Adicione metricas customizadas |
| Depender do cliente reportar problema | Alerta proativo |
| Resolver problema so com dashboard | Dashboard = macro, traces = micro |

## Troubleshooting

### Metricas customizadas nao aparecem no Prometheus
**Symptom:** Counters criados no codigo nao sao exibidos no Grafana/Prometheus
**Cause:** O endpoint `/metrics` nao esta exposto ou o Prometheus nao esta configurado para scrape da aplicacao
**Fix:** Verifique se o SDK de metricas expoe `/metrics` na porta correta e adicione o target no `prometheus.yml` com o service discovery ou static config adequado

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
