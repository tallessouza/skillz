# Code Examples: GitHub Actions

## Exemplo 1: Workflow minimo

O workflow mais simples possivel para CI:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install
      - run: npm test
```

**Explicacao step-by-step:**
1. `name: CI` — nome do workflow visivel na aba Actions
2. `on: push: branches: [main]` — trigger: executa quando houver push na main
3. `jobs:` — define os jobs do workflow
4. `runs-on: ubuntu-latest` — runner: maquina Ubuntu
5. `actions/checkout@v4` — action open source que faz checkout do codigo
6. `npm install` e `npm test` — comandos custom

## Exemplo 2: CI separado de CD por branch

```yaml
name: Pipeline

on:
  push:
    branches: [dev, main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test

  cd:
    needs: ci
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
```

**Logica de branches (conforme instrutor):**
- Push em `dev`: roda apenas job `ci` (install + test)
- Push em `main`: roda `ci` e depois `cd` (install + test + build + deploy)
- PR para `main`: roda `ci` para validacao

## Exemplo 3: Usando actions open source do marketplace

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # Action open source: checkout do codigo
      - uses: actions/checkout@v4

      # Action open source: setup do Node.js
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      # Action open source: cache de dependencias
      - uses: actions/cache@v4
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

      - run: npm ci
      - run: npm test
```

**Ponto do instrutor:** GitHub Actions tem varias actions open source prontas. Sempre busque no marketplace antes de criar algo custom.

## Exemplo 4: Multiplos triggers

```yaml
on:
  # Trigger por push
  push:
    branches: [main, dev]

  # Trigger por pull request
  pull_request:
    branches: [main]

  # Trigger manual (workflow_dispatch)
  workflow_dispatch:

  # Trigger por schedule (cron)
  schedule:
    - cron: '0 6 * * 1' # Segunda-feira as 6h
```

O instrutor menciona que voce controla no YAML "em qual momento isso sera disparado" — push, merge, pull request, entre outros.

## Exemplo 5: Diferentes runners

```yaml
jobs:
  test-ubuntu:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test

  test-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
```

**Conforme instrutor:** o runner eh a maquina que executa. Voce configura declarativamente qual SO quer usar.

## Exemplo 6: Pipeline para diferentes tipos de repositorio

### Backend (Node.js)
```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
  - run: npm ci
  - run: npm test
  - run: npm run build
```

### Frontend (React/Next)
```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
  - run: npm ci
  - run: npm run lint
  - run: npm test
  - run: npm run build
```

### Infraestrutura (Terraform)
```yaml
steps:
  - uses: actions/checkout@v4
  - uses: hashicorp/setup-terraform@v3
  - run: terraform init
  - run: terraform validate
  - run: terraform plan
```

**Ponto do instrutor:** workflows servem para backend, frontend, jobs, ou ate repositorios de infraestrutura. A estrutura YAML eh a mesma, mudam as actions e comandos.