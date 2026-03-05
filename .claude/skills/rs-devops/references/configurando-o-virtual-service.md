---
name: rs-devops-configurando-o-virtual-service
description: "Applies Istio Virtual Service configuration patterns when writing Kubernetes manifests for service mesh routing. Use when user asks to 'configure virtual service', 'split traffic', 'canary deployment with istio', 'route traffic between versions', or 'service mesh routing'. Enforces correct apiVersion, host resolution, subset references, and weight-based traffic shaping. Make sure to use this skill whenever generating Istio VirtualService manifests or configuring traffic splitting in Kubernetes. Not for Kubernetes Service objects, Ingress, or Gateway API resources."
---

# Configurando o Virtual Service (Istio)

> Ao criar um VirtualService, defina regras de roteamento inteligente na camada de infraestrutura, sem alterar a aplicacao.

## Rules

1. **Use apiVersion networking.istio.io/v1** — nao use v1alpha3, porque v1 ja e estavel e v1alpha3 e legado
2. **VirtualService nao substitui o Service do Kubernetes** — ambos coexistem, porque o Service resolve o DNS e o VirtualService adiciona regras de roteamento acima dele
3. **O campo hosts deve referenciar o nome do Service Kubernetes** — use o nome curto (ex: `app-service-mesh`) ou FQDN (`app-service-mesh.namespace.svc.cluster.local`), porque o VirtualService precisa encontrar o Service real
4. **Subsets exigem DestinationRule** — nunca declare subset sem ter o DestinationRule correspondente, porque o Kiali/Istio reportara "subset not found"
5. **Weights devem somar 100** — ao fazer traffic splitting, os pesos de todos os destinations devem totalizar 100, porque representam porcentagem do trafego
6. **Subset names nao tem relacao direta com image tags** — `v1` no subset nao significa tag `v1` do container, porque a associacao e feita via labels no DestinationRule

## How to write

### VirtualService basico com traffic splitting

```yaml
apiVersion: networking.istio.io/v1
kind: VirtualService
metadata:
  name: app-service-mesh-routes
spec:
  hosts:
    - app-service-mesh
  http:
    - route:
        - destination:
            host: app-service-mesh
            subset: v1
          weight: 80
        - destination:
            host: app-service-mesh
            subset: v2
          weight: 20
```

### VirtualService simples (single destination)

```yaml
apiVersion: networking.istio.io/v1
kind: VirtualService
metadata:
  name: app-service-mesh-routes
spec:
  hosts:
    - app-service-mesh
  http:
    - route:
        - destination:
            host: app-service-mesh
```

## Example

**Before (erro comum — subset sem DestinationRule):**
```yaml
apiVersion: networking.istio.io/v1
kind: VirtualService
metadata:
  name: my-app-vs
spec:
  hosts:
    - my-app
  http:
    - route:
        - destination:
            host: my-app
            subset: v1  # DestinationRule nao existe → Kiali alerta "subset not found"
          weight: 80
        - destination:
            host: my-app
            subset: v2  # Mesmo problema
          weight: 20
```

**After (VirtualService + DestinationRule correspondente):**
```yaml
# virtualservice.yaml
apiVersion: networking.istio.io/v1
kind: VirtualService
metadata:
  name: my-app-vs
spec:
  hosts:
    - my-app
  http:
    - route:
        - destination:
            host: my-app
            subset: v1
          weight: 80
        - destination:
            host: my-app
            subset: v2
          weight: 20
---
# destinationrule.yaml (obrigatorio para subsets)
apiVersion: networking.istio.io/v1
kind: DestinationRule
metadata:
  name: my-app-dr
spec:
  host: my-app
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Canary deployment (nova versao gradual) | Traffic split: 90/10 → 80/20 → 50/50 → 100 |
| Teste A/B | Traffic split com subsets por versao |
| Rewrite de rotas (ex: /a → /b) | Use `http.match` + `http.rewrite` no VirtualService |
| Timeout/retry | Configure no VirtualService em vez da aplicacao |
| Precisa de subset | Crie o DestinationRule ANTES de aplicar o VirtualService |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `apiVersion: networking.istio.io/v1alpha3` | `apiVersion: networking.istio.io/v1` |
| Declarar subset sem DestinationRule | Criar DestinationRule com os subsets correspondentes |
| Weights que nao somam 100 | Garantir que todos os weights totalizem 100 |
| Assumir que subset name = container image tag | Definir labels no DestinationRule que mapeiam para os pods |
| Remover o Service K8s ao criar VirtualService | Manter ambos — VirtualService opera acima do Service |
| Colocar logica de retry/timeout na aplicacao | Abstrair para o VirtualService (camada de infra) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-configurando-o-virtual-service/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-configurando-o-virtual-service/references/code-examples.md)
