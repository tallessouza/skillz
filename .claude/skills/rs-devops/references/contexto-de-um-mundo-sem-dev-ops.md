---
name: rs-devops-contexto-mundo-sem-devops
description: "Applies DevOps cultural principles when designing systems, teams, or workflows. Use when user asks to 'set up a team', 'improve deployment process', 'reduce bottlenecks', 'automate tasks', or 'break knowledge silos'. Enforces knowledge decentralization, continuous feedback, and automation-first thinking. Make sure to use this skill whenever discussing team organization, process improvement, or automation decisions. Not for specific tool configuration, CI/CD pipeline syntax, or infrastructure provisioning."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: devops-culture
  tags: [devops, culture, automation, silos, feedback, knowledge-sharing, teams]
---

# Contexto de um Mundo sem DevOps

> Ao projetar processos e equipes, elimine silos de conhecimento, promova feedback contínuo e automatize tudo que for repetitivo.

## Rules

1. **Descentralize conhecimento** — nenhum processo deve depender de um único time ou pessoa, porque centralização cria gargalos que impedem promoções, crescimento e escalabilidade
2. **Automatize antes que escale** — se um processo manual leva 15 minutos hoje, automatize agora, porque quando escalar para mais cenários, 30 minutos viram 2-3 horas
3. **Pense em escala sempre** — nunca aceite o argumento "são só 15 minutos", porque tempo repetitivo cresce linearmente com demanda
4. **Feedback contínuo** — implemente loops de feedback entre times (360, documentação, contribuições), porque sem feedback não há aprendizado contínuo
5. **Cultura primeiro, ferramentas depois** — DevOps é cultura de aproximação entre dev e ops; ferramentas são consequência, não causa
6. **Automatização não é só infra** — extrair relatório para cliente, gerar dados, qualquer tarefa repetitiva é prática DevOps legítima

## Decision Framework

| Situação | Ação |
|----------|------|
| Apenas um time domina um processo | Descentralizar conhecimento imediatamente — é um gargalo |
| Tarefa manual leva "só X minutos" | Calcular em escala (mais cenários, mais frequência) e automatizar |
| Times de dev e ops não se comunicam | Aproximar com práticas de feedback e documentação compartilhada |
| Processo funciona mas é repetitivo | Candidato a automatização, independente do domínio (back-end, infra, dados) |
| Time não consegue experimentar novas tecnologias | Sinal de gargalo cultural — reduzir barreiras para experimentação |

## Automation readiness diagnostic

```bash
# Quick team automation assessment
# For each process, ask:
# 1. Is it manual?         → Candidate for automation
# 2. Is it repetitive?     → High priority automation
# 3. How long does it take? → Calculate at scale
# 4. Who knows how to do it? → If 1 person → knowledge silo risk

# Example: manual deploy check
echo "Deploy process:"
echo "  Manual steps: $(wc -l < deploy-checklist.txt)"
echo "  Frequency: daily"
echo "  Time per run: 15min"
echo "  Monthly cost: $((15 * 22))min = 330min = 5.5h"
```

## Anti-patterns

| Nunca faça | Faça isso |
|------------|-----------|
| Deixar conhecimento crítico com um único time | Distribuir conhecimento entre todos os envolvidos no fluxo |
| Aceitar "são só 30 minutos" como justificativa | Projetar o custo em escala e automatizar proativamente |
| Implementar ferramentas sem mudar cultura | Primeiro alinhar pessoas e comunicação, depois adotar ferramentas |
| Separar dev e ops em silos isolados | Garantir que dev entenda ops e ops entenda dev (argumentos para conversar) |
| Automatizar só infraestrutura | Automatizar qualquer tarefa repetitiva: relatórios, extrações, publicações |
| Bloquear experimentação com burocracia | Criar ambiente que possibilite testar novas tecnologias com gargalo mínimo |

## Heuristics

| Sinal | Diagnóstico |
|-------|-------------|
| Time é "insubstituível" em uma frente | Centralização de conhecimento — risco organizacional |
| Pessoas não conseguem ser promovidas | Empresa depende delas em operação específica — descentralizar |
| Mesmo processo feito manualmente há meses | Dívida de automatização acumulando |
| Times não têm argumentos para discutir entre si | Falta de conhecimento cruzado dev/ops |
| Equipe sem tempo para inovar | Tempo consumido por trabalho repetitivo (toil) — automatizar para liberar |

## Troubleshooting

### Conhecimento centralizado em uma unica pessoa do time
**Symptom:** Projetos param quando uma pessoa especifica esta ausente ou de ferias
**Cause:** Centralizacao de conhecimento — processo ou sistema depende exclusivamente de um individuo
**Fix:** Documente processos, implemente pair programming e rotacao de tarefas para distribuir conhecimento

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
