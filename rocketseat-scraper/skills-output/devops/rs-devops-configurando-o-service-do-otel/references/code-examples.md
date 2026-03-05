# Code Examples: Configurando o Service do OTEL

## Exemplo completo do bloco service

```yaml
service:
  extensions: [health_check, pprof, zpages]
  pipelines:
    logs:
      receivers: [otlp]
      processors: [resource, batch]
      exporters: [otlphttp/logs]
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp/tempo]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheusremotewrite]
```

## Contexto: secoes que o service referencia

### Receivers referenciados

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
```

### Processors referenciados

```yaml
processors:
  batch: {}
  resource:
    attributes:
      - key: service.name
        value: "minha-aplicacao"
        action: upsert
```

### Exporters referenciados

```yaml
exporters:
  otlphttp/logs:
    endpoint: http://loki:3100/otlp
  otlp/tempo:
    endpoint: tempo:4317
    tls:
      insecure: true
  prometheusremotewrite:
    endpoint: http://prometheus:9090/api/v1/write
```

### Extensions referenciadas

```yaml
extensions:
  health_check:
    endpoint: 0.0.0.0:13133
  pprof:
    endpoint: 0.0.0.0:1777
  zpages:
    endpoint: 0.0.0.0:55679
```

## Variacao: adicionando receiver Jaeger

```yaml
service:
  pipelines:
    traces:
      receivers: [otlp, jaeger]
      processors: [batch]
      exporters: [otlp/tempo]
```

Requer definir o receiver jaeger:
```yaml
receivers:
  jaeger:
    protocols:
      grpc:
        endpoint: 0.0.0.0:14250
      thrift_http:
        endpoint: 0.0.0.0:14268
```

## Variacao: adicionando exporter debug

Util para desenvolvimento e troubleshooting:

```yaml
exporters:
  debug:
    verbosity: detailed

service:
  pipelines:
    logs:
      receivers: [otlp]
      processors: [resource, batch]
      exporters: [otlphttp/logs, debug]
```

## Variacao: metrics com Prometheus receiver

O instrutor mencionou que o Prometheus receiver e uma opcao adicional, embora no curso so use OTLP:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
  prometheus:
    config:
      scrape_configs:
        - job_name: 'minha-app'
          scrape_interval: 15s
          static_configs:
            - targets: ['app:8080']

service:
  pipelines:
    metrics:
      receivers: [otlp, prometheus]
      processors: [batch]
      exporters: [prometheusremotewrite]
```

## Comandos Docker usados para teste

```bash
# Rebuild e sobe todos os servicos
docker-compose up --build -d

# Verifica containers rodando
docker ps

# Verifica logs do OTEL Collector
docker logs <otel-collector-container>

# Procurar por "everything is ready" confirma que o Collector startou
# Erros de conexao com exporters NAO impedem o start

# Derrubar tudo para rebuild limpo
docker-compose down
```

## Mapeamento completo: pipeline → destino no Grafana

```
Aplicacao
    │
    ▼ (OTLP gRPC/HTTP)
OTEL Collector
    │
    ├── logs ──────→ Loki ──────→ Grafana (Explore > Logs)
    │
    ├── traces ────→ Tempo ─────→ Grafana (Explore > Traces)
    │
    └── metrics ───→ Prometheus → Grafana (Dashboards)
                     (Mimir backend opcional)
```