# Code Examples: Fault Injection com Istio

## Estrutura completa do VirtualService com Delay

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app-virtual-service
  namespace: default
spec:
  hosts:
    - app-service-mesh.svc.cluster.local
  http:
    - fault:
        delay:
          fixedDelay: 1s
          percentage:
            value: 20
      route:
        - destination:
            host: app-service-mesh.svc.cluster.local
            subset: v1
```

## Estrutura completa do VirtualService com Abort

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app-virtual-service
  namespace: default
spec:
  hosts:
    - app-service-mesh.svc.cluster.local
  http:
    - fault:
        abort:
          httpStatus: 504
          percentage:
            value: 20
      route:
        - destination:
            host: app-service-mesh.svc.cluster.local
            subset: v1
```

## DestinationRule correspondente (subsets)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: app-destination-rule
  namespace: default
spec:
  host: app-service-mesh.svc.cluster.local
  trafficPolicy:
    loadBalancer:
      simple: LEAST_CONN
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
```

## Comandos de teste com Fortio

### Rodar teste de carga basico

```bash
# 500 requisicoes por segundo, 10 segundos, 10 threads
kubectl exec -it fortio-pod -- fortio load \
  -qps 500 \
  -t 10s \
  -c 10 \
  http://app-service-mesh.svc.cluster.local/
```

### Aplicar configuracao

```bash
kubectl apply -f virtual-service.yaml
```

### Verificar configuracao aplicada

```bash
# Ver rotas e fault injection no VirtualService
istioctl analyze
kubectl get virtualservice app-virtual-service -o yaml
```

### Verificar logs quando abort causa crash

```bash
# Ver logs do pod que esta crashando
kubectl logs <pod-name> -c istio-proxy
kubectl logs <pod-name> -c <app-container>
```

## Variacoes de percentual testadas

### Conservador (5%)

```yaml
fault:
  delay:
    fixedDelay: 1s
    percentage:
      value: 5
```

Resultado: ~1.66 QPS, ~1800 requests em 10s. Impacto reduzido mas presente.

### Moderado (20%)

```yaml
fault:
  delay:
    fixedDelay: 1s
    percentage:
      value: 20
```

Resultado: 45 QPS. Impacto severo.

### Extremo (20% com 5s)

```yaml
fault:
  delay:
    fixedDelay: 5s
    percentage:
      value: 20
```

Resultado: Timeout total. Sistema inoperante.

## Combinando delay e abort (avancado)

```yaml
http:
  - fault:
      delay:
        fixedDelay: 500ms
        percentage:
          value: 10
      abort:
        httpStatus: 503
        percentage:
          value: 5
    route:
      - destination:
          host: app-service-mesh.svc.cluster.local
          subset: v1
```

## Fault injection por rota especifica

```yaml
http:
  - match:
      - uri:
          prefix: /api/orders
    fault:
      delay:
        fixedDelay: 2s
        percentage:
          value: 30
    route:
      - destination:
          host: orders-service.svc.cluster.local
          subset: v1
  - route:
      - destination:
          host: orders-service.svc.cluster.local
          subset: v1
```

Neste exemplo, apenas requisicoes para `/api/orders` recebem o delay. Demais rotas funcionam normalmente.