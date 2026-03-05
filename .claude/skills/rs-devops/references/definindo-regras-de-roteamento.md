---
name: rs-devops-definindo-regras-de-roteamento
description: "Applies Istio Virtual Service routing rules when configuring traffic management in Kubernetes service mesh. Use when user asks to 'route traffic', 'rewrite URL', 'configure virtual service', 'set load balancing', or 'split traffic between versions'. Covers URI match/rewrite, subset routing, traffic policy, and load balancer algorithms in Destination Rules. Make sure to use this skill whenever working with Istio routing or service mesh traffic configuration. Not for application-level routing, ingress controllers without Istio, or fault injection."
---

# Regras de Roteamento no Istio Virtual Service

> Configure roteamento inteligente na malha de servico sem alterar a aplicacao — todo controle fica no Virtual Service e Destination Rule.

## Rules

1. **Use URI match com prefix para redirecionar trafego** — `prefix: "/teste"` com `rewrite` para outra URI, porque permite padronizacao de rotas sem mexer na aplicacao
2. **Respeite a hierarquia de rotas no Virtual Service** — rotas mais especificas (com match) devem vir antes das rotas genericas, porque o Istio respeita ordem de precedencia top-down
3. **Configure subset no destination para controlar versao** — `subset: v2` dentro de `destination`, porque permite direcionar trafego especifico para versoes diferentes
4. **Defina traffic policy no Destination Rule, nao no Virtual Service** — load balancer algorithm fica em `trafficPolicy`, porque e responsabilidade do Destination Rule
5. **Subset traffic policy tem precedencia sobre spec-level** — configuracao dentro do subset sobrescreve a configuracao global do host, porque Istio aplica a mais especifica
6. **Mantenha consistencia de trafego para usuarios** — em cenarios de split, um usuario que caiu na V2 deve continuar na V2, porque inconsistencia quebra experiencia (requer sticky sessions/hash)

## How to write

### URI Match com Rewrite

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app-service-mesh
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
metadata:
  name: app-service-mesh
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

## Example

**Before (trafego sem controle de rota):**
```yaml
http:
  - route:
      - destination:
          host: app.default.svc.cluster.local
          subset: v1
        weight: 80
      - destination:
          host: app.default.svc.cluster.local
          subset: v2
        weight: 20
```

**After (roteamento inteligente por URI):**
```yaml
http:
  - match:
      - uri:
          prefix: "/teste"
    rewrite:
      uri: "/healthz"
    route:
      - destination:
          host: app.default.svc.cluster.local
          subset: v2
  - route:
      - destination:
          host: app.default.svc.cluster.local
          subset: v1
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Padronizar URLs sem alterar app | Use match + rewrite no Virtual Service |
| Multiplas URLs para mesmo destino | Adicione multiplos prefixes no mesmo match |
| Algoritmo de balanceamento por versao | Configure trafficPolicy dentro do subset no Destination Rule |
| Algoritmo de balanceamento global | Configure trafficPolicy no nivel da spec do Destination Rule |
| Deploy canario com split de trafego | Use weight nos destinations, libere gradualmente (10%, 20%, 30%) |
| Precisa reverter deploy canario | Redirecione 100% do weight para V1 |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Colocar `subset` fora de `destination` | `subset` deve estar dentro de `destination` (erro YAML comum) |
| Configurar load balancer no Virtual Service | Configure `trafficPolicy.loadBalancer` no Destination Rule |
| Rota generica antes de rota com match | Rota com match primeiro, generica por ultimo (hierarquia) |
| Split de trafego sem considerar sticky session | Implemente consistent hash para manter usuario na mesma versao |
| Alterar rotas na aplicacao para padronizacao | Use rewrite no Virtual Service — app nao precisa saber |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-definindo-regras-de-roteamento/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-definindo-regras-de-roteamento/references/code-examples.md)
