---
name: rs-devops-qual-e-a-ideia-do-dev-ops
description: "Applies DevOps culture diagnostics when analyzing team structures, CI/CD pipelines, or organizational problems. Use when user mentions 'DevOps culture', 'dev and ops separation', 'team silos', 'toil', 'manual deployment', or asks about 'why DevOps'. Identifies cultural anti-patterns: knowledge silos, lack of feedback loops, missing automation, dev/ops blame cycles. Make sure to use this skill whenever diagnosing organizational or process problems in software teams. Not for specific tool configuration, CI/CD pipeline code, or infrastructure provisioning."
---

# Cultura DevOps — Diagnosticando Organizacoes

> DevOps surgiu para resolver um problema cultural, nao ferramental — ferramentas sao consequencia da cultura implementada.

## Key concept

DevOps nasceu com o objetivo de resolver a separacao rigida entre desenvolvimento (front-end, back-end, mobile) e operacoes (infra, DBAs, QAs). Em organizacoes sem essa cultura, entregar valor ao cliente depende de uma pipeline que cruza areas — mas as areas nao se conversam. O resultado: atrasos, blame cycles e tarefas simples que levam meses para serem publicadas.

## Decision framework

| Quando encontrar | Diagnostico | Acao DevOps |
|-----------------|-------------|-------------|
| Dev alega "ta pronto" mas ops nao consegue publicar | Segmentacao dev/ops sem contexto compartilhado | Criar ownership compartilhado do deploy |
| Apenas uma pessoa sabe como a infra funciona | Centralizacao de conhecimento | Documentar, compartilhar, cross-training |
| Times nao sabem onde melhorar | Falta de feedback constante | Implementar feedback loops (metricas, retros, post-mortems) |
| Tarefa repetitiva que consome tempo crescente | Falta de automatizacao (toil) | Automatizar — qualquer automacao no processo e pratica DevOps |
| Dev nao sabe onde a app roda, ops nao entende o codigo | Silos de conhecimento bidirecional | Criar visibilidade end-to-end da pipeline |

## 5 diagnosticos de ausencia de cultura DevOps

### 1. Segmentacao forte dev/ops
Dev entrega build, ops tenta publicar. Se falha, ninguem tem contexto suficiente para diagnosticar — ops nao entende o codigo, dev nao entende a infra. Resultado: blame cycle e atraso na entrega de valor.

### 2. Centralizacao de conhecimento
O que acontece em operacoes mora em operacoes. O que acontece em dev mora em dev. Areas que deveriam ser interligadas funcionam como caixinhas isoladas.

### 3. Falta de feedback
Sem feedbacks constantes, nao ha estimulo para melhoria. Times nao sabem para onde ir para evoluir.

### 4. Ausencia de aprendizado continuo
Consequencia direta da centralizacao — descentralizar conhecimento gera documentacoes, compartilhamento entre times e estimulo ao aprendizado.

### 5. Falta de automatizacao (toil)
Tarefa repetitiva que hoje leva 10 minutos, semana que vem leva 20, e escala ate comprometer o dia inteiro. Qualquer automatizacao de tarefa penosa e pratica DevOps — tanto em dev quanto em infra.

## Como aplicar ao avaliar um time ou projeto

1. **Mapear a pipeline completa** — do commit ao cliente recebendo valor
2. **Identificar handoffs** — onde um time "joga por cima do muro" para outro
3. **Verificar contexto compartilhado** — dev sabe onde roda? Ops sabe o que roda?
4. **Avaliar automacao** — listar tarefas manuais repetitivas (toil)
5. **Checar feedback loops** — existem metricas, retros, post-mortems?

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| DevOps e sobre ferramentas (Docker, K8s, CI/CD) | DevOps e cultura — ferramentas foram impulsionadas pela cultura |
| Basta contratar um "DevOps Engineer" | DevOps e uma mudanca organizacional, nao um cargo |
| Se o deploy funciona, nao precisa de DevOps | Funcionar nao e suficiente — precisa ser rapido, confiavel e com feedback |
| Automatizar tudo de uma vez | Comece pela tarefa mais penosa e itere |

## Limitations

- Este diagnostico identifica problemas culturais — nao prescreve ferramentas especificas
- Mudanca cultural e gradual e organizacional, nao resolvida por um unico time
- Contextos muito pequenos (1-2 devs) podem nao ter os silos descritos

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
