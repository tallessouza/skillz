---
name: rs-devops-entendendo-o-recreate
description: "Applies Kubernetes deployment strategy selection between Recreate and RollingUpdate. Use when user asks to 'choose deployment strategy', 'configure Recreate strategy', 'understand RollingUpdate vs Recreate', or 'deploy without downtime'. Enforces RollingUpdate as default for user-facing services, Recreate only for fault-tolerant workloads, and removal of incompatible fields when switching strategies. Make sure to use this skill whenever choosing or configuring Kubernetes deployment strategies. Not for canary deployments (use entendendo-e-configurando-o-canary-deployment) or blue-green."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-deploy-strategies
  tags: [kubernetes, deployment, recreate, rolling-update, strategy, zero-downtime, canary]
---

# Estrategia Recreate no Kubernetes

> Ao configurar deployments Kubernetes, escolha a estrategia de deploy baseado na tolerancia a indisponibilidade do servico.

## Rules

1. **Nunca use Recreate para servicos user-facing** — causa downtime total
2. **Rolling Update e o default por um motivo** — garante zero-downtime
3. **Recreate so para workloads tolerantes a indisponibilidade** — cronjobs, consumers de fila
4. **Deployment puro so suporta duas estrategias** — RollingUpdate e Recreate
5. **Ao trocar estrategia, remova campos incompativeis** — `maxSurge` so existe em RollingUpdate

## How to write

### Recreate
```yaml
spec:
  strategy:
    type: Recreate
```

### Rolling Update (preferir)
```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
```

## Heuristics

| Situacao | Estrategia |
|----------|-----------|
| API REST / GraphQL | RollingUpdate (maxUnavailable: 0) |
| Consumer de fila (SQS) | Recreate e aceitavel |
| CronJob / batch worker | Recreate e aceitavel |
| Deploy gradual (10%, 20%) | Canary (requer Argo Rollouts) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `type: Recreate` em API de producao | `type: RollingUpdate` com `maxUnavailable: 0` |
| `maxSurge`/`maxUnavailable` com Recreate | Remover bloco `rollingUpdate` |
| Assumir que K8s puro faz canary | Usar Argo Rollouts, Istio ou Flagger |

## Troubleshooting

### Erro "unknown field maxSurge" apos trocar para Recreate
**Symptom:** `kubectl apply` falha com campo desconhecido no spec.strategy
**Cause:** Campos `maxSurge` e `maxUnavailable` so existem em RollingUpdate, nao em Recreate
**Fix:** Remover o bloco `rollingUpdate` inteiro ao mudar `type` para `Recreate`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
