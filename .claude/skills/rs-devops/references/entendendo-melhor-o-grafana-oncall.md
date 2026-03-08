---
name: rs-devops-entendendo-melhor-o-grafana-oncall
description: "Applies Grafana OnCall incident management patterns with severity classification and escalation chains. Use when user asks to 'configure Grafana OnCall', 'setup on-call rotation', 'define severity levels', or 'configure escalation chains'. Enforces alerts beyond dashboards, on-call rotation, severity-based response times, and multi-channel notification. Make sure to use this skill whenever setting up incident response workflows or on-call rotations in Grafana. Not for dashboard creation (use criando-dashboards-de-acompanhamento) or Prometheus alerting rules."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: observabilidade-alertas
  tags: [grafana, oncall, incident-management, severity, escalation, mttd, mttr, alerting]
---

# Grafana OnCall e Gestao de Incidentes

> Configure alertas que notificam as pessoas certas, no momento certo, com escalonamento claro e metricas de resposta.

## Rules

1. **Sempre configure alertas alem dos dashboards** — dashboards sem alarmes dependem de alguem olhando
2. **Defina rotacao de plantao (on-call)** — cada turno tem um responsavel claro
3. **Separe horario comercial de nao-comercial** — escalation chains diferentes
4. **Classifique por severidade** — SEV0=critico, SEV1=alto, SEV2=medio, SEV3=baixo
5. **Extraia metricas de resposta** — MTTD, MTTR, MTBF

## Classificacao de Severidade

| Severidade | Tempo de resposta |
|------------|-------------------|
| SEV0 | < 5 minutos |
| SEV1 | < 15 minutos |
| SEV2 | < 1 hora |
| SEV3 | < 4 horas |

## Canais de Notificacao

| Canal | Quando usar |
|-------|-------------|
| Chamada telefonica | SEV0, fora do horario |
| SMS | SEV0-SEV1 |
| Slack/Teams | SEV1-SEV2 |
| Canal de incidentes | Todos os niveis |

## Escalation chain example

```yaml
# Grafana OnCall escalation chain configuration
escalation_chain:
  name: "production-critical"
  steps:
    - step: 1
      action: notify_on_call
      duration: 5m
      channel: slack
    - step: 2
      action: notify_on_call
      duration: 10m
      channel: sms
    - step: 3
      action: notify_on_call
      duration: 15m
      channel: phone_call
    - step: 4
      action: escalate_to_next
      duration: 20m
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Dashboards sem alertas | Configure alertas para toda metrica critica |
| Depender do cliente para reportar | Detecte antes com alertas automaticos |
| Colocar todos como responsaveis | Uma pessoa de plantao por turno |
| Usar apenas um canal | Escalone: Slack, SMS, chamada |
| Configurar Grafana OnCall OSS | Use Grafana Cloud (OSS deprecado) |

## Troubleshooting

### Alertas disparam mas ninguem recebe notificacao
**Symptom:** Grafana mostra alertas ativos mas nenhum membro do time e notificado
**Cause:** Escalation chain nao configurada ou rotacao de plantao sem responsavel ativo
**Fix:** Verificar que existe uma escalation chain ativa com pelo menos um responsavel de plantao no turno atual

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
