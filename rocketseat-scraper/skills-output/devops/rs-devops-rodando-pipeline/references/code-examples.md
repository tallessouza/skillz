# Code Examples: Rodando Pipeline CI/CD

## Fluxo completo de branch + PR + merge

### Criar branch e commitar

```bash
# Verificar estado atual
git status

# Criar branch a partir da main
git checkout -b feature/configure-release

# Adicionar arquivos e commitar
git add .
git commit -m "feat: configure semantic release"

# Push para remote
git push origin feature/configure-release
```

### Apos merge, corrigir permissao

```bash
# Nova branch para o fix
git checkout -b fix/content-repository-permission

# Editar workflow YAML, commitar e push
git add .
git commit -m "fix: content repository permission to write"
git push origin fix/content-repository-permission
```

## Workflow YAML — secao de permissoes

### Antes (somente leitura — causa erro):

```yaml
permissions:
  contents: read
```

### Depois (escrita habilitada):

```yaml
permissions:
  contents: write
```

## Estrutura tipica do workflow com semantic-release

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: yarn install

      - name: Run tests
        run: yarn test

      - name: Semantic Release
        run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Ordem importante:** Semantic Release roda ANTES de qualquer generate tag customizado. Ele cuida de versionamento, changelog e release.

## Configuracao de Actions para PRs (mencionado pelo instrutor)

```yaml
# Workflow separado para validacao em PRs
name: PR Validation

on:
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies
        run: yarn install

      - name: Code coverage
        run: yarn test --coverage

      # Opcional: SonarQube/SonarCloud
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

## Output do semantic-release

### Changelog gerado automaticamente

```markdown
# Changelog

## 1.0.0 (2026-02-28)

### Features

* configure semantic release (abc1234)
* add Docker configuration (def5678)

### Bug Fixes

* content repository permission to write (ghi9012)
```

### Release no GitHub

- Nome: `v1.0.0`
- Tag: `v1.0.0`
- Body: changelog da versao
- Assets: pacote gerado (se configurado)

## Permissoes granulares do GitHub Actions

```yaml
permissions:
  contents: write       # Commits, branches, downloads, releases
  issues: write         # Criar/fechar issues (semantic-release usa)
  pull-requests: write  # Comentar em PRs (opcional)
  packages: write       # Publicar packages (se necessario)
```

**Dica:** Se o semantic-release continuar falhando com `contents: write`, adicionar `issues: write` — o semantic-release cria issues automaticas quando falha e precisa dessa permissao.