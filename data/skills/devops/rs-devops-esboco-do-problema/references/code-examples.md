# Code Examples: Esboço do Problema — Kubernetes

## 1. Deployment basico com 3 replicas e recursos declarados

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-a
spec:
  replicas: 3
  selector:
    matchLabels:
      app: app-a
  template:
    metadata:
      labels:
        app: app-a
    spec:
      containers:
        - name: app-a
          image: app-a:latest
          resources:
            requests:
              memory: "1Gi"
              cpu: "1000m"
            limits:
              memory: "1Gi"
              cpu: "1000m"
```

**Calculo de recursos totais:**
- 3 replicas x 1Gi = 3Gi RAM total
- 3 replicas x 1000m = 3000m (3 vCPUs) total

## 2. Deployment da App B com recursos menores

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-b
spec:
  replicas: 2
  selector:
    matchLabels:
      app: app-b
  template:
    metadata:
      labels:
        app: app-b
    spec:
      containers:
        - name: app-b
          image: app-b:latest
          resources:
            requests:
              memory: "512Mi"
              cpu: "500m"      # 0.5 vCPU
            limits:
              memory: "512Mi"
              cpu: "500m"
```

**Calculo:**
- 2 replicas x 512Mi = 1Gi RAM total
- 2 replicas x 500m = 1000m (1 vCPU) total

## 3. HPA para App A (escala de 3 a 8 por memoria)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-a-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app-a
  minReplicas: 3
  maxReplicas: 8
  metrics:
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 70
```

**Comportamento:**
1. Comeca com 3 pods
2. Se media de uso de memoria > 70% → cria pod adicional
3. Escala ate maximo de 8
4. Quando uso cai < 70% → remove pods ate minimo de 3

## 4. HPA para App B (escala de 2 a 5)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-b-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app-b
  minReplicas: 2
  maxReplicas: 5
  metrics:
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 70
```

## 5. Cenario completo: duas apps no mesmo cluster

```yaml
# Total de recursos no cluster (minimo):
# App A: 3 pods x (1Gi + 1000m) = 3Gi + 3000m
# App B: 2 pods x (512Mi + 500m) = 1Gi + 1000m
# TOTAL MINIMO: 4Gi RAM + 4000m CPU
#
# Total de recursos no cluster (maximo com HPA):
# App A: 8 pods x (1Gi + 1000m) = 8Gi + 8000m
# App B: 5 pods x (512Mi + 500m) = 2.5Gi + 2500m
# TOTAL MAXIMO: 10.5Gi RAM + 10500m CPU
```

## 6. Padrao stateless — desacoplando estado

```yaml
# ERRADO: app salvando logs e assets localmente
# Cada pod tem dados diferentes → inconsistencia

# CORRETO: desacoplar para servicos externos
# Logs → exporter para Prometheus/Grafana
# Assets → S3/Blob Storage
# Sessao → Redis/banco externo

# Exemplo de variáveis de ambiente para desacoplamento
env:
  - name: LOG_EXPORTER
    value: "prometheus"
  - name: ASSET_STORAGE
    value: "s3://my-bucket/assets"
  - name: SESSION_STORE
    value: "redis://redis-service:6379"
```

## 7. Conversao de unidades de CPU

```
# Millicores para vCPU:
# 1000m = 1 vCPU
# 500m  = 0.5 vCPU
# 250m  = 0.25 vCPU
# 100m  = 0.1 vCPU

# No YAML do Kubernetes, ambas as formas sao validas:
cpu: "1000m"   # millicores (explicito)
cpu: "1"       # vCPU inteiro
cpu: "0.5"     # meio vCPU
cpu: "500m"    # equivalente a 0.5
```