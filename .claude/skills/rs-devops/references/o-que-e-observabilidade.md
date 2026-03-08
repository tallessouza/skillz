---
name: rs-devops-o-que-e-observabilidade
description: "Applies observability principles when designing, reviewing, or instrumenting production systems. Use when user asks to 'add monitoring', 'make observable', 'add metrics', 'instrument application', 'debug production', or 'improve reliability'. Ensures the three pillars (logs, metrics, traces) are considered and systems expose proper outputs. Make sure to use this skill whenever discussing production readiness or system visibility. Not for CI/CD pipeline setup, container configuration, or Kubernetes deployment."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: observability
  tags: [observability, logs, metrics, traces, monitoring, reliability, production]
---

# Observabilidade

> Promova visibilidade do ecossistema de aplicacoes para descobrir problemas antes do cliente.

## Key concepts

Observabilidade e a capacidade de entender o estado interno de um sistema a partir das suas saidas (outputs). Nao se trata apenas de saber SE algo esta errado, mas de entender O QUE, ONDE e POR QUE esta errado — de maneira proativa, antes que o usuario final descubra.

## Tres pilares

| Pilar | O que captura | Exemplo |
|-------|--------------|---------|
| **Logs** | Eventos discretos do sistema | `ERROR: Connection refused to database at 14:32:01` |
| **Metricas** | Valores numericos ao longo do tempo | Taxa de erros, latencia p99, consumo de CPU/memoria |
| **Traces** | Caminho de uma requisicao atraves de servicos | App A → App B → App C → Banco |

Os tres pilares juntos fornecem visao macro (dashboards, alertas) e visao micro (investigacao profunda de um problema especifico).

## Framework de decisao

| Quando voce encontra | Aplique |
|---------------------|---------|
| Sistema em producao sem instrumentacao | Adicione os tres pilares antes de qualquer feature nova |
| Erro reportado pelo cliente | O sistema falhou em observabilidade — adicione alerta proativo |
| Cadeia de microservicos | Traces sao obrigatorios para entender dependencias |
| Deploy continuo | Metricas de taxa de erro e latencia devem ser monitoradas pos-deploy |
| Erro generico exposto ao usuario | Problema de seguranca + observabilidade — logs devem capturar stack trace internamente |

## Como pensar sobre observabilidade

### Confiabilidade como objetivo
Observabilidade nao e o objetivo final — **confiabilidade** e. O sistema observavel permite:
- Descobrir problemas antes do cliente
- Ter confianca para fazer deploys continuos
- Entender a cadeia de dependencias (A → B → C → DB)
- Medir taxa de erros, latencia, throughput

### Relacao com metodologia agil
Sistemas observaveis permitem ciclos mais rapidos porque a equipe tem confianca para alterar codigo sabendo que problemas serao detectados rapidamente. Sem observabilidade, cada deploy e um salto no escuro.

### Saidas do sistema
Observabilidade e baseada nas **saidas** (outputs) que o sistema exporta. A aplicacao precisa ativamente expor: exportadores de metricas, logs estruturados, e contexto de tracing propagado entre servicos.

## Equivocos comuns

| Pessoas pensam | Realidade |
|---------------|-----------|
| Observabilidade = monitoramento | Monitoramento e um subconjunto; observabilidade permite entender problemas desconhecidos |
| Basta ter logs | Logs sozinhos nao mostram latencia, throughput ou caminho entre servicos |
| So preciso quando algo quebra | O valor principal e descobrir problemas ANTES que afetem o cliente |
| Erros nao vao acontecer | Erros SEMPRE acontecem — esteja preparado para detecta-los rapido |
| Stack trace no response e aceitavel | E um problema de seguranca; capture internamente via logs, retorne erro generico ao cliente |

## Quando aplicar

- Ao projetar qualquer sistema que ira para producao
- Ao revisar arquitetura de microservicos (traces sao criticos)
- Ao planejar estrategia de deploy continuo
- Ao investigar problemas de performance ou confiabilidade
- Ao avaliar maturidade operacional de um projeto

## Diagnostic

```bash
# Checklist de observabilidade para producao
# [ ] Logs estruturados configurados (JSON)
# [ ] Metricas expostas (Prometheus /metrics endpoint)
# [ ] Tracing propagado entre servicos (x-trace-id)
# [ ] Alertas proativos configurados (Alertmanager/PagerDuty)
# [ ] Dashboards com os 4 sinais (latencia, trafego, erros, saturacao)
```

## Limitacoes

- Observabilidade nao substitui testes (unitarios, integracao, e2e)
- Instrumentacao tem custo computacional — balanceie granularidade vs overhead
- Ferramentas de observabilidade precisam de infraestrutura propria (storage, processamento)

## Troubleshooting

### Sistema tem metricas mas time nao detecta problemas a tempo
**Symptom:** Dashboards existem mas MTTD continua alto e usuarios reportam bugs antes do time
**Cause:** Metricas configuradas sem alertas proativos — dashboards sao passivos, requerem que alguem olhe
**Fix:** Configurar alertas automaticos (Prometheus Alertmanager, PagerDuty) para metricas criticas como taxa de erro e latencia p99

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
