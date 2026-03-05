---
name: rs-full-stack-criando-o-primeiro-commit
description: "Enforces correct Git first commit workflow when user asks to 'initialize a repo', 'create first commit', 'git init', 'start a project with git', or 'setup version control'. Applies rules: check status before committing, understand stage area, use restore for mistakes, write meaningful commit messages. Make sure to use this skill whenever setting up a new Git repository or teaching Git basics. Not for advanced Git workflows, branching strategies, or CI/CD pipelines."
---

# Criando o Primeiro Commit

> Antes de commitar, verifique o estado do projeto com `git status` e garanta que o stage area reflete exatamente o que voce quer salvar na historia.

## Rules

1. **Sempre rode `git status` antes de qualquer acao** — porque ele mostra exatamente o que mudou, o que esta no stage e o que falta adicionar
2. **Use `git restore` para desfazer modificacoes no stage area** — `git restore <arquivo>` volta o arquivo ao estado da ultima vez que foi adicionado ao stage, porque erros acontecem e voce precisa de um caminho de volta
3. **Re-adicione com `git add` apos modificacoes** — quando modifica um arquivo ja no stage, rode `git add` novamente para atualizar o stage area, porque o stage e um snapshot que precisa ser atualizado
4. **Escreva mensagens de commit descritivas** — `git commit -m "mensagem"` com aspas duplas fechadas, porque a mensagem e o registro historico do que foi feito
5. **Nao rode `git commit` sem arquivos no stage** — Git avisa que nao ha nada para commitar, porque commit sem conteudo e uma operacao vazia

## How to write

### Fluxo completo do primeiro commit

```bash
# 1. Verificar estado atual
git status

# 2. Adicionar arquivos ao stage area
git add nome-do-arquivo.txt

# 3. Se precisar desfazer modificacoes pos-stage
git restore nome-do-arquivo.txt

# 4. Re-adicionar apos novas modificacoes
git add nome-do-arquivo.txt

# 5. Criar o commit
git commit -m "initial commit"
```

### Mensagem de commit

```bash
# Formato correto — aspas duplas, mensagem descritiva
git commit -m "initial commit"

# O Git retorna: id unico, arquivos modificados, numero de insercoes
# Exemplo: [main abc1234] initial commit
#  1 file changed, 5 insertions(+)
#  create mode 100644 frases.txt
```

## Example

**Before (erro comum — commitar sem verificar):**

```bash
git commit -m "salvando"
# Erro: nothing to commit, working tree clean
```

**After (fluxo correto):**

```bash
git status
# Verifica: arquivos novos, modificados, no stage

git add frases.txt
# Adiciona ao stage area

git status
# Confirma que esta no stage

git commit -m "initial commit"
# [main abc1234] initial commit
#  1 file changed, 5 insertions(+)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Criou arquivo novo no projeto | `git add arquivo` → `git commit -m "descricao"` |
| Modificou arquivo ja no stage | `git add arquivo` novamente para atualizar |
| Fez modificacao errada | `git restore arquivo` para voltar ao estado do stage |
| Quer saber o estado atual | `git status` antes de qualquer acao |
| Git diz "nothing to commit" | Verifique se adicionou arquivos ao stage com `git add` |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Commitar sem rodar `git status` | Sempre `git status` antes |
| Esquecer de fechar aspas na mensagem | `git commit -m "mensagem completa"` |
| Modificar arquivo e commitar sem re-add | `git add` novamente apos modificar |
| Rodar `git commit` com stage vazio | Adicionar arquivos primeiro com `git add` |
| Usar mensagens vagas como "update" | Descrever o que foi feito: "initial commit" |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre stage area, restore e o ciclo de vida do commit
- [code-examples.md](references/code-examples.md) — Todos os exemplos de comandos Git expandidos com variacoes