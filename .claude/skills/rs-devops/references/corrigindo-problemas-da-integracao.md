---
name: rs-devops-corrigindo-problemas-integracao
description: "Applies correct GitHub Actions permissions for Semantic Release when fixing CI/CD integration issues. Use when user asks to 'fix semantic release', 'fix CI permissions', 'configure github actions permissions', 'semantic release not working', or 'fix release pipeline'. Ensures token scopes, workflow permissions, and CI permissions are correctly set for issues and pull requests. Make sure to use this skill whenever debugging Semantic Release failures in GitHub Actions. Not for setting up Semantic Release from scratch, Docker configuration, or AppRunner deployment."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: ci-cd-semantic-release
  tags: [semantic-release, github-actions, permissions, ci-cd, token, workflow]
---

# Corrigindo Problemas de Integracao com Semantic Release

> Quando Semantic Release falha por permissao, ajuste tres camadas: CI workflow permissions, repository settings, e token scopes.

## Rules

1. **Sempre configure permissoes em tres camadas** — CI workflow YAML, repository settings, e personal access token, porque uma camada faltando causa falha silenciosa
2. **Issues e Pull Requests precisam de write** — nao apenas read, porque a lib `@semantic-release/github` tenta correlacionar issues/PRs com releases e potencialmente escrever comentarios
3. **Verifique o token antes de re-executar** — acesse Settings > Developer Settings > Personal Access Tokens e confirme `issues: read/write` e `pull_requests: read/write`, porque o token e a camada mais esquecida
4. **Rerun nao gera release** — Semantic Release so gera release quando ha commits novos desde a ultima tag, porque ela e orientada pelo arquivo `.releaserc`
5. **Teste o fluxo completo** — abra PR, faca merge, e verifique se tag + changelog + release foram gerados, porque testar apenas o job nao valida o pipeline inteiro

## How to configure

### Permissoes no CI (GitHub Actions workflow)

```yaml
permissions:
  contents: write
  issues: write
  pull-requests: write
```

### Repository Settings

```
Repository > Settings > Actions > General > Workflow permissions
→ Selecione "Read and write permissions"
→ Save
```

### Token Scopes (PAT)

```
Profile > Settings > Developer Settings > Personal Access Tokens
→ Repository permissions:
  - Issues: Read and write
  - Pull requests: Read and write
  - Contents: Read and write
```

## Example

**Before (CI falhando com erro de permissao):**
```yaml
# Semantic Release tenta buscar issues e PRs mas recebe 403
permissions:
  contents: write
  # issues e pull-requests nao configurados → falha
```

**After (com permissoes corretas):**
```yaml
permissions:
  contents: write
  issues: write
  pull-requests: write
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Erro de permissao no Semantic Release | Verificar as tres camadas: CI, repo settings, token |
| Rerun do job nao gera release | Normal — precisa de commits novos apos ultima tag |
| Release gerou tag mas nao changelog | Verificar plugins no `.releaserc` |
| Token tem permissao mas CI falha | Verificar se workflow permissions do repo esta em "Read and write" |
| Quer testar sem gerar release real | Faca rerun de job existente (nao gera release sem commits novos) |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Configurar apenas o token e ignorar CI permissions | Configurar token + CI workflow + repo settings |
| Dar permissao so de `read` para issues/PRs | Usar `write` porque a lib pode comentar em issues/PRs |
| Testar re-executando job sem commits novos e achar que quebrou | Criar commit real, abrir PR, fazer merge, e verificar release |
| Ignorar o `.releaserc` ao debugar | Verificar plugins configurados — eles definem o comportamento |

## Troubleshooting

### Semantic Release nao gera release apos rerun do job
**Symptom:** O job roda com sucesso mas nenhuma release, tag ou changelog e gerado.
**Cause:** Semantic Release so gera release quando ha commits novos desde a ultima tag. Rerun reutiliza o mesmo commit.
**Fix:** Crie um commit real (mesmo que seja `chore: trigger release`), abra PR, faca merge, e verifique se a release foi gerada.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
