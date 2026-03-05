---
name: rs-devops-entendendo-problemas-da-tag-latest
description: "Enforces immutable image tagging practices in Kubernetes deployments. Use when user asks to 'deploy to kubernetes', 'create a deployment manifest', 'tag a docker image', 'rollback a deployment', or 'write a Dockerfile'. Guards against mutable tags (latest, v1) that break rollback capability. Make sure to use this skill whenever generating Kubernetes manifests or Docker build commands. Not for general Docker development without Kubernetes, nor for Helm chart templating."
---

# Problemas da Tag Latest no Kubernetes

> Nunca use tags mutaveis em deployments Kubernetes — rollback so funciona quando cada revisao aponta para uma imagem imutavel e unica.

## Rules

1. **Nunca use a tag `latest` em manifests Kubernetes** — porque o rollback baixa a imagem pela tag, e se a tag foi sobrescrita, o rollback nao restaura a versao anterior
2. **Nunca sobrescreva tags existentes no registry** — `app:v1` deve sempre apontar para o mesmo digest, porque o Kubernetes perde o lastro da revisao quando a tag e mutabilizada
3. **Use tags versionadas e imutaveis** — `app:1.0.0`, `app:sha-abc123`, porque cada revision do rollout history precisa de uma referencia unica
4. **Configure `imagePullPolicy: Always` somente quando necessario** — porque com tags imutaveis, `IfNotPresent` e mais eficiente e o rollback funciona corretamente
5. **Mantenha o historico de revisoes adequado** — o default do Kubernetes e 10 revisoes (`revisionHistoryLimit`), porque permite rollback para versoes anteriores

## How to write

### Deployment com tag imutavel

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
spec:
  revisionHistoryLimit: 10
  template:
    spec:
      containers:
        - name: app
          image: myregistry/app:1.2.3  # Tag imutavel, nunca "latest"
          imagePullPolicy: IfNotPresent
```

### Comandos de rollback

```bash
# Ver historico de revisoes
kubectl rollout history deployment/app -n meu-namespace

# Voltar para a versao imediatamente anterior
kubectl rollout undo deployment/app -n meu-namespace

# Voltar para uma revisao especifica
kubectl rollout undo deployment/app -n meu-namespace --to-revision=2
```

## Example

**Before (tag mutavel — rollback quebrado):**

```yaml
# Deploy v1
image: myregistry/app:v1   # aponta para build A

# Deploy v2 — SOBRESCREVE a mesma tag
image: myregistry/app:v1   # agora aponta para build B

# kubectl rollout undo → volta para revision 1, mas tag v1 ja aponta para build B
# Resultado: rollback NAO restaura a versao anterior
```

**After (tags imutaveis — rollback funcional):**

```yaml
# Deploy v1
image: myregistry/app:1.0.0   # sempre aponta para build A

# Deploy v2
image: myregistry/app:1.1.0   # aponta para build B

# kubectl rollout undo → volta para revision 1, baixa app:1.0.0 = build A
# Resultado: rollback restaura corretamente
```

## Heuristics

| Situation | Do |
|-----------|-----|
| CI/CD pipeline build | Gere tag com git SHA: `app:sha-$(git rev-parse --short HEAD)` |
| Ambiente de desenvolvimento local | `latest` e aceitavel, mas nunca em cluster compartilhado |
| Multiplas revisoes para rollback | Use `kubectl rollout history` + `--to-revision=N` |
| `imagePullPolicy` com tag imutavel | Use `IfNotPresent` para evitar pulls desnecessarios |
| Hotfix urgente | Crie nova tag incrementada, nunca sobrescreva a anterior |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `image: app:latest` | `image: app:1.2.3` |
| `image: app:v1` (reutilizada) | `image: app:1.0.0` (unica por build) |
| `imagePullPolicy: Always` com tag fixa | `imagePullPolicy: IfNotPresent` |
| Rollback sem verificar `rollout history` | Sempre verificar historico antes de `undo` |
| Sobrescrever tag no registry | Criar nova tag para cada build |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
