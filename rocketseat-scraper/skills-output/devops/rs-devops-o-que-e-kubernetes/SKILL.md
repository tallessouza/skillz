---
name: rs-devops-o-que-e-kubernetes
description: "Applies Kubernetes foundational knowledge when designing container orchestration architecture. Use when user asks to 'deploy to kubernetes', 'setup k8s cluster', 'orchestrate containers', 'scale application', or 'choose between k8s and simpler alternatives'. Guides trade-off analysis on whether Kubernetes fits the context. Make sure to use this skill whenever discussing container orchestration strategy or Kubernetes adoption decisions. Not for Docker basics, CI/CD pipelines, or IaC tooling like Terraform."
---

# O que e Kubernetes

> Antes de adotar Kubernetes, analise se a complexidade se justifica para o contexto — escala e orquestracao de multiplos servicos sao os gatilhos reais.

## Conceito central

Kubernetes e um orquestrador de containers open source, mantido pela CNCF, que automatiza a implantacao de aplicacoes em containers de forma **declarativa**. Nasceu do projeto Borg do Google, e escrito em Go e 100% gratuito — o que se paga e o gerenciamento (EKS, GKE, AKS).

## Rules

1. **Kubernetes orquestra containers, nao aplicacoes** — pre-requisito: aplicacao ja rodando em container. K8s nao conhece seu codigo, conhece seu container
2. **Agnostico por design** — agnostico a cloud provider (AWS, GCP, Azure) e a container runtime (Docker, containerd, CRI-O) via CRI (Container Runtime Interface)
3. **Declarativo sobre imperativo** — declare o estado desejado em manifestos YAML, porque isso habilita versionamento, GitOps e migracoes futuras
4. **Avalie trade-offs antes de adotar** — K8s e altamente complexo. Se nao ha problema de escala ou orquestracao de multiplos servicos, a carga cognitiva pode nao compensar
5. **Gratuito vs gerenciado** — a ferramenta e gratuita; EKS/GKE/AKS cobram pelo gerenciamento do control plane, nao pelo Kubernetes em si
6. **Escala e o gatilho real** — uma aplicacao monolitica sem problemas de escala provavelmente nao precisa de K8s, assim como nem toda aplicacao precisa de microservicos

## Framework de decisao

| Situacao | Recomendacao |
|----------|-------------|
| App monolitica sem problemas de escala | Nao adote K8s — complexidade nao se justifica |
| Multiplos microservicos em producao | K8s e forte candidato — orquestracao declarativa brilha |
| Time pequeno, poucas aplicacoes | Considere alternativas mais simples (Docker Compose, ECS, Cloud Run) |
| Necessidade de ser agnostico a cloud | K8s e ideal — portabilidade entre providers |
| Ja tem containers mas precisa escalar | K8s resolve — automatiza scaling declarativamente |

## Heuristics

| Situacao | Faca |
|----------|------|
| Usuario quer "usar K8s porque e legal" | Questione: qual problema de escala/orquestracao voce tem? |
| Aplicacao ainda nao esta em container | Primeiro containerize, depois considere orquestracao |
| Precisa de deploy rapido sem complexidade | Sugira alternativas gerenciadas (Cloud Run, App Runner, Fly.io) |
| Multiplos servicos com interdependencias | K8s com manifestos declarativos e GitOps |
| Duvida entre Docker Compose e K8s | Compose para dev/projetos pequenos, K8s para producao com escala |

## Anti-patterns

| Nao faca | Faca |
|----------|------|
| Adotar K8s sem problema de escala | Avalie se a complexidade se justifica para o contexto |
| Usar comandos imperativos em producao | Use manifestos declarativos versionados no Git |
| Confundir custo do K8s com custo do gerenciamento | K8s e gratuito; EKS/GKE/AKS cobram gerenciamento |
| Achar que K8s substitui containerizacao | K8s orquestra containers — containerizar e pre-requisito |
| Ignorar carga cognitiva do time | Considere maturidade do time antes de adotar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
