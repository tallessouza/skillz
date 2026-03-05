# Code Examples: Monitoramento vs Observabilidade

## 1. Golden Signals — Implementacao completa com Prometheus

```typescript
import { Counter, Histogram, Gauge, register } from 'prom-client'

// === GOLDEN SIGNAL 1: Taxa de Erros ===
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total de requisicoes HTTP',
  labelNames: ['method', 'status_code', 'route'],
})

// === GOLDEN SIGNAL 2: Latencia ===
const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duracao das requisicoes HTTP em segundos',
  labelNames: ['method', 'route'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
})

// === GOLDEN SIGNAL 3: Saturacao ===
// CPU e memoria geralmente sao auto-instrumentados (prom-client collectDefaultMetrics)
import { collectDefaultMetrics } from 'prom-client'
collectDefaultMetrics() // CPU, memoria, event loop lag, etc.

// === GOLDEN SIGNAL 4: Satisfacao (Apdex) ===
// Apdex e calculado a partir do histogram de latencia no Grafana/Prometheus
// Formula: (satisfied + tolerating/2) / total
// Threshold tipico: satisfied < 0.5s, tolerating < 2s
```

## 2. Metricas customizadas em fluxo de negocio

O exemplo que o instrutor descreve: um fluxo de cadastro de usuario com contadores de sucesso e erro.

```typescript
// Metricas customizadas para fluxo de cadastro
const userRegistrationSuccess = new Counter({
  name: 'user_registration_success_total',
  help: 'Cadastros de usuario com sucesso',
})

const userRegistrationError = new Counter({
  name: 'user_registration_error_total',
  help: 'Cadastros de usuario com erro',
  labelNames: ['error_type'],
})

async function registerUser(data: CreateUserInput) {
  try {
    const user = await userRepository.create(data)
    userRegistrationSuccess.inc() // Incrementa metrica de sucesso
    return { user }
  } catch (error) {
    userRegistrationError.inc({ error_type: error.constructor.name }) // Incrementa metrica de erro
    throw error
  }
}
```

**Resultado no painel:** "Na ultima hora, 200 cadastros com sucesso e 500 com erro" — indicador claro de problema no fluxo.

## 3. Alertas conectados ao Slack

```yaml
# prometheus/alerts.yml
groups:
  - name: golden-signals-alerts
    rules:
      # Taxa de erros > 40%
      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status_code=~"5.."}[5m]))
          /
          sum(rate(http_requests_total[5m]))
          > 0.40
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Taxa de erros 5xx acima de 40%"
          description: "{{ $value | humanizePercentage }} das requisicoes estao falhando"

      # Latencia P95 > 2s
      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Latencia P95 acima de 2 segundos"

      # Saturacao — CPU > 80%
      - alert: HighCpuUsage
        expr: process_cpu_seconds_total > 0.80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Uso de CPU acima de 80%"

      # Metrica customizada — erros de cadastro
      - alert: HighRegistrationErrors
        expr: rate(user_registration_error_total[10m]) > rate(user_registration_success_total[10m])
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Mais erros do que sucessos no cadastro de usuarios"
```

## 4. Configuracao do Alertmanager para Slack/SMS

```yaml
# alertmanager.yml
route:
  receiver: 'slack-critical'
  routes:
    - match:
        severity: critical
      receiver: 'slack-critical'
    - match:
        severity: warning
      receiver: 'slack-warning'

receivers:
  - name: 'slack-critical'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/XXX'
        channel: '#alerts-critical'
        title: '{{ .GroupLabels.alertname }}'
        text: '{{ .Annotations.summary }}'

  - name: 'slack-warning'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/XXX'
        channel: '#alerts-warning'
```

## 5. Acompanhamento de crescimento do ecossistema

```promql
# Queries para visualizar crescimento ao longo do tempo no Grafana

# RPS (Requests Per Second) — media por dia
avg_over_time(rate(http_requests_total[1h])[30d:1d])

# Numero de replicas rodando
count(up{job="my-app"})

# Comparacao mes a mes
rate(http_requests_total[5m]) # este mes
rate(http_requests_total[5m] offset 30d) # mes passado
```

## 6. Transacional vs Analitico — arquitetura

```
┌─────────────────────────────────────────────────┐
│              APLICACAO                           │
│  (metricas auto-instrumentadas + customizadas)   │
└──────────┬──────────────────────┬───────────────┘
           │                      │
           ▼                      ▼
┌──────────────────┐   ┌──────────────────────────┐
│  TRANSACIONAL    │   │  ANALITICO               │
│  (Real-time)     │   │  (D-1 ou H-1)            │
│                  │   │                          │
│  Prometheus      │   │  ETL/ELT → Data Lake     │
│  Grafana         │   │  (Databricks, Athena)    │
│  Alertmanager    │   │                          │
│  → Slack/SMS     │   │  Dashboards de Produto   │
│                  │   │  Auditoria               │
│  FOCO: resolver  │   │  FOCO: visao historica   │
│  problema AGORA  │   │  e decisao de negocio    │
└──────────────────┘   └──────────────────────────┘
```