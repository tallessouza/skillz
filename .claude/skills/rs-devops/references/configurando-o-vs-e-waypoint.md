---
name: rs-devops-configurando-o-vs-e-waypoint
description: "Applies Istio Ambient Mode Waypoint configuration for advanced traffic routing without sidecars. Use when user asks to 'configure waypoint', 'setup ambient mode routing', 'fix virtual service not working in ambient', 'istio traffic management without sidecar', or 'route traffic with waypoint'. Ensures correct GatewayClass, labeling, and Virtual Service behavior in ambient mesh. Make sure to use this skill whenever configuring Istio service mesh in Ambient Mode. Not for sidecar-based Istio setups, ingress gateway configuration, or general Kubernetes networking."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: istio-ambient-mode
  tags: [istio, waypoint, ambient-mode, virtual-service, kubernetes, service-mesh, hbone]
---

# Waypoint e Virtual Service no Ambient Mode

> No Ambient Mode do Istio, o Waypoint substitui o sidecar como interceptador de trafego, sendo obrigatorio para que Virtual Services e Destination Rules funcionem.

## Rules

1. **Waypoint e obrigatorio no Ambient Mode** — sem sidecar proxy, o Virtual Service e Destination Rule sao ignorados ate que um Waypoint esteja configurado e labelado no namespace, porque nao ha proxy local para interceptar requisicoes
2. **Labele o namespace apos criar o Waypoint** — `istio.io/use-waypoint=waypoint` no namespace, porque sem essa label o trafego nao passa pelo Waypoint
3. **GatewayClassName deve ser istio-waypoint** — nao `istio`, porque `istio` e para gateways de ingress, `istio-waypoint` e para interceptacao interna
4. **Protocolo HBONE na porta 15008** — o Waypoint usa protocolo HBONE (Envoy/Istio interno), nao HTTP, porque ele intercepta trafego interno do mesh
5. **Waypoint nao e ponto de acesso** — ele nao responde a chamadas externas (retorna 404/empty), porque funciona apenas como interceptador transparente dentro do namespace
6. **Um Waypoint por namespace** — cada namespace precisa do seu proprio Waypoint configurado e labelado independentemente

## How to write

### Waypoint declarativo (YAML)

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: waypoint
  namespace: app
spec:
  gatewayClassName: istio-waypoint  # NAO usar 'istio'
  listeners:
    - name: mesh
      port: 15008
      protocol: HBONE  # Protocolo interno Envoy/Istio
```

### Label no namespace

```bash
kubectl label namespace app istio.io/use-waypoint=waypoint
```

### Virtual Service com roteamento condicional

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app-vs
  namespace: app
spec:
  hosts:
    - app-service-mesh-svc  # nome do servico (mesmo namespace)
  http:
    - match:
        - headers:
            teste-ab:
              exact: "true"  # headers sempre string
      route:
        - destination:
            host: app-service-mesh-svc
            subset: v2
    - route:
        - destination:
            host: app-service-mesh-svc
            subset: v1
```

## Example

**Before (Ambient Mode sem Waypoint — Virtual Service ignorado):**
```bash
# Teste de carga direto no servico
kubectl run fortio --image=fortio/fortio -- load -qps 500 -t 30s http://app-service-mesh-svc/healthz

# Resultado: trafego dividido 50/50 entre v1 e v2
# Virtual Service e completamente ignorado
# Kiali nao registra metricas
```

**After (com Waypoint configurado):**
```bash
# 1. Criar waypoint
istioctl waypoint apply --namespace app
# Ou aplicar o YAML declarativo

# 2. Labeler namespace
kubectl label namespace app istio.io/use-waypoint=waypoint

# 3. Mesmo teste de carga
kubectl run fortio --image=fortio/fortio -- load -qps 500 -t 30s http://app-service-mesh-svc/healthz

# Resultado: 100% do trafego vai para v1 (respeitando Virtual Service)
# Kiali registra metricas corretamente
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Virtual Service ignorado no Ambient Mode | Verificar se Waypoint existe e namespace esta labelado |
| Kiali nao mostra metricas | Confirmar que trafego passa pelo Waypoint (nao direto no servico) |
| Trafego dividido igualmente ignorando regras | Sintoma classico de Waypoint ausente |
| Precisa de Circuit Breaker/Fault Injection no Ambient | Tambem requer Waypoint para funcionar |
| Gateway de ingress vs Waypoint | Ingress usa `gatewayClassName: istio`, Waypoint usa `istio-waypoint` |
| HTTPRoute com path exact vs prefix | `exact: /healthz` para rota especifica, `pathPrefix: /` para catch-all |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `gatewayClassName: istio` no Waypoint | `gatewayClassName: istio-waypoint` |
| `protocol: HTTP` no Waypoint listener | `protocol: HBONE` na porta 15008 |
| Tentar acessar Waypoint como endpoint | Waypoint e transparente, chame o servico normalmente |
| Criar Virtual Service sem Waypoint no Ambient | Primeiro configure Waypoint, depois Virtual Service |
| Esquecer label no namespace | `kubectl label namespace <ns> istio.io/use-waypoint=waypoint` |
| Criar Waypoint sem manifesto declarativo | Use `istioctl` para debug, mas mantenha YAML no repo |

## Troubleshooting

### Virtual Service ignorado no Ambient Mode
**Symptom:** Trafego dividido igualmente entre versoes, ignorando regras do VirtualService
**Cause:** Waypoint nao esta configurado ou namespace nao esta labelado com `istio.io/use-waypoint`
**Fix:** Crie o Waypoint com `istioctl waypoint apply --namespace <ns>` e labele o namespace com `kubectl label namespace <ns> istio.io/use-waypoint=waypoint`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
