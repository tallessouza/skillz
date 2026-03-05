# Code Examples: Configurando o Collector do OpenTelemetry

## Docker Compose completo do OTel Collector

```yaml
otel:
  image: otel/opentelemetry-collector-contrib:latest
  container_name: otel
  restart: always
  ports:
    - "4317:4317"
  command:
    - --config=/etc/otelcol/config.yml
  volumes:
    - ./config/otel/otel.yml:/etc/otelcol/config.yml
  depends_on:
    - loki
    - tempo
    - mimir
    - grafana
```

### Detalhes:
- **command**: sobrescreve o comando padrao para apontar para o config customizado
- **volumes**: monta o arquivo local `./config/otel/otel.yml` como `/etc/otelcol/config.yml` dentro do container
- **ports**: apenas 4317 (gRPC) eh exposta. A 4318 (HTTP) pode ser adicionada se necessario

## Arquivo de configuracao completo: otel.yml

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
  prometheus:
    config:
      scrape_configs:
        - job_name: otel-collector
          scrape_interval: 60s
          static_configs:
            - targets: ["localhost:8888"]

processors:
  batch:
  resource:
    attributes:
      - action: insert
        key: loki.resource.labels
        value: service.name, service.environment

exporters:
  otlphttp/loki:
    endpoint: http://loki:3100/otlp/v1/logs
    tls:
      insecure: true
  otlp/tempo:
    endpoint: tempo:3200
    tls:
      insecure: true
  otlphttp/metrics:
    endpoint: http://mimir:9009/otlp/v1/metrics
    tls:
      insecure: true
  prometheusremotewrite:
    endpoint: http://mimir:9090/api/v1/push

extensions:
  health_check:
  pprof:
  zpages:

service:
  # a ser configurado na proxima aula
```

## Estrutura de pastas esperada

```
project/
├── docker-compose.yml
└── config/
    ├── otel/
    │   └── otel.yml          # Configuracao do OTel Collector
    ├── loki/
    │   └── loki.yml
    ├── tempo/
    │   └── tempo.yml
    └── mimir/
        └── mimir.yml
```

## Grafana com dependencia do Mimir

O instrutor tambem ajustou o Grafana para depender do Mimir:

```yaml
grafana:
  image: grafana/grafana:latest
  depends_on:
    - loki
    - tempo
    - mimir
```

## Variacoes de exporters

### Se usar Datadog em vez de Loki:

```yaml
exporters:
  datadog:
    api:
      key: ${DD_API_KEY}
    logs:
      enabled: true
```

### Se adicionar novo backend:

```yaml
exporters:
  otlphttp/novo-backend:
    endpoint: http://novo-backend:porta/path
    tls:
      insecure: true
```

O padrao eh sempre: consultar documentacao do backend → pegar endpoint → adicionar como exporter.

## Commit de referencia

[baf4249f73942c08f513308c329f28c66ccf5b7e](https://github.com/rocketseat-education/devops-observabilidade/commit/baf4249f73942c08f513308c329f28c66ccf5b7e)