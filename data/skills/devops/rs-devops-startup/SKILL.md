---
name: rs-devops-startup
description: "Applies Kubernetes startupProbe configuration when writing Pod, Deployment, or StatefulSet manifests. Use when user asks to 'configure probes', 'add health checks', 'setup startup probe', 'create deployment manifest', or 'configure kubernetes pod'. Enforces correct httpGet structure, failureThreshold, successThreshold, timeoutSeconds, and periodSeconds parameters. Make sure to use this skill whenever generating Kubernetes manifests with containers that need startup verification. Not for readinessProbe, livenessProbe, Docker health checks, or application-level health endpoint implementation."
---

# Kubernetes Startup Probe

> Configure startupProbe em cada container para verificar se a aplicacao subiu antes de qualquer outra probe atuar.

## Rules

1. **startupProbe fica no nivel do container** — dentro de `spec.template.spec.containers[].startupProbe`, porque probes sao por container, nao por Pod
2. **Use httpGet para checar rota GET** — probes batem em endpoints do container, entao a rota deve existir e responder 200, porque 404 causa restart infinito
3. **Defina failureThreshold** — numero inteiro de falhas toleradas antes de considerar que o container nao subiu, porque sem isso o Kubernetes usa defaults que podem nao refletir sua aplicacao
4. **successThreshold deve ser 1** — basta um sucesso para confirmar que subiu, porque a logica e invertida em relacao a failure (precisa de pelo menos 1)
5. **timeoutSeconds define tempo maximo por tentativa** — nao e quantidade de timeouts, e o tempo maximo em segundos que cada check pode levar
6. **periodSeconds define o intervalo entre checks** — a cada N segundos o Kubernetes executa a probe, e dentro desse periodo aplica as regras de failure/success/timeout
7. **Use sufixo Z nas rotas de health** — `/healthz`, `/readyz` evitam colisao de path com rotas da aplicacao, porque e um padrao do ecossistema Kubernetes

## How to write

### startupProbe basico

```yaml
spec:
  template:
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

### Recapitulando a semantica

```yaml
# A cada 10 segundos (periodSeconds):
#   - Faz GET em /healthz na porta 3000
#   - Tolera ate 3 falhas (failureThreshold)
#   - Precisa de pelo menos 1 sucesso (successThreshold)
#   - Cada tentativa tem no maximo 1s (timeoutSeconds)
# Se falhar alem do threshold: container e restartado (self-healing)
```

## Example

**Before (sem probe — sem verificacao de subida):**

```yaml
containers:
  - name: api
    image: api:v5
    ports:
      - containerPort: 3000
```

**After (com startupProbe configurado):**

```yaml
containers:
  - name: api
    image: api:v6
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

## Heuristics

| Situacao | Acao |
|----------|------|
| Aplicacao leve (Node, Go) | `timeoutSeconds: 1`, `periodSeconds: 10` |
| Aplicacao pesada (Java, .NET) | Aumentar `timeoutSeconds` e `failureThreshold` |
| Rota de health ainda nao existe | Criar rota GET que retorna 200 antes de configurar probe |
| Porta do container duplicada no manifesto | Tolerar ate templatizar com Helm/Kustomize |
| Container restarting infinitamente | Verificar se a rota da probe existe e retorna 200 (erro 404 = restart loop) |
| Multiplos containers no Pod | Configurar startupProbe individualmente em cada container |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Probe apontando para rota inexistente | Confirmar que a rota existe e retorna 200 |
| Omitir `failureThreshold` | Definir explicitamente quantas falhas tolera |
| `successThreshold` maior que 1 em startupProbe | Usar `successThreshold: 1` (um sucesso ja confirma subida) |
| Usar POST na probe | Usar GET (probes usam httpGet, padrao HTTP para leitura) |
| Confundir startupProbe com readinessProbe | startupProbe = subiu? readinessProbe = pronto para receber trafego? |
| Rota `/health` sem sufixo | Usar `/healthz` para evitar colisao de paths |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
