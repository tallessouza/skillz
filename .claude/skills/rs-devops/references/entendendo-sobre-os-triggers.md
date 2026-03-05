---
name: rs-devops-entendendo-sobre-os-triggers
description: "Applies GitHub Actions trigger configuration patterns when writing CI/CD workflows. Use when user asks to 'create a workflow', 'configure CI/CD', 'setup GitHub Actions', 'add a trigger', or 'configure pipeline'. Covers on/push/branches, matrix strategy for multi-version testing, setup-node action, and webhook mechanics. Make sure to use this skill whenever generating or modifying .github/workflows YAML files. Not for Docker build steps, deployment pipelines, or CD-specific configuration."
---

# GitHub Actions Triggers e CI Configuration

> Configure o parametro `on` corretamente — sem ele o workflow nao executa, porque o CI nao tem orientacao para disparar a pipeline.

## Rules

1. **Sempre declare o `on`** — e um parametro obrigatorio (required), sem ele o workflow existe mas nunca executa, porque o GitHub Actions precisa saber QUANDO disparar
2. **Use array em `branches`** — a estrutura comporta multiplos valores, entao liste todas as branches que devem acionar o workflow
3. **Use Matrix Strategy para validar compatibilidade** — defina versoes no `strategy.matrix` para rodar o mesmo job em multiplas versoes, porque isso garante que nenhuma versao suportada esta quebrada
4. **Referencie variaveis da matrix com `matrix.<key>`** — nunca fixe a versao no `with` quando usar matrix, use `${{ matrix.node-version }}` para que cada job rode sua versao
5. **Separe CI de CD** — matrix testing e validacao pertencem ao CI; build de imagem Docker usa versao fixa do Dockerfile, nao precisa de matrix
6. **Inclua cache no setup-node** — passe o parametro `cache` (yarn/npm) para acelerar instalacao de dependencias em execucoes subsequentes

## How to write

### Trigger basico com push em branch

```yaml
on:
  push:
    branches:
      - main
```

### Trigger com multiplas branches

```yaml
on:
  push:
    branches:
      - main
      - develop
      - feature/my-feature
```

### Setup Node com cache

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'yarn'
```

### Matrix Strategy para multiplas versoes

```yaml
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
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

## Example

**Before (workflow sem trigger — nunca executa):**

```yaml
name: ci
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install
      - run: npm test
```

**After (com trigger e matrix configurados):**

```yaml
name: ci
on:
  push:
    branches:
      - main
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

## Heuristics

| Situation | Do |
|-----------|-----|
| Projeto com uma branch principal | `on: push: branches: [main]` |
| Projeto com multiplas branches ativas | Liste todas em `branches` |
| Precisa validar compatibilidade de versoes | Use `strategy.matrix` |
| Build de imagem Docker | Nao use matrix — versao vem do Dockerfile |
| Quer CI em pull requests tambem | Adicione `pull_request:` ao `on` |
| Monorepo com package.json fora da raiz | Defina path no setup-node |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Workflow sem `on` | Sempre declare `on` com pelo menos um evento |
| `node-version: '20'` fixo com matrix ativa | `node-version: ${{ matrix.node-version }}` |
| Matrix com versoes sem suporte (ex: Node 14) | Apenas versoes com suporte ativo |
| `npm install` em CI | `npm ci` ou `yarn --frozen-lockfile` para builds reproduziveis |
| Steps sem `name` | Sempre nomeie steps para legibilidade no Actions UI |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-entendendo-sobre-os-triggers/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-entendendo-sobre-os-triggers/references/code-examples.md)
