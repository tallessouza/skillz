# Code Examples: HPA Triggers

## Verificando metricas atuais dos pods

```bash
# Ver utilizacao de CPU e memoria dos pods no namespace
kubectl top pod -n primeira-aplicacao
```

Output esperado:
```
NAME                    CPU(cores)   MEMORY(bytes)
app-pod-1               45m          89Mi
app-pod-2               52m          91Mi
app-pod-3               38m          87Mi
```

## Deployment com resources completo

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
  namespace: primeira-aplicacao
spec:
  replicas: 3
  selector:
    matchLabels:
      app: minha-app
  template:
    metadata:
      labels:
        app: minha-app
    spec:
      containers:
        - name: app
          image: minha-app:latest
          resources:
            requests:
              cpu: "100m"      # 100 milicores reservados
              memory: "128Mi"  # 128Mi reservados
            limits:
              cpu: "200m"      # maximo 200 milicores (1/5 de uma vCPU)
              memory: "256Mi"  # maximo 256Mi
```

### Entendendo os valores

- `requests.cpu: 100m` = 100 milicores reservados no no para este pod
- `limits.cpu: 200m` = o pod pode usar ate 200 milicores (o dobro do request)
- Com 3 replicas: 300m reservados, ate 600m no limite
- 1000m = 1 vCPU completa

## Escala manual (o que NAO fazer em producao)

```yaml
# Alterar replicas diretamente — NAO recomendado
spec:
  replicas: 10  # mudou de 3 para 10 manualmente
```

Problemas:
1. Se feito via `kubectl edit` ou `kubectl scale`, nao fica no Git
2. Precisa lembrar de voltar para 3 quando o trafego baixar
3. Tempo entre detectar problema e aplicar mudanca = downtime

## HPA completo com CPU e memoria

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
  namespace: primeira-aplicacao
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app-deployment
  minReplicas: 3    # baseline normal
  maxReplicas: 8    # limite seguro (~2.5x baseline)
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 80  # escala quando media dos pods > 80%
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

## Fluxo de escala na pratica

```
Estado normal: 3 pods usando ~40% CPU cada
    │
    ▼ Trafego aumenta
    │
3 pods usando ~82% CPU (acima do threshold de 80%)
    │
    ▼ HPA detecta via Metrics Server
    │
HPA cria 4o pod → redistribui carga → ~62% CPU cada
    │
    ▼ Trafego continua subindo
    │
4 pods usando ~85% CPU
    │
    ▼ HPA cria 5o pod
    │
5 pods usando ~68% CPU → estabiliza
    │
    ▼ Trafego diminui gradualmente
    │
5 pods usando ~30% CPU → HPA remove pods excedentes
    │
    ▼ Volta ao minReplicas
    │
3 pods usando ~40% CPU (estado normal)
```

## Verificando status do HPA

```bash
# Ver HPAs no namespace
kubectl get hpa -n primeira-aplicacao

# Output esperado:
# NAME      REFERENCE               TARGETS           MINPODS   MAXPODS   REPLICAS
# app-hpa   Deployment/app-deploy   42%/80%, 35%/80%  3         8         3
```

## Cenario de alerta: maxReplicas atingido

```bash
# Se o HPA mostra REPLICAS = MAXPODS, investigue
kubectl get hpa -n primeira-aplicacao
# NAME      REFERENCE               TARGETS            MINPODS   MAXPODS   REPLICAS
# app-hpa   Deployment/app-deploy   95%/80%, 88%/80%   3         8         8
#                                    ^^^^ ainda acima do threshold com max replicas
```

Nesse cenario: nao aumente maxReplicas automaticamente. Investigue a causa (leak de memoria, ataque, bug, evento inesperado).