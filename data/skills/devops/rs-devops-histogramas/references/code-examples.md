# Code Examples: Histogramas no Prometheus

## 1. Criando histograma na aplicacao (OpenTelemetry)

```typescript
// No service da aplicacao
const histogram = meter.createHistogram('request_duration', {
  description: 'Duracao das requisicoes em milissegundos',
  unit: 'ms',
});

// Registrar uma observacao (diferente de counter que usa .add())
histogram.record(1000); // 1000ms = 1 segundo
```

Resultado no Prometheus — 3 metricas criadas automaticamente:
- `request_duration_bucket{le="..."}`
- `request_duration_count`
- `request_duration_sum`

## 2. Comparacao: Counter vs Histograma

```typescript
// COUNTER — gera metrica com sufixo _total
const counter = meter.createCounter('hello_sex');
counter.add(1);
// Prometheus: hello_sex_total

// HISTOGRAMA — gera _bucket, _count, _sum
const histogram = meter.createHistogram('request_duration');
histogram.record(1000);
// Prometheus: request_duration_bucket, request_duration_count, request_duration_sum
```

## 3. Consultas PromQL

### Ver todos os buckets de uma metrica

```promql
http_client_duration_milliseconds_bucket{
  service_name="api-skillz",
  version="1.0"
}
```

Retorna multiplos resultados com diferentes valores de `le` (5, 10, 25, 50, 75, 100, 250, 500, 1000, 2500, 5000, 10000, +Inf).

### Filtrar por threshold com `le`

```promql
-- Quantas requisicoes levaram ate 250ms?
http_client_duration_milliseconds_bucket{
  service_name="api-skillz",
  le="250"
}
```

### Media de duracao nos ultimos 5 minutos

```promql
sum(rate(http_client_duration_milliseconds_bucket{service_name="api-skillz"}[5m]))
/
sum(rate(http_client_duration_milliseconds_count{service_name="api-skillz"}[5m]))
```

### Media nos ultimos 10 minutos

```promql
sum(rate(http_client_duration_milliseconds_bucket{service_name="api-skillz"}[10m]))
/
sum(rate(http_client_duration_milliseconds_count{service_name="api-skillz"}[10m]))
```

### Filtrar por rota especifica

```promql
http_client_duration_milliseconds_bucket{
  service_name="api-skillz",
  http_route="/api/users"
}
```

### Ver sum total

```promql
http_client_duration_milliseconds_sum{
  service_name="api-skillz"
}
```

### Ver count total

```promql
http_client_duration_milliseconds_count{
  service_name="api-skillz"
}
```

## 4. Verificacao de consistencia

O instrutor demonstra que os numeros batem:
- `count` = 16 observacoes
- Cada observacao registrou 1000ms
- `sum` = 16000 (16 × 1000)

Isso valida que a instrumentacao esta correta.

## 5. Cenario: volume persistente para nao perder metricas

```yaml
# docker-compose.yml — SEM persistencia (problema)
services:
  prometheus:
    image: prom/prometheus
    # docker compose down = perde tudo

# docker-compose.yml — COM persistencia (correto)
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - prometheus-data:/prometheus

volumes:
  prometheus-data:
    driver: local
```

## 6. Labels disponiveis para filtragem

| Label | Exemplo | Uso |
|-------|---------|-----|
| `service_name` | `api-skillz` | Isolar por aplicacao |
| `version` | `1.0` | Isolar por versao |
| `http_route` | `/api/users` | Isolar por endpoint |
| `http_method` | `GET`, `POST` | Isolar por verbo |
| `http_status_code` | `200`, `404`, `304` | Isolar por status |
| `le` | `250`, `500`, `+Inf` | Threshold do bucket |