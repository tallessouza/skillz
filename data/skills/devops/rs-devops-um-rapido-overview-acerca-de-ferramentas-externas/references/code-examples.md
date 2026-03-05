# Code Examples: Ferramentas Externas de Observabilidade

## Nota sobre exemplos de codigo

Esta aula e conceitual e de encerramento de modulo — nao contem exemplos de codigo implementados. Os exemplos abaixo ilustram os conceitos discutidos pelo instrutor.

## OpenTelemetry Collector exportando para diferentes backends

### Exportando para Grafana/LGTM (open source)

```yaml
# otel-collector-config.yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

exporters:
  otlp/tempo:
    endpoint: tempo:4317
    tls:
      insecure: true
  prometheusremotewrite:
    endpoint: http://mimir:9009/api/v1/push
  loki:
    endpoint: http://loki:3100/loki/api/v1/push

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [otlp/tempo]
    metrics:
      receivers: [otlp]
      exporters: [prometheusremotewrite]
    logs:
      receivers: [otlp]
      exporters: [loki]
```

### Exportando para Datadog (pago)

```yaml
# otel-collector-config-datadog.yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317

exporters:
  datadog:
    api:
      key: ${DD_API_KEY}
      site: datadoghq.com

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [datadog]
    metrics:
      receivers: [otlp]
      exporters: [datadog]
    logs:
      receivers: [otlp]
      exporters: [datadog]
```

### Exportando para New Relic (pago)

```yaml
# otel-collector-config-newrelic.yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317

exporters:
  otlphttp/newrelic:
    endpoint: https://otlp.nr-data.net
    headers:
      api-key: ${NEW_RELIC_LICENSE_KEY}

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [otlphttp/newrelic]
    metrics:
      receivers: [otlp]
      exporters: [otlphttp/newrelic]
    logs:
      receivers: [otlp]
      exporters: [otlphttp/newrelic]
```

## Ponto chave dos exemplos

Note que o bloco `receivers` e identico em todos os casos — a instrumentacao da aplicacao nao muda. Apenas o `exporters` e o destino no `service.pipelines` mudam. Esta e a essencia da recomendacao do instrutor: **OpenTelemetry como camada de abstracao permite trocar de backend sem tocar no codigo da aplicacao.**

## Comparativo de custo (conceitual)

```
# Open Source (LGTM Stack)
Custo = Infra (servidores + storage) + Time (manutencao + troubleshooting)

# SaaS (Datadog/New Relic)  
Custo = Licenca (por host/evento/GB) + Onboarding

# Ambos
Custo comum = Instrumentacao (OpenTelemetry) + Conhecimento da equipe
```