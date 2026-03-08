---
name: rs-devops-adicionando-step-de-build
description: "Applies Docker build step patterns in GitHub Actions CI pipelines. Use when user asks to 'add build step', 'build docker in CI', 'configure CI pipeline', 'github actions docker build', or 'generate commit tag'. Enforces commit SHA tagging, GITHUB_OUTPUT usage, and step output references. Make sure to use this skill whenever configuring Docker builds in GitHub Actions workflows. Not for local Docker builds, deployment, or pushing images to registries."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: github-actions-ci
  tags: [github-actions, ci-cd]
---

# Adicionando Step de Build no CI

> Configure steps de build Docker em GitHub Actions usando `run` direto no runner e tags baseadas no commit SHA.

## Rules

1. **Use `run` para comandos diretos no runner** — nao precisa de `uses` com action, porque o runner Ubuntu ja tem Docker pre-instalado
2. **Nunca use tag `latest` em pipelines de CI** — associe a tag ao commit SHA, porque permite rastrear cada imagem ao commit que a gerou
3. **Pegue apenas os 7 primeiros caracteres do SHA** — `head -c7` ou equivalente, porque a hash completa e desnecessariamente longa
4. **Exporte variaveis via GITHUB_OUTPUT** — nao use variaveis shell entre steps, porque GITHUB_OUTPUT centraliza e persiste os valores entre steps
5. **Adicione `id` em steps que produzem outputs** — porque sem ID nao ha como referenciar o output em steps posteriores
6. **Referencie outputs com `steps.<id>.outputs.<var>`** — sintaxe padrao do GitHub Actions para consumir variaveis de saida

## How to write

### Step de build com run direto

```yaml
- name: Build docker image
  run: docker build -t minha-app:${{ steps.generate_tag.outputs.sha }} .
```

### Step de geracao de tag a partir do commit

```yaml
- name: Generate tag
  id: generate_tag
  run: |
    SHA=$(echo $GITHUB_SHA | head -c7)
    echo "sha=$SHA" >> $GITHUB_OUTPUT
```

### Referenciando output em outro step

```yaml
- name: Build docker image
  run: docker build -t minha-org/minha-app:${{ steps.generate_tag.outputs.sha }} .
```

## Example

**Before (tag latest — ma pratica):**

```yaml
steps:
  - uses: actions/checkout@v4
  - name: Build docker image
    run: docker build -t skillz-ci-api:latest .
```

**After (tag com commit SHA):**

```yaml
steps:
  - uses: actions/checkout@v4

  - name: Generate tag
    id: generate_tag
    run: |
      SHA=$(echo $GITHUB_SHA | head -c7)
      echo "sha=$SHA" >> $GITHUB_OUTPUT

  - name: Build docker image
    run: docker build -t skillz-ci-api:${{ steps.generate_tag.outputs.sha }} .
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa rodar comando no runner sem action | Use `run:` ao inves de `uses:` |
| Runner e Ubuntu | Docker ja esta pre-instalado, use direto |
| Precisa passar valor entre steps | Use `GITHUB_OUTPUT` + `id` no step produtor |
| Tag da imagem Docker | Sempre baseada no commit SHA (7 chars) |
| Dockerfile nao esta na raiz | Passe o path no lugar do `.` no `docker build` |
| Multiplas instrucoes em um run | Use pipe `\|` para quebrar linhas |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `docker build -t app:latest .` em CI | `docker build -t app:${{ steps.generate_tag.outputs.sha }} .` |
| Usar SHA completo como tag | Usar apenas os 7 primeiros caracteres |
| Variavel shell entre steps diferentes | `GITHUB_OUTPUT` com `id` e `steps.<id>.outputs.<var>` |
| Step com output sem `id` | Sempre adicionar `id` quando o step produz outputs |
| `echo "::set-output name=sha::$SHA"` (deprecated) | `echo "sha=$SHA" >> $GITHUB_OUTPUT` |

## Troubleshooting

### Step posterior nao consegue acessar output do step de geracao de tag
**Symptom:** Variavel SHA retorna vazio em steps posteriores ao generate_tag
**Cause:** O step produtor nao tem `id` definido ou usa sintaxe deprecated `::set-output`
**Fix:** Adicione `id: generate_tag` no step e use `echo "sha=$SHA" >> $GITHUB_OUTPUT` em vez de `::set-output`

## Deep reference library

- [deep-explanation.md](../../../data/skills/devops/rs-devops-adicionando-step-de-build/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/devops/rs-devops-adicionando-step-de-build/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
