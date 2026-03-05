---
name: rs-devops-definindo-roteamento
description: "Applies Kubernetes Gateway API HTTP routing configuration when writing HTTPRoute YAML manifests. Use when user asks to 'configure gateway routes', 'create HTTPRoute', 'setup K8s routing', 'define destination rules', or 'configure service mesh routing'. Enforces correct parent refs, exact path matching, backend service references, and route hierarchy. Make sure to use this skill whenever generating Gateway API routing manifests or troubleshooting gateway 404 errors. Not for Ingress resources, Istio VirtualService CRDs, or application-level routing code."
---

# Definindo Roteamento com Gateway API

> Ao configurar roteamento no Kubernetes Gateway API, defina HTTPRoutes como filhos do Gateway, com match exato nos paths e backend refs apontando para os servicos corretos.

## Rules

1. **Crie arquivos separados para cada recurso** — `gateway.yaml` e `route.yaml` em vez de multiplos documentos YAML no mesmo arquivo, porque segregacao de responsabilidade facilita manutencao e debugging
2. **Defina parentRefs apontando para o Gateway** — o HTTPRoute eh filho do Gateway, formando a hierarquia Gateway → HTTPRoute → Service, porque sem parentRef o route fica solto e nao recebe trafego
3. **Use path type Exact para rotas especificas** — `type: Exact` garante que apenas o path exato faz match, porque prefix matching pode rotear trafego indesejado
4. **Referencie o backendRef com nome e porta do Service** — nome deve corresponder exatamente ao metadata.name do Service e a porta deve ser a porta exposta, porque mismatch resulta em 404
5. **Cada path exposto precisa de uma entrada no match** — rotas nao declaradas no HTTPRoute retornam 404 no gateway, porque o gateway so encaminha o que tem match explicito
6. **Considere se precisa de LoadBalancer ou ClusterIP** — nem sempre exposicao externa eh desejada; avalie o gatewayClassName para controlar isso

## How to write

### HTTPRoute basico com Exact match

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: app-service-mesh-route
  namespace: app
spec:
  parentRefs:
    - name: app-service-mesh-gateway  # deve corresponder ao metadata.name do Gateway
  rules:
    - matches:
        - path:
            type: Exact
            value: /healthz
      backendRefs:
        - name: service-mesh-svc      # metadata.name do Service
          port: 80                      # porta exposta pelo Service
```

### Multiplos paths no mesmo HTTPRoute

```yaml
spec:
  parentRefs:
    - name: app-service-mesh-gateway
  rules:
    - matches:
        - path:
            type: Exact
            value: /healthz
        - path:
            type: Exact
            value: /readyz
      backendRefs:
        - name: service-mesh-svc
          port: 80
```

## Example

**Before (gateway sem rota — retorna 404):**
```bash
$ curl http://<GATEWAY_IP>:80/healthz
# 404 Not Found — gateway nao tem regras de destino
```

**After (HTTPRoute aplicado):**
```bash
$ kubectl apply -f route.yaml -n app
# httproute.gateway.networking.k8s.io/app-service-mesh-route created

$ curl http://<GATEWAY_IP>:80/healthz
# 200 OK — gateway fez match exato e redirecionou ao service
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Gateway retorna 404 em todas as rotas | Verifique se HTTPRoute existe e parentRefs aponta pro Gateway correto |
| Rota existe mas da 404 da aplicacao (erro Node/app) | O match funciona mas a aplicacao nao tem aquela rota — verifique o path value |
| Precisa expor muitas rotas | Considere `type: PathPrefix` com value `/` em vez de listar cada Exact match |
| Quer trafego apenas interno | Configure gatewayClassName para ClusterIP em vez de LoadBalancer |
| Quer testar carga pelo gateway | Use `kubectl port-forward` no gateway (nao no service) para validar o fluxo completo |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Colocar HTTPRoute sem parentRefs | Sempre referencie o Gateway pai em parentRefs |
| Usar path prefix `/` sem intencao de catch-all | Use `type: Exact` com paths especificos |
| Duplicar gateway + route no mesmo arquivo YAML | Separe em arquivos distintos para clareza |
| Esquecer o namespace no apply | `kubectl apply -f route.yaml -n <namespace>` |
| Assumir que todas as rotas da app estao expostas | Apenas paths declarados no matches sao roteados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
