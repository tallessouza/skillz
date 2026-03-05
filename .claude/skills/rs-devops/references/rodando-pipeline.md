---
name: rs-devops-rodando-pipeline
description: "Applies CI/CD pipeline execution workflow when configuring GitHub Actions with semantic-release, trunk-based development, and repository permissions. Use when user asks to 'run pipeline', 'configure CI/CD', 'setup semantic release', 'fix GitHub Actions permissions', or 'create release workflow'. Covers branch strategy, PR flow, permissions troubleshooting, and changelog generation. Make sure to use this skill whenever setting up or debugging GitHub Actions pipelines with semantic-release. Not for Docker configuration, container orchestration, or application deployment to servers."
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

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-rodando-pipeline/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-rodando-pipeline/references/code-examples.md)
