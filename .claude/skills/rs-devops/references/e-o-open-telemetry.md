---
name: rs-devops-e-o-open-telemetry
description: "Applies OpenTelemetry architecture when instrumenting applications for vendor-agnostic telemetry. Use when user asks to 'setup OpenTelemetry', 'configure OTEL collector', 'instrument application', 'add telemetry', or 'switch observability provider'. Covers OTLP protocol, Collector architecture (receiver/processor/exporter), auto-instrumentation, and vendor decoupling. Make sure to use this skill whenever making decisions about telemetry architecture or migrating between observability providers. Not for specific provider SDK configuration, Grafana dashboard creation, or Prometheus scraping setup."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: observabilidade
  tags: [opentelemetry, otel, otlp, collector, telemetry, observability, cncf, auto-instrumentation]
---

# OpenTelemetry — Telemetria Agnostica de Provedor

> Aplicacoes nunca conhecem o provedor de telemetria — conhecem apenas o OpenTelemetry.

## Conceito central

OpenTelemetry (OTEL) e um padrao aberto mantido pela CNCF que padroniza coleta e exportacao de dados de telemetria. O protocolo OTLP garante que a aplicacao envie metricas, logs e traces para o OpenTelemetry Collector, que entao exporta para qualquer provedor.

## Rules

1. **Nunca conecte a aplicacao diretamente ao provedor** — sempre use o Collector como camada intermediaria
2. **Mudanca de provedor = mudanca no Collector** — a aplicacao nao muda nada
3. **Use auto-instrumentacao quando disponivel** — captura traces e metricas sem codigo manual
4. **Considere abstrair com lib interna** — aplicacao nem precisa conhecer OTEL diretamente

## Arquitetura

```
[App 1] --+
[App 2] --+--> [OpenTelemetry Collector] --> [Provedor A ou B]
[App N] --+         (ponto unico)
```

### Componentes do Collector

| Componente | Funcao |
|------------|--------|
| Receiver | Recebe dados das aplicacoes (OTLP) |
| Processor | Transforma, filtra, enriquece |
| Exporter | Envia para o provedor final |

## Decision framework

| Situacao | Decisao |
|----------|---------|
| Novo projeto greenfield | OTEL desde o inicio |
| Projeto existente com SDK do provedor | Migrar incrementalmente |
| Troca de provedor | Mudar apenas o exporter no Collector |
| Muitos microservicos (>50) | OTEL e obrigatorio |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| `newrelic.recordMetric()` direto no codigo | `meter.createCounter()` via OTEL SDK |
| SDK diferente por microservico | OTEL SDK padronizado |
| Configurar provedor dentro da aplicacao | Configurar no Collector |
| Ignorar OTEL por ser "complexo" | Auto-instrumentacao resolve 80% sem codigo |

## Troubleshooting

### Traces nao chegam ao provedor (Tempo, Jaeger)
**Symptom:** Aplicacao roda com OTEL SDK mas nenhum trace aparece no backend de observabilidade
**Cause:** O Collector nao esta configurado com o exporter correto ou o endpoint OTLP da aplicacao aponta para endereco errado
**Fix:** Verifique `OTEL_EXPORTER_OTLP_ENDPOINT` na aplicacao, confirme que o Collector esta rodando e que o exporter no `otel-collector-config.yaml` aponta para o provedor correto

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
