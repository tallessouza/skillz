---
name: rs-full-stack-alterando-e-commitando
description: "Enforces correct Git modify-stage-commit workflow when writing or teaching Git commands. Use when user asks to 'commit changes', 'save changes in git', 'update a file and commit', 'git workflow', or 'stage and commit'. Applies rules: always check git status before staging, stage specific files not all, write descriptive commit messages, understand tracked vs untracked. Make sure to use this skill whenever the user is working with basic Git operations on modified files. Not for branching, merging, rebasing, or remote operations."
---

# Alterando e Commitando

> Ao modificar arquivos num repositorio Git, siga sempre o fluxo: modificar → verificar status → adicionar ao staged → commit com mensagem descritiva.

## Rules

1. **Sempre verifique com `git status` antes de staged** — porque voce precisa ver exatamente o que mudou antes de decidir o que entra no commit
2. **Adicione arquivos especificos, nunca `git add .` cegamente** — `git add phrases.txt` nao `git add .`, porque arquivos indesejados como `.DS_Store` podem entrar no commit
3. **Escreva mensagens de commit descritivas** — `git commit -m "Adicionei novas linhas no phrases.txt"` nao `git commit -m "update"`, porque a mensagem descreve O QUE foi feito
4. **Entenda que Git rastreia automaticamente arquivos ja adicionados** — apos o primeiro `git add`, qualquer modificacao futura aparece no `git status` sem precisar re-registrar o arquivo
5. **Arquivo modificado nao staged = nao entra no commit** — se nao fez `git add`, o `git commit` ignora a mudanca, porque o staged area e o filtro intencional
6. **Use `git restore` para descartar mudancas indesejadas** — se esta insatisfeito com as alteracoes, `git restore arquivo` volta ao estado do ultimo commit

## How to write

### Fluxo completo de modificacao e commit

```bash
# 1. Modifique o arquivo
echo "nova linha" >> phrases.txt

# 2. Verifique o que mudou
git status

# 3. Adicione apenas o arquivo desejado ao staged
git add phrases.txt

# 4. Confirme que esta no staged
git status

# 5. Crie o commit com mensagem descritiva
git commit -m "Adicionei novas linhas no phrases.txt"
```

### Descartando mudancas

```bash
# Arquivo modificado mas voce nao quer manter
git status          # veja o que mudou
git restore phrases.txt  # volta ao ultimo commit
```

## Example

**Before (erro comum):**
```bash
# Editou o arquivo e faz commit direto
vim phrases.txt
git commit -m "update"    # Nada acontece — arquivo nao esta no staged
```

**After (com este skill aplicado):**
```bash
vim phrases.txt
git status                              # Verifica: "modified: phrases.txt"
git add phrases.txt                     # Adiciona especificamente
git status                              # Confirma no staged
git commit -m "Adicionei novas frases"  # Commit com mensagem clara
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Modificou um arquivo ja rastreado | `git status` → `git add arquivo` → `git commit -m "descricao"` |
| `git status` mostra arquivo nao rastreado indesejado | Ignore-o ou adicione ao `.gitignore`, nunca use `git add .` |
| Fez mudancas mas se arrependeu | `git restore arquivo` para voltar ao ultimo commit |
| Commit retornou "nothing to commit" | Voce esqueceu de fazer `git add` — o arquivo nao esta no staged |
| Quer ver o que o commit registrou | Leia a saida: arquivos modificados, insercoes, delecoes |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `git add .` sem verificar status | `git status` → `git add arquivo_especifico` |
| `git commit -m "update"` | `git commit -m "Adicionei novas linhas no phrases.txt"` |
| Commit sem verificar staged | `git status` antes de cada `git commit` |
| Ignorar a saida do commit | Leia: quantos arquivos, insercoes, delecoes |
| Tentar adivinhar o que mudou | `git status` sempre mostra exatamente o que mudou |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre o fluxo modify-stage-commit e como o Git rastreia arquivos
- [code-examples.md](references/code-examples.md) — Todos os exemplos de comandos Git expandidos com variacoes