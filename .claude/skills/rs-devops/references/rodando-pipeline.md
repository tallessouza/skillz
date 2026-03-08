---
name: rs-devops-rodando-pipeline
description: "Applies CI/CD pipeline execution with GitHub Actions and semantic-release for automated versioning. Use when user asks to 'run pipeline', 'configure semantic-release', 'fix GitHub Actions permissions', 'setup trunk-based development', or 'automate changelog'. Enforces trunk-based workflow, conventional commits, semantic versioning, and granular GitHub Actions permissions. Make sure to use this skill whenever configuring GitHub Actions workflows with semantic-release or troubleshooting pipeline permissions. Not for Terraform pipelines, Docker build pipelines, or non-GitHub CI systems."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: ci-cd-pipeline
  tags: [github-actions, semantic-release, ci-cd, pipeline, conventional-commits, permissions, changelog]
---

# Rodando Pipeline CI/CD

> Configure e execute pipelines GitHub Actions com semantic-release seguindo trunk-based development, corrigindo permissoes iterativamente.

## Prerequisites

- Repositorio GitHub com Actions habilitado
- `semantic-release` configurado no projeto (via `.releaserc` ou `release.config.js`)
- Workflow YAML em `.github/workflows/`
- Branch `main` como branch principal

## Steps

### Step 1: Criar branch seguindo convencao

```bash
git checkout -b feature/configure-release
```

**Convencao de nome:** `feature/{descricao-breve}` — identifica intencao e autor.

### Step 2: Commitar e push na feature branch

```bash
git status
git add .
git commit -m "feat: configure semantic release"
git push origin feature/configure-release
```

O workflow NAO dispara aqui porque o trigger esta configurado apenas para `main`.

### Step 3: Abrir Pull Request

Criar PR no GitHub com descricao clara. Nenhuma Action dispara na abertura (a menos que configurado com `on: pull_request`).

**Opcional:** Configurar Actions em PRs para validar coverage, code smells (SonarQube/SonarCloud), linhas duplicadas.

### Step 4: Merge e observar pipeline

```bash
# Merge via GitHub UI
# Deletar branch remota (boa pratica, automatizavel)
```

Apos merge na `main`, o workflow dispara automaticamente.

### Step 5: Corrigir permissoes do repositorio

Se erro `no permission, cannot push to git repository`:

```yaml
# No workflow YAML, seção permissions:
permissions:
  contents: write  # Era 'read', precisa ser 'write'
```

`contents` controla: commits, branches, downloads e operacoes no repositorio.

### Step 6: Commitar fix e repetir ciclo

```bash
git checkout -b fix/content-repository-permission
git add .
git commit -m "fix: content repository permission to write"
git push origin fix/content-repository-permission
# Abrir PR → Merge → Deletar branch
```

## Output format

Pipeline bem-sucedida gera:
- **Changelog** automatico com commits formatados
- **Release** com versao semantica (major/minor/patch)
- Tag git correspondente

## Error handling

| Erro | Causa | Solucao |
|------|-------|---------|
| `no permission, cannot push to git repository` | `contents: read` no workflow | Alterar para `contents: write` |
| Semantic-release falha em gerar release | Permissao insuficiente para recurso especifico | Verificar todas as permissions no workflow YAML |
| Workflow nao dispara | Push em branch que nao e `main` | Confirmar trigger `on: push: branches: [main]` |

## Verification

- Changelog gerado automaticamente com commits listados
- Release criada com versao semantica no GitHub Releases
- Issue automatica aberta pelo semantic-release em caso de falha (util para debug)


## Troubleshooting

### Semantic-release falha com "no permission, cannot push"
**Symptom:** Pipeline roda mas semantic-release nao consegue criar release
**Cause:** Permissao `contents` no workflow YAML esta como `read` em vez de `write`
**Fix:** Altere `permissions: contents: write` no workflow YAML

### Workflow nao dispara apos push
**Symptom:** Push feito mas nenhuma Action aparece no repositorio
**Cause:** Push foi feito em branch que nao e `main` e o trigger esta configurado apenas para `on: push: branches: [main]`
**Fix:** Faca merge na main via PR para disparar o workflow

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: Rodando Pipeline CI/CD

## Trunk-Based Development na pratica

O instrutor demonstra um fluxo proximo ao trunk-based development: branches curtas criadas diretamente da `main`, com merge rapido. A ideia e que a branch viva pouco tempo — o suficiente para o PR ser revisado e mergeado.

### Convencao de nomenclatura de branches

O instrutor segue: `{tipo}/{descricao-breve}` — exemplos:
- `feature/configure-release`
- `fix/content-repository-permission`

Ele menciona que gosta de incluir tambem quem esta fazendo, para controle. O tipo (`feature`, `fix`) indica a intencao, a descricao e breve, e opcionalmente identifica o autor.

## Por que o workflow nao dispara na feature branch

O workflow esta configurado com trigger `on: push: branches: [main]`. Qualquer push em outra branch e ignorado. Isso e intencional — o pipeline de deploy so roda apos merge na main.

## O ciclo iterativo de permissoes

O instrutor demonstra um padrao real e comum: configurar pipeline, rodar, falhar por permissao, corrigir, rodar de novo. Isso acontece porque:

1. GitHub Actions tem permissoes granulares por recurso
2. O default e restritivo (`read`)
3. Semantic-release precisa de `write` em `contents` para criar commits (changelog), tags e releases

### A permissao `contents`

No YAML do workflow, a secao `permissions` controla o que o token `GITHUB_TOKEN` pode fazer:

```yaml
permissions:
  contents: write  # commits, branches, downloads, releases
```

Sem `write`, o semantic-release consegue analisar commits e calcular a versao, mas falha ao tentar:
- Fazer push do changelog commitado
- Criar a tag
- Criar a release

### Issue automatica

O instrutor mostra que o semantic-release abriu automaticamente uma issue no repositorio quando falhou. Isso e um recurso do semantic-release para facilitar debugging — a issue contem documentacao do que deu errado.

## Semantic-release: o que ele faz no pipeline

1. Analisa commits desde a ultima release (convencional commits)
2. Determina o tipo de bump: major, minor ou patch
3. Gera changelog automatico
4. Cria commit com changelog atualizado
5. Cria tag git com a nova versao
6. Cria release no GitHub com o pacote

O instrutor destaca que o semantic-release roda ANTES do generate tag no pipeline — e uma etapa configurativa, nao de deploy.

## Problema residual: permissao para recurso especifico

Mesmo apos corrigir `contents: write`, o instrutor ainda encontrou erro de permissao. O changelog foi gerado, a release foi parcialmente criada, mas algo ainda faltou. Ele menciona que precisa investigar "qual recurso" nao tem permissao — possivelmente `issues: write` ou `pull-requests: write` para que o semantic-release possa interagir completamente.

## Boas praticas observadas

1. **Deletar branch apos merge** — manter repositorio limpo. Pode ser automatizado nas settings do GitHub
2. **Nao commitar direto na main** — sempre via PR, mesmo sem revisores
3. **Investigar antes de forcar** — o instrutor nao forca permissoes amplas, vai corrigindo granularmente
4. **Actions em PRs (mencionado)** — coverage, code smells, linhas duplicadas via SonarQube/SonarCloud

---

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
