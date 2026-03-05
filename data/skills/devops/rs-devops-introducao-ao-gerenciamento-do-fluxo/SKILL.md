---
name: rs-devops-intro-gerenciamento-fluxo
description: "Applies Istio service mesh setup patterns when configuring Kubernetes clusters with Istio. Use when user asks to 'install Istio', 'setup service mesh', 'configure sidecar injection', 'deploy Istio on Kubernetes', or 'manage Istio namespace'. Covers installation via Helm, automatic sidecar injection, Istio CTL usage, service discovery, and Ambient Mode architecture. Make sure to use this skill whenever setting up or managing Istio in a Kubernetes cluster. Not for application-level code, CI/CD pipelines, or non-Istio networking."
---

# Gerenciamento de Fluxo com Istio no Kubernetes

> Instale o Istio via Helm, habilite injecao automatica de sidecar em todos os namespaces, e use o namespace `istio-system` para isolar componentes da malha de servico.

## Rules

1. **Instale via Helm, nao kubectl puro** — Helm empacota configuracoes e simplifica upgrades, porque gerenciar manifests individuais do Istio via kubectl nao escala
2. **Habilite injecao automatica de sidecar** — configure o webhook de admissao para injetar o proxy automaticamente em todos os namespaces, porque injecao manual nao escala e gera erros humanos
3. **Isole componentes no namespace `istio-system`** — crie um namespace dedicado conforme a documentacao oficial, porque facilita monitoramento e separacao logica
4. **Use Istio CTL em ambiente local** — em producao, abstraia com Helm/GitOps, porque o Istio CTL e ideal para exploracao e debugging local
5. **Aproveite o service discovery nativo do Kubernetes** — o Istio usa a API do Kubernetes (matchLabels, Services), porque nao precisa de mecanismo externo de descoberta
6. **Conheca o Ambient Mode como alternativa** — elimina sidecars associando proxies ao no, porque reduz overhead de ter dois containers por pod

## How to write

### Instalacao do Istio via Helm

```bash
# Adicionar repositorio do Istio
helm repo add istio https://istio-release.storage.googleapis.com/charts
helm repo update

# Criar namespace dedicado
kubectl create namespace istio-system

# Instalar base + istiod
helm install istio-base istio/base -n istio-system
helm install istiod istio/istiod -n istio-system
```

### Habilitar injecao automatica de sidecar

```bash
# Rotular namespace para injecao automatica
kubectl label namespace default istio-injection=enabled

# Verificar labels
kubectl get namespace -L istio-injection
```

### Verificar componentes instalados

```bash
# Todos os componentes ficam em istio-system
kubectl get pods -n istio-system

# Usar Istio CTL para diagnostico
istioctl analyze
istioctl proxy-status
```

## Example

**Before (configuracao manual — nao escala):**
```yaml
# Declarando sidecar manualmente em cada deployment
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      containers:
        - name: my-app
          image: my-app:latest
        - name: istio-proxy          # manual em cada deploy
          image: istio/proxyv2:latest
```

**After (injecao automatica via webhook):**
```bash
# Habilitar no namespace — todos os pods recebem sidecar automaticamente
kubectl label namespace default istio-injection=enabled

# Deploy normal, sem declarar sidecar
kubectl apply -f my-app-deployment.yaml
# O webhook de admissao injeta o proxy automaticamente
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Novo cluster precisa de service mesh | Instalar Istio via Helm, habilitar injecao automatica |
| Namespace especifico NAO deve ter sidecar | Remover label `istio-injection=enabled` desse namespace |
| Debugging local de service mesh | Usar `istioctl` para analise e proxy-status |
| Ambiente produtivo | Gerenciar via Helm charts + GitOps, nao istioctl direto |
| Preocupacao com overhead de sidecar | Avaliar Ambient Mode (proxy associado ao no, sem container extra) |
| Verificar se sidecar foi injetado | `kubectl get pods` — pod deve ter 2/2 containers (app + proxy) |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Injetar sidecar manualmente em cada deployment | Habilitar injecao automatica via label no namespace |
| Instalar componentes Istio no namespace default | Criar namespace `istio-system` dedicado |
| Usar kubectl apply com manifests soltos do Istio | Usar Helm para instalacao e gerenciamento |
| Depender de istioctl em producao | Abstrair com Helm charts e GitOps |
| Ignorar o service discovery nativo | Usar matchLabels e Services do Kubernetes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
