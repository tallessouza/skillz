---
name: rs-devops-conhecendo-a-stack-lgtm
description: "Applies LGTM stack architecture knowledge when designing observability infrastructure with Grafana, Loki, Tempo, and Mimir. Use when user asks to 'setup observability', 'configure monitoring', 'add logging and tracing', 'setup Grafana stack', or 'implement LGTM'. Provides component roles, connection topology, and local Docker-based setup guidance. Make sure to use this skill whenever building observability pipelines from scratch. Not for application-level logging code, Grafana Cloud managed setup, or Kubernetes-specific orchestration."
---

# Stack LGTM — Arquitetura de Observabilidade

> Cada componente da stack LGTM tem uma responsabilidade unica: Grafana visualiza, Loki agrega logs, Tempo agrega traces, Mimir armazena metricas — nunca confundir quem coleta com quem exibe.

## Key concept

A stack LGTM e um conjunto de ferramentas open source da Grafana Labs que cobre os tres pilares da observabilidade:

- **Logs** → Loki (agregador)
- **Traces** → Tempo (rastreamento distribuido)
- **Metricas** → Mimir (time series database, trabalha com Prometheus)
- **Visualizacao** → Grafana (conecta com todos os anteriores)

O Grafana NAO coleta dados. Ele e exclusivamente um visualizador que se conecta aos datasources (Loki, Tempo, Mimir e outros).

## Decision framework

| Pilar | Ferramenta | Papel |
|-------|-----------|-------|
| Logs | Loki | Agrega logs enviados pela aplicacao |
| Traces | Tempo | Agrega traces, compativel com OpenTelemetry, Jaeger, Zipkin |
| Metricas | Mimir | Time series DB, usa Prometheus por tras |
| Visualizacao | Grafana | Conecta com Loki, Tempo, Mimir para dashboards |
| Coleta | OpenTelemetry | Coletor que exporta para Loki, Tempo, Mimir |
| Performance | K6 | Testes de carga (projeto Grafana Labs, complementar) |

## How to think about it

### Topologia de conexao

```
[Aplicacao] → [OpenTelemetry Collector]
                    │
                    ├── logs ──→ [Loki] ──────→ [Grafana]
                    ├── traces → [Tempo] ─────→ [Grafana]
                    └── metrics → [Mimir/Prometheus] → [Grafana]
```

O Grafana se conecta com cada datasource individualmente. Cada ferramenta roda como um container isolado.

### Local vs Grafana Cloud

| Aspecto | Local (nosso objetivo) | Grafana Cloud |
|---------|----------------------|---------------|
| Complexidade | Alta — configurar cada componente | Baixa — endpoint pronto |
| Custo | Zero | Free trial 14 dias, depois pago |
| Aprendizado | Profundo — entende a infraestrutura | Superficial — abstrai detalhes |
| Resultado | Mesma experiencia visual | Mesma experiencia visual |

### Imagem all-in-one vs do zero

Existe a imagem `grafana/otel-lgtm` (Hotel LGTM) que traz tudo pre-configurado. Util para testes rapidos, mas abstrai a configuracao. Para aprendizado e controle, montar componente a componente.

## Abordagem de setup local

1. **Rodar tudo em container** — isolamento e base do modulo DevOps
2. **Instalar componente a componente** — Grafana, Loki, Tempo, Mimir separados
3. **Configurar OpenTelemetry** como coletor central
4. **Conectar datasources no Grafana** — Loki para logs, Tempo para traces, Mimir para metricas
5. **Adicionar Prometheus** depois do Mimir estar funcionando

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Grafana coleta logs e metricas | Grafana so visualiza — Loki e Mimir coletam |
| Precisa do Grafana Cloud para usar | Stack inteira e open source, roda local |
| Uma imagem Docker resolve tudo | `otel-lgtm` existe mas abstrai a configuracao — montar do zero da mais controle |
| OpenTelemetry e obrigatorio | Compativel tambem com Jaeger e Zipkin, mas OTel e o padrao recomendado |
| Mimir substitui Prometheus | Mimir trabalha JUNTO com Prometheus, nao o substitui |

## Limitations

- Esta skill cobre a arquitetura e papel de cada componente — configuracao detalhada de cada ferramenta esta em aulas subsequentes
- Nao cobre Kubernetes, Helm charts ou deploy em producao
- Nao cobre Grafana Cloud setup
- K6 (testes de performance) e Pyroscope (profiling) sao mencionados mas nao detalhados

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-conhecendo-a-stack-lgtm/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-conhecendo-a-stack-lgtm/references/code-examples.md)
