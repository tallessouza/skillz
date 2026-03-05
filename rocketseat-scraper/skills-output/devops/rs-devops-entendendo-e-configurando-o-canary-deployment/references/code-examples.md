# Code Examples: Canary Deployment com Istio

## Deployment com Rolling Update (baseline)

```yaml
apiVersion: apps/v1
kind: Deployment
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  replicas: 4
```

## DestinationRule com dois subsets

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: app-service-mesh
spec:
  host: app-service-mesh
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
```

## VirtualService com peso 50/50

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
spec:
  hosts:
    - app-service-mesh
  http:
    - route:
        - destination:
            host: app-service-mesh
            subset: v1
          weight: 50
        - destination:
            host: app-service-mesh
            subset: v2
          weight: 50
```

## DestinationRule com ConsistentHash (sticky session)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: app-service-mesh
spec:
  host: app-service-mesh
  trafficPolicy:
    loadBalancer:
      consistentHash:
        httpQueryParameterName: "test"
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
```

### Variantes de ConsistentHash

```yaml
# Via cookie (recomendado para producao)
consistentHash:
  httpCookie:
    name: "session-id"
    ttl: 0s

# Via header HTTP
consistentHash:
  httpHeaderName: "x-user-id"

# Via IP de origem
consistentHash:
  useSourceIp: true
```

## VirtualService com match para AB Testing

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
spec:
  hosts:
    - app-service-mesh
  http:
    - name: app-service-mesh-v2
      match:
        - queryParams:
            testeAB:
              exact: "true"   # Sempre string, nao boolean
      route:
        - destination:
            host: app-service-mesh
            subset: v2
    - name: app-service-mesh-v1
      route:
        - destination:
            host: app-service-mesh
            subset: v1
```

**Ponto critico:** `queryParams` sempre recebe valores como string. Passar `true` sem aspas nao funciona.

## Testes com Fortio

### Teste sem parametro (deve bater so na V1)

```bash
# Sem query param — trafego vai 100% para V1
kubectl exec fortio-pod -- fortio load \
  -c 1 -n 5000 \
  http://app-service-mesh:8080/
```

### Teste com query param AB (deve bater so na V2)

```bash
# Com testeAB=true — trafego vai 100% para V2
kubectl exec fortio-pod -- fortio load \
  -c 1 -n 5000 \
  "http://app-service-mesh:8080/?testeAB=true"
```

### Nota sobre threads
Testes com multiplas threads (`-c 10`) nao validam bem sticky session porque cada thread cria conexao independente. Use `-c 1` ou valide via chamadas inter-servico.

## Progressao tipica de Canary

```yaml
# Dia 1: 5% canary
weight: 95  # v1
weight: 5   # v2

# Dia 2: metricas OK, aumenta
weight: 80  # v1
weight: 20  # v2

# Dia 3: confianca alta
weight: 50  # v1
weight: 50  # v2

# Dia 4: promocao
weight: 0   # v1
weight: 100 # v2
```

## Rollback imediato

```yaml
# Se error rate subir durante canary:
weight: 100  # v1
weight: 0    # v2
```