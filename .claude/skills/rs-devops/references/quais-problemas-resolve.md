---
name: rs-devops-quais-problemas-resolve
description: "Applies observability problem-solving reasoning when designing monitoring, alerting, or troubleshooting strategies. Use when user asks to 'add observability', 'monitor services', 'reduce downtime', 'troubleshoot distributed systems', 'add alerting', or 'improve reliability'. Covers MTTD, MTTR metrics, distributed tracing rationale, resilience patterns, and cost optimization through observability. Make sure to use this skill whenever designing or reviewing observability architecture. Not for implementing specific tools like Prometheus, Grafana, or Sentry — only for reasoning about what problems observability solves and why."
---

# Quais Problemas a Observabilidade Resolve

> Observabilidade existe para descobrir e solucionar problemas de maneira rapida e eficiente, transformando dados em decisoes.

## Key concept

Observabilidade nao e apenas "ter dashboards" — e a capacidade de entender o comportamento interno do sistema a partir dos dados que ele emite. O valor real esta em reduzir o tempo entre "algo quebrou" e "esta resolvido", medido por duas metricas fundamentais: MTTD e MTTR.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Sistema sem alertas ou com alertas ignorados | Medir MTTD — tempo medio ate alguem detectar o problema |
| Time demora para resolver incidentes | Medir MTTR — tempo medio de reparo apos deteccao |
| Microservicos sem rastreio | Implementar tracing distribuido para mapa de dependencias |
| Custos de infra crescendo sem explicacao | Usar metricas de CPU/memoria para identificar gargalos |
| Bugs consomem tempo do time vs features | Observabilidade reduz tempo em firefighting, libera capacity |
| Usuarios reportam problemas antes do time | MTTD esta alto — o time deveria detectar antes do usuario |

## How to think about it

### MTTD — Mean Time to Detect

Tempo medio entre o sistema emitir um alerta e alguem dar acknowledge. Se o time tem boa observabilidade mas MTTD alto, o problema nao e tecnico — e processual. Metrificar MTTD permite definir metas (ex: detectar em 5 min) e atuar na causa raiz do atraso.

### MTTR — Mean Time to Repair

Comeca a contar apos a deteccao. Quanto menor o MTTR, menor o impacto no usuario. Boa observabilidade com tracing distribuido reduz MTTR drasticamente porque elimina o "onde esta o problema?" em arquiteturas de microservicos.

### Confianca do usuario

Um sistema onde o time resolve problemas antes do usuario perceber gera confianca. O objetivo e: o usuario nunca deveria ser quem reporta o incidente.

### Troubleshooting em sistemas distribuidos

Sem observabilidade, descobrir qual microservico causa latencia e como procurar agulha no palheiro. Com tracing (rastreio de requisicoes), voce ve o caminho completo e identifica o responsavel.

### Comportamento do usuario como insight

Logs e metricas revelam padroes de uso que nao sao erros, mas oportunidades de produto. Um cliente usando o sistema de forma inesperada pode indicar uma feature faltando.

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Observabilidade = ter Grafana/dashboards | Dashboards sao visualizacao; observabilidade e a capacidade de investigar qualquer estado interno |
| So preciso monitorar quando algo quebra | Monitorar comportamento normal e essencial para detectar anomalias |
| Microservicos nao precisam de tracing | Sem tracing, troubleshooting em sistemas distribuidos e praticamente impossivel |
| Observabilidade e custo extra | Reduz custos: menos tempo em bugs, melhor capacity planning, menos downtime |
| O usuario reportar bugs e aceitavel | Se o usuario detecta antes do time, o MTTD esta falhando |

## When to apply

- Ao projetar arquitetura de microservicos — planejar tracing desde o inicio
- Ao definir SLAs/SLOs — MTTD e MTTR sao as metricas base
- Ao fazer capacity planning — metricas de observabilidade informam tamanho do time
- Ao revisar custos de infraestrutura — metricas de CPU/memoria revelam gargalos
- Ao decidir entre resilience patterns — Circuit Breaker, Outbox Pattern dependem de dados observaveis

## Limitations

- Observabilidade nao substitui bom design de software — sistemas mal projetados geram ruido excessivo
- Metricas sem contexto de negocio sao numeros vazios — MTTD de 5 min so importa se o impacto justifica
- Over-instrumentation gera custo de storage e noise — instrumentar com intencao, nao por default

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-quais-problemas-resolve/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-quais-problemas-resolve/references/code-examples.md)
