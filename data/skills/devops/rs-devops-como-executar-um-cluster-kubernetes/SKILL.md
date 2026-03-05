---
name: rs-devops-como-executar-cluster-kubernetes
description: "Applies Kubernetes cluster execution knowledge when designing or discussing K8s infrastructure. Use when user asks to 'create a cluster', 'deploy to kubernetes', 'choose between EKS GKE AKS', 'run kubernetes locally', or 'set up k8s environment'. Guides decisions between managed vs self-managed clusters and local development setups. Make sure to use this skill whenever planning Kubernetes infrastructure or choosing execution strategy. Not for container image building, Docker-only setups, or application code patterns."
---

# Como Executar um Cluster Kubernetes

> Antes de criar um cluster, decida o modelo de execucao: gerenciado (cloud provider), auto-gerenciado (on-premise), ou local (estudo/desenvolvimento).

## Key concept

Kubernetes e open source e 100% portavel — nao esta acoplado a nenhum cloud provider. O custo nunca e pelo Kubernetes em si, mas pelo **gerenciamento** do cluster. Essa distincao e fundamental para decisoes de infraestrutura.

## Decision framework

| Cenario | Modelo | Justificativa |
|---------|--------|---------------|
| Producao com equipe pequena | Gerenciado (EKS/GKE/AKS) | Remove carga cognitiva de gerenciamento do time |
| Producao com equipe de infra dedicada | Auto-gerenciado (on-premise/bare metal) | Controle total, sem custo de gerenciamento do provider |
| Estudo e desenvolvimento local | Local (minikube/kind/k3d) | Zero custo, roda em qualquer SO |
| POC ou validacao rapida | Local ou gerenciado | Depende se precisa simular ambiente produtivo |

## Managed services por provider

| Provider | Servico | Sigla |
|----------|---------|-------|
| AWS | Elastic Kubernetes Service | EKS |
| Google Cloud | Google Kubernetes Engine | GKE |
| Azure | Azure Kubernetes Service | AKS |
| Digital Ocean | DOKS | DOKS |

## How to think about it

### Gerenciado vs auto-gerenciado

A diferenca nao e se o cluster sera gerenciado — ele sempre sera. A questao e **quem** gerencia:

- **Gerenciado:** Cloud provider cuida do control plane, upgrades, patches. Voce paga por isso.
- **Auto-gerenciado:** Sua equipe cuida de tudo. Voce "paga" com carga cognitiva e horas de trabalho.

### Quando usar execucao local

Execucao local e para aprendizado e desenvolvimento. Permite subir containers, testar isolamento, e entender o funcionamento do K8s sem custo. Nao simula cenarios de rede e escala de producao.

## Heuristics

| Situacao | Acao |
|----------|------|
| Time sem experiencia em K8s | Comece com gerenciado (EKS/GKE/AKS) |
| Requisitos de compliance/dados on-premise | Auto-gerenciado no bare metal |
| Primeiros estudos de K8s | Rode localmente na sua maquina |
| Infraestrutura como codigo | Combine gerenciado + Terraform para criar clusters |

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Kubernetes e pago | K8s e open source e gratuito; o gerenciamento no cloud provider e pago |
| Precisa de cloud para usar K8s | K8s roda em qualquer lugar: cloud, on-premise, maquina local |
| Auto-gerenciado e mais barato | O custo de horas da equipe gerenciando pode superar o custo do servico gerenciado |
| So funciona em Linux | Roda em Linux, Windows e Mac sem problemas |

## Limitations

- Execucao local nao replica cenarios de rede (VPC, subnet) nem escala de producao
- A escolha entre gerenciado e auto-gerenciado depende de contexto organizacional, nao ha resposta universal
- Este skill cobre a decisao de modelo de execucao, nao a configuracao detalhada de cada provider

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
