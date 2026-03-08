---
name: rs-devops-o-que-sao-probes-e-self-healing
description: "Applies Kubernetes probe patterns when configuring application health checks and self-healing. Use when user asks to 'configure health checks', 'add probes', 'setup self-healing', 'configure startup probe', 'readiness probe', or 'liveness probe'. Enforces all three probes with dependency-aware health endpoints. Make sure to use this skill whenever deploying applications to Kubernetes. Not for application logic, CI/CD pipelines, or Docker-only deployments."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-probes
  tags: [kubernetes, probes, startup, readiness, liveness, self-healing, health-check]
---

# Probes e Self-Healing no Kubernetes

> Toda aplicacao em Kubernetes deve ter probes configuradas que validem nao apenas a aplicacao, mas tambem suas dependencias externas.

## Key concept

Probes sao sondagens de verificacao que o Kubernetes executa para entender o estado da aplicacao. Existem exatamente tres probes, cada uma com um papel distinto no ciclo de vida do container. O self-healing e o mecanismo automatico do Kubernetes que reage quando uma probe falha — via de regra, reiniciando o container.

## Rules

1. **Sempre configure as tres probes** — Startup, Readiness e Liveness, porque sem elas o Kubernetes nao tem visibilidade do estado real da aplicacao
2. **Rotas de probe devem testar dependencias externas** — se a app depende de MySQL, Kafka, Redis, a rota de health deve verificar conexao com todos, porque a app pode estar ok mas as dependencias nao
3. **Startup Probe executa primeiro** — valida que o container subiu e completou o bootstrap, porque apps com banco, mensageria e cache demoram mais para inicializar
4. **Readiness Probe vem em seguida** — valida que a app esta pronta para receber trafego, porque subir nao significa estar pronta
5. **Liveness Probe monitora continuamente** — verifica de tempos em tempos se a app esta viva, porque degradacao pode ocorrer apos o startup
6. **Startup e Liveness podem compartilhar rota** — use a mesma rota de `/health` para ambos, mas Readiness pode ter rota separada `/ready` dependendo da arquitetura

## Decision framework

| Situacao | Probe | Acao |
|----------|-------|------|
| App com bootstrap lento (DB, Kafka, cache) | Startup | Aumentar `initialDelaySeconds` e `failureThreshold` |
| App pronta mas dependencia externa caiu | Readiness | Rota `/ready` testa conexao com dependencias |
| App rodando mas degradou com o tempo | Liveness | Rota `/health` retorna status, Kubernetes reinicia se falhar |
| App sem dependencias externas | Todas | Rotas simples que retornam 200, mas ainda configure as tres |
| Liveness falha repetidamente | Self-healing | Kubernetes reinicia o container automaticamente |

## How to configure

### Rotas na aplicacao

```typescript
// Rota de health (usada por Startup e Liveness)
// Testa a app E suas dependencias externas
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1')       // testa MySQL/Postgres
    await redis.ping()                // testa Redis
    await kafka.admin().connect()     // testa Kafka
    res.status(200).json({ status: 'healthy' })
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message })
  }
})

// Rota de readiness (prontidao para receber trafego)
app.get('/ready', async (req, res) => {
  try {
    await db.query('SELECT 1')
    await redis.ping()
    res.status(200).json({ status: 'ready' })
  } catch (error) {
    res.status(503).json({ status: 'not ready', error: error.message })
  }
})
```

### Probes no Deployment

```yaml
spec:
  containers:
    - name: app
      ports:
        - containerPort: 3000
      startupProbe:
        httpGet:
          path: /health
          port: 3000
        initialDelaySeconds: 5
        periodSeconds: 10
        failureThreshold: 30
      readinessProbe:
        httpGet:
          path: /ready
          port: 3000
        initialDelaySeconds: 5
        periodSeconds: 10
        failureThreshold: 3
      livenessProbe:
        httpGet:
          path: /health
          port: 3000
        initialDelaySeconds: 15
        periodSeconds: 20
        failureThreshold: 3
```

## Fluxo do self-healing

```
Liveness falha → Kubernetes conta failureThreshold
  → Threshold atingido → Restart do container
    → Startup Probe valida novo bootstrap
      → Readiness Probe valida prontidao
        → Trafego redirecionado ao pod
```

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Rota de health que so retorna 200 sem testar nada | Rota que testa conexao com todas as dependencias externas |
| Deployment sem nenhuma probe configurada | Sempre configure Startup + Readiness + Liveness |
| Mesma rota para tudo sem pensar na arquitetura | Avalie se Readiness precisa de rota separada |
| Ignorar `initialDelaySeconds` em apps com bootstrap lento | Ajustar delay baseado no tempo real de bootstrap |
| Confiar que "subiu = pronto para trafego" | Usar Readiness Probe para validar prontidao |

