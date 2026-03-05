# Code Examples: Métricas — Segundo Pilar da Observabilidade

## 1. Counter — Cadastro de Usuário

O exemplo central da aula: instrumentar um fluxo de cadastro com contadores separados.

```typescript
// Contadores separados para cada outcome
const userRegistrationSuccess = metrics.counter('user_registration_success_total')
const userRegistrationError = metrics.counter('user_registration_error_total')

async function registerUser(data: CreateUserInput) {
  try {
    const user = await userRepository.create(data)
    userRegistrationSuccess.increment(1)  // SEMPRE incrementa
    return { user }
  } catch (error) {
    userRegistrationError.increment(1)    // Contador SEPARADO, nunca decrementa o de sucesso
    throw error
  }
}
```

**Ponto-chave:** Nunca faça `userRegistrationSuccess.decrement(1)` quando há erro. Cada outcome tem seu próprio counter monotonicamente crescente.

## 2. Histogram — Tempo de Requisição

Padrão descrito pelo instrutor para medir latência manualmente.

```typescript
const requestDuration = metrics.histogram('http_request_duration_ms', {
  buckets: [10, 50, 100, 250, 500, 1000, 2500, 5000]
})

async function handleRequest(request: Request) {
  const startTime = Date.now()

  try {
    const response = await processRequest(request)
    return response
  } finally {
    const durationMs = Date.now() - startTime
    requestDuration.record(durationMs)
  }
}
```

**Uso:** Permite montar dashboards de distribuição e calcular percentis (P99, P95, P90).

## 3. Gauge — Valor que Flutua

Exemplo do instrutor sobre métrica que incrementa e decrementa.

```typescript
const activeConnections = metrics.gauge('active_connections')

function onConnectionOpen() {
  activeConnections.increment(1)
}

function onConnectionClose() {
  activeConnections.decrement(1)
}
```

**Quando usar:** Conexões ativas, itens em fila, memória utilizada — valores que naturalmente sobem e descem.

## 4. Percentis — Acompanhamento de P99

```typescript
// Configurar histogram com buckets para percentis
const responseTime = metrics.histogram('api_response_time_ms', {
  buckets: [10, 25, 50, 100, 200, 500, 1000, 2000, 5000]
})

// No dashboard (Grafana/similar):
// P99 = 50ms  → Excelente (99% respondido em até 50ms)
// P99 = 2000ms → Sistema muito lento
// P95 = 100ms → 95% respondido em até 100ms
```

## 5. Detecção de Anomalias

```typescript
// Métrica de tráfego (RPS)
const requestsPerSecond = metrics.counter('http_requests_total')

// Configurar alerta no sistema de monitoramento:
// Normal: ~100 RPS
// Anomalia alta: > 500 RPS (possível ataque, spike viral)
// Anomalia baixa: < 10 RPS (possível falha upstream)
```

## 6. Golden Signals Completo

```typescript
// 1. Latência
const latency = metrics.histogram('request_latency_ms')

// 2. Tráfego
const traffic = metrics.counter('requests_total')

// 3. Erros
const errors = metrics.counter('errors_total')

// 4. Saturação
const saturation = metrics.gauge('cpu_utilization_percent')
const queueSize = metrics.gauge('request_queue_size')
```

## 7. Métricas Negociais

```typescript
// Métricas de produto/negócio — não apenas técnicas
const ordersCompleted = metrics.counter('orders_completed_total')
const orderValue = metrics.histogram('order_value_cents')
const cartAbandonment = metrics.counter('cart_abandoned_total')
const signupConversion = metrics.counter('signup_completed_total')

// Permitem KPIs de negócio no mesmo dashboard de observabilidade
```

## 8. SLI/SLO com Métricas

```typescript
// SLI: a métrica em si
const sliLatency = metrics.histogram('sli_request_latency_ms')
const sliAvailability = metrics.counter('sli_successful_requests_total')
const sliTotal = metrics.counter('sli_total_requests_total')

// SLO: o objetivo definido no monitoramento
// Availability SLO: 99.9% (sliAvailability / sliTotal >= 0.999)
// Latency SLO: P99 < 200ms

// SLA: contrato com cliente baseado nos SLOs
```

## Visualização mencionada na aula

O instrutor mostra um exemplo do Logz.io com:
- Contagem de alertas por severidade
- Contagem de spans
- Métricas recentes com filtros
- Tudo no contexto **macro** — quantidades, totais, tendências