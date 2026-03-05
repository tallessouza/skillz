# Code Examples: Golden Signals

## Dashboard de Golden Signals (conceitual)

Nao ha codigo direto na aula, pois e teorica. Abaixo, exemplos praticos de como implementar monitoramento dos 4 sinais.

### Prometheus — metricas para os 4 sinais

```yaml
# Latencia — histogram de tempo de resposta
- record: http_request_duration_seconds
  expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Trafego — requests por segundo
- record: http_requests_per_second
  expr: rate(http_requests_total[5m])

# Erros — taxa de erros 5xx
- record: http_error_rate
  expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])

# Saturacao — uso de CPU e memoria
- record: container_cpu_usage
  expr: rate(container_cpu_usage_seconds_total[5m])
- record: container_memory_usage
  expr: container_memory_usage_bytes / container_spec_memory_limit_bytes
```

### Alertas baseados nos Golden Signals

```yaml
groups:
  - name: golden-signals
    rules:
      # Latencia — alerta quando p95 salta 3x acima do baseline
      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Latencia p95 acima de 500ms"

      # Trafego — alerta quando RPS triplica
      - alert: TrafficSpike
        expr: rate(http_requests_total[5m]) > 3 * avg_over_time(rate(http_requests_total[5m])[1h:5m])
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "Trafego 3x acima da media"

      # Erros — alerta quando taxa de erro 5xx ultrapassa 5%
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Taxa de erros 5xx acima de 5%"

      # Saturacao — alerta quando CPU ou memoria ultrapassa 80%
      - alert: HighSaturation
        expr: container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Uso de memoria acima de 80%"
```

### Circuit Breaker com Istio (DestinationRule)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: my-service-circuit-breaker
spec:
  host: my-service
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        h2UpgradePolicy: DEFAULT
        http1MaxPendingRequests: 100
        http2MaxRequests: 1000
        maxRequestsPerConnection: 10
    outlierDetection:
      consecutive5xxErrors: 5        # 5 erros 5xx consecutivos
      interval: 10s                   # janela de avaliacao
      baseEjectionTime: 30s           # tempo fora do pool
      maxEjectionPercent: 50          # maximo de pods ejetados
```

### Grafana Dashboard JSON (estrutura basica)

```json
{
  "title": "Golden Signals",
  "panels": [
    {
      "title": "Latencia (p95)",
      "type": "timeseries",
      "targets": [{ "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))" }]
    },
    {
      "title": "Trafego (RPS)",
      "type": "timeseries",
      "targets": [{ "expr": "rate(http_requests_total[5m])" }]
    },
    {
      "title": "Taxa de Erros 5xx",
      "type": "stat",
      "targets": [{ "expr": "rate(http_requests_total{status=~\"5..\"}[5m]) / rate(http_requests_total[5m]) * 100" }]
    },
    {
      "title": "Saturacao (CPU/Memoria)",
      "type": "gauge",
      "targets": [{ "expr": "container_memory_usage_bytes / container_spec_memory_limit_bytes * 100" }]
    }
  ]
}
```

### Async vs Sync — exemplo Node.js

```typescript
// SINCRONO — enfileira, aumenta latencia sob trafego alto
app.post('/orders', async (req, res) => {
  const order = await createOrder(req.body)
  await sendEmail(order.userEmail, order)      // bloqueia
  await updateInventory(order.items)            // bloqueia
  await notifyWarehouse(order)                  // bloqueia
  res.json({ order })
})

// ASSINCRONO — responde rapido, processa em background
app.post('/orders', async (req, res) => {
  const order = await createOrder(req.body)
  
  // Publica eventos — processamento assincrono
  await queue.publish('order.created', { orderId: order.id })
  
  res.json({ order })  // responde imediatamente
})

// Workers processam de forma assincrona
queue.subscribe('order.created', async (event) => {
  const order = await getOrder(event.orderId)
  await sendEmail(order.userEmail, order)
  await updateInventory(order.items)
  await notifyWarehouse(order)
})
```