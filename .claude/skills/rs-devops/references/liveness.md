---
name: rs-devops-liveness
description: "Applies Kubernetes Liveness Probe configuration patterns when writing Pod specs, Deployments, or health check configs. Use when user asks to 'configure liveness', 'add health checks', 'setup probes', 'fix pod restarts', or 'kubernetes deployment yaml'. Enforces initialDelaySeconds, correct thresholds, and probe layering (Startup → Readiness → Liveness). Make sure to use this skill whenever generating Kubernetes manifests with probes. Not for application-level health check endpoint code or Docker healthchecks."
---

# Kubernetes Liveness Probe

> Configure Liveness Probes com initialDelaySeconds e thresholds corretos para evitar falsos positivos e restart loops.

## Rules

1. **Sempre defina initialDelaySeconds no Liveness e Readiness** — porque sem ele, o probe dispara antes da aplicacao subir, gerando falsos positivos e restart loops
2. **successThreshold do Liveness DEVE ser 1** — o Kubernetes exige esse valor fixo; qualquer outro valor causa erro de validacao
3. **Respeite a ordem: Startup → Readiness → Liveness** — o Startup segura os outros probes ate a aplicacao subir; o initialDelaySeconds do Readiness/Liveness conta APOS o Startup passar
4. **failureThreshold agressivo causa instabilidade** — valor muito baixo (1-2) em aplicacoes com erros intermitentes causa restarts constantes e indisponibilidade parcial
5. **initialDelaySeconds do Startup >= tempo de boot da aplicacao** — se a app demora 30s pra subir, o delay deve ser >= 30s, porque o probe nao encontra nada antes disso e entra em restart loop
6. **Liveness restart deleta o Pod e recria** — nao e graceful, causa indisponibilidade parcial; configure thresholds conservadores em producao

## How to write

### Probe completo com tres camadas

```yaml
spec:
  containers:
    - name: app
      image: app:v1
      ports:
        - containerPort: 3000
      # 1. Startup: segura tudo ate a app subir
      startupProbe:
        httpGet:
          path: /healthz
          port: 3000
        initialDelaySeconds: 30    # tempo de boot da app
        periodSeconds: 10
        failureThreshold: 3
        timeoutSeconds: 1
      # 2. Readiness: app pronta pra receber trafego?
      readinessProbe:
        httpGet:
          path: /ready
          port: 3000
        initialDelaySeconds: 10    # camada extra apos Startup
        periodSeconds: 10
        failureThreshold: 3
        successThreshold: 1
        timeoutSeconds: 1
      # 3. Liveness: app ainda viva?
      livenessProbe:
        httpGet:
          path: /healthz
          port: 3000
        initialDelaySeconds: 10    # camada extra apos Startup
        periodSeconds: 10
        failureThreshold: 5        # conservador em producao
        successThreshold: 1        # DEVE ser 1 (obrigatorio)
        timeoutSeconds: 1
```

## Example

**Before (restart loop — app demora 30s pra subir):**
```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 3000
  periodSeconds: 10
  failureThreshold: 3
# Sem initialDelaySeconds → probe dispara imediatamente
# → connection refused → restart → loop infinito
```

**After (com protecao contra falso positivo):**
```yaml
startupProbe:
  httpGet:
    path: /healthz
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
  failureThreshold: 3
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

## Heuristics

| Situacao | Faca |
|----------|------|
| App demora >10s pra subir | Startup Probe com initialDelaySeconds >= tempo de boot |
| Erros intermitentes em producao | failureThreshold alto (5+) no Liveness |
| Deploy com rolling update lento | Ajuste maxSurge, nao reduza thresholds |
| Precisa de camada extra de seguranca | initialDelaySeconds de 10s no Readiness e Liveness (alem do Startup) |
| Tempo de boot variavel | Observe e use o pior caso + margem no initialDelaySeconds |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Liveness sem initialDelaySeconds em app lenta | Adicione Startup Probe + initialDelaySeconds |
| `successThreshold: 3` no Liveness | `successThreshold: 1` (unico valor aceito) |
| `failureThreshold: 1` em producao | `failureThreshold: 5` (tolere erros transientes) |
| Liveness sem Startup Probe | Sempre use Startup Probe como primeira camada |
| Mesmo path para Readiness e Liveness | Use `/ready` para Readiness, `/healthz` para Liveness |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-liveness/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-liveness/references/code-examples.md)
