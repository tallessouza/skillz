---
name: rs-devops-k8s-tag-rollback
description: "Enforces Kubernetes tag immutability and rollback best practices when working with container deployments. Use when user asks to 'deploy to kubernetes', 'rollback deployment', 'manage k8s tags', 'fix deployment version', or 'undo kubernetes deploy'. Applies rules: never overwrite tags, use imagePullPolicy IfNotPresent, always sync imperative rollbacks to declarative manifests. Make sure to use this skill whenever managing Kubernetes deployments or container image versioning. Not for Docker image building, CI/CD pipeline setup, or Helm chart authoring."
---

# Tag Imutável e Rollback no Kubernetes

> Toda tag de imagem é imutável — alterações geram nova tag, e todo comando imperativo deve ser refletido no manifesto declarativo.

## Rules

1. **Nunca sobrescreva tags** — crie `v2`, `v3`, etc., nunca rebuilde `v1`, porque tags sobrescritas tornam rollback imprevisível e cache do cluster inválido
2. **Nunca use `latest` em deployments** — sempre referencie tag explícita (`v1`, `v2`, `1.0.3`), porque `latest` é ambígua e impede rastreabilidade
3. **Use `imagePullPolicy: IfNotPresent`** — não `Always`, porque imagens imutáveis já existem no cluster e pull desnecessário atrasa rollback
4. **Sempre declare o que fez imperativamente** — se rodou `kubectl rollout undo`, atualize o manifesto YAML com a tag correta, porque outro deploy vai sobrescrever o rollback
5. **Rollback é emergencial** — `kubectl rollout undo` é para urgências; o estado correto vive no YAML declarativo, não no histórico imperativo
6. **Vincule tag ao commit** — cada tag de imagem deve corresponder a um commit no git, porque permite rastrear exatamente o que roda em produção

## How to write

### Deploy com tag versionada
```yaml
# deployment.yaml
spec:
  containers:
    - name: app
      image: registry/app:v2  # Tag explícita, nunca latest
      imagePullPolicy: IfNotPresent  # Imagem imutável, pull só se não existir
```

### Rollback emergencial + sincronização declarativa
```bash
# 1. Verificar histórico
kubectl rollout history deployment/app -n minha-aplicacao

# 2. Rollback para revisão anterior (emergencial)
kubectl rollout undo deployment/app --to-revision=3 -n minha-aplicacao

# 3. OBRIGATÓRIO: Atualizar manifesto para refletir o rollback
# Editar deployment.yaml: image: registry/app:v1
# Commitar a mudança no git
```

## Example

**Before (rollback sem declaração — armadilha):**
```bash
# Dev faz rollback imperativo
kubectl rollout undo deployment/app -n prod
# Manifesto continua com image: registry/app:v2
# Próximo kubectl apply redeploia v2 (a versão problemática!)
```

**After (rollback com declaração — correto):**
```bash
# 1. Rollback emergencial
kubectl rollout undo deployment/app -n prod

# 2. Imediatamente atualiza manifesto
sed -i 's/app:v2/app:v1/' deployment.yaml
git add deployment.yaml
git commit -m "fix: rollback to v1 due to issue in v2"

# Agora qualquer kubectl apply mantém v1
```

## Heuristics

| Situação | Faça |
|----------|------|
| Nova feature pronta | Build com nova tag (v3), push, atualize manifesto, apply |
| Bug em produção | `kubectl rollout undo` + atualize manifesto YAML imediatamente |
| Quer ver versões anteriores | `kubectl rollout history deployment/app -n namespace` |
| Rollback para revisão específica | `--to-revision=N`, depois declare no YAML |
| Sem `--to-revision` | Volta para a revisão imediatamente anterior |
| Deploy cadenciado em andamento | Aguarde — pods antigos e novos coexistem temporariamente |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| `image: app:latest` | `image: app:v2` |
| `imagePullPolicy: Always` com tags imutáveis | `imagePullPolicy: IfNotPresent` |
| Rollback imperativo sem atualizar YAML | Rollback + commit do manifesto atualizado |
| Rebuildar `v1` com código novo | Criar `v2` com o código novo |
| Rollback e não avisar a equipe | Rollback + commit + comunicação |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-criando-nova-tag-e-controlando-rollback-da-aplicacao/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-criando-nova-tag-e-controlando-rollback-da-aplicacao/references/code-examples.md)
