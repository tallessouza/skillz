---
name: rs-devops-e-o-open-telemetry
description: "Applies OpenTelemetry architecture patterns when designing observability for microservices. Use when user asks to 'add telemetry', 'instrument application', 'setup monitoring', 'configure observability', 'migrate monitoring tool', or 'add metrics and logs'. Enforces provider-agnostic telemetry via OTEL collector layer, preventing vendor lock-in. Make sure to use this skill whenever designing observability architecture or choosing between monitoring providers. Not for Grafana dashboard configuration, Prometheus query writing, or application-level logging syntax."
---

# OpenTelemetry — Telemetria Agnóstica de Provedor

> Aplicações nunca conhecem o provedor de telemetria — conhecem apenas o OpenTelemetry.

## Conceito central

OpenTelemetry (OTEL) é um padrão aberto mantido pela CNCF que padroniza coleta e exportação de dados de telemetria. O protocolo OTLP garante que a aplicação envie métricas, logs e traces para o OpenTelemetry Collector, que então exporta para qualquer provedor (New Relic, Datadog, Grafana Stack, Splunk, Elastic).

## Rules

1. **Nunca conecte a aplicação diretamente ao provedor** — sempre use o OpenTelemetry Collector como camada intermediária, porque migrar 1000 microserviços que falam direto com New Relic é inviável
2. **Mudança de provedor = mudança no Collector** — a aplicação não muda nada, apenas o exportador do Collector aponta para o novo destino, porque isso reduz o blast radius de migrações
3. **Use auto-instrumentação quando disponível** — OTEL oferece auto-instrumentação em Node, Java, C#, Go e outras, porque captura traces e métricas sem código manual
4. **Considere abstrair com lib interna** — crie uma lib organizacional que encapsula o OpenTelemetry, porque assim a aplicação nem precisa conhecer OTEL diretamente

## Arquitetura

```
[App 1] ──┐
[App 2] ──┤──→ [OpenTelemetry Collector] ──→ [Provedor A ou B]
[App N] ──┘         (ponto único)
```

### Componentes do Collector

| Componente | Função |
|------------|--------|
| **Receiver** | Recebe dados das aplicações (protocolo OTLP) |
| **Processor** | Transforma, filtra, enriquece dados |
| **Exporter** | Envia para o provedor final (Prometheus, Loki, Datadog, etc.) |

## Decision framework

| Situação | Decisão |
|----------|---------|
| Novo projeto greenfield | Usar OTEL desde o início — custo zero de migração futura |
| Projeto existente com SDK do provedor | Migrar para OTEL incrementalmente — microserviço por microserviço |
| Troca de provedor (ex: New Relic → Grafana) | Mudar apenas o exporter no Collector — aplicações intactas |
| Muitos microserviços (>50) | OTEL é obrigatório — sem ele, migração é proibitiva |
| Aplicação simples, monolito único | OTEL ainda recomendado — custo baixo, benefício futuro |

## Heuristics

| Situação | Faça |
|----------|------|
| Escolhendo entre SDKs nativos vs OTEL | Sempre OTEL — vendor lock-in é dívida técnica silenciosa |
| Auto-instrumentação não cobre um caso | Adicione instrumentação manual pontual via OTEL SDK |
| Equipe quer lib interna | Crie wrapper sobre OTEL: app → lib interna → OTEL → provedor |
| Precisa de métricas + logs + traces | OTEL cobre os 3 pilares — use um único Collector |

## Anti-patterns

| Nunca faça | Faça isto |
|------------|-----------|
| `newrelic.recordMetric()` direto no código | `meter.createCounter()` via OTEL SDK |
| SDK diferente por microserviço | OTEL SDK padronizado em todos os serviços |
| Configurar provedor dentro da aplicação | Configurar provedor no Collector (exporter) |
| Ignorar OTEL por ser "complexo demais" | Auto-instrumentação resolve 80% sem código |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-e-o-open-telemetry/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-e-o-open-telemetry/references/code-examples.md)
