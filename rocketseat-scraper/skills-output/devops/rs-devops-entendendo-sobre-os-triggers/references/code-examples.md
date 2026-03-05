# Code Examples: GitHub Actions Triggers

## Exemplo 1: Workflow minimo com trigger

O ponto de partida mais simples para um workflow funcional:

```yaml
name: ci

on:
  push:
    branches:
      - main

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

Este workflow apenas faz checkout do codigo quando ha push na main. O setup job automatico sobe o Ubuntu, configura tokens e baixa a action de checkout.

## Exemplo 2: Adicionando Setup Node com instalacao e testes

```yaml
name: ci

on:
  push:
    branches:
      - main

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'

      - run: yarn
      - run: yarn run test
```

Pontos importantes:
- `node-version: '20'` — versao fixa do Node
- `cache: 'yarn'` — habilita cache do Yarn para acelerar builds
- Se `package.json` e `yarn.lock` estao na raiz, nao precisa definir `path`
- Para monorepos, adicione o parametro `path` apontando para o diretorio do package.json

## Exemplo 3: Matrix Strategy com multiplas versoes

```yaml
name: ci

on:
  push:
    branches:
      - main

jobs:
  build-and-push:
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

O que muda:
- `strategy.matrix.node-version` define um array de versoes
- O job roda 3 vezes em paralelo (uma para cada versao)
- `${{ matrix.node-version }}` substitui o valor fixo
- O `name` do step inclui a versao para identificacao nos logs
- Nos logs do GitHub Actions, voce vera 3 jobs separados: "16", "18", "20"

## Exemplo 4: Trigger com multiplas branches

```yaml
on:
  push:
    branches:
      - main
      - develop
      - staging
```

A estrutura aceita multiplos valores. Cada branch listada aciona o workflow quando recebe um push.

## Parametros disponiveis no setup-node

Documentados no Marketplace (`actions/setup-node@v4`):

| Parametro | Descricao | Obrigatorio |
|-----------|-----------|-------------|
| `node-version` | Versao do Node.js | Nao (mas recomendado) |
| `cache` | Gerenciador de pacotes (npm, yarn, pnpm) | Nao |
| `registry-url` | URL do registry | Nao |
| `node-version-file` | Arquivo com versao (.nvmrc, .node-version) | Nao |

## Fluxo de execucao observado nos logs

1. **Setup job** (~1s) — provisiona Ubuntu, configura tokens, baixa actions
2. **Checkout** — synca repositorio, faz checkout da branch do trigger
3. **Setup Node.js** — instala versao do Node, configura cache
4. **yarn** — instala dependencias na maquina virtual
5. **yarn run test** — executa testes

Cada step aparece separado nos logs do GitHub Actions com status de sucesso/falha.