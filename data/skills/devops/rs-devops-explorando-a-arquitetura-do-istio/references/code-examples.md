# Code Examples: Arquitetura do Istio

## Estrutura de manifesto Istio vs Kubernetes

O ponto central da aula e que Istio e um CRD. Na pratica, isso se traduz em manifestos muito similares.

### Manifesto Kubernetes padrao

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  namespace: default
spec:
  replicas: 2
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: my-app:1.0
          ports:
            - containerPort: 8080
```

### Manifesto Istio (mesmo padrao YAML, API diferente)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: my-app-routing
  namespace: default
spec:
  hosts:
    - my-app
  http:
    - route:
        - destination:
            host: my-app
            port:
              number: 8080
```

Note: mesma estrutura (`apiVersion`, `kind`, `metadata`, `spec`), mas a API e `networking.istio.io` — a extensao CRD do Istio.

## Gateway Istio

```yaml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: my-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
    - port:
        number: 80
        name: http
        protocol: HTTP
      hosts:
        - "*.example.com"
```

## DestinationRule (politicas de trafego)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: my-app-destination
spec:
  host: my-app
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
    loadBalancer:
      simple: ROUND_ROBIN
```

## Instalacao do Istio com addons

```bash
# Instalacao basica do Istio
istioctl install --set profile=demo -y

# Habilitar injecao automatica de sidecar no namespace
kubectl label namespace default istio-injection=enabled

# Instalar addons (Kiali, Jaeger, Prometheus, Grafana)
kubectl apply -f samples/addons/

# Verificar instalacao
kubectl get pods -n istio-system
```

## Verificar CRDs do Istio instalados

```bash
# Listar todos os CRDs que o Istio registrou no cluster
kubectl get crds | grep istio

# Output esperado (exemplos):
# virtualservices.networking.istio.io
# destinationrules.networking.istio.io
# gateways.networking.istio.io
# serviceentries.networking.istio.io
# sidecars.networking.istio.io
```

## Multi-tenant: multiplas instalacoes no mesmo cluster

```bash
# Instalar Istio em namespace dedicado para time A
istioctl install --set values.global.istioNamespace=istio-system-team-a

# Instalar Istio em namespace dedicado para time B
istioctl install --set values.global.istioNamespace=istio-system-team-b
```

## Sidecar mode vs Ambient mode na instalacao

```bash
# Sidecar mode (padrao)
istioctl install --set profile=default

# Ambient mode
istioctl install --set profile=ambient
```