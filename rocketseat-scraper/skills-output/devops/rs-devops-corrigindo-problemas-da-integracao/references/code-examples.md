# Code Examples: Corrigindo Problemas de Integracao com Semantic Release

## Exemplo completo de workflow com permissoes corretas

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: write
  issues: write
  pull-requests: write

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies
        run: yarn install

      - name: Run tests
        run: yarn test

      - name: Semantic Release
        run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Fluxo de comandos git usado na aula

```bash
# Fazer alteracao e commitar
git add .
git commit -m "fix: fix permissions"
git push

# Garantir sincronizacao
git pull
git pull origin main
git push
```

## Fluxo completo de teste (apos configurar permissoes)

```bash
# 1. Fazer qualquer alteracao no codigo
# 2. Commitar com mensagem semantica
git add .
git commit -m "fix: remove unnecessary config from pipeline"
git push

# 3. Abrir PR no GitHub
# 4. Fazer merge na main
# 5. Verificar: Actions > Job > Semantic Release passou
# 6. Verificar: nova tag, release, e changelog gerados
```

## Onde configurar cada permissao

### 1. No arquivo de workflow (.github/workflows/*.yml)

```yaml
permissions:
  contents: write      # ja existia antes
  issues: write        # NOVO — necessario para @semantic-release/github
  pull-requests: write # NOVO — necessario para @semantic-release/github
```

### 2. No repositorio (GitHub UI)

```
Repositorio > Settings > Actions > General
  > Workflow permissions
    > [x] Read and write permissions
    > Save
```

### 3. No token (GitHub UI)

```
Profile > Settings > Developer Settings > Personal Access Tokens
  > Selecionar o token usado no CI
  > Repository permissions:
    - Issues: Read and write          # verificar/adicionar
    - Pull requests: Read and write   # NOVO — adicionar
    - Contents: Read and write        # ja existia
  > Update token
```

## Verificacao pos-configuracao

Apos configurar tudo, o resultado esperado no log do Semantic Release:

```
# Sucesso — nova release publicada
Published release v1.0.6
Created tag v1.0.6
Updated CHANGELOG.md
```

```
# Sem commits novos (rerun) — comportamento normal
The local branch has nothing to be published
```