# Code Examples: Entendendo o PromQL

## Estrutura Basica de uma Query PromQL

```promql
# Formato geral
nome_da_metrica{label1="valor1", label2="valor2"}

# Exemplo real da aula
http_requests_total{service_name="skillz"}
```

## Filtragem por Labels

```promql
# Filtrar por aplicacao
http_requests_total{service_name="skillz"}

# Filtrar por ambiente
http_requests_total{environment="production"}

# Multiplas labels
http_requests_total{service_name="skillz", environment="production"}

# Filtrar por versao do container
http_requests_total{container_tag="v1.2.3"}
```

## Counters — Padrao Sucesso/Erro

```typescript
// NO CODIGO DA APLICACAO (proximo da proxima aula)

// No try — incrementa sucesso
transactionSuccessCounter.inc(1);

// No catch — incrementa erro (metrica SEPARADA)
transactionErrorCounter.inc(1);

// NUNCA faca isso:
// transactionSuccessCounter.dec(1); // ANTI-PATTERN
```

```promql
# No PromQL — consultar counters
ecommerce_transactions_success_total{service_name="checkout"}
ecommerce_transactions_error_total{service_name="checkout"}

# Rate de sucesso por segundo (ultimos 5 min)
rate(ecommerce_transactions_success_total{service_name="checkout"}[5m])

# Rate de erro por segundo
rate(ecommerce_transactions_error_total{service_name="checkout"}[5m])
```

## Gauges — Valores Volateis

```promql
# CPU usage (sobe e desce)
node_cpu_usage_percent{instance="server-01"}

# Memoria disponivel
node_memory_available_bytes{environment="production"}

# Conexoes ativas
app_active_connections{service_name="api"}
```

## Histograms — Distribuicao Temporal

```promql
# Buckets de duracao de requisicao
http_request_duration_seconds_bucket{service_name="api"}

# Percentil 95 de latencia (ultimos 5 min)
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{service_name="api"}[5m]))

# Percentil 99
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket{service_name="api"}[5m]))
```

## Configuracao do Prometheus (honor_labels)

```yaml
# prometheus.yml (scrape config)
scrape_configs:
  - job_name: 'skillz-app'
    honor_labels: true  # Evita conflito entre labels da app e do Prometheus
    static_configs:
      - targets: ['app:3000']
```

## Builder vs Code no Grafana

No Grafana, o builder transforma selecoes visuais em PromQL:

```
# Builder: Metric = http_requests_total, Label = service_name, Value = skillz
# Gera automaticamente:
http_requests_total{service_name="skillz"}
```

Equivalencias nas tres linguagens:
```
# LogQL (Loki)
{service_name="skillz"} |= "error"

# TraceQL (Tempo)
{resource.service.name="skillz"}

# PromQL (Prometheus)
http_requests_total{service_name="skillz"}
```

## Exemplo Pratico: Dashboard de E-commerce

```promql
# Painel 1: Taxa de sucesso por minuto
rate(ecommerce_transactions_success_total{service_name="checkout"}[1m])

# Painel 2: Taxa de erro por minuto
rate(ecommerce_transactions_error_total{service_name="checkout"}[1m])

# Painel 3: Ratio erro/total (porcentagem de erro)
rate(ecommerce_transactions_error_total{service_name="checkout"}[5m])
/
(rate(ecommerce_transactions_success_total{service_name="checkout"}[5m]) + rate(ecommerce_transactions_error_total{service_name="checkout"}[5m]))

# Painel 4: Latencia p95
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{service_name="checkout"}[5m]))
```