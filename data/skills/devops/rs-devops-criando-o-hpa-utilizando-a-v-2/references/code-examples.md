# Code Examples: HPA v2

## Manifesto completo usado na aula

### hpa.yaml (v2)
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app
  minReplicas: 3
  maxReplicas: 8
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 75
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

## Deployment com requests ajustado

Apos o HPA escalar desnecessariamente por causa de memoria subdimensionada, o instrutor ajustou o Deployment:

```yaml
# Antes (subdimensionado)
resources:
  requests:
    memory: 64Mi
  limits:
    memory: 128Mi

# Depois (ajustado)
resources:
  requests:
    memory: 128Mi
  limits:
    memory: 192Mi
```

## Comandos usados na aula

### Aplicar o HPA
```bash
kubectl apply -f k8s/hpa.yaml -n primeira-aplicacao
```

### Verificar estado do HPA
```bash
kubectl get hpa -n primeira-aplicacao
```
Saida esperada mostra colunas: TARGETS (cpu/memory), MINPODS, MAXPODS, REPLICAS, AGE

### Verificar consumo real dos pods
```bash
kubectl top pod -n primeira-aplicacao
```

### Aplicar alteracao no Deployment
```bash
kubectl apply -f k8s/deployment.yaml -n primeira-aplicacao
```

### Monitorar pods em tempo real
```bash
watch kubectl get po -n primeira-aplicacao
```

## Variacao: HPA somente com CPU

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

## Variacao: HPA somente com memoria

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app
  minReplicas: 3
  maxReplicas: 6
  metrics:
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

## Debugging: verificar eventos do HPA

```bash
kubectl describe hpa app-hpa -n primeira-aplicacao
```

Eventos tipicos:
```
Events:
  Type    Reason             Age   Message
  ----    ------             ----  -------
  Normal  SuccessfulRescale  5m    New size: 5; reason: memory resource utilization above target
  Normal  SuccessfulRescale  3m    New size: 8; reason: memory resource utilization above target
```

## Fluxo de troubleshooting

```bash
# 1. Ver estado atual do HPA
kubectl get hpa -n primeira-aplicacao

# 2. Se targets estao altos, verificar consumo real
kubectl top pod -n primeira-aplicacao

# 3. Se consumo real e alto vs requests, ajustar Deployment
kubectl edit deployment app -n primeira-aplicacao
# Ou editar o arquivo e aplicar:
kubectl apply -f k8s/deployment.yaml -n primeira-aplicacao

# 4. Monitorar se HPA reage
watch kubectl get hpa -n primeira-aplicacao
```