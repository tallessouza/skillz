---
name: rs-devops-entendendo-o-recreate
description: "Applies Kubernetes Recreate deployment strategy knowledge when writing or reviewing K8s manifests. Use when user asks to 'deploy to kubernetes', 'change deployment strategy', 'configure k8s deployment', 'write a deployment yaml', or 'avoid downtime'. Warns against Recreate for user-facing services and recommends alternatives. Make sure to use this skill whenever generating Kubernetes Deployment manifests or discussing deployment strategies. Not for Docker Compose, Helm chart authoring, or CI/CD pipeline configuration."
---

# Estrategia Recreate no Kubernetes

> Ao configurar deployments Kubernetes, escolha a estrategia de deploy baseado na tolerancia a indisponibilidade do servico.

## Rules

1. **Nunca use Recreate para servicos user-facing** — APIs, frontends, e qualquer servico que responde diretamente a clientes, porque Recreate mata TODOS os pods antes de subir os novos, causando downtime total
2. **Rolling Update e o default por um motivo** — o Kubernetes usa `RollingUpdate` como estrategia padrao do Deployment porque garante zero-downtime, so mude se tiver razao explicita
3. **Recreate so para workloads tolerantes a indisponibilidade** — cronjobs, consumidores de fila, workers de background que podem ficar offline temporariamente
4. **Deployment puro so suporta duas estrategias** — `RollingUpdate` e `Recreate`. Para blue-green ou canary, precisa de frameworks adicionais (Argo Rollouts, Istio, Flagger)
5. **Ao trocar estrategia, remova campos incompativeis** — `maxSurge` e `maxUnavailable` so existem em `RollingUpdate`, nao funcionam com `Recreate`

## Como configurar

### Recreate

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-worker
spec:
  replicas: 3
  strategy:
    type: Recreate
    # Nao aceita rollingUpdate config aqui
  template:
    # ...
```

### Rolling Update (default — preferir)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-api
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    # ...
```

## Example

**Before (erro comum — Recreate em API):**
```yaml
kind: Deployment
metadata:
  name: api-gateway
spec:
  replicas: 5
  strategy:
    type: Recreate  # ERRADO: vai derrubar todas as 5 replicas de uma vez
```

**After (corrigido):**
```yaml
kind: Deployment
metadata:
  name: api-gateway
spec:
  replicas: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0  # Zero downtime
```

## Heuristics

| Situacao | Estrategia |
|----------|-----------|
| API REST / GraphQL | RollingUpdate (maxUnavailable: 0) |
| Frontend / SSR | RollingUpdate |
| Consumer de fila (SQS, RabbitMQ) | Recreate e aceitavel |
| CronJob / batch worker | Recreate e aceitavel |
| Precisa de deploy gradual (10%, 20%...) | Canary (requer Argo Rollouts ou similar) |
| Precisa de duas versoes simultaneas | Blue-Green (requer framework adicional) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `type: Recreate` em API de producao | `type: RollingUpdate` com `maxUnavailable: 0` |
| Deixar `maxSurge`/`maxUnavailable` com `Recreate` | Remover bloco `rollingUpdate` ao usar `Recreate` |
| Assumir que K8s puro faz canary | Usar Argo Rollouts, Istio ou Flagger para canary |
| Usar Recreate "porque e mais simples" | Rolling Update e o default e igualmente simples |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-entendendo-o-recreate/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-entendendo-o-recreate/references/code-examples.md)
