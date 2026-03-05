# Code Examples: Adicionando Step de Build

## Exemplo 1: Build simples com latest (apenas para teste)

Este foi o primeiro exemplo do instrutor — funcional, mas nao recomendado para producao:

```yaml
- name: Build docker image
  run: docker build -t skillz-ci-api:latest .
```

O instrutor nota que se voce nao passar tag nenhuma, o Docker automaticamente tagueia como `latest`. Entao o `:latest` e ate redundante.

## Exemplo 2: Pipeline completa com geracao de tag

Este e o exemplo final da aula, com geracao de tag a partir do commit SHA:

```yaml
name: CI

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - run: yarn install
      - run: yarn run test

      - name: Generate tag
        id: generate_tag
        run: |
          SHA=$(echo $GITHUB_SHA | head -c7)
          echo "sha=$SHA" >> $GITHUB_OUTPUT

      - name: Build docker image
        run: docker build -t skillz-ci-api:${{ steps.generate_tag.outputs.sha }} .
```

## Exemplo 3: Detalhamento do step generate_tag

```yaml
- name: Generate tag
  id: generate_tag
  run: |
    # GITHUB_SHA contem o hash completo do commit (40 chars)
    # Ex: 2add08ad1c2310d447ed50e161cfb9890282e372

    # Pega apenas os 7 primeiros caracteres
    SHA=$(echo $GITHUB_SHA | head -c7)
    # Resultado: 2add08a

    # Exporta como variavel de saida do step
    echo "sha=$SHA" >> $GITHUB_OUTPUT
```

## Exemplo 4: Referenciando outputs — comparacao com matrix

O instrutor compara a sintaxe de referencia de outputs com a de matrix strategy:

```yaml
# Matrix strategy (aula anterior)
node-version: ${{ matrix.node-version }}

# Step outputs (esta aula)
tag: ${{ steps.generate_tag.outputs.sha }}
```

Ambos usam a mesma sintaxe de interpolacao `${{ }}`, mas acessam contextos diferentes.

## Exemplo 5: Variacao — Dockerfile em subdiretorio

Se o Dockerfile nao estiver na raiz:

```yaml
- name: Build docker image
  run: docker build -t skillz-ci-api:${{ steps.generate_tag.outputs.sha }} ./backend
```

## Exemplo 6: Multiplos outputs no GITHUB_OUTPUT

O instrutor menciona que voce pode colocar varios valores no GITHUB_OUTPUT:

```yaml
- name: Generate metadata
  id: metadata
  run: |
    SHA=$(echo $GITHUB_SHA | head -c7)
    echo "sha=$SHA" >> $GITHUB_OUTPUT
    echo "timestamp=$(date +%Y%m%d%H%M%S)" >> $GITHUB_OUTPUT
    echo "branch=${GITHUB_REF##*/}" >> $GITHUB_OUTPUT

- name: Build docker image
  run: |
    docker build \
      -t minha-app:${{ steps.metadata.outputs.sha }} \
      -t minha-app:${{ steps.metadata.outputs.branch }}-${{ steps.metadata.outputs.timestamp }} \
      .
```