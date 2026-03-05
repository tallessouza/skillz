---
name: rs-devops-readiness
description: "Applies Kubernetes readiness probe configuration when writing pod manifests or deployment specs. Use when user asks to 'configure readiness', 'add health checks', 'setup probe', 'kubernetes manifest', or 'check pod readiness'. Covers httpGet config, periodSeconds tuning, failure/success thresholds, and readyZ endpoint patterns. Make sure to use this skill whenever configuring Kubernetes probes or health check endpoints. Not for liveness probe, startup probe, or application business logic."
---

# Kubernetes Readiness Probe

> Configure readiness probes para validar continuamente se a aplicacao esta pronta para receber trafego, separando prontidao de saude.

## Rules

1. **Readiness usa rota dedicada `/readyz`** — nunca reutilize `/healthz`, porque readiness valida prontidao (conexoes externas prontas), health valida saude (aplicacao funcionando)
2. **Readiness roda continuamente** — diferente do startup probe que roda apenas na subida, readiness executa de tempos em tempos durante toda a vida do pod
3. **periodSeconds deve refletir a criticidade** — 15s e um bom padrao para maioria das aplicacoes, porque equilibra responsividade com carga de checagem
4. **failureThreshold em 3** — permite falhas transitorias sem derrubar o pod imediatamente, porque erros momentaneos nao significam que a aplicacao parou
5. **successThreshold em 1** — basta um sucesso para considerar pronto novamente, porque se respondeu ok uma vez, esta pronto
6. **timeoutSeconds em 1** — se a rota de readiness demora mais que 1s para responder, algo ja esta errado

## How to write

### Readiness Probe no manifesto

```yaml
readinessProbe:
  httpGet:
    path: /readyz
    port: 3000
  failureThreshold: 3
  successThreshold: 1
  timeoutSeconds: 1
  periodSeconds: 15
```

### Endpoint readyz no NestJS

```typescript
// ready.controller.ts
@Get('readyz')
checkReadiness() {
  // Validar conexoes externas: DB, cache, message broker
  return { status: 'ok' };
}
```

## Example

**Before (sem readiness, apenas startup):**
```yaml
spec:
  containers:
    - name: api
      image: api:v7
      startupProbe:
        httpGet:
          path: /healthz
          port: 3000
      # Pod marcado como ready assim que inicia — sem validacao continua
```

**After (com readiness probe configurado):**
```yaml
spec:
  containers:
    - name: api
      image: api:v8
      startupProbe:
        httpGet:
          path: /healthz
          port: 3000
        failureThreshold: 30
        periodSeconds: 1
      readinessProbe:
        httpGet:
          path: /readyz
          port: 3000
        failureThreshold: 3
        successThreshold: 1
        timeoutSeconds: 1
        periodSeconds: 15
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Aplicacao conecta a servicos externos (DB, Kafka, Redis) | Readiness valida essas conexoes |
| Aplicacao e stateless simples | Readiness pode ser um ping basico na `/readyz` |
| Alto tempo de bootstrap (30s+) | Startup probe cuida da subida, readiness cuida depois |
| Erros aleatorios em producao | failureThreshold 3 absorve transitoriedades |
| Precisa de checagem mais frequente | Reduza periodSeconds (minimo razoavel: 5s) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Readiness e healthz na mesma rota | Rotas separadas: `/healthz` (startup/liveness) e `/readyz` (readiness) |
| `periodSeconds: 1` no readiness | `periodSeconds: 15` — readiness nao precisa ser agressivo |
| Readiness sem failureThreshold | Sempre defina failureThreshold (padrao 3) |
| Logica de negocio no endpoint readyz | Apenas validacao de prontidao (conexoes, dependencias) |
| Confundir readiness com liveness | Readiness = pronto para trafego, Liveness = ainda vivo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
