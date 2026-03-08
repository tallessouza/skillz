---
name: rs-devops-principais-componentes
description: "Applies Kubernetes cluster architecture knowledge when designing, debugging, or reviewing cluster topology. Use when user asks to 'understand k8s architecture', 'debug scheduling issues', 'configure control plane', 'troubleshoot etcd', or 'understand kubelet/kube-proxy roles'. Provides mental model for control plane vs node components. Make sure to use this skill whenever discussing cluster design or debugging infrastructure issues. Not for application deployment manifests, Docker configuration, or CI/CD pipelines."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-architecture
  tags: [kubernetes, control-plane, etcd, kubelet, kube-proxy, scheduler, api-server]
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

## Troubleshooting

### Pod fica em Pending sem ser agendado
**Symptom:** Pod permanece em status Pending indefinidamente, nunca transiciona para Running
**Cause:** Nenhum node tem recursos suficientes (CPU/memoria) para acomodar o pod, ou taints/tolerations impedem agendamento
**Fix:** Verificar recursos com `kubectl describe node`, ajustar requests/limits do pod ou adicionar nodes ao cluster

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: Arquitetura de um Cluster Kubernetes

## O cerebro do Kubernetes: Control Plane

O instrutor usa a analogia do **cerebro** para o control plane. Ele enfatiza que o control plane nao executa containers — ele **garante o estado desejado**. Se voce pediu 5 replicas, o control plane e quem assegura que essas 5 replicas estejam rodando nos nodes.

Ponto critico: o control plane deve estar **sempre online**. Se ele cair, ninguem garante o estado do cluster. Por isso, em ambientes de producao, voce pode (e deve) ter **redundancia de control plane** — multiplas instancias para alta disponibilidade.

## Nodes: maquinas com limites reais

Cada node e uma maquina (fisica ou virtual) com recursos finitos. O instrutor reforça que conforme voce aloca pods, eles **consomem recursos** (CPU, memoria) do node. Isso e fundamental porque:

1. O kube-scheduler leva isso em conta ao decidir onde alocar um pod
2. Se nenhum node tem recursos suficientes, o pod nao sera agendado
3. Voce precisa dimensionar seus nodes de acordo com a carga esperada

## kube-scheduler: o agendador inteligente

O scheduler nao simplesmente joga pods em qualquer node. Ele analisa:
- Recursos disponiveis em cada node (CPU, memoria restante)
- Restricoes de afinidade/anti-afinidade (se configuradas)
- Taints e tolerations

O instrutor destaca que e uma **participacao efetiva** — o control plane diz "preciso de 5 replicas" e o scheduler decide **onde** cada uma vai rodar.

## etcd: a memoria do cluster

O etcd e descrito como um **banco chave-valor** que armazena todas as informacoes de configuracao e estado do cluster. O instrutor faz uma distincao pratica importante:

- **Kubernetes gerenciado** (cloud providers): a complexidade do etcd e abstraida. Voce nao precisa se preocupar com backup, compactacao ou alta disponibilidade do etcd.
- **Bare metal / on-premise**: voce e responsavel pelo etcd. Isso inclui rotinas de backup, monitoramento de saude e planejamento de capacidade.

Essa distincao e critica para decisoes de infraestrutura.

## kubelet: o agente do node

Presente em **cada node**, o kubelet faz a ponte entre o node e o control plane. Funcoes:
- Reporta o estado dos containers ao control plane
- Executa acoes de **self-healing** (reiniciar containers com falha)
- Comunica problemas para que o control plane tome decisoes

## kube-proxy: abstração de rede

O kube-proxy e descrito como uma **abstracao** que facilita servicos de rede. Ele gerencia comunicacoes:
- **Dentro do cluster**: entre pods e services
- **Fora do cluster**: trafego externo chegando aos services

O instrutor menciona que e uma "facilitacao" — voce nao precisa configurar regras de rede manualmente para cada pod.

## Redundancia em dois niveis

