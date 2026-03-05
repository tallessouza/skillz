# Code Examples: Envoy Proxy

## Habilitando injecao automatica do Envoy (Istio sidecar)

O Envoy e injetado automaticamente como sidecar quando o namespace tem a label de injecao:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    istio-injection: enabled
```

A partir desse momento, todo Pod criado nesse namespace recebe automaticamente um container Envoy sidecar.

## Verificando o sidecar Envoy em um Pod

```bash
# Ver os containers de um Pod (deve aparecer istio-proxy)
kubectl get pod my-app-pod -o jsonpath='{.spec.containers[*].name}'
# Output: my-app istio-proxy

# Ver logs do Envoy sidecar
kubectl logs my-app-pod -c istio-proxy

# Ver configuracao do Envoy em runtime
kubectl exec my-app-pod -c istio-proxy -- pilot-agent request GET config_dump
```

## Arquitetura visual: onde o Envoy se encaixa

```
┌─────────────────────────────────────┐
│           ISTIO                     │
│                                     │
│  ┌───────────────────────────────┐  │
│  │      Control Plane (istiod)   │  │
│  │  - Configuracao               │  │
│  │  - Politicas                  │  │
│  │  - Certificados               │  │
│  └──────────┬────────────────────┘  │
│             │ configura               │
│  ┌──────────▼────────────────────┐  │
│  │       Data Plane (Envoy)      │  │
│  │                               │  │
│  │  Pod A          Pod B         │  │
│  │  ┌─────────┐   ┌─────────┐   │  │
│  │  │ App     │   │ App     │   │  │
│  │  │ Envoy ◄─┼───┼─► Envoy │   │  │
│  │  └─────────┘   └─────────┘   │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Camadas de atuacao do Envoy

```
Modelo OSI simplificado:

Camada 7 — HTTP/gRPC ──── Envoy atua aqui
Camada 6 — Apresentacao
Camada 5 — Sessao
Camada 4 — TCP ────────── Envoy atua aqui
Camada 3 — Rede (IP)
Camada 2 — Enlace
Camada 1 — Fisica
```

## VirtualService (Istio configura o Envoy via CRDs)

```yaml
# Exemplo de roteamento L7 — o Envoy executa essa regra
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: reviews-route
spec:
  hosts:
  - reviews
  http:
  - match:
    - headers:
        end-user:
          exact: jason
    route:
    - destination:
        host: reviews
        subset: v2
  - route:
    - destination:
        host: reviews
        subset: v1
```

Neste exemplo, o Envoy (configurado pelo Control Plane) roteia trafego HTTP baseado em headers — funcionalidade L7.

## DestinationRule (configurando comportamento do Envoy)

```yaml
# Circuit breaking e load balancing — executado pelo Envoy
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: reviews-cb
spec:
  host: reviews
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100    # L4 — limite de conexoes TCP
      http:
        h2UpgradePolicy: DEFAULT
        http1MaxPendingRequests: 100  # L7 — limite de requests HTTP
    outlierDetection:
      consecutive5xxErrors: 5
      interval: 30s
      baseEjectionTime: 30s
```

Este exemplo mostra o Envoy atuando em ambas as camadas simultaneamente: TCP (maxConnections) e HTTP (maxPendingRequests).