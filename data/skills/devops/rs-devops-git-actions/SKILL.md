---
name: rs-devops-git-actions
description: "Applies GitHub Actions CI/CD architecture when setting up workflows, pipelines, or automation in GitHub repositories. Use when user asks to 'create a workflow', 'setup CI/CD', 'configure GitHub Actions', 'add a pipeline', or 'automate tests and deploy'. Covers workflow structure, actions, runners, branch-based triggers, and YAML declarative config. Make sure to use this skill whenever creating or modifying .github/workflows/ files. Not for Jenkins, CircleCI, GitLab CI, Azure Pipelines, or non-GitHub CI/CD tools."
---

# GitHub Actions — CI/CD no GitHub

> Todo repositorio GitHub possui CI/CD built-in via Actions: descreva workflows declarativos em YAML que orquestram actions executadas por runners.

## Componentes principais

1. **Workflow** — arquivo YAML em `.github/workflows/` que descreve todo o processo de automacao (compilar, testar, deployar). Um repositorio pode ter N workflows.
2. **Actions** — tarefas individuais dentro de um workflow (instalar dependencias, rodar testes, buildar). Relacao 1:N com workflow. Muitas actions open source prontas para uso.
3. **Runner** — maquina que executa o workflow. Configurada declarativamente (ex: `ubuntu-latest`).

## Rules

1. **Um workflow por arquivo YAML** — cada `.github/workflows/*.yml` define um workflow completo, porque isso mantem pipelines independentes e debugaveis
2. **Use actions open source quando existirem** — `actions/checkout`, `actions/setup-node`, etc., porque ja estao testadas e otimizadas pela comunidade
3. **Configure triggers por branch** — separe CI (branches dev/feature) de CD (branch main), porque cada contexto exige steps diferentes
4. **Otimize minutagem** — conta free tem 2000 min/mes, entao mantenha pipelines enxutas para nao estourar cota
5. **Declarativo YAML sempre** — toda configuracao de ambiente, steps e triggers eh descrita em YAML, nao em scripts imperativos avulsos

## How to write

### Workflow basico com trigger por branch

```yaml
name: CI

on:
  push:
    branches: [dev, main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
```

### Separacao CI vs CD por branch

```yaml
jobs:
  ci:
    if: github.ref != 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test

  cd:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npm run deploy
```

## Example

**Before (sem GitHub Actions — webhook externo):**
```
GitHub repo → webhook → CircleCI (servico externo) → roda CI
```

**After (com GitHub Actions — built-in):**
```
GitHub repo → .github/workflows/ci.yml → Runner executa → CI/CD completo
```

Sem integracao externa, sem configuracao de webhook, tudo no mesmo ecossistema.

## Heuristics

| Situacao | Faca |
|----------|------|
| Commit em branch dev/feature | Rode install + test apenas |
| Merge/push na main | Rode install + test + build + deploy |
| Pull request aberto | Rode CI completo para validar antes do merge |
| Pipeline demorando muito | Otimize: cache de dependencias, steps paralelos |
| Precisa de action especifica | Busque no marketplace antes de criar custom |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Integrar servico CI externo quando usa GitHub | Use GitHub Actions built-in |
| Rodar deploy em branches de desenvolvimento | Restrinja deploy para branch main via `if` |
| Ignorar minutagem da cota free | Otimize pipeline para ser rapida e enxuta |
| Escrever scripts bash longos inline nos steps | Extraia para actions reutilizaveis ou scripts separados |
| Usar runner sem especificar SO | Declare explicitamente `runs-on: ubuntu-latest` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
