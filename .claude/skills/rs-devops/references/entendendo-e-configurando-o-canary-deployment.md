---
name: rs-devops-canary-deployment-istio
description: "Applies Canary Deployment patterns using Istio service mesh on Kubernetes. Use when user asks to 'configure canary deployment', 'gradual rollout', 'traffic splitting', 'AB testing with Istio', 'sticky sessions Kubernetes', or 'consistent hash routing'. Covers VirtualService weight-based routing, DestinationRule ConsistentHash, and query parameter matching for AB tests. Make sure to use this skill whenever configuring Istio traffic management for safe deployments. Not for CI/CD pipeline setup, Argo Rollouts, Flagger, or non-Istio service meshes."
---

# Canary Deployment com Istio

> Configure deploys graduais e seguros usando VirtualService weights, ConsistentHash sticky sessions e match-based AB testing no Istio.

## Rules

1. **Entenda as 4 estrategias antes de escolher** — Rolling Update, Recreate, Blue-Green e Canary servem contextos diferentes, porque escolher errado causa downtime ou risco desnecessario
2. **Use ConsistentHash para sticky sessions** — usuario que bateu na V1 deve continuar na V1, porque mudanca aleatoria entre versoes causa experiencia inconsistente e bugs em breaking changes
3. **Nunca deixe carry param na mao do cliente** — use cookie ou header para controlar trafego, porque query parameters sao facilmente manipulaveis
4. **Canary nao e o motivo para adotar Istio** — Istio resolve outros problemas (mTLS, observabilidade), para canary puro considere Argo Rollouts ou Flagger
5. **Monitore error rate e AppDex durante canary** — se saturacao aparecer, volte a V2 para 0% imediatamente, porque o valor do canary e o rollback com impacto minimo

## How to write

### Weight-based Canary (VirtualService)

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

### Sticky Session com ConsistentHash (DestinationRule)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
spec:
  trafficPolicy:
    loadBalancer:
      consistentHash:
        httpQueryParameterName: "test"
        # Alternativas:
        # httpCookie:
        #   name: "session-id"
        #   ttl: 0s
        # httpHeaderName: "x-user-id"
        # useSourceIp: true
```

### Match-based AB Testing (sem peso)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
spec:
  http:
    - name: app-service-mesh-v2
      match:
        - queryParams:
            testeAB:
              exact: "true"
      route:
        - destination:
            host: app-service-mesh
            subset: v2
    - name: app-service-mesh-v1
      route:
        - destination:
            host: app-service-mesh
            subset: v1
```

## Example

**Before (rolling update basico sem controle):**
```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
```

**After (canary com controle de trafego e sticky session):**
```yaml
# VirtualService com peso gradual
http:
  - route:
      - destination:
          subset: v1
        weight: 95
      - destination:
          subset: v2
        weight: 5

# DestinationRule com ConsistentHash
trafficPolicy:
  loadBalancer:
    consistentHash:
      httpCookie:
        name: "session-id"
        ttl: 0s
```

## Heuristics

| Situacao | Faca |
|----------|------|
| App sincrona com usuario conectado | Canary com sticky session (ConsistentHash) |
| Job assincrono sem conexao direta | Recreate pode ser suficiente |
| Precisa testar antes de receber trafego | Blue-Green (0% ate promocao) |
| Deploy simples sem breaking changes | Rolling Update padrao |
| Teste AB com duas versoes | Match-based routing por header/cookie |
| Ferramenta dedicada para canary | Argo Rollouts ou Flagger, nao Istio |

## Anti-patterns

| Nunca faca | Faca instead |
|------------|--------------|
| Canary sem sticky session em breaking changes | Configure ConsistentHash no DestinationRule |
| Controle de trafego via query param em producao | Use cookie ou header HTTP |
| Adotar Istio so para canary deployment | Use Argo Rollouts ou Flagger para canary puro |
| Ignorar metricas durante canary | Monitore error rate e AppDex, rollback se saturar |
| Teste de carga com multiplas threads para validar sticky session | Teste via chamada entre servicos dentro do cluster |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-entendendo-e-configurando-o-canary-deployment/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-entendendo-e-configurando-o-canary-deployment/references/code-examples.md)
