# Code Examples: Waypoint e Virtual Service no Ambient Mode

## 1. Verificando GatewayClasses disponiveis

```bash
kubectl get gatewayclasses
# NAME              CONTROLLER                    AGE
# istio             istio.io/gateway-controller    2d
# istio-remote      istio.io/gateway-controller    2d
# istio-waypoint    istio.io/gateway-controller    2d
```

## 2. Verificando servicos no namespace

```bash
kubectl get svc -n app
# NAME                              TYPE        CLUSTER-IP       PORT(S)
# app-service-mesh-gateway-istio    ClusterIP   10.96.x.x        80/TCP
# app-service-mesh-svc              ClusterIP   10.96.x.x        80/TCP
# waypoint                          ClusterIP   10.96.x.x        15021/TCP,15008/TCP
```

## 3. Criando Waypoint via istioctl

```bash
# Criar waypoint no namespace app
istioctl waypoint apply --namespace app

# Output: waypoint app/waypoint applied
```

## 4. Criando Waypoint via YAML declarativo

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: waypoint
  namespace: app
spec:
  gatewayClassName: istio-waypoint
  listeners:
    - name: mesh
      port: 15008
      protocol: HBONE
```

```bash
kubectl apply -f waypoint.yaml
```

## 5. Labelando namespace para usar Waypoint

```bash
kubectl label namespace app istio.io/use-waypoint=waypoint
# namespace/app labeled
```

## 6. Gateway de ingress (para comparacao)

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: app-service-mesh-gateway
  namespace: app
spec:
  gatewayClassName: istio  # Diferente do waypoint!
  listeners:
    - name: http
      port: 80
      protocol: HTTP
```

## 7. HTTPRoute com rotas exatas

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: app-routes
  namespace: app
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
        - name: app-service-mesh-svc
          port: 80
```

## 8. HTTPRoute com path prefix (catch-all)

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: app-routes
  namespace: app
spec:
  parentRefs:
    - name: app-service-mesh-gateway
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /
      backendRefs:
        - name: app-service-mesh-svc
          port: 80
```

## 9. Virtual Service com teste A/B via header

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app-vs
  namespace: app
spec:
  hosts:
    - app-service-mesh-svc.app.svc.cluster.local
  http:
    # Regra 1: Se header teste-ab=true, manda para v2
    - match:
        - headers:
            teste-ab:
              exact: "true"  # Sempre string
      route:
        - destination:
            host: app-service-mesh-svc
            subset: v2
    # Regra 2: Default vai para v1
    - route:
        - destination:
            host: app-service-mesh-svc
            subset: v1
```

## 10. Destination Rule com subsets

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: app-dr
  namespace: app
spec:
  host: app-service-mesh-svc
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
```

## 11. Teste de carga com Fortio

```bash
# Teste direto no servico (requer Waypoint para respeitar VS)
kubectl run fortio --rm -it --image=fortio/fortio -- \
  load -qps 500 -t 30s http://app-service-mesh-svc/healthz

# Teste via gateway de ingress
kubectl run fortio --rm -it --image=fortio/fortio -- \
  load -qps 500 -t 30s http://app-service-mesh-gateway-istio/healthz
```

## 12. Comparacao: Gateway Ingress vs Waypoint

```yaml
# INGRESS GATEWAY (trafego externo → cluster)
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: app-gateway
spec:
  gatewayClassName: istio        # <-- istio
  listeners:
    - port: 80
      protocol: HTTP             # <-- HTTP
---
# WAYPOINT (interceptacao interna do namespace)
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: waypoint
spec:
  gatewayClassName: istio-waypoint  # <-- istio-waypoint
  listeners:
    - port: 15008
      protocol: HBONE               # <-- HBONE
```