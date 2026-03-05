---
name: rs-devops-criando-um-replica-set
description: "Applies Kubernetes ReplicaSet configuration patterns when writing pod replication manifests. Use when user asks to 'create a ReplicaSet', 'replicate pods', 'scale pods', 'ensure pod availability', or 'write Kubernetes YAML for replicas'. Enforces correct label/selector matching, template structure, and replica count configuration. Make sure to use this skill whenever generating Kubernetes manifests that involve pod replication or high availability. Not for Deployments, StatefulSets, DaemonSets, or Helm charts."
---

# Kubernetes ReplicaSet

> Ao criar ReplicaSets, garanta que labels e selectors estejam corretamente pareados entre o controller e o template do pod.

## Rules

1. **Sempre defina `selector.matchLabels`** — o ReplicaSet precisa saber quais pods controlar, sem isso o apply falha com erro de campo required
2. **Labels do template devem corresponder ao selector** — `spec.selector.matchLabels` e `spec.template.metadata.labels` devem ter exatamente as mesmas labels, porque o ReplicaSet faz self-discovery interno via match
3. **Use `apiVersion: apps/v1`** — ReplicaSet pertence ao grupo `apps`, nao ao core API group
4. **Nunca gerencie pods individuais para replicacao** — criar `pod1.yaml`, `pod2.yaml` nao escala e nao oferece controle de acesso ou mutabilidade
5. **Defina `replicas` no nivel do ReplicaSet** — a quantidade de pods e controlada pelo controller, nao pelo pod spec
6. **Pods sao efemeros** — o ReplicaSet garante que pods deletados sejam recriados automaticamente para manter o numero desejado

## How to write

### ReplicaSet completo

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

## Example

**Before (erro comum — selector e labels ausentes):**

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: nginx
spec:
  template:
    spec:
      containers:
        - name: nginx
          image: nginx:latest
```

**After (com selector e labels corretos):**

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
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Aplicacao stateless precisa de alta disponibilidade | Use ReplicaSet (ou Deployment que cria ReplicaSet) |
| Precisa alterar numero de replicas | Edite o campo `replicas` e rode `kubectl apply` |
| Pod deletado manualmente | ReplicaSet recria automaticamente para manter o count desejado |
| Aplicacao stateful (banco de dados, Kafka) | Nao use ReplicaSet diretamente — use StatefulSet |
| Producao real | Use Deployment em vez de ReplicaSet diretamente — Deployment gerencia ReplicaSets |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Criar multiplos `pod.yaml` para replicacao | Use ReplicaSet com `replicas: N` |
| Omitir `selector.matchLabels` | Sempre defina o selector com as mesmas labels do template |
| Omitir `template.metadata.labels` | Sempre defina labels no template que correspondam ao selector |
| Usar `apiVersion: v1` para ReplicaSet | Use `apiVersion: apps/v1` |
| Gerenciar pods avulsos em producao | Use controllers (ReplicaSet, Deployment) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
