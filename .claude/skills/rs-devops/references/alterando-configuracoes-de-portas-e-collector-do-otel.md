---
name: rs-devops-otel-collector-config
description: "Applies OpenTelemetry Collector configuration patterns for Prometheus integration in Docker Compose observability stacks. Use when user asks to 'configure OTEL', 'add Prometheus exporter', 'setup observability', 'configure collector', or 'connect OpenTelemetry to Prometheus'. Covers port mapping, batch processor tuning, Prometheus exporter setup, and service pipeline wiring. Make sure to use this skill whenever configuring OTEL Collector YAML or adding new exporters to an observability stack. Not for application-level instrumentation, custom metrics creation, or Grafana dashboard building."
---

# Configuracao do OTEL Collector com Prometheus

> Ao configurar o OpenTelemetry Collector, defina exporter, registre no service pipeline, e ajuste batch processor — nessa ordem.

## Rules

1. **Sempre sincronize portas entre servicos** — se Mimir muda para 9009, atualize o datasource do Grafana E o YAML do Mimir (grpc_listen_port e http_listen_port), porque portas inconsistentes causam falhas silenciosas no plugin
2. **Declare dependencias no Docker Compose** — Grafana depende de Prometheus e do Collector, porque ordem de startup sem depends_on causa conexoes recusadas intermitentes
3. **Configure batch processor com limites explicitos** — defina send_batch_max_size, batch_size e timeout, porque sem limites o Collector acumula dados e consome memoria indefinidamente
4. **Adicionar exporter exige duas alteracoes** — declare o exporter E registre no service.pipelines, porque exporter sem service e ignorado silenciosamente
5. **Ative resource_to_telemetry_conversion** — enable: true no exporter Prometheus melhora performance convertendo resource attributes em labels de metrica
6. **Valide com docker logs apos subir** — procure "Everything is ready" no log do Collector, porque flags ou configs invalidas so aparecem no log de startup

## How to write

### Mimir — ajuste de portas

```yaml
# mimir.yaml — quando mudar a porta HTTP, declare ambas
server:
  grpc_listen_port: 9008
  http_listen_port: 9009
```

### Docker Compose — dependencias

```yaml
grafana:
  depends_on:
    - prometheus
    - otel-collector
```

### OTEL Collector — Prometheus exporter completo

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
  prometheusremotewrite:
    endpoint: "http://mimir:9009/api/v1/push"
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
```

### Prometheus — scrape do Collector

```yaml
# prometheus.yml
scrape_configs:
  - job_name: "otel-collector"
    scrape_interval: 10s
    static_configs:
      - targets: ["otel-collector:8888"]
```

## Example

**Before (exporter adicionado mas nao registrado):**
```yaml
exporters:
  prometheus:
    endpoint: "0.0.0.0:8889"

service:
  pipelines:
    metrics:
      exporters: [prometheusremotewrite]  # prometheus ausente!
```

**After (exporter registrado no service pipeline):**
```yaml
exporters:
  prometheus:
    endpoint: "0.0.0.0:8889"
    resource_to_telemetry_conversion:
      enabled: true

service:
  pipelines:
    metrics:
      exporters: [prometheusremotewrite, prometheus]
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Mudou porta de um servico | Atualize TODOS os locais que referenciam: datasource, YAML do servico, Docker Compose |
| Adicionou novo exporter | Declare em exporters E registre em service.pipelines |
| Collector sobe mas metrica nao aparece | Verifique docker logs do Collector procurando erros de config |
| Prometheus sem metricas do app | Verifique scrape_configs e se o target esta acessivel na rede Docker |
| Batch acumulando demais | Reduza batch_size e timeout para valores menores |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Mudar porta no Compose sem mudar no YAML do servico | Sincronize porta em todos os arquivos que referenciam o servico |
| Exporter sem entry no service.pipelines | Sempre declare exporter E registre no pipeline correspondente |
| Subir stack sem verificar logs | Rode `docker logs <collector-id>` e procure "Everything is ready" |
| Batch sem timeout | Defina timeout explicito (ex: 10s) para evitar acumulo indefinido |
| Ignorar depends_on no Compose | Declare dependencias para garantir ordem de startup |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-alterando-configuracoes-de-portas-e-collector-do-otel/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-alterando-configuracoes-de-portas-e-collector-do-otel/references/code-examples.md)