O instrutor traça um paralelo com a redundancia de containers:
1. **Nivel de pods**: multiplas replicas da mesma aplicacao
2. **Nivel de nodes**: distribuir pods entre multiplos nodes
3. **Nivel de control plane**: multiplas instancias do control plane

Isso garante que a falha de um componente nao derrube o sistema inteiro.

## Componentes dentro do node (preview)

O instrutor menciona brevemente que dentro de cada node existem:
- Componentes de **build**: Pod, Deployment, ReplicaSet
- Componentes de **persistencia**: PV, PVC
- Componentes de **rede**: Services, Ingress
- Componentes de **configuracao**: ConfigMaps, Secrets

Estes serao detalhados em aulas subsequentes do modulo.

---

# Code Examples: Arquitetura de um Cluster Kubernetes

## Visualizando componentes do cluster

### Verificar nodes do cluster
```bash
# Listar todos os nodes e seus status
kubectl get nodes

# Detalhes de um node especifico (recursos, pods alocados, condicoes)
kubectl describe node <node-name>
```

### Verificar componentes do control plane
```bash
# Verificar pods do sistema (control plane roda como pods no namespace kube-system)
kubectl get pods -n kube-system

# Saida tipica inclui:
# etcd-<master>
# kube-apiserver-<master>
# kube-scheduler-<master>
# kube-controller-manager-<master>
# kube-proxy-<node>  (um por node)
```

### Verificar recursos disponiveis nos nodes
```bash
# Ver capacidade e alocacao de recursos
kubectl describe node <node-name> | grep -A 5 "Allocated resources"

# Ver todos os nodes com uso de recursos
kubectl top nodes
```

### Interagindo com a API Server diretamente
```bash
# Iniciar proxy local para a API
kubectl proxy --port=8080

# Fazer chamada REST direta
curl http://localhost:8080/api/v1/namespaces/default/pods
```

### Verificar saude do etcd (bare metal)
```bash
# Verificar saude do etcd (requer acesso ao node master)
ETCDCTL_API=3 etcdctl \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key \
  endpoint health

# Backup do etcd (critico em bare metal)
ETCDCTL_API=3 etcdctl snapshot save /backup/etcd-snapshot.db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key
```

### Verificar kubelet em um node
```bash
# Status do kubelet (executar no proprio node)
systemctl status kubelet

# Logs do kubelet
journalctl -u kubelet -f
```

### Verificar kube-proxy
```bash
# kube-proxy roda como DaemonSet (um por node)
kubectl get daemonset kube-proxy -n kube-system

# Ver regras de rede criadas pelo kube-proxy
kubectl logs -n kube-system -l k8s-app=kube-proxy
```

## Arquitetura visual do cluster

```
┌─────────────────────────────────────────────────────┐
│                   CONTROL PLANE                      │
│                                                      │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ API      │  │ kube-        │  │    etcd       │  │
│  │ Server   │  │ scheduler    │  │ (chave-valor) │  │
│  └──────────┘  └──────────────┘  └──────────────┘  │
│                                                      │
│  ┌──────────────────────┐                           │
│  │ controller-manager   │                           │
│  └──────────────────────┘                           │
└─────────────────────┬───────────────────────────────┘
                      │ (comunicacao via kubelet)
          ┌───────────┴───────────┐
          ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│     NODE 1      │    │     NODE 2      │
│                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │  kubelet    │ │    │ │  kubelet    │ │
│ ├─────────────┤ │    │ ├─────────────┤ │
│ │ kube-proxy  │ │    │ │ kube-proxy  │ │
│ ├─────────────┤ │    │ ├─────────────┤ │
│ │ ┌───┐ ┌───┐│ │    │ │ ┌───┐ ┌───┐│ │
│ │ │Pod│ │Pod││ │    │ │ │Pod│ │Pod││ │
│ │ └───┘ └───┘│ │    │ │ └───┘ └───┘│ │
│ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘
```
