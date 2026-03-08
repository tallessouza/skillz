---
name: rs-devops-injetando-istio-deployment
description: "Applies Istio sidecar injection patterns when configuring Kubernetes deployments with service mesh. Use when user asks to 'inject Istio', 'add sidecar proxy', 'configure service mesh', 'enable Istio namespace', or 'create Kubernetes service'. Covers namespace labeling, ClusterIP services, sidecar injection lifecycle, and multi-namespace control. Make sure to use this skill whenever working with Istio or service mesh on Kubernetes. Not for Istio virtual services, traffic routing, or addon configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: istio-sidecar-injection
  tags: [istio, sidecar, kubernetes, namespace, clusterip, service-mesh]
---

# Injetando Istio no Deployment

> Controle a injecao do Istio via labels no namespace, nunca manualmente no deployment.

## Rules

1. **Crie um Service ClusterIP para centralizar acesso aos pods** — use `selector` com match labels do deployment, porque sem service cada pod precisa ser acessado individualmente
2. **Injete Istio via label no namespace, nao no deployment** — adicionar container manualmente no spec e possivel mas impraticavel para service mesh, porque a configuracao do sidecar e complexa demais
3. **Use `--overwrite` ao rotular namespace** — `kubectl label namespace <ns> istio-injection=enabled --overwrite`, porque garante que a label sobrescreve qualquer config anterior
4. **Re-deploy apos rotular o namespace** — a injecao acontece no momento da admissao (webhook), pods existentes nao recebem o sidecar automaticamente
5. **Sempre passe `-n <namespace>` nos comandos** — service e deployment devem estar no mesmo namespace, porque Kubernetes isola recursos por namespace
6. **Verifique a injecao pelo count de containers** — pods com Istio mostram `2/2` (app + istio-proxy), sem Istio mostram `1/1`

## How to write

### Service ClusterIP

```yaml
apiVersion: v1
kind: Service
metadata:
  name: app-service-mesh-svc
  namespace: app
spec:
  type: ClusterIP
  selector:
    app: app-service-mesh
  ports:
    - port: 80
      targetPort: 3000
```

### Habilitar injecao no namespace

```bash
kubectl label namespace app istio-injection=enabled --overwrite
```

### Re-deploy para ativar injecao

```bash
# Deletar e reaplicar (injecao so ocorre na criacao do pod)
kubectl delete -f k8s/ -n app
kubectl apply -f k8s/ -n app
```

### Verificar injecao

```bash
# Com Istio: READY 2/2 (app + istio-proxy)
kubectl get pods -n app

# Sem Istio: READY 1/1
kubectl get pods -n app2
```

## Example

**Before (tentativa manual — NAO faca isso):**
```yaml
spec:
  containers:
    - name: app-service-mesh
      image: app:latest
      ports:
        - containerPort: 3000
    - name: istio
      image: istio-proxy:???  # Configuracao complexa demais
```

**After (injecao automatica via namespace label):**
```bash
# 1. Rotular namespace
kubectl label namespace app istio-injection=enabled --overwrite

# 2. Recriar pods (delete + apply)
kubectl delete -f k8s/ -n app
kubectl apply -f k8s/ -n app

# 3. Verificar: 2/2 containers (app + istio-proxy)
kubectl get pods -n app
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Namespace novo para service mesh | Rotule com `istio-injection=enabled` antes do primeiro deploy |
| Pods existentes sem sidecar | Delete e recrie (nao basta rotular) |
| Namespace que NAO deve ter Istio | Nao rotule — pods sobem com 1/1 |
| Precisa de override sobre config existente | Use flag `--overwrite` no label |
| Quer verificar se injecao funcionou | Cheque count de containers: 2/2 = OK |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Adicionar container Istio manualmente no deployment | Rotular namespace com `istio-injection=enabled` |
| Esperar que pods existentes ganhem sidecar apos label | Deletar e recriar os pods |
| Criar service sem `-n namespace` | Sempre especificar namespace explicitamente |
| Usar NodePort/LoadBalancer sem necessidade | Usar ClusterIP como padrao para acesso interno |
| Esquecer de mapear `selector` com labels do deployment | Garantir que selector do service bate com labels do pod template |

## Troubleshooting

### Pods continuam com 1/1 apos rotular namespace
**Symptom:** `kubectl get pods` mostra READY 1/1 mesmo apos `kubectl label namespace app istio-injection=enabled`
**Cause:** A injecao so ocorre no momento da admissao (criacao do pod). Pods existentes nao recebem sidecar automaticamente
**Fix:** Delete e recrie os pods: `kubectl delete -f k8s/ -n app && kubectl apply -f k8s/ -n app`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
