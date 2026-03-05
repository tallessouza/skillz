# Code Examples: Ferramentas de Observabilidade

## Stack LGTM completa com Docker Compose

```yaml
# docker-compose.yml
version: "3.8"

services:
  # Dashboard e visualizacao
  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
    depends_on:
      - loki
      - prometheus
      - tempo

  # Agregacao de logs
  loki:
    image: grafana/loki:latest
    container_name: loki
    ports:
      - "3100:3100"
    volumes:
      - ./loki-config.yaml:/etc/loki/local-config.yaml
    command: -config.file=/etc/loki/local-config.yaml

  # Rastreamento distribuido (traces)
  tempo:
    image: grafana/tempo:latest
    container_name: tempo
    ports:
      - "3200:3200"   # tempo API
      - "4317:4317"   # OTLP gRPC
      - "4318:4318"   # OTLP HTTP
    volumes:
      - ./tempo-config.yaml:/etc/tempo/config.yaml
    command: -config.file=/etc/tempo/config.yaml

  # Coleta de metricas
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  # Armazenamento de longo prazo para metricas
  mimir:
    image: grafana/mimir:latest
    container_name: mimir
    ports:
      - "9009:9009"
    volumes:
      - ./mimir-config.yaml:/etc/mimir/config.yaml
    command: -config.file=/etc/mimir/config.yaml

volumes:
  grafana-data:
```

## Configuracao basica do Prometheus

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  # Adicione suas aplicacoes aqui
  - job_name: "minha-aplicacao"
    static_configs:
      - targets: ["host.docker.internal:8080"]
```

## Configuracao basica do Loki

```yaml
# loki-config.yaml
auth_enabled: false

server:
  http_listen_port: 3100

common:
  path_prefix: /loki
  storage:
    filesystem:
      chunks_directory: /loki/chunks
      rules_directory: /loki/rules
  replication_factor: 1
  ring:
    kvstore:
      store: inmemory

schema_config:
  configs:
    - from: 2020-10-24
      store: tsdb
      object_store: filesystem
      schema: v13
      index:
        prefix: index_
        period: 24h
```

## Configuracao basica do Tempo

```yaml
# tempo-config.yaml
server:
  http_listen_port: 3200

distributor:
  receivers:
    otlp:
      protocols:
        grpc:
          endpoint: "0.0.0.0:4317"
        http:
          endpoint: "0.0.0.0:4318"

storage:
  trace:
    backend: local
    local:
      path: /var/tempo/traces
```

## Provisioning automatico de data sources no Grafana

```yaml
# grafana/provisioning/datasources/datasources.yaml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true

  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100

  - name: Tempo
    type: tempo
    access: proxy
    url: http://tempo:3200
```

## Comparativo de ferramentas — quando usar cada uma

```
# Decisao rapida:

Budget disponivel + equipe pequena?
  → New Relic (free tier) ou Datadog
  → Preco cresce com volume de logs

100% na AWS e sem planos de sair?
  → CloudWatch (mas aceite o lock-in)

Quer controle total + sem custo de licenca?
  → Grafana LGTM Stack (Loki + Grafana + Tempo + Mimir + Prometheus)
  → Voce gerencia a infra

Ja usa Elasticsearch?
  → ELK Stack (Elasticsearch + Logstash + Kibana)

Quer Grafana sem gerenciar?
  → Grafana Cloud (pago apos trial)
```