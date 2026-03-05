---
name: rs-devops-o-que-sao-probes-e-self-healing
description: "Applies Kubernetes probes (Startup, Readiness, Liveness) and self-healing patterns when configuring deployments. Use when user asks to 'add health checks', 'configure probes', 'setup liveness', 'implement readiness check', 'add self-healing', or any Kubernetes deployment health monitoring task. Ensures probe routes test external dependencies, not just the app itself. Make sure to use this skill whenever creating or reviewing Kubernetes deployment manifests that lack probe configuration. Not for application-level error handling, CI/CD pipelines, or HPA/autoscaling configuration."
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

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-o-que-sao-probes-e-self-healing/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-o-que-sao-probes-e-self-healing/references/code-examples.md)
