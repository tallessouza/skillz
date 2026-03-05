# Code Examples: Destination Rule no Istio

## Exemplo 1: DestinationRule Basico (da aula)

Este e o manifesto criado durante a aula. Note que ele tem um problema intencional (labels iguais):

```yaml
# k8s/destinationRule.yaml
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
    - name: v2
      labels:
        app: app-service-mesh
```

**Problema:** Ambos subsets apontam para mesmas labels. O split 80/20 do VS nao tera efeito real.

## Exemplo 2: DestinationRule Corrigido (com labels distintas)

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
        version: v1
    - name: v2
      labels:
        app: app-service-mesh
        version: v2
```

## Exemplo 3: VirtualService Correspondente (da aula anterior)

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
            subset: v1
          weight: 80
        - destination:
            host: app-service-mesh-svc
            subset: v2
          weight: 20
```

## Exemplo 4: Deployments com Labels de Versao

Para que os subsets funcionem, os Deployments precisam das labels correspondentes:

```yaml
# Deployment v1
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-service-mesh-v1
spec:
  template:
    metadata:
      labels:
        app: app-service-mesh
        version: v1           # Label que o subset v1 vai encontrar
    spec:
      containers:
        - name: app
          image: app:1.0.0

---
# Deployment v2
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-service-mesh-v2
spec:
  template:
    metadata:
      labels:
        app: app-service-mesh
        version: v2           # Label que o subset v2 vai encontrar
    spec:
      containers:
        - name: app
          image: app:2.0.0
```

## Exemplo 5: DestinationRule com Traffic Policy

```yaml
apiVersion: networking.istio.io/v1
kind: DestinationRule
metadata:
  name: app-service-mesh-dr
spec:
  host: app-service-mesh-svc
  trafficPolicy:
    loadBalancer:
      simple: LEAST_CONN
    outlierDetection:
      consecutive5xxErrors: 5
      interval: 30s
      baseEjectionTime: 30s
  subsets:
    - name: v1
      labels:
        app: app-service-mesh
        version: v1
    - name: v2
      labels:
        app: app-service-mesh
        version: v2
```

## Comando: Aplicar o DestinationRule

```bash
kubectl apply -f k8s/destinationRule.yaml
```

## Comando: Verificar CRDs do Istio no cluster

```bash
kubectl get destinationrules
# ou
kubectl get dr
```

## Comando: Verificar todos os recursos Istio

```bash
kubectl get virtualservices,destinationrules
```