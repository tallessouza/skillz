---
name: rs-devops-melhorando-gerenciamento-de-envs
description: "Enforces correct usage of env vs envFrom in Kubernetes deployments when injecting ConfigMaps and Secrets. Use when user asks to 'create a deployment', 'inject environment variables', 'use configmap', 'mount secrets', or 'configure env in k8s'. Applies rules: envFrom for bulk injection, env for selective injection, key names must match application expectations. Make sure to use this skill whenever writing Kubernetes deployment manifests with environment variables. Not for Docker Compose, Helm chart templating, or application-level env parsing."
---

# Gerenciamento de Env no Kubernetes: env vs envFrom

> Ao injetar variaveis de ambiente em Pods, escolha entre `env` (granular, renomeia chaves) e `envFrom` (bulk, exige nomes identicos aos da aplicacao).

## Rules

1. **Use `envFrom` para injecao em massa** — injeta todas as chaves de um ConfigMap ou Secret de uma vez, porque escala melhor quando a aplicacao tem 20+ variaveis
2. **Use `env` para injecao seletiva** — permite renomear chaves e selecionar apenas o necessario, porque a relacao e 1:1 entre name e key ref
3. **Nomes das chaves no ConfigMap/Secret devem corresponder exatamente ao que a aplicacao espera quando usar `envFrom`** — `APP_NAME` no ConfigMap deve ser `APP_NAME` na aplicacao, porque envFrom nao permite renomear
4. **Combine `env` e `envFrom` no mesmo container** — ambos funcionam juntos sem conflito, porque o Kubernetes faz merge das variaveis
5. **Avalie se `envFrom` e adequado para ConfigMaps compartilhados** — se um ConfigMap atende multiplas aplicacoes com chaves diferentes, prefira `env` seletivo, porque envFrom injeta tudo incluindo variaveis irrelevantes
6. **Considere Vault ou secret managers externos para secrets sensiveis** — a Secret nativa do Kubernetes e base64, nao criptografia real, porque solucoes como Vault oferecem rotacao de chaves e auditoria

## How to write

### envFrom com ConfigMap e Secret

```yaml
spec:
  containers:
    - name: app
      image: app:latest
      envFrom:
        - configMapRef:
            name: app
        - secretRef:
            name: app-secret
```

### env seletivo (quando precisa renomear chaves)

```yaml
spec:
  containers:
    - name: app
      image: app:latest
      env:
        - name: APP
          valueFrom:
            configMapKeyRef:
              name: app
              key: app_name
        - name: API_KEY
          valueFrom:
            secretKeyRef:
              name: app-secret
              key: api_key
```

### Combinando env e envFrom

```yaml
spec:
  containers:
    - name: app
      image: app:latest
      envFrom:
        - configMapRef:
            name: app
      env:
        - name: API_KEY
          valueFrom:
            secretKeyRef:
              name: app-secret
              key: api_key
```

## Example

**Before (variaveis indefinidas em runtime):**

ConfigMap com chave `app_name`, aplicacao espera `APP`:
```yaml
# ConfigMap
data:
  app_name: "my-app"

# Deployment usando envFrom
envFrom:
  - configMapRef:
      name: app
# Resultado: variavel injetada = app_name, aplicacao procura APP → undefined
```

**After (chaves alinhadas com a aplicacao):**

```yaml
# ConfigMap com chaves que a aplicacao espera
data:
  APP: "my-app"

# Deployment usando envFrom
envFrom:
  - configMapRef:
      name: app
# Resultado: variavel injetada = APP, aplicacao encontra APP → funciona
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Aplicacao com 5+ env vars de um ConfigMap | Use `envFrom` com chaves nomeadas igual a aplicacao |
| Precisa injetar 1-2 vars de um ConfigMap grande | Use `env` com `configMapKeyRef` |
| ConfigMap compartilhado entre apps | Use `env` seletivo para cada app |
| Secret com dados sensiveis em producao | Considere Vault/Secret Manager externo |
| Variavel undefined em runtime apos migrar para envFrom | Verifique se as chaves do ConfigMap/Secret correspondem ao que a app espera |
| Precisa renomear chave do ConfigMap | Use `env` (envFrom nao permite renomear) |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `envFrom` com chaves diferentes do esperado pela app | Alinhe os nomes das chaves no ConfigMap/Secret com os nomes esperados |
| 30 blocos `env` individuais quando todas vem do mesmo ConfigMap | Use `envFrom` com `configMapRef` |
| ConfigMap compartilhado com `envFrom` em multiplas apps | `env` seletivo ou ConfigMaps separados por app |
| Secrets sensiveis apenas com Secret nativa do K8s em producao | Vault, Secret Manager ou solucao externa com rotacao |
| Assumir que envFrom renomeia chaves como env faz | Teste sempre apos migrar de env para envFrom |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
