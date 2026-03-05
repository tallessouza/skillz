---
name: rs-devops-configurando-o-collector-do-otel
description: "Generates OpenTelemetry Collector configuration with Docker Compose setup and YAML config. Use when user asks to 'setup otel', 'configure opentelemetry', 'add observability', 'setup collector', or 'configure telemetry pipeline'. Covers receivers (OTLP/Prometheus), processors (batch/resource), exporters (Loki/Tempo/Mimir), extensions, and Docker Compose integration. Make sure to use this skill whenever setting up OpenTelemetry Collector in a Docker environment. Not for application-level instrumentation, SDK setup, or Grafana dashboard configuration."
---

# Configurando o Collector do OpenTelemetry

> O OpenTelemetry Collector eh o ponto central que recebe telemetria da aplicacao e exporta para multiplos backends, mantendo a aplicacao agnostica aos servicos de observabilidade.

## Rules

1. **Aplicacao nunca se conecta diretamente aos backends** — a aplicacao conhece apenas o OTel Collector, porque trocar de Grafana para Datadog deve exigir zero mudancas na aplicacao
2. **Use a imagem oficial contrib** — `otel/opentelemetry-collector-contrib` porque inclui receivers/exporters adicionais que a versao core nao tem
3. **Declare depends_on no Docker Compose** — o collector depende de todos os backends (Loki, Tempo, Mimir, Grafana), porque ele precisa dos endpoints disponiveis ao iniciar
4. **Configure receivers para GRPC e HTTP** — porta 4317 (gRPC) e 4318 (HTTP), porque aplicacoes podem usar qualquer protocolo
5. **Defina resource attributes no processor** — service.name e service.environment facilitam indexacao e filtragem de logs/metricas
6. **Exporters apontam para nomes de servico Docker** — use nomes como `loki:3100`, `tempo:3200`, porque containers na mesma rede se enxergam pelo nome

## How to write

### Docker Compose - Container OTel

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

### Config YAML - Estrutura base

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
  # configurado na proxima etapa
```

## Example

**Before (aplicacao conectando direto ao Loki):**
```yaml
# app envia logs direto pro Loki - ERRADO
services:
  api:
    environment:
      - LOG_ENDPOINT=http://loki:3100
```

**After (aplicacao envia pro OTel Collector):**
```yaml
services:
  api:
    environment:
      - OTEL_EXPORTER_OTLP_ENDPOINT=http://otel:4317
  otel:
    image: otel/opentelemetry-collector-contrib:latest
    # collector decide pra onde enviar
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Trocar backend (ex: Grafana → Datadog) | Altere apenas os exporters no config do OTel |
| Adicionar novo tipo de telemetria | Adicione novo receiver + exporter no config |
| Aplicacao usa gRPC | Use porta 4317 |
| Aplicacao usa HTTP | Use porta 4318 |
| Precisa de metricas do proprio collector | Configure Prometheus receiver com target localhost:8888 |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| App conecta direto ao Loki/Tempo/Mimir | App conecta ao OTel Collector |
| Hardcode de endpoints na aplicacao | Use variavel OTEL_EXPORTER_OTLP_ENDPOINT |
| Esquecer depends_on dos backends | Declare todos os backends como dependencia |
| Usar imagem core sem contrib | Use `otel/opentelemetry-collector-contrib` |
| Config sem TLS insecure em dev | Declare `tls: insecure: true` para comunicacao interna |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-configurando-o-collector-do-otel/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-configurando-o-collector-do-otel/references/code-examples.md)
