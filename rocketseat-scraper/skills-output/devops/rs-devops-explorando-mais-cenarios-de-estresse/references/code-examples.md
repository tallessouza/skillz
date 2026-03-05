# Code Examples: Explorando Cenarios de Estresse

## Aplicacao Node.js com processo pesado (writeStream)

### Codigo da aplicacao

```javascript
import { createWriteStream } from 'fs'

// Dentro do handler da rota
const file = createWriteStream('rocketseat.txt')

for (let x = 0; x <= 10000; x++) {
  file.write(`Linha ${x}\n`)
}

file.end()
```

**Por que isso consome CPU**: cada requisicao executa 10.000 escritas sincronas. Sob carga (6.000 QPS), multiplas requisicoes competem por CPU simultaneamente.

## Workflow completo: build, push e deploy

### 1. Build da imagem Docker

```bash
docker build -t danielrodrigues/pts:v5 .
```

### 2. Push para o container registry

```bash
docker push danielrodrigues/pts:v5
```

### 3. Atualizar a tag no deployment e aplicar

```bash
kubectl apply -f k8s/deployment.yaml -n minha-aplicacao
```

O rolling update substitui as replicas gradualmente conforme a estrategia configurada.

## Monitoramento durante o teste

### Verificar consumo de recursos por pod

```bash
kubectl top pods -n minha-aplicacao
```

Saida tipica durante estresse:
```
NAME                      CPU(cores)   MEMORY(bytes)
app-abc123-1              190m         45Mi
app-abc123-2              195m         42Mi
app-abc123-3              188m         48Mi
```

### Modo watch para observar em tempo real

```bash
watch kubectl top pods -n minha-aplicacao
```

### Verificar estado do HPA

```bash
kubectl get hpa -n minha-aplicacao
```

Saida mostra replicas atuais, minimo, maximo e metricas:
```
NAME      REFERENCE            TARGETS   MINPODS   MAXPODS   REPLICAS
app-hpa   Deployment/app-dep   0%/70%    3         8         3
```

## Teste de estresse com Fortio

```bash
# 6000 QPS, 50 threads, 2 minutos
fortio load -qps 6000 -c 50 -t 2m http://app-service/rota
```

### Resultados comparativos

**App simples (retorna string):**
```
Code 200 : ~500.000 requisicoes
QPS: ~4.000-5.000
Latencia media: 12ms
```

**App com writeStream (processo pesado):**
```
Code 200 : ~10.000 requisicoes
QPS: ~80
Latencia media: 617ms
```

## Deployment YAML — antes e depois do ajuste

### Antes (valores iniciais)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: app
          image: danielrodrigues/pts:v5
          resources:
            requests:
              cpu: "200m"
              memory: "128Mi"
            limits:
              cpu: "200m"
              memory: "256Mi"
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
spec:
  minReplicas: 3
  maxReplicas: 8
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

### Depois (ajustado com dados do teste)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  replicas: 6    # baseline ajustado
  template:
    spec:
      containers:
        - name: app
          image: danielrodrigues/pts:v5
          resources:
            requests:
              cpu: "400m"       # dobrou — CPU era gargalo
              memory: "128Mi"   # manteve — nao era gargalo
            limits:
              cpu: "700m"       # headroom maior
              memory: "256Mi"
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
spec:
  minReplicas: 6    # baseline real
  maxReplicas: 10   # mais headroom
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

## Observando o decaimento do HPA

```bash
# Apos o teste, executar periodicamente:
kubectl get hpa -n minha-aplicacao

# Sequencia observada:
# t+0min:  REPLICAS=8 (maximo, pos-teste)
# t+2min:  REPLICAS=7
# t+4min:  REPLICAS=6
# t+6min:  REPLICAS=5
# t+10min: REPLICAS=3 (minimo restaurado)
```

Para ajustar a velocidade de decaimento:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
spec:
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 60   # padrao e 300 (5min)
      policies:
        - type: Percent
          value: 50
          periodSeconds: 60
```