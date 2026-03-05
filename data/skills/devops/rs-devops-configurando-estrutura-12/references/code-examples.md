# Code Examples: Semantic Release — Configuracao na Pipeline

## Exemplo completo do workflow step

```yaml
# Dentro do job de CI/CD, apos build e testes
steps:
  # ... steps anteriores (checkout, setup-node, install, test, build)

  - name: Semantic Release
    uses: cycjimmy/semantic-release-action@v4
    env:
      GH_TOKEN: ${{ secrets.GH_TOKEN }}
    # Nota: NPM_TOKEN omitido porque nao publicamos no npm

  # ... steps posteriores (generate tag, deploy, etc)
```

## Arquivo .releaserc completo

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/git",
    "@semantic-release/github"
  ]
}
```

**Localizacao:** raiz do projeto, junto com `package.json`.

## Instalacao dos plugins

```bash
# Cada plugin individualmente como devDependency
npm install -D @semantic-release/commit-analyzer
npm install -D @semantic-release/release-notes-generator
npm install -D @semantic-release/changelog
npm install -D @semantic-release/git
npm install -D @semantic-release/github
```

Ou em um unico comando:

```bash
npm install -D @semantic-release/commit-analyzer \
  @semantic-release/release-notes-generator \
  @semantic-release/changelog \
  @semantic-release/git \
  @semantic-release/github
```

## Configuracao do token no GitHub

### Criacao do Fine-Grained Token

```
GitHub.com > Settings (perfil) > Developer Settings > Personal Access Tokens > Fine-grained tokens

Repository access: Only select repositories → [seu-repositorio]

Permissions:
  - Actions: Read
  - Contents: Read and Write
  - Issues: Read and Write
```

### Adicionar como Secret no repositorio

```
Repositorio > Settings > Secrets and variables > Actions > New repository secret

Name: GH_TOKEN
Value: github_pat_xxxxxxxxxxxxxxxx
```

## Variacao: multiplas branches de release

```json
{
  "branches": [
    "main",
    { "name": "next", "prerelease": true },
    { "name": "beta", "prerelease": true }
  ],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/git",
    "@semantic-release/github"
  ]
}
```

## Exemplo de commits e versoes resultantes

```bash
# Commit de fix → patch
git commit -m "fix: correct date validation in scheduling"
# 1.0.0 → 1.0.1

# Commit de feature → minor
git commit -m "feat: add user endpoint for profile management"
# 1.0.1 → 1.1.0

# Commit com breaking change → major
git commit -m "feat!: redesign authentication flow

BREAKING CHANGE: JWT tokens now use RS256 instead of HS256"
# 1.1.0 → 2.0.0
```

## CHANGELOG.md gerado automaticamente (exemplo)

```markdown
# Changelog

## [2.0.0](https://github.com/user/repo/compare/v1.1.0...v2.0.0) (2026-02-28)

### ⚠ BREAKING CHANGES

* JWT tokens now use RS256 instead of HS256

### Features

* redesign authentication flow (abc1234)

## [1.1.0](https://github.com/user/repo/compare/v1.0.1...v1.1.0) (2026-02-27)

### Features

* add user endpoint for profile management (def5678)

## [1.0.1](https://github.com/user/repo/compare/v1.0.0...v1.0.1) (2026-02-26)

### Bug Fixes

* correct date validation in scheduling (ghi9012)
```