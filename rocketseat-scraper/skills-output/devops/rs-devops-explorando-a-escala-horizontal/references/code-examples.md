# Code Examples: Escala Horizontal no Kubernetes

## 1. Deployment base com replicas e resource requests

O HPA precisa de resource requests definidos para calcular utilizacao percentual.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deployment
  labels:
    app: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: api:latest
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: "250m"
              memory: "256Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
```

**Por que 3 replicas?** Ja e o principio da horizontalidade — tres pods distribuindo carga desde o inicio, com redundancia imediata (1 falha = 66% disponivel).

## 2. HPA com target de CPU

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-deployment
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 80
```

**Comportamento:** Quando a media de CPU dos pods ultrapassa 80%, o HPA cria novos pods. Quando cai abaixo, faz downscale ate minReplicas.

## 3. HPA com CPU e memoria combinados

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-deployment
  minReplicas: 3
  maxReplicas: 15
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 80
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 75
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
        - type: Pods
          value: 2
          periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Pods
          value: 1
          periodSeconds: 120
```

**Behavior section:** Controla a velocidade do scaling — scale up rapido (2 pods por minuto), scale down conservador (1 pod a cada 2 min, com janela de estabilizacao de 5 min).

## 4. Escala manual via kubectl

```bash
# Escala manual — funciona mas nao e sustentavel no mundo real
kubectl scale deployment api-deployment --replicas=8

# Verificar pods apos escala
kubectl get pods -l app=api

# Ver status do HPA
kubectl get hpa api-hpa

# Detalhes do HPA (metricas atuais vs targets)
kubectl describe hpa api-hpa
```

## 5. Calculo de redundancia

```
Pods totais: 5
Pod com falha: 1
Disponibilidade: (5 - 1) / 5 = 80%

Pods totais: 10
Pod com falha: 1
Disponibilidade: (10 - 1) / 10 = 90%

# Quanto mais pods, menor o impacto percentual de cada falha
```

## 6. KEDA — ScaledObject para Kafka (exemplo conceitual)

```yaml
# KEDA NAO e built-in — precisa instalar no cluster
# helm install keda kedacore/keda --namespace keda --create-namespace

apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: consumer-scaler
spec:
  scaleTargetRef:
    name: consumer-deployment
  minReplicaCount: 1
  maxReplicaCount: 20
  triggers:
    - type: kafka
      metadata:
        bootstrapServers: kafka:9092
        consumerGroup: my-group
        topic: events
        lagThreshold: "50"  # Scale quando lag > 50 mensagens
```

## 7. Verificando se Metrics Server esta instalado

```bash
# Metrics Server e pre-requisito para HPA funcionar
kubectl top pods
kubectl top nodes

# Se retornar erro, instalar:
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```