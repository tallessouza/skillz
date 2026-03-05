# Code Examples: Analisando Traces e Metricas

## Validacao do pipeline

### Verificar containers

```bash
# Listar containers rodando
docker ps

# Verificar logs de um container especifico
docker logs <container-name>

# Verificar logs com follow para monitorar em tempo real
docker logs -f <otel-collector-container>
```

### Gerar traces de teste

```bash
# Testar endpoint health
curl http://localhost:3000/health

# Testar endpoint help
curl http://localhost:3000/help

# Gerar multiplas requisicoes para popular metricas
for i in $(seq 1 10); do curl -s http://localhost:3000/health; done
```

## Navegacao no Grafana

### Explorando Traces (Tempo)

```
Passo a passo no Grafana:

1. Menu lateral → Explore
2. Dropdown de Data Source → selecionar Tempo
3. Clicar no botao "Search"
4. Lista de Trace IDs aparece com:
   - Trace ID (hex string)
   - Servico de origem
   - Duracao total
   - Timestamp
5. Clicar em um Trace ID para expandir
6. Visualizacao em cascata (waterfall) mostra:
   - Cada span como uma barra horizontal
   - Tempo de cada operacao
   - Hierarquia de chamadas
```

### Busca direta por Trace ID (TraceQL)

```
No Grafana Tempo:

1. Copiar o Trace ID de um log ou da lista
   Exemplo: a1b2c3d4e5f6789012345678abcdef00
2. No campo TraceQL, colar o ID
3. Executar a busca
4. Resultado: trace completo com todos os spans
```

### Explorando Metricas (Mimir)

```
No Grafana:

1. Menu lateral → Explore
2. Dropdown de Data Source → selecionar Mimir
3. Clicar em "Metrics Browser"
4. Metricas auto-instrumentadas disponiveis:
   - http_server_duration_seconds_bucket
   - http_server_duration_seconds_count
   - http_server_duration_seconds_sum
   - http_client_duration_seconds_bucket
   - http_server_request_total
5. Selecionar uma metrica
6. Opcoes de visualizacao:
   - Time series (linha)
   - Points (pontos)
   - Bars (barras)
```

## Exemplo de trace real da aula

### Trace do endpoint /health

```
Trace ID: <auto-gerado>
Servico: wrapping-rocket-seed
Duracao total: 3.4ms

Spans:
├── [Express] HTTP GET /health ──── 3.4ms
│   ├── [Express] middleware:init ── 0.1ms
│   ├── [Express] middleware:json ── 0.5ms
│   ├── [Express] request handler ── 2.6ms
│   └── [Express] response ──────── 0.2ms
```

### Trace do endpoint /help

```
Trace ID: <auto-gerado>
Servico: wrapping-rocket-seed
Duracao total: 2.6ms

Spans:
├── [Express] HTTP GET /help ────── 2.6ms
│   ├── [Express] middleware:init ── 0.1ms
│   ├── [Express] middleware:json ── 0.3ms
│   ├── [Express] request handler ── 2.0ms
│   └── [Express] response ──────── 0.2ms
```

## Trace distribuido entre servicos (conceitual)

```
Quando servico A chama servico B, o mesmo Trace ID propaga:

Trace ID: abc123def456

Servico A (API Gateway):
├── [Express] HTTP GET /orders ────── 150ms
│   ├── [Express] middleware ──────── 2ms
│   ├── [HTTP Client] GET /users ──── 45ms  ← chamada ao servico B
│   ├── [HTTP Client] GET /products ── 80ms  ← chamada ao servico C
│   └── [Express] response ────────── 3ms

Servico B (Users API) — mesmo Trace ID abc123def456:
├── [Express] HTTP GET /users ─────── 45ms
│   ├── [Database] SELECT * FROM users ── 30ms
│   └── [Express] response ────────────── 5ms

Servico C (Products API) — mesmo Trace ID abc123def456:
├── [Express] HTTP GET /products ───── 80ms
│   ├── [Database] SELECT * FROM products ── 60ms
│   └── [Express] response ──────────────── 5ms
```

## Queries uteis no Mimir (PromQL)

```promql
# Taxa de requisicoes por segundo
rate(http_server_request_total[5m])

# Latencia media (p50)
histogram_quantile(0.5, rate(http_server_duration_seconds_bucket[5m]))

# Latencia p99
histogram_quantile(0.99, rate(http_server_duration_seconds_bucket[5m]))

# Total de requisicoes por endpoint
sum by (http_route) (http_server_request_total)
```