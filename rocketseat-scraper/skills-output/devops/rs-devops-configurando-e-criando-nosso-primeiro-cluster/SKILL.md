---
name: rs-devops-configurando-criando-primeiro-cluster
description: "Guides Kubernetes cluster creation with Kind when user asks to 'create a cluster', 'setup kubernetes locally', 'configure kind', 'run kubernetes with docker', or 'setup k8s dev environment'. Enforces separation of control plane from worker nodes, declarative over imperative approach, and namespace scoping. Make sure to use this skill whenever setting up local Kubernetes clusters or discussing Kind configuration. Not for cloud-managed Kubernetes (EKS, GKE, AKS), Helm charts, or application deployment."
---

# Criando Cluster Kubernetes com Kind

> Sempre separe control plane de worker nodes e prefira configuracao declarativa sobre comandos imperativos.

## Rules

1. **Nunca rode workloads no control plane** — o control plane e o cerebro do cluster, responsavel pelo gerenciamento; aplicacoes rodam em worker nodes, porque misturar controle e workload compromete estabilidade e escalabilidade
2. **Prefira declarativo sobre imperativo** — `kind create cluster` sem config file nao tem lastro; use um arquivo de configuracao YAML porque ele documenta a intencao e e reproduzivel
3. **Nunca use o namespace default para aplicacoes** — escope aplicacoes por namespace (por dominio ou aplicacao), porque o default nao oferece isolamento e dificulta gerenciamento
4. **Sempre configure o contexto do kubectl apos criar o cluster** — use `kubectl cluster-info --context kind-{nome}` para garantir que comandos vao para o cluster correto, porque com multiplos clusters o contexto errado causa deploys no lugar errado
5. **Garanta pre-requisitos antes de criar** — Docker (ou Podman) em execucao + Go instalado + Kind instalado, porque o Kind roda Kubernetes em containers

## Prerequisites

- Docker Desktop ou Podman em execucao
- Go instalado (para instalar Kind via `go install`)
- Kind CLI instalado: `go install sigs.k8s.io/kind@latest`
- kubectl instalado e no PATH

## Steps

### Step 1: Criar cluster (imperativo — apenas para exploracao)

```bash
kind create cluster --name meu-cluster
```

Isso cria APENAS o control plane. Nao e suficiente para workloads.

### Step 2: Configurar contexto do kubectl

```bash
kubectl cluster-info --context kind-meu-cluster
```

### Step 3: Verificar nodes

```bash
kubectl get nodes
```

Espere ver apenas um node com role `control-plane` e status `Ready`.

### Step 4: Explorar pods do sistema

```bash
# Namespace default — vazio (correto, nada deve rodar aqui)
kubectl get pods

# Namespace kube-system — pods do control plane
kubectl get pods -n kube-system
```

Pods esperados: CoreDNS, etcd, kube-apiserver, kube-controller-manager, kube-scheduler.

## Comandos kubectl essenciais

| Comando | Abreviacao | Funcao |
|---------|-----------|--------|
| `kubectl get nodes` | `kubectl get no` | Lista nodes do cluster |
| `kubectl get pods` | `kubectl get po` | Lista pods no namespace default |
| `kubectl get pods -n kube-system` | `kubectl get po -n kube-system` | Lista pods do sistema |

## Heuristics

| Situacao | Acao |
|----------|------|
| Cluster local para desenvolvimento | Use Kind com config declarativo incluindo worker nodes |
| Apenas exploracao rapida | `kind create cluster` imperativo e aceitavel |
| Multiplos clusters locais | Configure contextos distintos no kubectl |
| Precisa visualizar cluster graficamente | Use Lens conectando via `.kube/config` |
| Cluster so tem control plane | Recrie com config YAML adicionando worker nodes |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Deploy de apps no control plane | Adicione worker nodes e faca deploy neles |
| Use namespace default para apps | Crie namespaces por dominio/aplicacao |
| Crie cluster sem config file em producao | Use YAML declarativo com `kind create cluster --config` |
| Ignore o contexto do kubectl | Sempre set context apos criar cluster |
| Assuma que `kind create cluster` cria workers | Verifique com `kubectl get nodes` — so cria control plane |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
