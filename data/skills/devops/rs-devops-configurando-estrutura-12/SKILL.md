---
name: rs-devops-configurando-estrutura-12
description: "Configures Semantic Release in GitHub Actions CI/CD pipelines for automated versioning. Use when user asks to 'setup semantic release', 'automate versioning', 'configure release pipeline', 'add changelog generation', or 'setup semver in CI'. Applies semver conventions, .releaserc configuration, GitHub token scoping, and plugin installation. Make sure to use this skill whenever setting up automated release workflows in Node.js projects. Not for manual versioning, npm publishing, or Docker image tagging."
---

# Semantic Release — Configuracao na Pipeline

> Configure o Semantic Release como step na GitHub Actions para automatizar versionamento semantico baseado em commits.

## Rules

1. **Release somente na branch main** — configure `branches: ["main"]` no `.releaserc`, porque releases de branches secundarias geram confusao de versoes
2. **Token com escopo minimo** — o Personal Access Token precisa apenas de: read actions, read/write contents, read/write issues, porque o Semantic Release faz commit, cria release e pode criar issues
3. **Token como secret do repositorio** — armazene em Settings > Secrets > Actions como `GH_TOKEN`, porque hardcoded no workflow expoe credenciais
4. **Plugins como devDependencies** — instale todos os plugins com `-D`, porque sao ferramentas de build, nao dependencias de runtime
5. **Step antes do generate tag** — o semantic release deve rodar antes de qualquer step de tagging manual, porque ele proprio gerencia as tags
6. **Sem npm token se nao publica pacote** — omita `NPM_TOKEN` quando o projeto nao e publicado no registry npm, porque evita configuracao desnecessaria

## How to write

### Step na GitHub Actions

```yaml
- name: Semantic Release
  uses: cycjimmy/semantic-release-action@v4
  env:
    GH_TOKEN: ${{ secrets.GH_TOKEN }}
```

### Arquivo .releaserc

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

### Instalacao dos plugins

```bash
npm install -D @semantic-release/commit-analyzer \
  @semantic-release/release-notes-generator \
  @semantic-release/changelog \
  @semantic-release/git \
  @semantic-release/github
```

## Example

**Before (versionamento manual no package.json):**
```json
{
  "version": "1.0.0"
}
```
Desenvolvedor manualmente edita version a cada release.

**After (com Semantic Release configurado):**
```
feat: add user endpoint     → 1.1.0 (minor)
fix: correct validation     → 1.1.1 (patch)
feat!: redesign auth flow   → 2.0.0 (major, breaking change)
```
Version no package.json, CHANGELOG.md e GitHub Release atualizados automaticamente.

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto Node.js com CI no GitHub Actions | Configure semantic release com .releaserc |
| Projeto nao publica no npm | Omita NPM_TOKEN, use apenas GH_TOKEN |
| Multiplas branches de release | Adicione branches no array do .releaserc |
| Token do GitHub | Fine-grained com escopo minimo: actions(read), contents(rw), issues(rw) |
| Step ordering | Semantic release ANTES de qualquer generate tag manual |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Hardcode token no workflow YAML | Use `${{ secrets.GH_TOKEN }}` |
| Token com full repo access | Fine-grained: actions(read), contents(rw), issues(rw) |
| Plugins como dependencies | Plugins como devDependencies (`-D`) |
| Editar version manualmente | Deixe o semantic release gerenciar |
| Release de qualquer branch | Restrinja a `["main"]` no .releaserc |
| Incluir NPM_TOKEN sem publicar | Omita se nao publica no npm registry |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
