# Code Examples: O que e Observabilidade

## Nota

Esta aula e conceitual — nao contem exemplos de codigo diretamente. Os exemplos abaixo ilustram os conceitos discutidos pelo instrutor em formato pratico, preparando para as aulas praticas do modulo.

## Exemplo: Aplicacao sem observabilidade vs com observabilidade

### Sem observabilidade (o problema)

```typescript
// API que nao exporta nenhuma metrica, log estruturado ou trace
app.get('/orders/:id', async (req, res) => {
  try {
    const order = await db.query('SELECT * FROM orders WHERE id = $1', [req.params.id])
    return res.json(order)
  } catch (error) {
    // Stack trace exposto ao cliente — problema de seguranca mencionado pelo instrutor
    return res.status(500).json({ error: error.stack })
  }
})
```

Problemas:
- Nenhum log estruturado — impossivel investigar depois
- Nenhuma metrica — nao sabe quantas requisicoes, latencia, taxa de erro
- Nenhum trace — se esta API chama outra, nao ha rastreabilidade
- Stack trace exposto ao usuario — risco de seguranca

### Com observabilidade (o objetivo)

```typescript
import { logger } from './observability/logger'
import { metrics } from './observability/metrics'
import { tracer } from './observability/tracer'

app.get('/orders/:id', async (req, res) => {
  const span = tracer.startSpan('GET /orders/:id')
  const startTime = Date.now()

  try {
    const order = await db.query('SELECT * FROM orders WHERE id = $1', [req.params.id])

    metrics.increment('http_requests_total', { method: 'GET', path: '/orders', status: '200' })
    metrics.histogram('http_request_duration_ms', Date.now() - startTime)

    span.end()
    return res.json(order)
  } catch (error) {
    // Log estruturado interno — visivel apenas para o time
    logger.error('Failed to fetch order', {
      orderId: req.params.id,
      error: error.message,
      stack: error.stack,
    })

    metrics.increment('http_requests_total', { method: 'GET', path: '/orders', status: '500' })
    span.setStatus({ code: 'ERROR', message: error.message })
    span.end()

    // Erro generico para o cliente — seguro
    return res.status(500).json({ error: 'Internal server error' })
  }
})
```

## Exemplo: Cadeia de dependencias (A → B → C)

O instrutor enfatiza entender a cadeia de dependencias. Com traces:

```
[Trace ID: abc-123]
├── App A: POST /checkout (120ms)
│   ├── App B: POST /payment (80ms)
│   │   └── App C: POST /notify (15ms)
│   └── Database: INSERT orders (25ms)
```

Sem traces, se o checkout demora 120ms, voce nao sabe ONDE esta o gargalo. Com traces, fica claro que o pagamento consome 80ms dos 120ms.

## Exemplo: Metricas que o instrutor menciona

```
# Taxa de erros (quantos % das requisicoes falham)
http_requests_total{status="500"} / http_requests_total * 100

# Latencia (quanto tempo cada requisicao demora)
histogram_quantile(0.99, http_request_duration_seconds_bucket)

# Throughput (quantas requisicoes por segundo)
rate(http_requests_total[5m])

# Consumo de recursos
container_cpu_usage_seconds_total
container_memory_usage_bytes

# Replicas rodando
kube_deployment_status_replicas_available
```

## Exemplo: Visao macro vs micro

### Macro (dashboard)
```
┌─────────────────────────────────────────┐
│ Sistema de Pedidos — Ultimo 1h          │
│                                         │
│ Requisicoes/s: 1.2K   Erros: 0.3%     │
│ Latencia p99:  45ms   CPU: 62%         │
│ Replicas:      3/3    Memoria: 71%     │
└─────────────────────────────────────────┘
```

### Micro (investigacao de problema)
```
14:32:01 ERROR order-service: Connection refused to payment-api
14:32:01 ERROR order-service: Connection refused to payment-api
14:32:02 WARN  order-service: Circuit breaker opened for payment-api
14:32:02 INFO  order-service: Falling back to cached payment status

Trace abc-123:
  order-service → payment-api: TIMEOUT after 5000ms
  payment-api: container restarting (OOMKilled)
```