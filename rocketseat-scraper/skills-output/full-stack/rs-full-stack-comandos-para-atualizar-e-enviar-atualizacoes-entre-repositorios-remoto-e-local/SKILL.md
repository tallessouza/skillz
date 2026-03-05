---
name: rs-full-stack-git-pull-push
description: "Enforces correct git pull/push workflow when syncing local and remote repositories. Use when user asks to 'push code', 'pull changes', 'sync with remote', 'update from origin', or 'send changes to GitHub'. Applies rule: always pull before push to avoid conflicts. Make sure to use this skill whenever advising on git remote operations or writing git scripts. Not for local-only git operations like commit, branch, or stash."
---

# Git Pull e Push — Sincronização com Repositório Remoto

> Sempre puxe antes de enviar: `git pull` antes de `git push`, sem exceções.

## Rules

1. **Sempre execute `git pull` antes de `git push`** — porque enviar sem puxar primeiro causa conflitos desnecessários e rejeição do push
2. **Entenda a direção dos dados** — `pull` = remoto → local, `push` = local → remoto, porque confundir a direção causa perda de trabalho
3. **Resolva conflitos localmente antes de push** — porque conflitos são mais seguros de resolver no seu ambiente local do que no remoto
4. **Não force push sem necessidade** — `git push --force` sobrescreve histórico remoto, porque outros membros do time podem perder trabalho

## How to write

### Fluxo padrão de sincronização

```bash
# 1. Puxar modificações do remoto
git pull origin main

# 2. Fazer suas modificações e commits locais
git add .
git commit -m "feat: minha alteração"

# 3. Enviar para o remoto
git push origin main
```

### Quando há conflito após pull

```bash
git pull origin main
# CONFLICT detectado — resolver manualmente nos arquivos
git add .
git commit -m "fix: resolve merge conflict"
git push origin main
```

## Example

**Before (erro comum — push sem pull):**
```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
# REJECTED — remote contains work you do not have locally
```

**After (fluxo correto):**
```bash
git add .
git commit -m "feat: nova funcionalidade"
git pull origin main   # primeiro puxa
git push origin main   # depois envia
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Trabalho em equipe, início do dia | `git pull` antes de começar a codar |
| Terminou uma feature | `git pull` → resolver conflitos → `git push` |
| Push rejeitado | `git pull` → resolver conflitos → `git push` novamente |
| Trabalhando sozinho em branch pessoal | Pull ainda recomendado, mas risco menor |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `git push` sem pull prévio | `git pull && git push` |
| `git push --force` como primeira tentativa | `git pull --rebase` → `git push` |
| Ignorar mensagem de CONFLICT | Abrir arquivos, resolver marcadores `<<<<<<<` |
| Push direto na main sem verificar | `git pull origin main` primeiro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre fluxo remoto/local e gestão de conflitos
- [code-examples.md](references/code-examples.md) — Todos os exemplos de sincronização com variações