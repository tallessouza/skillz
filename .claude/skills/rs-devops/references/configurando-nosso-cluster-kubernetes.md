---
name: rs-devops-configurando-cluster-kubernetes
description: "Generates Kind cluster configurations for local Kubernetes environments. Use when user asks to 'create a kubernetes cluster', 'setup kind', 'configure local k8s', 'multi-node cluster', or 'service mesh cluster'. Produces kind.yaml with control plane and worker nodes, runs kind create cluster with config. Make sure to use this skill whenever setting up local Kubernetes clusters for development or testing. Not for production cluster provisioning, cloud-managed Kubernetes (EKS/GKE/AKS), or Helm chart authoring."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-kind-service-mesh
  tags: [kubernetes, kind, cluster, service-mesh, istio]
---

# Configurando Cluster Kubernetes com Kind

> Criar clusters Kubernetes locais multi-no com Kind para desenvolvimento e testes de service mesh.

## Prerequisites

- Docker instalado e rodando
- Kind CLI instalado (`kind.sigs.k8s.io`)
- kubectl instalado e configurado
- Se nao encontrar Kind: consultar https://kind.sigs.k8s.io para instalacao

## Steps

### Step 1: Criar estrutura de diretorios

```
project/
├── app-ts/          # Aplicacao (com Dockerfile)
└── infra/
    └── kind.yaml    # Configuracao do cluster
```

### Step 2: Criar configuracao do cluster Kind

```yaml
# infra/kind.yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: cluster-service-mesh
nodes:
  - role: control-plane
  - role: worker
  - role: worker
```

**Regras de configuracao:**
- 1 control-plane (cerebro do cluster, nao recebe carga de trabalho)
- 2+ workers (redundancia na camada de aplicacao)
- `name` no YAML define o nome do cluster (pode ser overridden com `--name` na CLI)

### Step 3: Criar o cluster

```bash
cd infra
kind create cluster --config kind.yaml
```

O Kind vai:
1. Baixar a imagem `kindest/node` (~900MB no primeiro pull)
2. Preparar os nos (control-plane + workers)
3. Instalar CNI (Container Network Interface)
4. Fazer join dos workers ao cluster

### Step 4: Verificar o cluster

```bash
kubectl get nodes
```

Saida esperada:
```
NAME                                 STATUS   ROLES           AGE   VERSION
cluster-service-mesh-control-plane   Ready    control-plane   1m    v1.32.x
cluster-service-mesh-worker          Ready    <none>          1m    v1.32.x
cluster-service-mesh-worker2         Ready    <none>          1m    v1.32.x
```

Todos os nos devem estar `Ready`.

## Output format

Cluster Kind local com:
- 1 control-plane node
- 2 worker nodes
- CNI configurado
- kubectl context automaticamente configurado

## Error handling

- Se `kind create cluster` falha com imagem: verificar conexao e Docker rodando
- Se nodes ficam `NotReady`: aguardar alguns segundos, CNI pode estar inicializando
- Se API version invalida: verificar versao do Kind instalado, ajustar `v1alpha4` conforme necessario
- Se cluster com mesmo nome ja existe: `kind delete cluster --name cluster-service-mesh` antes de recriar

## Verification

```bash
# Verificar nodes
kubectl get nodes

# Verificar todos os pods do sistema
kubectl get pods -A

# Verificar contexto atual
kubectl config current-context
```

## Heuristics

| Situacao | Configuracao |
|----------|-------------|
| Desenvolvimento local simples | 1 control-plane + 1 worker |
| Service mesh (Istio, Linkerd) | 1 control-plane + 2 workers (minimo) |
| Testes de resiliencia | 1 control-plane + 3 workers |
| HA control plane (raro local) | 3 control-planes + 2 workers |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Rodar workloads no control-plane | Usar workers dedicados para aplicacoes |
| `kind create cluster` sem `--config` para multi-no | Sempre passar `--config` com YAML declarativo |
| Criar cluster sem nome definido | Definir `name` no YAML ou `--name` na CLI |
| Ignorar `NotReady` e deployar imediatamente | Esperar todos os nodes ficarem `Ready` |

## Troubleshooting

### Nodes ficam em estado NotReady apos criar cluster
**Symptom:** `kubectl get nodes` mostra status NotReady para um ou mais nodes
**Cause:** CNI (Container Network Interface) ainda esta inicializando ou Docker nao tem recursos suficientes
**Fix:** Aguarde 30-60 segundos e verifique novamente. Se persistir, verifique logs com `kubectl describe node <nome>` e recursos do Docker

## Deep reference library

- [deep-explanation.md](../../../data/skills/devops/rs-devops-configurando-nosso-cluster-kubernetes/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/devops/rs-devops-configurando-nosso-cluster-kubernetes/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
