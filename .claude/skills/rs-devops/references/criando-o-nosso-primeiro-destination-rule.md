---
name: rs-devops-destination-rule
description: "Applies Istio Destination Rule configuration patterns when writing Kubernetes service mesh manifests. Use when user asks to 'create destination rule', 'configure subsets', 'split traffic', 'route traffic between versions', or 'setup service mesh routing'. Enforces correct subset-to-label mapping, host resolution, and DestinationRule-VirtualService binding. Make sure to use this skill whenever generating Istio routing manifests or debugging traffic splitting issues. Not for general Kubernetes deployments, Ingress configuration, or non-Istio service meshes."
---

# Destination Rule no Istio

> Destination Rules definem PARA ONDE o trafego vai e como chegar la — subsets, labels e politicas de conexao.

## Rules

1. **VirtualService define o COMO, DestinationRule define o O QUE** — VS configura split de trafego (80/20), DR define os destinos (subsets) com suas labels, porque sao responsabilidades complementares
2. **Cada subset DEVE apontar para labels DISTINTAS** — se dois subsets apontam para a mesma label, o split de trafego nao funciona na pratica, porque todo trafego vai para os mesmos pods
3. **O name do subset DEVE coincidir com a referencia no VirtualService** — subset `v1` no DR precisa ser `v1` no VS, porque e o vinculo entre as duas configuracoes
4. **Use a mesma apiVersion do VirtualService** — `networking.istio.io/v1`, porque ambos sao CRDs do Istio na mesma API group
5. **Nomeie com prefixo do tipo de recurso** — `app-service-mesh-dr` para DestinationRule, `app-service-mesh-vs` para VirtualService, porque facilita identificacao no cluster
6. **Host deve resolver para um Service valido no namespace** — use o nome curto do Service quando no mesmo namespace, FQDN quando cross-namespace

## How to write

### DestinationRule basico com subsets

```yaml
apiVersion: networking.istio.io/v1
kind: DestinationRule
metadata:
  name: app-service-mesh-dr
spec:
  host: app-service-mesh-svc
  subsets:
    - name: v1
      labels:
        app: app-service-mesh
        version: v1          # Label DISTINTA por versao
    - name: v2
      labels:
        app: app-service-mesh
        version: v2          # Label DISTINTA por versao
```

### VirtualService correspondente

```yaml
apiVersion: networking.istio.io/v1
kind: VirtualService
metadata:
  name: app-service-mesh-vs
spec:
  hosts:
    - app-service-mesh-svc
  http:
    - route:
        - destination:
            host: app-service-mesh-svc
            subset: v1        # Vinculo com DR subset name
          weight: 80
        - destination:
            host: app-service-mesh-svc
            subset: v2        # Vinculo com DR subset name
          weight: 20
```

## Example

**Before (labels iguais — split nao funciona):**
```yaml
subsets:
  - name: v1
    labels:
      app: app-service-mesh    # Mesma label!
  - name: v2
    labels:
      app: app-service-mesh    # Mesma label! Trafego vai 100% pros mesmos pods
```

**After (labels distintas — split funcional):**
```yaml
subsets:
  - name: v1
    labels:
      app: app-service-mesh
      version: v1              # Label distinta identifica pods v1
  - name: v2
    labels:
      app: app-service-mesh
      version: v2              # Label distinta identifica pods v2
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dois subsets com mesmas labels | Adicione label `version` distinta em cada subset e nos Deployments |
| Host nao resolve no Kiali | Verifique se o Service existe no mesmo namespace ou use FQDN |
| Kiali mostra DR como "NA" | Configuracao aplicada mas sem trafego ainda — nao e erro |
| Precisa de Circuit Breaker | Configure `outlierDetection` no spec do DestinationRule |
| Precisa de load balancing customizado | Configure `trafficPolicy.loadBalancer` no DestinationRule |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Subsets com labels identicas | Cada subset com label `version` unica |
| Criar DR sem VS correspondente | Sempre crie DR e VS juntos com subsets vinculados |
| Usar nome generico `dr-1` | Usar `{app}-dr` para rastreabilidade |
| Esquecer labels nos Deployments | Cada Deployment precisa da label `version` que o subset referencia |
| Aplicar split sem verificar no Kiali | Sempre valide no Kiali que o trafego esta splitado corretamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-criando-o-nosso-primeiro-destination-rule/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-criando-o-nosso-primeiro-destination-rule/references/code-examples.md)
