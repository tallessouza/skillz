---
name: rs-devops-entendendo-sobre-os-triggers
description: "Applies GitHub Actions workflow trigger configuration and matrix strategy patterns. Use when user asks to 'configure GitHub Actions triggers', 'setup matrix strategy', 'test multiple Node versions in CI', or 'configure on parameter'. Enforces mandatory on declaration, matrix strategy for compatibility testing, cache usage in setup-node, and CI/CD separation. Make sure to use this skill whenever configuring GitHub Actions workflow triggers or matrix testing strategies. Not for deployment steps (use deployando-nossa-aplicacao) or self-hosted runners."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: ci-cd-github-actions
  tags: [github-actions, triggers, matrix, ci, node-version, workflow, cache, yaml]
---

# GitHub Actions Triggers e CI Configuration

> Configure o parametro `on` corretamente — sem ele o workflow nao executa.

## Rules

1. **Sempre declare o `on`** — parametro obrigatorio
2. **Use array em `branches`** — liste todas as branches que devem acionar o workflow
3. **Use Matrix Strategy para validar compatibilidade** — multiplas versoes do Node.js
4. **Referencie variaveis da matrix com `matrix.<key>`**
5. **Separe CI de CD** — matrix testing pertence ao CI
6. **Inclua cache no setup-node** — `cache: 'yarn'`

## How to write

### Matrix Strategy

```yaml
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'yarn'
      - run: yarn
      - run: yarn run test
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Workflow sem `on` | Sempre declare `on` com pelo menos um evento |
| `node-version: '20'` fixo com matrix ativa | `${{ matrix.node-version }}` |
| `npm install` em CI | `npm ci` ou `yarn --frozen-lockfile` |
| Steps sem `name` | Sempre nomeie steps |

## Troubleshooting

### Workflow nao executa ao fazer push
**Symptom:** Push para a branch nao dispara o workflow
**Cause:** Parametro `on` ausente ou branch nao listada no array `branches`
**Fix:** Adicionar `on: push: branches: [main, develop]` com a branch desejada no array

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
