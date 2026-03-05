# Code Examples: Kubernetes Startup Probe

## Rotas de health na aplicacao (Node.js)

As rotas que a probe vai checar devem existir na aplicacao:

```javascript
// Rota de health (para startupProbe)
app.get('/healthz', (req, res) => {
  console.log('Chequei a saúde da aplicação')
  return res.status(200).send()
})

// Rota de readiness (para readinessProbe)
app.get('/readyz', (req, res) => {
  console.log('Chequei a prontidão da aplicação')
  return res.status(200).send()
})
```

## Manifesto completo do Deployment com startupProbe

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  replicas: 6
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
          image: app:v6
          ports:
            - containerPort: 3000
          startupProbe:
            httpGet:
              path: /healthz
              port: 3000
            failureThreshold: 3
            successThreshold: 1
            timeoutSeconds: 1
            periodSeconds: 10
```

## Cenario de erro: rota inexistente

Se a imagem nao tem a rota `/healthz`:

```yaml
# ERRADO: imagem v5 nao tem /healthz
containers:
  - name: app
    image: app:v5  # <-- nao tem as rotas de health
    startupProbe:
      httpGet:
        path: /healthz  # <-- vai retornar 404
        port: 3000
      failureThreshold: 3
      successThreshold: 1
      timeoutSeconds: 1
      periodSeconds: 10
```

Resultado nos eventos do Kubernetes:

```
Warning  Unhealthy  startup probe failed: HTTP probe failed with status code 404
```

O container entra em loop de restart infinito. A correcao e usar a imagem correta:

```yaml
# CORRETO: imagem v6 tem /healthz e /readyz
containers:
  - name: app
    image: app:v6  # <-- tem as rotas de health
    startupProbe:
      httpGet:
        path: /healthz  # <-- vai retornar 200
        port: 3000
```

## Aplicando o manifesto

```bash
# Aplicar o deployment
kubectl apply -f deployment.yaml

# Acompanhar o status dos pods
kubectl get pods -w

# Ver eventos (para diagnosticar falhas de probe)
kubectl describe pod <pod-name>

# Ver logs do container
kubectl logs <pod-name>
```

## Variacao: aplicacao com startup lento (Java/Spring Boot)

```yaml
startupProbe:
  httpGet:
    path: /healthz
    port: 8080
  failureThreshold: 30    # Tolera mais falhas (startup lento)
  successThreshold: 1
  timeoutSeconds: 5        # Mais tempo por tentativa
  periodSeconds: 10
  # Total: ate 30 * 10 = 300 segundos (5 min) para subir
```

## Variacao: probe com TCP em vez de HTTP

```yaml
# Para aplicacoes que nao tem endpoint HTTP de health
startupProbe:
  tcpSocket:
    port: 3000
  failureThreshold: 3
  successThreshold: 1
  timeoutSeconds: 1
  periodSeconds: 10
```

## Build e push da imagem (fluxo completo)

```bash
# Build da nova versao com as rotas de health
docker build -t app:v6 .

# Push para o registry
docker push app:v6

# Atualizar o manifesto e aplicar
kubectl apply -f deployment.yaml
```