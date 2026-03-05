# Code Examples: Probes e Self-Healing no Kubernetes

## Exemplo 1: App sem dependencias externas

Para aplicacoes simples que nao dependem de servicos externos, as rotas de probe podem ser minimas:

```typescript
// Rota simples — app sem dependencias
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' })
})

app.get('/ready', (req, res) => {
  res.status(200).json({ status: 'ready' })
})
```

```yaml
# deployment.yaml — probes basicas
apiVersion: apps/v1
kind: Deployment
metadata:
  name: simple-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: simple-app
  template:
    metadata:
      labels:
        app: simple-app
    spec:
      containers:
        - name: simple-app
          image: simple-app:latest
          ports:
            - containerPort: 3000
          startupProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 3
            periodSeconds: 5
            failureThreshold: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
            periodSeconds: 10
            failureThreshold: 3
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            periodSeconds: 20
            failureThreshold: 3
```

## Exemplo 2: App com dependencias externas (MySQL + Kafka + Redis)

Este e o cenario que o instrutor enfatiza como mais importante:

```typescript
import { Pool } from 'mysql2/promise'
import { createClient } from 'redis'
import { Kafka } from 'kafkajs'

const db = new Pool({ host: 'mysql', database: 'app' })
const redis = createClient({ url: 'redis://redis:6379' })
const kafka = new Kafka({ brokers: ['kafka:9092'] })

// Health check que testa TODAS as dependencias
app.get('/health', async (req, res) => {
  const checks = {
    mysql: false,
    redis: false,
    kafka: false,
  }

  try {
    await db.query('SELECT 1')
    checks.mysql = true
  } catch (e) {
    // MySQL down
  }

  try {
    await redis.ping()
    checks.redis = true
  } catch (e) {
    // Redis down
  }

  try {
    const admin = kafka.admin()
    await admin.connect()
    await admin.disconnect()
    checks.kafka = true
  } catch (e) {
    // Kafka down
  }

  const allHealthy = Object.values(checks).every(Boolean)
  const status = allHealthy ? 200 : 503

  res.status(status).json({
    status: allHealthy ? 'healthy' : 'unhealthy',
    checks,
  })
})

// Readiness pode testar apenas dependencias criticas para trafego
app.get('/ready', async (req, res) => {
  try {
    await db.query('SELECT 1')
    await redis.ping()
    res.status(200).json({ status: 'ready' })
  } catch (error) {
    res.status(503).json({ status: 'not ready' })
  }
})
```

## Exemplo 3: Configuracao de probes para app com bootstrap lento

Quando a aplicacao demora para subir (conexoes com banco, warmup de cache):

```yaml
startupProbe:
  httpGet:
    path: /health
    port: 3000
  # Espera 10s antes de comecar a testar
  initialDelaySeconds: 10
  # Testa a cada 10s
  periodSeconds: 10
  # Tolera 30 falhas = 10 + (30 * 10) = 310s maximo para bootstrap
  failureThreshold: 30

readinessProbe:
  httpGet:
    path: /ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 10
  # 3 falhas = remove do service
  failureThreshold: 3
  # 1 sucesso = volta ao service
  successThreshold: 1

livenessProbe:
  httpGet:
    path: /health
    port: 3000
  # So comeca apos Startup Probe passar
  initialDelaySeconds: 0
  periodSeconds: 20
  # 3 falhas = restart do container (self-healing)
  failureThreshold: 3
```

## Exemplo 4: Fluxo completo do ciclo de vida

```
Container criado
    │
    ▼
Startup Probe inicia (apos initialDelaySeconds)
    │
    ├── Falha → conta failureThreshold
    │   ├── Threshold nao atingido → tenta novamente (apos periodSeconds)
    │   └── Threshold atingido → Container reiniciado
    │
    └── Sucesso → Startup Probe desativada
            │
            ▼
      Readiness Probe inicia
            │
            ├── Falha → Pod removido do Service (sem trafego)
            │   └── Proximo check: tenta novamente
            │
            └── Sucesso → Pod adicionado ao Service (recebe trafego)
                    │
                    ▼
              Liveness Probe inicia (continua)
                    │
                    ├── Falha → conta failureThreshold
                    │   ├── Threshold nao atingido → tenta novamente
                    │   └── Threshold atingido → RESTART (self-healing)
                    │       └── Volta ao inicio (Startup Probe)
                    │
                    └── Sucesso → Tudo ok, proximo check em periodSeconds
```