## Troubleshooting

### Pod reinicia continuamente mesmo com probes configuradas
**Symptom:** Pod entra em CrashLoopBackOff com restarts frequentes apos adicionar probes
**Cause:** `initialDelaySeconds` menor que o tempo real de bootstrap da aplicacao, causando falha no startup probe antes da app estar pronta
**Fix:** Aumentar `initialDelaySeconds` e `failureThreshold` no startup probe para acomodar o tempo real de inicializacao

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: Probes e Self-Healing no Kubernetes

## Por que probes existem

O instrutor enfatiza que sem probes, o Kubernetes nao tem nenhuma visibilidade sobre o estado real da aplicacao. O container pode estar rodando (processo ativo) mas a aplicacao dentro dele pode estar completamente quebrada. Probes sao o mecanismo que fecha essa lacuna.

## As tres probes em detalhe

### Startup Probe — Sondagem de subida

O ponto central do instrutor: "Quando eu tenho o container da minha aplicacao, nada garante que ele vai funcionar." O Startup Probe existe para validar que o bootstrap completou com sucesso.

Isso e especialmente critico em aplicacoes com dependencias pesadas (banco de dados, Kafka, Redis, cache). Essas aplicacoes tem um tempo de bootstrap maior — podem levar 30s, 60s ou mais para estabelecer todas as conexoes. O Startup Probe permite configurar thresholds para acomodar esse tempo sem que o Kubernetes mate o container prematuramente.

Se o Startup Probe falha apos todas as tentativas, o Kubernetes entende que o container nao conseguiu subir e toma acoes (geralmente restart).

### Readiness Probe — Sondagem de prontidao

Insight chave do instrutor: "Quando a sua aplicacao sobe, nao quer dizer que ela ja esta pronta para receber trafego."

A separacao entre "subiu" e "esta pronta" e fundamental. Uma aplicacao pode ter completado o bootstrap (Startup OK) mas ainda estar:
- Carregando cache em memoria
- Sincronizando estado com outros servicos
- Esperando warmup de connection pool

O Readiness Probe remove o pod do Service (e portanto do load balancer) ate que a aplicacao sinalize que esta pronta. Isso evita que usuarios recebam erros 503 durante a inicializacao.

### Liveness Probe — Sondagem de vivacidade

O instrutor descreve como "acompanhar a aplicacao de tempos em tempos para entender se esta viva." Diferente do Startup (que roda uma vez) e do Readiness (que valida prontidao), o Liveness e continuo.

Quando o Liveness falha, entra o self-healing: o Kubernetes reinicia o container automaticamente. O instrutor menciona "thresholds" — voce configura quantas falhas consecutivas sao toleradas antes do restart.

## A armadilha das dependencias externas

Este e o insight mais valioso da aula. O instrutor usa um exemplo concreto:

> "Aplicacao A depende de MySQL, Kafka e Redis. Se qualquer um estiver off, a aplicacao nao esta de fato online."

O erro comum e criar uma rota de health que apenas retorna 200 sem verificar nada. O instrutor e enfatico: "Voce vai descobrir que a aplicacao esta pronta, mas as dependencias nao estao. E isso vai gerar um gargalo."

A boa pratica e que toda rota de probe teste ativamente as conexoes com dependencias externas. Se MySQL esta down, a rota de health deve retornar 503, triggering o mecanismo de self-healing.

## Compartilhamento de rotas

O instrutor explica que na pratica voce pode ter:
- **Duas rotas:** `/health` (compartilhada entre Startup e Liveness) e `/ready` (Readiness)
- **Tres rotas:** uma para cada probe, se a arquitetura exigir
- **Uma rota:** em apps muito simples sem dependencias

A decisao depende da arquitetura da aplicacao. O ponto importante e que a rota existe e testa o que precisa testar.

## Self-healing como consequencia

O self-healing nao e algo que voce "configura" separadamente. Ele e consequencia natural das probes. Quando o Liveness Probe falha alem do threshold, o Kubernetes reinicia o container. Essa e a "autocura" — o sistema tenta resolver sozinho antes de escalar para alertas.

O instrutor menciona que alarmistica (alertas, notificacoes) sera abordada no modulo de observabilidade, indicando que probes sao a base sobre a qual observabilidade e construida.

---

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
