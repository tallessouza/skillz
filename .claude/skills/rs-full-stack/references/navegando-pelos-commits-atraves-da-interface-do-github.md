---
name: rs-full-stack-navegando-commits-github
description: "Navigates commit history through GitHub's web interface. Use when user asks to 'view commits on GitHub', 'check commit history', 'browse old versions', 'see file changes', or 'navigate project history'. Maps git CLI commands to their GitHub UI equivalents: git log, git checkout, git diff. Make sure to use this skill whenever explaining GitHub interface navigation or commit exploration. Not for git CLI commands, local repository operations, or branch management strategies."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: git-github
  tags: [github, commits, history, diff, web-interface]
---

# Navegando Pelos Commits na Interface do GitHub

> Use a interface web do GitHub para explorar historico de commits, visualizar alteracoes e navegar entre momentos do projeto sem digitar comandos no terminal.

## Key concepts

A interface do GitHub replica os comandos git mais usados para navegacao. Cada acao na UI corresponde a um comando CLI, mas sem necessidade de terminal. Isso facilita a compreensao do historico, especialmente quando multiplas pessoas contribuem.

## Mapeamento CLI → GitHub UI

| Comando Git (terminal) | Equivalente na interface GitHub |
|------------------------|-------------------------------|
| `git log` | Clicar em **"X commits"** no repositorio |
| `git show <id>` | Clicar em um commit especifico na lista |
| `git diff` | Visualizacao de linhas verdes (+) e vermelhas (-) no commit |
| `git checkout <id>` | Clicar no botao **"Browse files"** (`<>`) em um commit |
| `git checkout main` | Selecionar **"main"** no seletor de branch |

## Decision framework

| Quando voce quer | Faca na interface |
|-----------------|-------------------|
| Ver todo o historico | Clique em "Commits" na pagina do repositorio |
| Ver o que mudou em um commit | Clique no commit → veja linhas adicionadas/removidas |
| Ver o projeto em um momento passado | No commit, clique no icone "Browse files" (`<>`) |
| Voltar ao estado atual | Selecione "main" no seletor de branch |
| Ver arquivo deletado | Navegue ate o commit anterior a delecao |
| Ver arquivo resgatado | Navegue ate o commit do resgate |

## How to think about it

### Visualizacao de diferencas (diff)

Ao clicar em um commit, o GitHub mostra alteracoes linha a linha:
- **Vermelho (-)**: linha removida
- **Verde (+)**: linha adicionada
- Uma linha "modificada" aparece como remocao da antiga + adicao da nova, porque o git detecta qualquer caractere diferente como um bloco novo

### Navegacao temporal

Ao clicar em "Browse files" em um commit, voce esta fazendo o equivalente a `git checkout <id>` — o GitHub mostra o projeto exatamente como era naquele momento. A partir dali, voce so consegue navegar para o passado (commits anteriores). Para voltar ao presente, selecione a branch "main" no seletor.

### Limitacao importante

Quando voce navega para um commit antigo na interface, nao existe botao "proximo commit" — voce so volta no tempo. O caminho de volta e sempre pelo seletor de branch (main).

### Equivalentes no terminal

```bash
# Ver historico de commits (equivalente a clicar em "Commits")
git log --oneline

# Ver o que mudou em um commit especifico
git show abc1234

# Navegar para o estado do projeto em um commit
git checkout abc1234

# Voltar para o estado atual
git checkout main
```

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| Linha modificada aparece como "edit" | Git mostra como remocao + adicao (bloco novo por qualquer caractere diferente) |
| Da pra navegar para frente nos commits | So da pra voltar no tempo; para ir ao presente, selecione a branch main |
| Precisa do terminal para ver historico | A interface do GitHub replica git log, git show e git checkout visualmente |

## When to apply

- Revisando contribuicoes de outros membros do time
- Entendendo o que mudou em cada etapa do projeto
- Verificando quando um arquivo foi deletado ou resgatado
- Explorando o estado do projeto em qualquer momento passado
- Ensinando git para iniciantes sem exigir terminal

## Limitations

- Nao substitui operacoes que modificam o repositorio (commit, push, merge)
- Branches e tags sao visiveis mas a navegacao e limitada ao que existe no remote
- Para operacoes complexas de diff (entre branches, ranges de commits), o terminal oferece mais flexibilidade

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Nao encontra botao "Commits" | Repositorio vazio ou sem commits | Faca pelo menos um commit e push para o repositorio |
| Botao "Browse files" nao aparece | Interface do GitHub mudou | Procure pelo icone `<>` ao lado do SHA do commit |
| Nao consegue voltar ao presente | Navegou para commit antigo e nao encontra "next" | Selecione "main" no seletor de branch para voltar |
| Diff mostra muitas linhas vermelhas/verdes para pequena mudanca | Git detecta qualquer caractere diferente como bloco novo | Comportamento normal — uma modificacao aparece como remocao + adicao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes