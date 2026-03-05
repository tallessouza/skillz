---
name: rs-devops-dev-ops-no-dia-a-dia-e-sre
description: "Applies DevOps culture principles and SRE role understanding when designing systems, pipelines, or team workflows. Use when user asks to 'set up CI/CD', 'improve deployment', 'define team process', 'implement observability', or discusses 'DevOps vs SRE'. Guides decisions on integration, documentation, fast feedback loops, and reliability engineering. Make sure to use this skill whenever discussing infrastructure culture or SRE responsibilities. Not for specific tool configuration, Kubernetes setup, or coding patterns."
---

# DevOps no Dia a Dia e SRE

> DevOps e cultura de integracao entre times; SRE e a implementacao tecnica dessa cultura.

## Key concept

DevOps nao e um cargo — e uma cultura que busca integrar equipes para entregar com agilidade, errar rapido e corrigir rapido. SRE (Site Reliability Engineering) e o cargo tecnico que implementa essa cultura atraves de automatizacao, observabilidade e confiabilidade.

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Times trabalhando em silos isolados | Integracao entre times — descentralize conhecimento |
| Documentacao desatualizada ou inexistente | Documentacao continua — trate como organismo vivo |
| Deploy lento e arriscado | Automatizacao + observabilidade — erre rapido, corrija rapido |
| Duvida se precisa de "DevOps Engineer" ou "SRE" | DevOps = cultura, SRE = cargo tecnico que implementa |
| Validacao de POC/prova de conceito | Pipeline agil — ciclo curto de experimentacao |
| Problema demora para ser detectado em producao | Mecanismos de observabilidade — deteccao e correcao rapidas |

## Pilares de uma empresa com DevOps

### 1. Integracao entre times
Entregar uma funcionalidade nao e apenas desenvolver. Exige integracao entre dev, ops, QA e produto para ter a melhor solucao com agilidade.

### 2. Documentacao continua
Descentralize conhecimento — nao guarde informacao. Documentacao e organismo vivo: escrever uma vez nao basta, precisa de cultura de atualizacao constante.

### 3. Feedback e aprendizado continuo
Estimule loops de feedback rapidos. Quanto mais rapido o feedback, mais rapido a correcao.

### 4. Testabilidade e agilidade
Quebre silos para conseguir experimentar rapido. O principio central: **errar rapido para corrigir rapido**. Sem DevOps, a curva para implementar, descobrir erros e pensar em plano B e muito alta.

## SRE — Site Reliability Engineering

### O que e
Engenharia de Confiabilidade de Sites. Cargo tecnico responsavel por implementar a cultura DevOps no campo pratico.

### O que faz
- Automatiza deploys
- Cria scripts para provisionar ambientes com agilidade
- Implementa observabilidade
- Promove integrabilidade entre times do ponto de vista tecnico

### DevOps vs SRE

| DevOps | SRE |
|--------|-----|
| Cultura organizacional | Cargo tecnico |
| Principios e valores | Implementacao pratica |
| Integracao, feedback, agilidade | Automatizacao, confiabilidade, observabilidade |
| Nao deveria ser um cargo | E de fato um cargo |

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| DevOps e um cargo | DevOps e cultura; SRE e o cargo tecnico |
| Basta ter ferramentas de CI/CD para ter DevOps | Ferramentas sem cultura integrada nao resolvem silos |
| Erros em producao sao inaceitaveis | O objetivo e errar rapido e corrigir rapido, nao evitar erros a todo custo |
| Documentacao e tarefa pontual | Documentacao e organismo vivo que precisa de atualizacao constante |
| Metodologia agil sozinha garante entregas rapidas | Sem integracao entre times (DevOps), Scrum nao resolve a lentidao |

## Leitura recomendada

**"Engenharia de Confiabilidade de Sites"** (Site Reliability Engineering) — escrito por engenheiros do Google. Cada capitulo aborda cenarios criticos diferentes (tarefas penosas, automatizacao, cultura). Nao precisa ler em sequencia — leia o capitulo relevante para seu contexto.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-dev-ops-no-dia-a-dia-e-sre/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-dev-ops-no-dia-a-dia-e-sre/references/code-examples.md)
