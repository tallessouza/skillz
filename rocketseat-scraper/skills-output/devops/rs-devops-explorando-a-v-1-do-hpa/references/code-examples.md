# Code Examples: Kubernetes HPA v1

## Manifesto HPA v1 completo e funcional

```yaml
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: appts-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: appts
  minReplicas: 3
  maxReplicas: 8
  targetCPUUtilizationPercentage: 75
```

## Manifesto com erro — targetMemoryUtilizationPercentage na v1

```yaml
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: appts-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: appts
  minReplicas: 3
  maxReplicas: 8
  targetCPUUtilizationPercentage: 75
  targetMemoryUtilizationPercentage: 75  # Este campo NAO EXISTE na v1
```

**Erro retornado pelo kubectl:**
```
error: error validating "k8s/hpa.yaml": error validating data: 
ValidationError(HorizontalPodAutoscaler.spec): unknown field "targetMemoryUtilizationPercentage" 
in io.k8s.api.autoscaling.v1.HorizontalPodAutoscalerSpec
```

## Deployment relacionado (referencia do scaleTargetRef)

O deployment que o HPA referencia deve ter `imagePullPolicy: IfNotPresent` para otimizar scale-up:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: appts
spec:
  replicas: 3
  selector:
    matchLabels:
      app: appts
  template:
    spec:
      containers:
        - name: appts
          image: minha-imagem:1.0.0
          imagePullPolicy: IfNotPresent  # Importante para HPA
          resources:
            requests:
              cpu: "250m"
            limits:
              cpu: "500m"
```

## Comandos kubectl para gerenciar HPA

### Aplicar o manifesto
```bash
kubectl apply -f k8s/hpa.yaml -n primeira-aplicacao
```

### Verificar status do HPA
```bash
kubectl get hpa -n primeira-aplicacao
```

**Output esperado:**
```
NAME        REFERENCE           TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
appts-hpa   Deployment/appts   0%/75%    3         8         3          1m
```

Campos do output:
- **TARGETS:** `0%/75%` = uso atual (0%) / target definido (75%)
- **MINPODS:** minimo de replicas (3)
- **MAXPODS:** maximo de replicas (8)
- **REPLICAS:** quantidade atual rodando (3)

### Deletar HPA por nome
```bash
kubectl delete hpa appts-hpa -n primeira-aplicacao
```

### Deletar HPA por arquivo
```bash
kubectl delete -f k8s/hpa.yaml -n primeira-aplicacao
```

### Verificar que foi deletado
```bash
kubectl get hpa -n primeira-aplicacao
# Nenhum recurso retornado
```

## Variacoes de configuracao

### Aplicacao com bootstrap rapido (< 5s)
```yaml
targetCPUUtilizationPercentage: 80  # Pode ser um pouco mais alto
```

### Aplicacao com bootstrap lento (> 30s)
```yaml
targetCPUUtilizationPercentage: 70  # Mais margem para compensar tempo de startup
```

### Aplicacao critica com picos imprevisíveis
```yaml
minReplicas: 5
maxReplicas: 20
targetCPUUtilizationPercentage: 70
```