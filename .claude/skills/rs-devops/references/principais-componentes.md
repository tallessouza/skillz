---
name: rs-devops-principais-componentes
description: "Applies Kubernetes cluster architecture knowledge when designing, debugging, or discussing K8s infrastructure. Use when user asks to 'create a cluster', 'deploy to kubernetes', 'debug pod scheduling', 'configure k8s', or mentions control plane, nodes, etcd, kubelet, kube-proxy. Make sure to use this skill whenever working with Kubernetes architecture decisions or troubleshooting cluster components. Not for Docker-only setups, application code, or CI/CD pipeline configuration."
---

# Arquitetura de um Cluster Kubernetes

> Todo cluster Kubernetes se divide em dois planos: o control plane (cerebro) gerencia estado e configuracao, os nodes (nos de trabalho) executam os containers.

## Key concept

Um cluster Kubernetes e composto por **control plane** + **N nodes**. O control plane garante que o estado desejado (ex: 5 replicas) seja mantido nos nodes. Cada node e uma maquina (fisica ou virtual) com recursos finitos (CPU, memoria) onde pods sao alocados.

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Pod nao sendo agendado | Verifique recursos disponiveis nos nodes (kube-scheduler considera CPU/memoria) |
| Cluster instavel, estado inconsistente | Verifique saude do etcd (banco chave-valor com todo estado do cluster) |
| Node nao responde ao control plane | Verifique o kubelet do node (agente de comunicacao com control plane) |
| Problemas de rede entre pods/servicos | Verifique o kube-proxy (gerencia comunicacoes de rede dentro e fora do cluster) |
| Interacao programatica com cluster | Use a API Server (REST API exposta pelo control plane) |
| Precisa de alta disponibilidade | Considere redundancia de control plane E distribuicao de pods entre multiplos nodes |

## Componentes do Control Plane

| Componente | Funcao | Analogia |
|-----------|--------|----------|
| **API Server** | Ponto de entrada REST para interagir com o cluster | Portaria do edificio |
| **kube-scheduler** | Agenda pods nos nodes considerando recursos disponiveis | Alocador de salas |
| **etcd** | Banco chave-valor com todas as configuracoes e estado do cluster | Memoria do cerebro |
| **Control plane (geral)** | Garante que o estado desejado seja mantido | Cerebro do Kubernetes |

## Componentes do Node

| Componente | Funcao |
|-----------|--------|
| **kubelet** | Agente em cada node que comunica com o control plane; aciona self-healing |
| **kube-proxy** | Abstrai e gerencia comunicacoes de rede dentro e fora do cluster |
| **Container runtime** | Executa os containers de fato |
| **Pods, Deployments, ReplicaSets** | Componentes de workload que moram dentro do node |

## How to think about it

### Scheduling de pods
O kube-scheduler olha para os nodes disponiveis, verifica recursos (CPU, memoria) restantes e aloca o pod no node mais adequado. Se nenhum node tem recurso suficiente, o pod fica em estado `Pending`.

### etcd: gerenciado vs bare metal
- **Kubernetes gerenciado** (EKS, GKE, AKS): etcd e abstraido pelo provider, complexidade reduzida
- **Bare metal / on-premise**: voce gerencia o etcd diretamente — backup e rotina de manutencao sao sua responsabilidade

### Redundancia em dois niveis
1. **Pods**: multiplas replicas da mesma aplicacao distribuidas entre nodes
2. **Control plane**: multiplas instancias para garantir que o cerebro nunca caia

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Control plane executa containers | Control plane apenas gerencia estado; nodes executam containers |
| Um cluster tem apenas um node | Um cluster pode ter N nodes para redundancia e distribuicao de carga |
| etcd e um banco relacional | etcd e um banco chave-valor distribuido |
| kubelet fica no control plane | kubelet fica em cada node de trabalho |
| kube-proxy e um proxy HTTP | kube-proxy gerencia regras de rede (iptables/IPVS) para roteamento de servicos |

## When to apply

- Ao projetar a topologia de um cluster Kubernetes
- Ao debugar problemas de scheduling, rede ou estado do cluster
- Ao decidir entre Kubernetes gerenciado vs self-managed
- Ao dimensionar recursos de nodes para workloads

## Limitations

- Esta skill cobre a arquitetura macro do cluster, nao os detalhes de objetos como Services, Ingress, PV/PVC
- Componentes de persistencia, rede avancada e configuracao (ConfigMaps, Secrets) sao cobertos em aulas separadas

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-principais-componentes/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-principais-componentes/references/code-examples.md)
