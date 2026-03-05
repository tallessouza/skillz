---
name: rs-devops-reconfigurando-cluster-ambient
description: "Applies Istio Ambient Mode cluster setup when user asks to 'install istio', 'configure service mesh', 'remove sidecar', 'setup ambient mode', or 'reconfigure cluster'. Guides through cluster recreation, Istio ambient profile installation, namespace labeling, and observability tooling setup. Make sure to use this skill whenever configuring Istio without sidecars or migrating from sidecar to ambient mode. Not for application deployment, Istio traffic management rules, or sidecar-based Istio configuration."
---

# Reconfigurando Cluster com Istio Ambient Mode

> Ao configurar Istio sem sidecar, instale com profile ambient e aplique label de dataplane no namespace.

## Prerequisites

- Kind (Kubernetes in Docker) instalado
- `istioctl` instalado e no PATH
- YAMLs de observabilidade (Kiali, Prometheus, Jaeger) disponíveis em `infra/`
- Imagem do Kind já baixada localmente (acelera criação)

## Steps

### Step 1: Deletar cluster existente (se necessário)

```bash
kind delete cluster --name cluster-service-mesh
docker ps  # verificar que nao tem mais containers
```

### Step 2: Recriar o cluster

```bash
cd infra/
kind create cluster --config kind.yaml
kubectl get nodes  # confirmar control-plane + workers
```

### Step 3: Instalar Istio com Ambient Mode

```bash
istioctl install --set profile=ambient
```

Confirmar quando perguntado. Instala IstioCore, Istiod, CNI Node (DaemonSet) e Ztunnel (DaemonSet) — sem sidecar.

O Ztunnel funciona como DaemonSet (agent do cluster), capturando metricas de forma descentralizada, nao por aplicacao.

### Step 4: Criar namespace da aplicacao

```bash
kubectl create ns app
```

### Step 5: Instalar ferramentas de observabilidade

```bash
kubectl apply -f jaeger.yaml
kubectl apply -f prometheus.yaml
kubectl apply -f kiali.yaml
```

Prometheus deve estar rodando antes do Kiali — Kiali depende do endpoint 9090 do Prometheus para metricas.

### Step 6: Aplicar aplicacao no namespace

```bash
kubectl apply -f ../k8s/. -n app
```

Pods terao 1/1 containers (sem sidecar), nao 2/2 como no modo sidecar.

### Step 7: Aplicar label Ambient Mode no namespace

```bash
kubectl label namespace app istio.io/dataplane-mode=ambient
```

Cada namespace que participar da malha precisa desta label. Sem ela, Kiali mostra "missing sidecar".

## Verification

```bash
kubectl get pods -n app          # todos 1/1 (sem sidecar)
kubectl get pods -n istio-system  # istiod, ztunnel, cni, jaeger, kiali, prometheus running
```

No Kiali: namespace app nao deve mostrar alertas de "missing sidecar" ou "out of mesh".

## Heuristics

| Situacao | Acao |
|----------|------|
| Cluster grande com muitas aplicacoes | Preferir Ambient Mode — evita overhead de sidecar por pod |
| Sidecar causando lentidao na subida | Migrar para Ambient Mode |
| Novo namespace adicionado | Aplicar label `istio.io/dataplane-mode=ambient` |
| Kiali mostra "missing sidecar" | Verificar se label ambient foi aplicada no namespace |
| Kiali nao mostra metricas | Verificar se Prometheus esta rodando antes do Kiali |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `istioctl install` sem profile (instala sidecar mode) | `istioctl install --set profile=ambient` |
| `istio-injection=enabled` label com ambient | `istio.io/dataplane-mode=ambient` label |
| Subir Kiali sem Prometheus | Sempre instalar Prometheus antes do Kiali |
| Assumir que label vale para todo cluster | Aplicar label em cada namespace individualmente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-reconfigurando-o-nosso-cluster/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-reconfigurando-o-nosso-cluster/references/code-examples.md)
