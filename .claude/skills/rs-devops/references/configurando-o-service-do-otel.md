---
name: rs-devops-configurando-service-otel
description: "Generates OpenTelemetry Collector service configuration with pipelines for logs, traces, and metrics. Use when user asks to 'configure OTEL', 'setup OpenTelemetry pipelines', 'define OTEL service', 'connect receivers processors exporters', or 'configure observability stack'. Applies correct pipeline structure linking receivers, processors, and exporters per signal type. Make sure to use this skill whenever setting up or modifying an OpenTelemetry Collector config. Not for application-level instrumentation, Grafana dashboard creation, or Prometheus query writing."
---

# Configurando o Service do OpenTelemetry Collector

> O bloco `service` do OTEL Collector define pipelines que conectam receivers, processors e exporters para cada tipo de sinal (logs, traces, metricas).

## Conceito central

O service e a cola que une tudo. Cada pipeline declara: de onde recebo (receivers), como processo (processors), para onde exporto (exporters). Os nomes usados nas pipelines DEVEM referenciar exatamente os nomes definidos nas secoes anteriores do config — nao sao arbitrarios.

## Estrutura do service

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

## Rules

1. **Nomes nas pipelines referenciam definicoes anteriores** — `otlp` em receivers referencia o bloco `receivers.otlp` definido acima, porque nomes inconsistentes causam falha silenciosa no Collector
2. **Cada pipeline so recebe processors relevantes** — o processor `resource` configurado para logs NAO vai na pipeline de traces, porque ele esta associado especificamente ao enriquecimento de logs
3. **Exporters podem ser multiplos por pipeline** — uma pipeline pode exportar para mais de um destino simultaneamente, porque o OTEL Collector suporta fan-out nativo
4. **Extensions ficam no nivel do service, nao dentro de pipelines** — health_check, pprof e zpages sao servicos auxiliares do Collector, nao parte do fluxo de dados
5. **Erros de conexao em exporters nao impedem o Collector de rodar** — se o Tempo nao esta acessivel, o Collector loga erro mas continua funcionando para os outros pipelines

## Mapeamento tipico

| Sinal | Receiver | Processor | Exporter |
|-------|----------|-----------|----------|
| Logs | otlp | resource, batch | otlphttp (Loki) |
| Traces | otlp | batch | otlp (Tempo) |
| Metrics | otlp | batch | prometheusremotewrite (Mimir) |

## Heuristics

| Situacao | Faca |
|----------|------|
| Processor so se aplica a um tipo de sinal | Coloque apenas na pipeline daquele sinal |
| Exporter com erro de conexao | Verifique porta e hostname dentro da rede Docker |
| Precisa de debug | Use exporter `debug` adicional na pipeline |
| Multiplos receivers para mesmo sinal | Liste todos no array de receivers da pipeline |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Colocar processor de resource em todas as pipelines | Coloque apenas na pipeline onde ele e relevante |
| Usar nomes diferentes entre definicao e referencia | Copie o nome exato da secao de definicao |
| Ignorar erro de conexao em producao | Debug a porta/hostname e corrija antes de deploy |
| Expor Prometheus receiver sem necessidade | Use apenas otlp como receiver se e o unico protocolo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-configurando-o-service-do-otel/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-configurando-o-service-do-otel/references/code-examples.md)
