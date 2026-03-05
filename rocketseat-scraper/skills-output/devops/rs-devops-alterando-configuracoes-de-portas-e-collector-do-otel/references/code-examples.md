# Code Examples: Configuracao do OTEL Collector com Prometheus

## 1. Mimir YAML — Configuracao de portas

### Antes (porta padrao 9090)
```yaml
server:
  http_listen_port: 9090
```

### Depois (separando gRPC e HTTP)
```yaml
server:
  grpc_listen_port: 9008
  http_listen_port: 9009
```

**Nota:** A porta gRPC (9008) e usada para comunicacao interna entre servicos. A porta HTTP (9009) e usada pelo datasource do Grafana.

## 2. Datasource do Mimir no Grafana

```yaml
# provisioning/datasources/datasources.yaml
datasources:
  - name: Mimir
    type: prometheus
    url: http://mimir:9009/prometheus
    access: proxy
```

**Atencao:** A URL deve usar a porta 9009 (HTTP), nao 9008 (gRPC).

## 3. Docker Compose — Dependencias completas

```yaml
services:
  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
      - otel-collector
      - mimir
      - loki
      - tempo

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  otel-collector:
    image: otel/opentelemetry-collector
    ports:
      - "4317:4317"   # OTLP gRPC
      - "4318:4318"   # OTLP HTTP
      - "8888:8888"   # Collector metrics
      - "8889:8889"   # Prometheus exporter

  mimir:
    image: grafana/mimir
    ports:
      - "9009:9009"
      - "9008:9008"
    volumes:
      - ./mimir.yaml:/etc/mimir/mimir.yaml
```

## 4. OTEL Collector config completo (otel-config.yaml)

```yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:

processors:
  batch:
    send_batch_max_size: 0
    send_batch_size: 10
    timeout: 10s

exporters:
  # Envio direto para Mimir via Remote Write
  prometheusremotewrite:
    endpoint: "http://mimir:9009/api/v1/push"

  # Exposicao de metricas para scrape do Prometheus
  prometheus:
    endpoint: "0.0.0.0:8889"
    resource_to_telemetry_conversion:
      enabled: true

service:
  pipelines:
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheusremotewrite, prometheus]
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
    logs:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
```

## 5. Prometheus scrape config (prometheus.yml)

```yaml
global:
  scrape_interval: 10s

scrape_configs:
  - job_name: "otel-collector"
    scrape_interval: 10s
    static_configs:
      - targets: ["otel-collector:8888"]
```

**Porta 8888** e onde o Collector expoe suas proprias metricas internas (self-monitoring).
**Porta 8889** e onde o exporter Prometheus expoe as metricas recebidas via OTLP.

## 6. Comandos de validacao

```bash
# Derrubar stack
docker compose down

# Subir com rebuild
docker compose up --build -d

# Verificar se todos os containers estao up
docker ps -a

# Verificar logs do Collector
docker logs <otel-collector-container-id>
# Procurar: "Everything is ready"

# Verificar logs de um servico especifico
docker logs <container-id> --tail 50
```

## 7. Mapa de portas da stack completa

| Servico | Porta | Protocolo | Funcao |
|---------|-------|-----------|--------|
| Grafana | 3000 | HTTP | UI de dashboards |
| Prometheus | 9090 | HTTP | UI propria + scrape |
| Mimir | 9009 | HTTP | API de metricas |
| Mimir | 9008 | gRPC | Comunicacao interna |
| OTEL Collector | 4317 | gRPC | Recebe OTLP |
| OTEL Collector | 4318 | HTTP | Recebe OTLP |
| OTEL Collector | 8888 | HTTP | Metricas internas |
| OTEL Collector | 8889 | HTTP | Prometheus exporter |