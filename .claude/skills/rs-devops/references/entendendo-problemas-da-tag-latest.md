---
name: rs-devops-entendendo-problemas-da-tag-latest
description: "Applies immutable image tagging practices for Kubernetes deployments and rollback safety. Use when user asks to 'fix rollback issues', 'tag Docker images correctly', 'avoid latest tag in K8s', or 'configure revisionHistoryLimit'. Enforces versioned immutable tags, never overwriting existing tags, proper imagePullPolicy, and rollback history management. Make sure to use this skill whenever tagging Docker images for Kubernetes deployments or configuring rollback strategies. Not for Docker build optimization (use entendendo-sobre-uma-imagem-base) or registry configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-deployments
  tags: [kubernetes, docker, tags, latest, rollback, immutable, revision-history, imagepullpolicy]
---

# Problemas da Tag Latest no Kubernetes

> Nunca use tags mutaveis em deployments Kubernetes — rollback so funciona quando cada revisao aponta para uma imagem imutavel e unica.

## Rules

1. **Nunca use a tag `latest` em manifests Kubernetes** — rollback nao restaura a versao anterior
2. **Nunca sobrescreva tags existentes no registry** — `app:v1` deve sempre apontar para o mesmo digest
3. **Use tags versionadas e imutaveis** — `app:1.0.0`, `app:sha-abc123`
4. **Configure `imagePullPolicy: Always` somente quando necessario**
5. **Mantenha o historico de revisoes adequado** — default e 10 (`revisionHistoryLimit`)

## Comandos de rollback

```bash
kubectl rollout history deployment/app -n meu-namespace
kubectl rollout undo deployment/app -n meu-namespace
kubectl rollout undo deployment/app -n meu-namespace --to-revision=2
```

## Heuristics

| Situation | Do |
|-----------|-----|
| CI/CD pipeline build | Tag com git SHA: `app:sha-$(git rev-parse --short HEAD)` |
| Ambiente local | `latest` e aceitavel, nunca em cluster compartilhado |
| Hotfix urgente | Nova tag incrementada, nunca sobrescrever a anterior |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `image: app:latest` | `image: app:1.2.3` |
| `image: app:v1` (reutilizada) | `image: app:1.0.0` (unica por build) |
| `imagePullPolicy: Always` com tag fixa | `imagePullPolicy: IfNotPresent` |
| Sobrescrever tag no registry | Criar nova tag para cada build |

## Troubleshooting

### Rollback nao restaura a versao anterior
**Symptom:** `kubectl rollout undo` executa mas a aplicacao continua com o mesmo comportamento
**Cause:** Tag `latest` foi usada — todas as revisoes apontam para a mesma tag mutavel
**Fix:** Usar tags imutaveis e versionadas (ex: `app:sha-abc123`) para que cada revisao aponte para uma imagem unica

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
