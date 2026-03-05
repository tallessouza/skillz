---
name: rs-devops-e-o-monitoramento
description: "Applies monitoring vs observability distinction when designing alerting, dashboards, or metrics systems. Use when user asks to 'add monitoring', 'create alerts', 'set up dashboards', 'track errors', 'add metrics', or 'implement observability'. Enforces Golden Signals (errors, saturation, latency, satisfaction), transactional vs analytical monitoring separation, and custom metric instrumentation patterns. Make sure to use this skill whenever building monitoring infrastructure or discussing system health visibility. Not for application business logic, unit testing, or CI/CD pipeline configuration."
---

# Monitoramento vs Observabilidade

> Monitoramento fornece a visao macro atraves de indicadores e alertas; observabilidade permite o mergulho micro para identificar a causa raiz.

## Rules

1. **Monitoramento e indicadores macro** — monitoramento mostra ESTADO do sistema (taxa de erros, latencia, saturacao), nao a causa do problema, porque um numero sozinho nao explica o que aconteceu
2. **Observabilidade e o micro** — quando o alerta dispara, use observabilidade (traces, logs, spans) para chegar na causa raiz, porque o indicador so aponta que algo esta errado
3. **Sempre implemente Golden Signals** — erros, latencia, saturacao, satisfacao (Apdex), porque sao os 4 indicadores universais de saude de qualquer aplicacao
4. **Crie metricas customizadas por fluxo** — incrementar contadores de sucesso/erro em fluxos criticos (try/catch), porque metricas auto-instrumentadas nao cobrem logica de negocio
5. **Transacional primeiro, analitico como complemento** — monitoramento transacional (real-time) e obrigatorio para resolver problemas rapido; analitico (H-1, D-1) e opcional para visao de produto
6. **Alertas acionaveis** — todo alerta deve levar a uma acao (abrir painel, investigar), porque alerta sem caminho de investigacao e ruido

## How to write

### Golden Signals como metricas

```typescript
// Os 4 Golden Signals que toda aplicacao deve expor
const metrics = {
  errorRate: new Counter('http_errors_total', 'Total HTTP errors', ['status_code']),
  latency: new Histogram('http_request_duration_seconds', 'Request latency'),
  saturation: new Gauge('system_cpu_usage_percent', 'CPU usage percentage'),
  // Apdex calculado a partir do latency histogram
}
```

### Metricas customizadas em fluxos de negocio

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

### Alerta com threshold acionavel

```yaml
# Alerta que leva a acao — conectado ao Slack/SMS
groups:
  - name: golden-signals
    rules:
      - alert: HighErrorRate
        expr: rate(http_errors_total[5m]) / rate(http_requests_total[5m]) > 0.40
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Taxa de erros acima de 40%"
          runbook: "Abrir painel de observabilidade e filtrar por status 500"
```

## Example

**Before (monitoramento sem caminho de investigacao):**
```yaml
# So alerta, sem contexto para atuar
- alert: ErrorsHigh
  expr: errors > 100
  annotations:
    summary: "Muitos erros"
```

**After (monitoramento que leva a observabilidade):**
```yaml
# Alerta com Golden Signal + caminho para o micro
- alert: HighErrorRate
  expr: rate(http_errors_total{status_code=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.40
  for: 2m
  labels:
    severity: critical
  annotations:
    summary: "Taxa de erros 5xx acima de 40% nos ultimos 5min"
    dashboard: "https://grafana.internal/d/golden-signals"
    runbook: "1. Abrir dashboard 2. Filtrar traces por erro 3. Identificar servico com falha"
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Preciso saber se algo esta errado | Monitoramento — painel + alerta (macro) |
| Preciso saber POR QUE esta errado | Observabilidade — traces, logs (micro) |
| Metrica de CPU, memoria, disco | Auto-instrumentacao ja cobre, nao reimplemente |
| Fluxo critico de negocio (cadastro, pagamento) | Crie metricas customizadas com contadores success/error |
| Produto quer visao historica | Monitoramento analitico (D-1 ou H-1), nao transacional |
| Quer resolver problema AGORA | Monitoramento transacional (real-time) obrigatorio |
| Analitico real-time | Possivel com streaming, mas custo alto — avalie necessidade |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Alerta sem runbook/acao | Alerta com link para dashboard e passos de investigacao |
| So metricas auto-instrumentadas | Adicione metricas customizadas para fluxos de negocio |
| Depender do cliente reportar problema | Alerta proativo no Slack/SMS |
| Monitoramento analitico como unica fonte | Transacional primeiro, analitico como complemento |
| Metrica generica `errors_total` sem labels | `http_errors_total{status_code, service, endpoint}` |
| Resolver problema so com dashboard | Dashboard indica o macro, use traces para o micro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-e-o-monitoramento/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-e-o-monitoramento/references/code-examples.md)
