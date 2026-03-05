---
name: rs-devops-entendendo-melhor-o-grafana-oncall
description: "Applies Grafana OnCall incident management patterns when designing alerting systems, on-call rotations, or incident response workflows. Use when user asks to 'setup alerting', 'configure on-call', 'incident management', 'monitor downtime', or 'escalation chain'. Covers rotation mechanics, escalation chains, severity classification, and MTTR metrics. Make sure to use this skill whenever designing observability alerting or incident response pipelines. Not for Prometheus query writing, dashboard creation, or log aggregation setup."
---

# Grafana OnCall e Gestao de Incidentes

> Configure alertas que notificam as pessoas certas, no momento certo, com escalonamento claro e metricas de resposta.

## Rules

1. **Sempre configure alertas alem dos dashboards** — dashboards sem alarmes dependem de alguem olhando a tela, porque o cliente nao deve ser quem te avisa de um problema
2. **Defina rotacao de plantao (on-call)** — cada turno tem um responsavel claro, mesmo que essa pessoa nao resolva sozinha, porque alguem precisa ser o ponto de contato e acionar o time
3. **Separe horario comercial de nao-comercial** — escalation chains diferentes para cada periodo, porque a disponibilidade das pessoas muda
4. **Classifique por severidade** — use niveis (SEV0=critico, SEV1=alto, SEV2=medio, SEV3=baixo), porque 30 minutos de resposta pode ser ok para SEV3 mas inaceitavel para SEV0
5. **Extraia metricas de resposta** — MTTD (tempo para detectar), MTTR (tempo para resolver), MTBF (tempo entre falhas), porque sem metricas nao ha melhoria continua
6. **Compare times sem punir** — use metricas para entender diferencas de processo entre equipes, porque a cultura DevOps busca melhoria, nao punicao

## Estrutura do OnCall

### Escalation Chain

```
Deteccao (Prometheus/Logs/Metricas)
    │
    ▼
Alert Group (Grafana OnCall)
    │
    ▼
Escalation Chain
    ├── Pessoa de plantao (SMS, chamada)
    ├── Canal Slack/Teams/Telegram
    └── Grupo de incidente (se nao respondido)
```

### Workflow de Incidente

```
1. Alerta disparado → notificacao enviada
2. Responsavel faz ACK (acknowledge)
3. Investigacao inicia
4. Problema resolvido → alerta fecha automaticamente
5. Metricas extraidas (MTTD, MTTR)
```

### Classificacao de Severidade

| Severidade | Descricao | Tempo de resposta esperado |
|------------|-----------|---------------------------|
| SEV0 | Indisponibilidade total | < 5 minutos |
| SEV1 | Degradacao significativa | < 15 minutos |
| SEV2 | Impacto parcial | < 1 hora |
| SEV3 | Baixo impacto | < 4 horas |

## Canais de Notificacao

| Canal | Quando usar |
|-------|-------------|
| Chamada telefonica | SEV0, fora do horario comercial |
| SMS | SEV0-SEV1 |
| Slack/Teams (mencao direta) | SEV1-SEV2 |
| Canal de incidentes | Todos os niveis (registro) |

## Alternativas ao Grafana OnCall

| Ferramenta | Caracteristica |
|------------|---------------|
| **PagerDuty** | Referencia de mercado, SaaS completo |
| **Squadcast** | Alternativa open-source friendly |
| **Datadog On-Call** | Integrado se ja usa Datadog |
| **Grafana Cloud OnCall** | Plano gratuito disponivel, mesmo ecossistema |

## Heuristics

| Situacao | Faca |
|----------|------|
| Time pequeno (< 5 pessoas) | Rotacao semanal, uma pessoa por vez |
| Time grande (> 10 pessoas) | Rotacao diaria, pares de plantao |
| Grafana Cloud ja em uso | Use OnCall built-in (mesmo ecossistema) |
| Grafana OSS auto-hospedado | Use PagerDuty ou Squadcast (OnCall OSS esta deprecado) |
| Time A responde em 30min, Time B em 5min | Investigue processo do Time B e replique, sem punir |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Montar dashboards sem alertas | Configure alertas para toda metrica critica |
| Depender do cliente para reportar problemas | Detecte antes com alertas automaticos |
| Colocar todos como responsaveis | Defina uma pessoa de plantao por turno |
| Usar apenas um canal de notificacao | Escalone: Slack → SMS → chamada |
| Comparar times para punir | Compare para entender e melhorar processos |
| Configurar Grafana OnCall OSS hoje | Use Grafana Cloud (OSS esta deprecado desde marco/2025) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
