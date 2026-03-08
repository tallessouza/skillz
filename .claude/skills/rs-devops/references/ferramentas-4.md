---
name: rs-devops-ferramentas-4
description: "Configures observability tool selection and Grafana LGTM stack setup when configuring monitoring infrastructure. Use when user asks to 'setup monitoring', 'configure observability', 'choose logging tool', 'setup Grafana', 'configure Prometheus', or 'add metrics to application'. Applies Grafana LGTM stack (Loki, Grafana, Tempo, Mimir) with Prometheus for open-source observability. Make sure to use this skill whenever setting up observability or comparing monitoring tools. Not for application code instrumentation or OpenTelemetry configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: observabilidade
  tags: [grafana, loki, tempo, mimir, prometheus, lgtm-stack, observability, monitoring]
---

# Ferramentas de Observabilidade

> Escolha ferramentas de observabilidade desacopladas da aplicacao — a aplicacao emite dados, a ferramenta agrega e visualiza.

## Key concepts

A aplicacao nunca armazena seus proprios logs, metricas ou traces. Ela emite para uma ferramenta externa que cuida da agregacao, visualizacao e alertas.

## Decision framework

| Cenario | Ferramenta | Tradeoff |
|---------|-----------|----------|
| Precisa de simplicidade, tem budget | New Relic, Datadog | Pago, custo cresce com volume de dados |
| Ja esta em cloud provider unico | CloudWatch (AWS), Cloud Monitoring (GCP) | Lock-in com provider |
| Quer controle total, sem custo de licenca | Grafana LGTM Stack | Complexidade de infra por sua conta |
| Quer Grafana sem gerenciar infra | Grafana Cloud | Pago apos trial |
| Ja usa Elasticsearch | ELK Stack (open source) | Complexidade similar ao Grafana |

## Grafana LGTM Stack — componentes

| Componente | Pilar | Funcao |
|-----------|-------|--------|
| **Loki** | Logs | Agregacao e consulta de logs |
| **Grafana** | Dashboard | Visualizacao, alertas, on-call |
| **Tempo** | Traces | Rastreamento distribuido |
| **Mimir** | Storage | Armazenamento de longa duracao |
| **Prometheus** | Metricas | Coleta e exportacao de metricas |

Grafana e apenas o dashboard — ele se conecta a data sources (Prometheus, Loki, Tempo) para extrair e visualizar dados.

## Setup local com Docker

```yaml
# docker-compose.yml - stack LGTM basica
services:
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"

  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"

  tempo:
    image: grafana/tempo:latest
    ports:
      - "3200:3200"

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  mimir:
    image: grafana/mimir:latest
    ports:
      - "9009:9009"
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Estudando/aprendendo observabilidade | Use Grafana LGTM local com Docker — aprofunda conhecimento configurativo |
| Projeto pequeno, sem equipe de infra | Considere New Relic free tier ou Grafana Cloud trial |
| Empresa com budget e escala | Avalie Datadog/New Relic pelo custo vs complexidade operacional |
| Ja usa AWS para tudo | CloudWatch e opcao, mas gera lock-in |
| Quer trocar de ferramenta no futuro | Use OpenTelemetry como camada de abstracao (proxima aula) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|-----------|-------------------|
| Guardar logs dentro da propria aplicacao | Emitir logs para ferramenta externa (Loki, ELK) |
| Acoplar aplicacao diretamente ao provider de observabilidade | Usar camada de abstracao (OpenTelemetry) |
| Escolher CloudWatch sem avaliar lock-in | Avaliar custo de migracao futura antes de decidir |
| Ignorar custo exponencial de ferramentas pagas | Calcular projecao de custos baseado no crescimento de logs |
| Usar Grafana achando que ele armazena dados | Configurar data sources (Prometheus, Loki, Tempo) — Grafana so visualiza |

## Troubleshooting

### Grafana mostra "No data" nos dashboards
**Symptom:** Dashboards do Grafana nao exibem dados apesar dos servicos estarem rodando
**Cause:** Data sources nao estao configurados no Grafana — Grafana nao armazena dados, precisa de conexao com Prometheus, Loki ou Tempo
**Fix:** Acesse Configuration > Data Sources no Grafana e adicione os endpoints corretos (ex: `http://prometheus:9090`, `http://loki:3100`)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
