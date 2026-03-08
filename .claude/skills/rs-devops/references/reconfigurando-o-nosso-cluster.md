---
name: rs-devops-reconfigurando-o-nosso-cluster
description: "Applies Istio Ambient Mode installation patterns when configuring service mesh without sidecars. Use when user asks to 'install istio ambient', 'configure service mesh without sidecar', 'setup ztunnel', 'migrate from sidecar to ambient', or 'create kind cluster with istio'. Enforces ambient profile installation and proper namespace labeling. Make sure to use this skill whenever setting up Istio Ambient Mode. Not for sidecar mode configuration, application code, or Docker-only deployments."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: istio-ambient-mode
  tags: [istio, ambient-mode, ztunnel, kind, service-mesh, kiali, prometheus]
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

## Troubleshooting

### Kiali mostra "missing sidecar" apos instalar Ambient Mode
**Symptom:** Kiali exibe alerta de "missing sidecar" ou "out of mesh" para pods no namespace
**Cause:** Label `istio.io/dataplane-mode=ambient` nao aplicada no namespace da aplicacao
**Fix:** Aplicar label com `kubectl label namespace <ns> istio.io/dataplane-mode=ambient`; nao usar `istio-injection=enabled` que e para modo sidecar

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

# Deep Explanation: Istio Ambient Mode vs Sidecar

## Por que Ambient Mode existe

O Sidecar e o modo default do Istio — se voce nao fizer nada, ele injeta um container proxy (Envoy) ao lado de cada pod da aplicacao. Isso funciona bem em clusters pequenos, mas em escala (parques grandes de aplicacoes) pode causar:

- **Problemas de performance** — cada pod tem overhead de um container extra
- **Tempo de subida da aplicacao** — o sidecar precisa inicializar antes da app
- **Consumo de recursos** — memoria e CPU multiplicados por cada pod

## Como Ambient Mode funciona

A diferenca fundamental: em vez de injetar um proxy por pod, o Ambient Mode opera no **nivel do namespace**. A comunicacao e controlada pelo proprio namespace, sem container adicional dentro do pod.

Componentes instalados no Ambient Mode:
- **Istiod** — control plane (igual ao sidecar mode)
- **CNI Node** — DaemonSet que configura networking
- **Ztunnel** — DaemonSet que atua como agent do cluster

### DaemonSet como conceito

O instrutor destaca que DaemonSets no Kubernetes funcionam como **agents**: nao sao unicos por aplicacao, sao gerais do cluster. Se voce quer captar metricas ou fazer controle descentralizado, DaemonSet e o padrao. O Ztunnel segue essa logica — um agent por node, nao por pod.

## Sidecar vs Ambient — diferenca visual nos pods

- **Sidecar mode**: `kubectl get pods` mostra `2/2` (app + proxy)
- **Ambient mode**: `kubectl get pods` mostra `1/1` (somente app)

## Labels: a chave de ativacao

Nem sidecar nem ambient sao automaticos. Ambos exigem label no namespace:

- Sidecar: `istio-injection=enabled`
- Ambient: `istio.io/dataplane-mode=ambient`

Se voce esquecer a label, o namespace fica fora da malha e ferramentas como Kiali vao alertar.

## Dependencia Kiali → Prometheus

O instrutor enfatiza: Kiali depende do Prometheus (porta 9090) para metricas. Se Prometheus nao estiver rodando ou nao subiu, Kiali reclama na interface. Sempre instalar Prometheus antes ou garantir que esta healthy antes de acessar Kiali.

## Quando escolher cada modo

O instrutor nao detectou problemas com sidecar em clusters pequenos. A motivacao para ambient e **escala** — muitos pods, muitas aplicacoes. Para clusters menores, sidecar continua sendo perfeitamente valido.

---

# Code Examples: Reconfigurando Cluster com Ambient Mode

## Estrutura de diretorios do projeto

