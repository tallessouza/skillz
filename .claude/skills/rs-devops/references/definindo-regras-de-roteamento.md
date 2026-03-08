---
name: rs-devops-definindo-regras-de-roteamento
description: "Applies Istio VirtualService and DestinationRule routing configuration patterns. Use when user asks to 'configure Istio routing', 'setup URI rewrite', 'configure load balancer in service mesh', or 'route traffic by subset'. Enforces URI match ordering, subset-based destinations, and traffic policy placement in DestinationRule. Make sure to use this skill whenever generating Istio VirtualService or DestinationRule manifests. Not for Kubernetes Gateway API routing (use definindo-roteamento) or application-level routing."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: service-mesh-istio
  tags: [istio, virtual-service, destination-rule, routing, load-balancer, service-mesh, subset]
---

# Regras de Roteamento no Istio Virtual Service

> Configure roteamento inteligente na malha de servico sem alterar a aplicacao — todo controle fica no Virtual Service e Destination Rule.

## Rules

1. **Use URI match com prefix para redirecionar trafego** — `prefix: "/teste"` com `rewrite`
2. **Rotas mais especificas antes das genericas** — Istio respeita ordem top-down
3. **Configure subset no destination para controlar versao**
4. **Defina traffic policy no Destination Rule, nao no Virtual Service**
5. **Subset traffic policy tem precedencia sobre spec-level**

## How to write

### URI Match com Rewrite

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
spec:
  hosts:
    - app-service-mesh
  http:
    - name: app-service-mesh-v2
      match:
        - uri:
            prefix: "/teste"
      rewrite:
        uri: "/healthz"
      route:
        - destination:
            host: app-service-mesh.default.svc.cluster.local
            subset: v2
    - name: web-service-mesh-v1
      route:
        - destination:
            host: app-service-mesh.default.svc.cluster.local
            subset: v1
```

### Load Balancer no Destination Rule

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
spec:
  host: app-service-mesh.default.svc.cluster.local
  trafficPolicy:
    loadBalancer:
      simple: RANDOM
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
      trafficPolicy:
        loadBalancer:
          simple: LEAST_CONN
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Colocar `subset` fora de `destination` | `subset` dentro de `destination` |
| Configurar load balancer no Virtual Service | Configure no Destination Rule |
| Rota generica antes de rota com match | Rota com match primeiro |
| Alterar rotas na aplicacao para padronizacao | Use rewrite no Virtual Service |

## Troubleshooting

### Trafego nao chega no subset esperado
**Symptom:** Requisicoes vao sempre para v1 mesmo com match configurado para v2
**Cause:** Rota generica (sem match) esta declarada antes da rota com match — Istio usa ordem top-down
**Fix:** Mover a rota com `match` para antes da rota generica no bloco `http`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
