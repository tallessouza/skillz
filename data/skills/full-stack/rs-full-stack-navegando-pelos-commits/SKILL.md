---
name: rs-full-stack-navegando-pelos-commits
description: "Applies Git commit navigation patterns when user asks to 'check previous version', 'go back to old commit', 'view commit history', 'navigate commits', or 'see how file looked before'. Enforces correct use of git log, git checkout with SHA, and detached HEAD understanding. Make sure to use this skill whenever user needs to inspect or navigate Git history. Not for branching strategies, merge conflicts, or git rebase workflows."
---

# Navegando Pelos Commits

> Use git log para entender a historia e git checkout para viajar entre commits, sempre sabendo voltar ao presente.

## Rules

1. **Use git log antes de navegar** — sempre visualize a historia antes de fazer checkout, porque voce precisa do identificador (SHA) do commit destino
2. **Copie apenas um pedaco do SHA** — os primeiros 7-8 caracteres sao suficientes para identificar um commit unico, porque o Git resolve parciais automaticamente
3. **Entenda o detached HEAD** — ao fazer checkout para um commit antigo, voce esta em modo "observacao", nao em uma branch, porque qualquer mudanca feita aqui sera perdida sem criar branch
4. **Volte com git checkout main** — sempre retorne a branch principal apos inspecionar, porque o detached HEAD nao e lugar para trabalhar
5. **git log so mostra historico ate o commit atual** — em detached HEAD no passado, voce nao ve commits futuros, porque a visao e do ponto no tempo onde voce esta
6. **Para trazer mudancas do passado, crie uma branch** — se quiser modificar algo de um commit antigo, crie branch antes, porque commits em detached HEAD sao orfaos

## How to write

### Inspecionar historico

```bash
# Sempre comece vendo a historia
git log

# Saida mostra: SHA, autor, data, mensagem
# HEAD -> main indica onde voce esta agora
```

### Navegar para commit anterior

```bash
# Copie os primeiros caracteres do SHA do commit desejado
git checkout abc1234

# Voce entra em detached HEAD — modo observacao
# Inspecione arquivos, veja como estavam naquele momento
```

### Voltar ao presente

```bash
# Retorne a branch principal
git checkout main

# git log agora mostra todos os commits novamente
```

## Example

**Cenario: quero ver como um arquivo estava 3 commits atras**

```bash
# 1. Ver historico
git log
# commit f8a3b2c (HEAD -> main) feat: add validation
# commit d4e5f6a refactor: rename variables
# commit abc1234 initial commit

# 2. Ir para o commit antigo
git checkout abc1234
# You are in 'detached HEAD' state...

# 3. Inspecionar o arquivo
cat src/phrases.txt
# (versao original do arquivo)

# 4. Voltar ao presente
git checkout main
# Switched to branch 'main'
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Quer apenas olhar como arquivo estava | git checkout SHA → inspeciona → git checkout main |
| Quer recuperar codigo de commit antigo | git checkout SHA → crie branch → traga mudancas via merge |
| git log nao mostra commits futuros | Voce esta em detached HEAD — volte com git checkout main |
| SHA copiado da erro | Verifique se copiou caracteres suficientes (min 7) |
| Quer sair da tela do git log | Digite `:q` para sair do pager |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Fazer commits em detached HEAD sem branch | Crie branch primeiro: `git checkout -b nome-branch` |
| Copiar SHA inteiro (40 chars) | Copie 7-8 caracteres iniciais |
| Navegar sem git log antes | Sempre `git log` primeiro para ver os SHAs |
| Ficar em detached HEAD trabalhando | Volte com `git checkout main` ou crie branch |
| Entrar em panico com mensagem "detached HEAD" | E normal — e modo observacao, nao erro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre HEAD, SHA-1, e detached HEAD
- [code-examples.md](references/code-examples.md) — Todos os exemplos de navegacao expandidos com variacoes