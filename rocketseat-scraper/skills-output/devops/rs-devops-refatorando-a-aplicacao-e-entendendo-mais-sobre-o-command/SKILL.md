---
name: rs-devops-refatorando-app-k8s-command
description: "Enforces Kubernetes probe configuration best practices and command-based health checks when writing K8s manifests. Use when user asks to 'configure probes', 'add health check', 'fix pod restarts', 'setup liveness readiness startup probe', or 'write kubernetes deployment manifest'. Applies rules: initialDelaySeconds margin above actual boot time, command exec as alternative to httpGet, probe independence. Make sure to use this skill whenever generating Kubernetes deployment manifests with health checks. Not for Docker image building, CI/CD pipelines, or application code health endpoints."
---

# Kubernetes Probes: Configuracao e Command Exec

> Configure probes com margens seguras de tempo e use command exec quando verificacoes customizadas sao necessarias.

## Rules

1. **initialDelaySeconds com margem** — se a aplicacao demora X segundos para subir, configure `initialDelaySeconds` um pouco acima de X, porque valores abaixo causam falsos negativos e restarts desnecessarios
2. **Nao e obrigatorio usar as tres probes** — use apenas as que fazem sentido para o caso; uma unica probe (startup, readiness ou liveness) ja funciona, porque o Kubernetes aceita qualquer combinacao
3. **MaxSurge so age apos probes validarem** — durante rolling updates, novos pods so recebem trafego depois que todas as probes configuradas passam, porque o Kubernetes espera validacao antes de prosseguir o rollout
4. **Command exec para verificacoes customizadas** — use `exec.command` quando httpGet nao cobre o cenario de saude, porque scripts shell podem verificar dependencias externas, arquivos, ou estados internos
5. **Nao misture httpGet e exec na mesma probe** — o Kubernetes rejeita manifesto com mais de um tipo de check na mesma probe, porque cada probe aceita exatamente um handler
6. **Script deve existir na imagem** — ao usar exec com shell script, garanta que o arquivo existe no container, porque o pod entra em CrashLoopBackOff se o script nao for encontrado

## How to write

### Probe com httpGet (padrao)

```yaml
startupProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10
readinessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
```

### Probe com exec command

```yaml
startupProbe:
  exec:
    command:
      - /bin/sh
      - -c
      - /app/check.sh
  initialDelaySeconds: 10
```

### Apenas uma probe (caso simples)

```yaml
# Valido: usar somente startupProbe
startupProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10
```

## Example

**Before (aplicacao instavel com restarts):**
```yaml
startupProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 2    # muito curto, app demora 8s
readinessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 2
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 2
```

**After (com margens adequadas):**
```yaml
startupProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10   # margem acima dos 8s de boot
readinessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Tempo de boot conhecido e fixo (ex: 30s) | `initialDelaySeconds: 35` (margem pequena) |
| Tempo de boot variavel/aproximado | `initialDelaySeconds` bem acima do estimado |
| Verificacao requer logica customizada | Use `exec.command` com shell script |
| Aplicacao simples com endpoint /health | Use `httpGet` apenas |
| Nao precisa distinguir readiness de liveness | Use apenas uma probe |
| Rolling update com MaxSurge | Lembre que probes devem passar antes do rollout continuar |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `httpGet` e `exec` na mesma probe | Escolha um: `httpGet` OU `exec` |
| `initialDelaySeconds: 0` para app que demora | Valor acima do tempo real de boot |
| Script em `exec` que nao existe na imagem | Garanta o script no Dockerfile (COPY) |
| Tres probes identicas sem necessidade | Apenas as probes que agregam valor |
| `initialDelaySeconds` menor que boot time | Margem de seguranca acima do boot time |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
