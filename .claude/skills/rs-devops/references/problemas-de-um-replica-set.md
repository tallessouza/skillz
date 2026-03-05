---
name: rs-devops-problemas-de-um-replica-set
description: "Enforces correct Kubernetes deployment practices by warning against direct ReplicaSet usage for application updates. Use when user asks to 'deploy to kubernetes', 'update container image', 'change tag in k8s', 'rollback deployment', or 'manage replicas'. Explains why ReplicaSet alone causes downtime on image tag changes and guides toward Deployment objects. Make sure to use this skill whenever generating Kubernetes manifests that involve ReplicaSets directly. Not for Docker Compose, Helm chart templating, or non-Kubernetes container orchestration."
---

# Problemas de um ReplicaSet

> ReplicaSet controla replicas, nao implantacao — nunca use ReplicaSet diretamente para gerenciar atualizacoes de imagem.

## Rules

1. **Nunca use ReplicaSet diretamente para deploys** — use Deployment, porque ReplicaSet nao suporta troca de tag de imagem sem deletar e recriar o objeto
2. **Nunca use tag `latest` em producao** — use tags associadas ao hash do commit, porque `latest` e imprevisivel e impede rollback confiavel
3. **Prefira zero downtime deployment** — use Deployment (que gerencia ReplicaSet internamente), porque deletar e recriar ReplicaSet causa indisponibilidade de 30-40s dependendo da aplicacao
4. **Entenda que `kubectl apply` em ReplicaSet nao atualiza pods existentes** — o ReplicaSet e um controlador de replicas, nao de implantacao; ele so garante o numero de pods, nao a versao da imagem

## Como funciona o problema

### Tag muda, pods nao atualizam

```yaml
# replicaset.yaml - voce muda a tag aqui...
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    spec:
      containers:
      - name: nginx
        image: nginx:1.27-alpine-slim  # mudou de alpine3.20-slim
```

```bash
# kubectl apply aceita, mas pods continuam com a tag antiga
kubectl apply -f replicaset.yaml
# "configured" — mas pods NAO foram recriados

# Unica opcao com ReplicaSet puro:
kubectl delete rs nginx
kubectl apply -f replicaset.yaml
# Funciona, mas causa INDISPONIBILIDADE total
```

## Example

**Before (ReplicaSet direto — causa downtime):**
```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: user-skillz
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-skillz
  template:
    spec:
      containers:
      - name: user-skillz
        image: user-skillz:abc123f
```

**After (Deployment — zero downtime):**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-skillz
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-skillz
  template:
    spec:
      containers:
      - name: user-skillz
        image: user-skillz:abc123f
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa trocar tag de imagem | Use Deployment, nunca ReplicaSet direto |
| Precisa controlar numero de replicas | Deployment faz isso via ReplicaSet interno |
| Precisa de rollback rapido | Deployment tem `kubectl rollout undo` |
| Precisa de zero downtime | Deployment com rolling update strategy |
| Estudando ReplicaSet para entender K8s | OK usar direto, mas nunca em producao |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `kind: ReplicaSet` para deploys de producao | `kind: Deployment` |
| `image: nginx:latest` | `image: nginx:1.27-alpine-slim` ou tag do commit |
| Deletar e recriar ReplicaSet para trocar tag | `kubectl set image deployment/name container=image:newtag` |
| Deploy manual em janelas de baixo acesso | Rolling update via Deployment (zero downtime) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-problemas-de-um-replica-set/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-problemas-de-um-replica-set/references/code-examples.md)
