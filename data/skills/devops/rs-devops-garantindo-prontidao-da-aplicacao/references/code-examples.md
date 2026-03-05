# Code Examples: Kubernetes Probes

## Exemplo completo do Deployment com probes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-app-ts
  namespace: primeira-aplicacao
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-app-ts
  template:
    metadata:
      labels:
        app: api-app-ts
    spec:
      containers:
        - name: api-app-ts
          image: api-app-ts:latest
          ports:
            - containerPort: 3000
          startupProbe:
            httpGet:
              path: /health
              port: 3000
            failureThreshold: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /readyz
              port: 3000
            periodSeconds: 10
            failureThreshold: 3
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            periodSeconds: 10
            failureThreshold: 3
```

## Service com label selector

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-app-ts-svc
  namespace: primeira-aplicacao
spec:
  selector:
    app: api-app-ts
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP
```

**Ponto-chave:** O selector do Service faz match com as labels dos **pods** (definidas em `template.metadata.labels`), nao com o Deployment ou ReplicaSet.

## Comandos de verificacao

### Verificar endpoints do Service
```bash
# Lista os services no namespace
kubectl get svc -n primeira-aplicacao

# Descreve o service e mostra endpoints (IPs dos pods)
kubectl describe svc api-app-ts-svc -n primeira-aplicacao
```

A saida do `describe` mostra os **Endpoints** — que sao os IPs dos pods que passaram na readiness probe e fazem match com o selector.

### Verificar status dos pods
```bash
# Ver pods e seus IPs
kubectl get pods -n primeira-aplicacao -o wide

# Ver detalhes de um pod especifico (incluindo probe status)
kubectl describe pod <pod-name> -n primeira-aplicacao
```

## Variacao: aplicacao com bootstrap lento

```yaml
startupProbe:
  httpGet:
    path: /health
    port: 3000
  failureThreshold: 60    # 60 tentativas
  periodSeconds: 5         # a cada 5s = 5 min de tolerancia
```

## Variacao: readiness com verificacao de dependencias

Na aplicacao (Node.js/Express como exemplo):

```typescript
// /health - apenas verifica se a app esta viva
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// /readyz - verifica app + dependencias
app.get('/readyz', async (req, res) => {
  try {
    // Verifica conexao com banco
    await database.ping()
    // Verifica conexao com cache
    await redis.ping()
    res.status(200).json({ status: 'ready' })
  } catch (error) {
    res.status(503).json({ status: 'not ready', error: error.message })
  }
})
```

## Demonstracao do instrutor: quebrando o selector

O instrutor demonstrou ao vivo:

```yaml
# ANTES (correto) - selector faz match com pods
selector:
  app: api-app-ts

# ALTERADO (quebrado) - nenhum pod tem essa label
selector:
  app: api-app    # sem o "-ts"
```

Resultado do `kubectl describe svc`: **zero endpoints**. Nenhum pod encontrado. Ao corrigir de volta, os endpoints (IPs dos pods) reaparecem.

Isso ilustra que o Service resolve diretamente para pods via labels, e as probes controlam quais pods aparecem nessa lista de endpoints.