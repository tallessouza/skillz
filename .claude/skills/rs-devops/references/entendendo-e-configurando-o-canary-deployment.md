---
name: rs-devops-entendendo-e-configurando-o-canary-deployment
description: "Applies canary deployment patterns using Istio VirtualService weights, ConsistentHash sticky sessions, and match-based AB testing. Use when user asks to 'configure canary deployment', 'setup weighted routing in Istio', 'implement sticky sessions', or 'AB test with Istio'. Enforces weight-based gradual rollout, ConsistentHash for session affinity, cookie/header over query params, and monitoring during canary. Make sure to use this skill whenever implementing canary deployments or weighted traffic routing with Istio. Not for rolling update strategy (use entendendo-o-recreate) or Argo Rollouts."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: service-mesh-istio
  tags: [istio, canary, deployment, weighted-routing, sticky-session, ab-testing, consistent-hash]
---

# Canary Deployment com Istio

> Configure deploys graduais e seguros usando VirtualService weights, ConsistentHash sticky sessions e match-based AB testing no Istio.

## Rules

1. **Entenda as 4 estrategias** — Rolling Update, Recreate, Blue-Green e Canary
2. **Use ConsistentHash para sticky sessions** — usuario que bateu na V1 deve continuar na V1
3. **Nunca deixe carry param na mao do cliente** — use cookie ou header
4. **Canary nao e o motivo para adotar Istio** — para canary puro considere Argo Rollouts ou Flagger
5. **Monitore error rate e AppDex durante canary**

## How to write

### Weight-based Canary

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
spec:
  http:
    - route:
        - destination:
            host: app-service-mesh
            subset: v1
          weight: 95
        - destination:
            host: app-service-mesh
            subset: v2
          weight: 5
```

### Sticky Session com ConsistentHash

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
spec:
  trafficPolicy:
    loadBalancer:
      consistentHash:
        httpCookie:
          name: "session-id"
          ttl: 0s
```

### Match-based AB Testing

```yaml
spec:
  http:
    - match:
        - queryParams:
            testeAB:
              exact: "true"
      route:
        - destination:
            subset: v2
    - route:
        - destination:
            subset: v1
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Canary sem sticky session em breaking changes | Configure ConsistentHash |
| Controle via query param em producao | Use cookie ou header |
| Adotar Istio so para canary | Use Argo Rollouts ou Flagger |
| Ignorar metricas durante canary | Monitore error rate e AppDex |

## Troubleshooting

### Usuarios recebem versoes diferentes a cada request durante canary
**Symptom:** Mesmo usuario alterna entre v1 e v2 a cada requisicao
**Cause:** Falta ConsistentHash configurado no DestinationRule para sticky sessions
**Fix:** Adicionar `consistentHash` com `httpCookie` no `trafficPolicy` do DestinationRule

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
