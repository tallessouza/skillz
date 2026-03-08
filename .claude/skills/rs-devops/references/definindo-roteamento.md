---
name: rs-devops-definindo-roteamento
description: "Applies Kubernetes Gateway API HTTPRoute configuration patterns. Use when user asks to 'configure Gateway API routing', 'create HTTPRoute', 'setup parentRefs for gateway', or 'define backendRefs'. Enforces separate files for Gateway and HTTPRoute, Exact path matching, correct parentRefs hierarchy, and namespace-aware applies. Make sure to use this skill whenever generating Gateway API HTTPRoute or Gateway manifests. Not for Istio VirtualService routing (use definindo-regras-de-roteamento) or Ingress resources."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: service-mesh-gateway-api
  tags: [kubernetes, gateway-api, httproute, routing, backendref, parentref]
---

# Definindo Roteamento com Gateway API

> Ao configurar roteamento no Kubernetes Gateway API, defina HTTPRoutes como filhos do Gateway, com match exato nos paths e backend refs apontando para os servicos corretos.

## Rules

1. **Crie arquivos separados para cada recurso** — `gateway.yaml` e `route.yaml`
2. **Defina parentRefs apontando para o Gateway** — formando a hierarquia Gateway, HTTPRoute, Service
3. **Use path type Exact para rotas especificas** — evita trafego indesejado
4. **Referencie o backendRef com nome e porta do Service** — mismatch resulta em 404
5. **Cada path exposto precisa de uma entrada no match** — rotas nao declaradas retornam 404

## How to write

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: app-service-mesh-route
  namespace: app
spec:
  parentRefs:
    - name: app-service-mesh-gateway
  rules:
    - matches:
        - path:
            type: Exact
            value: /healthz
      backendRefs:
        - name: service-mesh-svc
          port: 80
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| HTTPRoute sem parentRefs | Sempre referencie o Gateway pai |
| Path prefix `/` sem intencao de catch-all | Use `type: Exact` com paths especificos |
| Duplicar gateway + route no mesmo arquivo | Separe em arquivos distintos |
| Esquecer namespace no apply | `kubectl apply -f route.yaml -n <namespace>` |

## Troubleshooting

### HTTPRoute retorna 404 para paths validos
**Symptom:** Requests para paths configurados retornam 404 Not Found
**Cause:** backendRef name ou port nao corresponde ao Service real no namespace
**Fix:** Verificar que o `name` e `port` no backendRef batem exatamente com o Service existente no mesmo namespace

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
