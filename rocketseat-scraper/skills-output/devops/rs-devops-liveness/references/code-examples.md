# Code Examples: Kubernetes Liveness Probe

## Exemplo 1: Liveness Probe basico (da aula)

```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 3000
  failureThreshold: 5
  successThreshold: 1
  periodSeconds: 10
  timeoutSeconds: 1
```

Campos:
- `failureThreshold: 5` — 5 falhas consecutivas antes de restartar
- `successThreshold: 1` — 1 sucesso para considerar saudavel (unico valor aceito pelo K8s)
- `periodSeconds: 10` — verifica a cada 10 segundos (circuito fechado)
- `timeoutSeconds: 1` — espera no maximo 1 segundo por resposta

## Exemplo 2: Startup Probe com initialDelaySeconds (problema do restart loop)

**Sem initialDelaySeconds (causa restart loop):**
```yaml
startupProbe:
  httpGet:
    path: /healthz
    port: 3000
  periodSeconds: 10
  failureThreshold: 3
  timeoutSeconds: 1
```

**Com initialDelaySeconds (resolve o loop):**
```yaml
startupProbe:
  httpGet:
    path: /healthz
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
  failureThreshold: 3
  timeoutSeconds: 1
```

## Exemplo 3: Deployment completo da aula (tres probes + rolling update)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  replicas: 6
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 2
      maxUnavailable: 0
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: app
          image: app:v8
          ports:
            - containerPort: 3000
          startupProbe:
            httpGet:
              path: /healthz
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
            failureThreshold: 3
            timeoutSeconds: 1
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 10
            failureThreshold: 3
            successThreshold: 1
            timeoutSeconds: 1
          livenessProbe:
            httpGet:
              path: /healthz
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 10
            failureThreshold: 5
            successThreshold: 1
            timeoutSeconds: 1
```

## Exemplo 4: Teste com failureThreshold agressivo

O instrutor reduziu de 5 para 2 para demonstrar instabilidade:

```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 10
  failureThreshold: 2    # muito agressivo para app instavel
  successThreshold: 1
  timeoutSeconds: 1
```

Resultado observado: Pods restartando frequentemente, indisponibilidade parcial, comportamento "hora funciona, hora nao funciona".

## Erro comum: successThreshold invalido

```yaml
# ERRO: Kubernetes rejeita esse valor
livenessProbe:
  successThreshold: 3
# strict decoding error: must be 1
```

```yaml
# CORRETO
livenessProbe:
  successThreshold: 1
```

## Comandos kubectl usados na aula

```bash
# Aplicar o deployment
kubectl apply -f deployment.yaml

# Verificar status dos pods
kubectl get pods

# Ver logs (mostra chamadas dos probes)
kubectl logs <pod-name>
# Output: "chequei a saude", "chequei a prontidao"

# Verificar eventos (mostra restart e probe failures)
kubectl describe pod <pod-name>
```