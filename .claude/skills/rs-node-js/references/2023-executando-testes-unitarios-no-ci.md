---
name: rs-node-js-2023-testes-unitarios-ci
description: "Generates GitHub Actions workflow for running unit tests on CI when setting up continuous integration for Node.js projects. Use when user asks to 'setup CI', 'add GitHub Actions', 'run tests on push', 'configure CI/CD', or 'automate tests'. Follows pattern: checkout, setup-node with cache, npm ci, npm run test. Make sure to use this skill whenever creating CI pipelines for Node.js/TypeScript projects. Not for CD/deployment pipelines, Docker builds, or infrastructure provisioning."
---

# Executando Testes Unitarios no CI

> Configure GitHub Actions para executar testes unitarios automaticamente a cada push, garantindo que codigo novo nao quebre a aplicacao.

## Prerequisites

- Repositorio Git inicializado e conectado ao GitHub
- Testes unitarios configurados com script no `package.json` (ex: `npm run test`)
- `package-lock.json` commitado (necessario para `npm ci`)
- Se nao encontrar: verificar se o projeto usa `pnpm` ou `yarn` e ajustar o campo `cache` correspondente

## Steps

### Step 1: Criar estrutura de pastas

```bash
mkdir -p .github/workflows
```

### Step 2: Criar workflow de testes unitarios

```yaml
# .github/workflows/run-unit-tests.yml
name: Run Unit Tests

on: [push]

jobs:
  run-unit-tests:
    name: Run Unit Tests
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'

      - run: npm ci

      - run: npm run test
```

### Step 3: Commit e push

```bash
git add .github/workflows/run-unit-tests.yml
git commit -m "ci: add unit tests workflow"
git push
```

### Step 4: Verificar execucao

```bash
gh run list --limit 1
gh run view --log
```

## Decisoes-chave

| Decisao | Escolha | Porque |
|---------|---------|--------|
| `npm ci` em vez de `npm install` | `npm ci` | Nao modifica `package-lock.json`, nao faz perguntas interativas, instalacao limpa e reproduzivel |
| `cache: 'npm'` no setup-node | Ativar cache | Proximas execucoes reaproveitam dependencias se nao mudaram, economizando tempo |
| `on: [push]` | Push trigger | Valida codigo a cada envio, alternativa seria `on: [pull_request]` para validar apenas PRs |
| `runs-on: ubuntu-latest` | Ubuntu | Mais comum e rapido, GitHub tambem suporta macOS e Windows |

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto usa pnpm | Trocar `cache: 'npm'` por `cache: 'pnpm'` e `npm ci` por `pnpm install --frozen-lockfile` |
| Projeto usa yarn | Trocar `cache: 'npm'` por `cache: 'yarn'` e `npm ci` por `yarn install --frozen-lockfile` |
| Precisa rodar apenas em PRs | Trocar `on: [push]` por `on: [pull_request]` |
| Precisa de ambos push e PR | Usar `on: [push, pull_request]` |
| Testes E2E separados | Criar workflow separado com banco de dados e setup adicional |
| Node version especifica | Alterar `node-version` para a versao desejada |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `npm install` no CI | `npm ci` — instalacao limpa sem efeitos colaterais |
| Esquecer `cache` no setup-node | Sempre configurar `cache` com o package manager usado |
| Rodar testes E2E no mesmo workflow dos unitarios | Separar em workflows distintos — E2E precisa de infra adicional |
| Commitar sem `package-lock.json` | Garantir que lockfile esta no repositorio para `npm ci` funcionar |

## Error handling

- Se action falhar no `npm ci`: verificar se `package-lock.json` esta commitado e atualizado
- Se testes falharem: checar se testes dependem de variaveis de ambiente (adicionar `env:` no step)
- Se setup-node falhar: verificar versao do Node especificada e action version

## Verification

- Apos push, acessar aba Actions no GitHub ou rodar `gh run list`
- Cada commit fica associado a um check verde (sucesso) ou vermelho (falha)
- Clicar no job para ver logs detalhados de cada step

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-executando-testes-unitarios-no-ci/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-executando-testes-unitarios-no-ci/references/code-examples.md)
