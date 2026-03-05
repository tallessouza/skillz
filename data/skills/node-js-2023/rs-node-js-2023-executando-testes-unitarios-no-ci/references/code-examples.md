# Code Examples: Executando Testes Unitarios no CI

## Exemplo completo do workflow criado na aula

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

## Variacoes

### Trigger em pull_request em vez de push

```yaml
on: [pull_request]
```

### Trigger em ambos

```yaml
on: [push, pull_request]
```

### Filtrar branches especificas

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
```

### Usando pnpm em vez de npm

```yaml
steps:
  - uses: actions/checkout@v4

  - uses: pnpm/action-setup@v2
    with:
      version: 8

  - uses: actions/setup-node@v4
    with:
      node-version: 18
      cache: 'pnpm'

  - run: pnpm install --frozen-lockfile

  - run: pnpm run test
```

### Usando yarn

```yaml
steps:
  - uses: actions/checkout@v4

  - uses: actions/setup-node@v4
    with:
      node-version: 18
      cache: 'yarn'

  - run: yarn install --frozen-lockfile

  - run: yarn test
```

### Adicionando variaveis de ambiente

```yaml
steps:
  - uses: actions/checkout@v4

  - uses: actions/setup-node@v4
    with:
      node-version: 18
      cache: 'npm'

  - run: npm ci

  - run: npm run test
    env:
      NODE_ENV: test
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Multiplos jobs (unitarios + lint)

```yaml
name: CI

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

  run-lint:
    name: Run Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
```

## Comandos CLI usados na aula

```bash
# Inicializar repositorio
git init

# Commit inicial
git add .
git commit -m "initial commit"

# Criar repositorio no GitHub via CLI
gh repo create nome-do-repo --private --source=. --remote=origin --push

# Ver repositorio no browser
gh repo view -w

# Verificar execucao das actions
gh run list --limit 1
gh run view --log
```

## Estrutura de pastas necessaria

```
projeto/
├── .github/
│   └── workflows/
│       └── run-unit-tests.yml    # Workflow de CI
├── src/                           # Codigo fonte
├── package.json                   # Scripts de teste configurados
├── package-lock.json              # Lockfile (obrigatorio para npm ci)
└── .gitignore                     # .env, node_modules, build, coverage
```