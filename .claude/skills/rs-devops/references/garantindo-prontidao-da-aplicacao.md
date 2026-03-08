---
name: rs-devops-garantindo-prontidao-da-aplicacao
description: "Enforces correct Kubernetes probe configuration (Startup, Liveness, Readiness) when writing pod specs or deployment manifests. Use when user asks to 'create a deployment', 'configure health checks', 'add probes', 'kubernetes manifest', or 'ensure pod readiness'. Applies startup/readiness/liveness probe patterns with correct endpoints and timing. Make sure to use this skill whenever generating Kubernetes deployment YAML that runs application containers. Not for Docker Compose health checks, cloud-provider-specific health checks, or application-level error handling code."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-probes
  tags: [kubernetes, probes, startup, liveness, readiness, health-check, self-healing, deployment]
---

# Kubernetes Probes — Startup, Liveness e Readiness

> Toda aplicacao em Kubernetes deve ter as tres probes configuradas para garantir self-healing e zero-downtime deployments.

## Rules

1. **Sempre configure as tres probes** — Startup, Readiness e Liveness, porque sem elas um container com falha recebe trafego e causa downtime
2. **Startup Probe valida o bootstrap** — verifica se o container iniciou corretamente antes de qualquer outra probe, porque um deploy com erro de inicializacao nao deve receber trafego
3. **Readiness Probe valida prontidao** — verifica se a aplicacao E suas dependencias externas (banco, cache) estao prontas, porque container rodando nao significa aplicacao pronta
4. **Liveness Probe monitora continuamente** — verifica a saude do pod em intervalos regulares, porque permite self-healing via restart automatico pelo control plane
5. **Use endpoints dedicados** — `/health` para startup/liveness, `/readyz` para readiness, porque readiness deve checar dependencias externas alem da aplicacao
6. **Probes nao resolvem o problema** — elas previnem impacto ao usuario e permitem alarmes, porque o fix real vem da observabilidade e acao manual

## How to write

### Deployment com as tres probes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-app
  template:
    metadata:
      labels:
        app: api-app
    spec:
      containers:
        - name: api
          image: api-app:latest
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

## Example

**Before (sem probes — deploy quebrado recebe trafego):**
```yaml
spec:
  containers:
    - name: api
      image: api-app:v2
      ports:
        - containerPort: 3000
```

**After (com probes — deploy quebrado nunca recebe trafego):**
```yaml
spec:
  containers:
    - name: api
      image: api-app:v2
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
      livenessProbe:
        httpGet:
          path: /health
          port: 3000
        periodSeconds: 10
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Aplicacao stateless simples | Tres probes com httpGet no /health e /readyz |
| Aplicacao com dependencias externas (DB, cache) | Readiness probe em /readyz que valida conexao com dependencias |
| Aplicacao com bootstrap lento | Aumentar failureThreshold do startupProbe |
| Pod em CrashLoopBackOff | Verificar logs, ajustar probes, adicionar observabilidade |
| Deploy novo nao recebe trafego | Verificar se readinessProbe esta passando |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Deploy sem nenhuma probe | Configure startup + readiness + liveness |
| Mesmo endpoint para readiness e liveness | `/readyz` (com deps) para readiness, `/health` (so app) para liveness |
| Confiar que container rodando = app pronta | Readiness probe valida prontidao real |
| Ignorar CrashLoopBackOff recorrente | Configurar alarmes e investigar causa raiz |
| Liveness com periodSeconds muito baixo | Minimo 10s para evitar restarts desnecessarios |

## Troubleshooting

### Pod fica em CrashLoopBackOff com probes configuradas
**Symptom:** Pod reinicia repetidamente e mostra status CrashLoopBackOff
**Cause:** StartupProbe falha porque a aplicacao demora mais para inicializar do que `failureThreshold * periodSeconds` permite
**Fix:** Aumente o `failureThreshold` do startupProbe (ex: de 30 para 60) para dar mais tempo ao bootstrap da aplicacao

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
