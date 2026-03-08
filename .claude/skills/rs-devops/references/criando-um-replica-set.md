---
name: rs-devops-criando-replicaset
description: "Applies Kubernetes ReplicaSet manifest patterns when understanding pod replication fundamentals. Use when user asks to 'create replicaset', 'replicate pods', 'write replicaset yaml', 'scale pods manually', or 'understand pod controllers'. Enforces selector/label pairing, apps/v1 apiVersion, and resource declarations. Make sure to use this skill whenever explaining or generating ReplicaSet manifests for learning purposes. Not for production workloads (use Deployment instead), StatefulSets, or DaemonSets."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-fundamentals
  tags: [kubernetes, replicaset, pods, replicas, labels, selector]
---

# Kubernetes ReplicaSet

> Ao criar ReplicaSets, garanta que labels e selectors estejam corretamente pareados entre o controller e o template do pod.

## Rules

1. **Sempre defina `selector.matchLabels`** — o ReplicaSet precisa saber quais pods controlar
2. **Labels do template devem corresponder ao selector** — exatamente as mesmas labels
3. **Use `apiVersion: apps/v1`** — ReplicaSet pertence ao grupo `apps`
4. **Nunca gerencie pods individuais para replicacao**
5. **Pods sao efemeros** — o ReplicaSet garante que pods deletados sejam recriados

## How to write

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: nginx
spec:
  replicas: 5
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:latest
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: "250m"
              memory: "64Mi"
            limits:
              cpu: "500m"
              memory: "128Mi"
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Criar multiplos `pod.yaml` para replicacao | Use ReplicaSet com `replicas: N` |
| Omitir `selector.matchLabels` | Sempre defina o selector |
| Usar `apiVersion: v1` para ReplicaSet | Use `apiVersion: apps/v1` |
| Producao real | Use Deployment em vez de ReplicaSet diretamente |

## Troubleshooting

### ReplicaSet nao atualiza pods apos mudanca de imagem
**Symptom:** Apos alterar a imagem no manifesto do ReplicaSet e aplicar, os pods existentes continuam com a imagem antiga.
**Cause:** ReplicaSet nao faz rolling update — ele so garante o numero de replicas. Pods existentes nao sao recriados.
**Fix:** Use Deployment em vez de ReplicaSet. O Deployment cria ReplicaSets automaticamente e gerencia rolling updates.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
