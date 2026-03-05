---
name: rs-devops-contexto-inicial-e-problema
description: "Applies Kubernetes problem-awareness lens when designing container architectures. Use when user asks to 'deploy containers', 'run in production', 'scale application', 'container orchestration', or 'kubernetes setup'. Evaluates whether workload actually needs orchestration by checking for replica needs, elastic scaling, resource limits, and multi-app complexity. Make sure to use this skill whenever discussing container production readiness or Kubernetes adoption decisions. Not for Docker basics, image building, or CI/CD pipelines."
---

# Kubernetes: Contexto Inicial e Problema

> Antes de adotar Kubernetes, identifique quais problemas de execucao em container voce realmente tem — orquestracao sem necessidade real de escala gera complexidade gratuita.

## Rules

1. **Avalie antes de orquestrar** — Kubernetes resolve problemas de escala; se voce nao tem problema de escala, vai ganhar complexidade sem beneficio
2. **Containers sao efemeros** — o container nao e sua aplicacao rodando de fato, e um runtime que para no primeiro problema; planeje para falha
3. **Replicas garantem disponibilidade parcial** — se uma replica cai com 5 rodando, voce nao fica 100% offline; redundancia e o minimo para producao
4. **Fluxo elastico exige automacao** — ajustar replicas manualmente (5 pods as 14h, 8 pods as 20h) nao escala; auto scaling e necessario
5. **Multiplas aplicacoes multiplicam a complexidade** — cada aplicacao adicional multiplica todos os problemas anteriores (falha, replicas, elasticidade, recursos)
6. **Defina limites de recursos por container** — sem limites de CPU e memoria, um container pode consumir todo o cluster

## Decision Framework

### Preciso de Kubernetes?

| Pergunta | Se SIM | Se NAO |
|----------|--------|--------|
| Preciso de replicas da mesma aplicacao? | K8s resolve | Docker Compose pode bastar |
| Preciso de auto scaling (fluxo elastico)? | K8s resolve | Replicas fixas bastam |
| Tenho multiplas aplicacoes com multiplos containers? | K8s resolve | Orquestracao simples basta |
| Preciso de recovery automatico em falha? | K8s resolve | Restart policy do Docker pode bastar |
| Preciso controlar recursos (CPU/RAM) por container? | K8s resolve | cgroups manuais ou Docker limits |

## Os 5 Problemas de Execucao em Container

### 1. Falha na execucao
Container para → aplicacao fica offline → resolucao manual e lenta e reativa.

### 2. Multiplos containers da mesma aplicacao (replicas)
Producao exige redundancia → manter replicas manualmente e insustentavel.

### 3. Fluxo elastico (auto scaling)
Trafego varia ao longo do dia → numero de replicas precisa acompanhar demanda.

### 4. Multiplas aplicacoes
Todos os problemas acima multiplicados por N aplicacoes → complexidade exponencial.

### 5. Controle de recursos
Cada container consome CPU e RAM → sem limites definidos, um container pode derrubar o cluster.

## Heuristics

| Situacao | Faca |
|----------|------|
| Aplicacao simples, sem escala | Docker Compose com restart policy |
| Aplicacao unica que precisa de replicas | Avalie K8s ou Docker Swarm |
| Multiplas aplicacoes com escala variavel | Kubernetes e a escolha certa |
| Usuario quer K8s "porque sim" | Questione: qual problema de escala voce tem? |
| Ambiente de desenvolvimento | Docker Compose; K8s e para producao |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Adotar K8s sem ter problema de escala | Avalie se Docker Compose ou Swarm resolve |
| Rodar 1 unica replica em producao | Minimo 2-3 replicas para redundancia |
| Ajustar replicas manualmente por horario | Configure Horizontal Pod Autoscaler |
| Ignorar limites de recursos nos containers | Defina requests e limits de CPU/memoria |
| Tratar container como servidor permanente | Projete para efemero: container pode morrer a qualquer momento |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-contexto-inicial-e-problema/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-contexto-inicial-e-problema/references/code-examples.md)