```
projeto/
├── app/              # codigo da aplicacao
│   └── k8s/          # manifests kubernetes da app
│       ├── deployment.yaml
│       ├── deployment-v2.yaml
│       ├── service.yaml
│       ├── virtual-service.yaml
│       └── destination-rule.yaml
└── infra/            # configuracao de infraestrutura
    ├── kind.yaml
    ├── jaeger.yaml
    ├── kiali.yaml
    └── prometheus.yaml
```

## kind.yaml — configuracao do cluster

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: cluster-service-mesh
nodes:
  - role: control-plane
  - role: worker
  - role: worker
```

## Fluxo completo de comandos

### 1. Deletar cluster existente

```bash
kind delete cluster --name cluster-service-mesh
# Verificar que nao ha containers rodando
docker ps
```

### 2. Criar cluster novo

```bash
cd infra/
kind create cluster --config kind.yaml
```

Saida esperada:
```
Creating cluster "cluster-service-mesh" ...
 ✓ Ensuring node image
 ✓ Preparing nodes
 ✓ Writing configuration
 ✓ Starting control-plane
 ✓ Installing CNI
 ✓ Installing StorageClass
 ✓ Joining worker nodes
```

### 3. Verificar nodes

```bash
kubectl get nodes
```

Saida esperada:
```
NAME                                 STATUS   ROLES           AGE   VERSION
cluster-service-mesh-control-plane   Ready    control-plane   1m    v1.27.x
cluster-service-mesh-worker          Ready    <none>          1m    v1.27.x
cluster-service-mesh-worker2         Ready    <none>          1m    v1.27.x
```

### 4. Instalar Istio com Ambient Mode

```bash
istioctl install --set profile=ambient
```

Saida esperada:
```
This will install the Istio ambient profile...
Proceed? (y/N) y
✔ Istio core installed
✔ Istiod installed
✔ CNI installed
✔ Ztunnel installed
✔ Installation complete
Enjoy Istio without sidecars!
```

### 5. Verificar pods do Istio

```bash
kubectl get pods -n istio-system
```

Saida esperada (sem sidecar-related pods):
```
NAME                      READY   STATUS    RESTARTS   AGE
istiod-xxx                1/1     Running   0          1m
istio-cni-node-xxx        1/1     Running   0          1m
ztunnel-xxx               1/1     Running   0          1m
```

### 6. Criar namespace e instalar observabilidade

```bash
kubectl create ns app
kubectl apply -f jaeger.yaml
kubectl apply -f prometheus.yaml
kubectl apply -f kiali.yaml
```

### 7. Acompanhar pods subindo

```bash
kubectl get pods -n istio-system -w
```

Ordem esperada de readiness: Jaeger → Prometheus → Kiali (Kiali depende de Prometheus).

### 8. Deploy da aplicacao

```bash
kubectl apply -f ../k8s/. -n app
kubectl get pods -n app
```

Saida — note `1/1` (sem sidecar):
```
NAME                     READY   STATUS    RESTARTS   AGE
app-v1-xxx               1/1     Running   0          30s
app-v2-xxx               1/1     Running   0          30s
```

### 9. Aplicar label Ambient Mode

```bash
# ERRADO (modo sidecar — nao usar):
# kubectl label namespace app istio-injection=enabled

# CORRETO (modo ambient):
kubectl label namespace app istio.io/dataplane-mode=ambient
```

### 10. Port-forward para Kiali

```bash
# Via Lens: Services → istio-system → kiali → porta 20001
# Ou via CLI:
kubectl port-forward svc/kiali -n istio-system 20001:20001
```

Acessar `http://localhost:20001` — namespace app deve aparecer sem alertas de sidecar.

### Comparacao: labels por modo

```bash
# Sidecar mode (aulas anteriores)
kubectl label namespace app istio-injection=enabled

# Ambient mode (esta aula)
kubectl label namespace app istio.io/dataplane-mode=ambient
```
