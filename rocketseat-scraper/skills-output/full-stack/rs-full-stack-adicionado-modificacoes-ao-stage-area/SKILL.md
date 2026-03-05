---
name: rs-full-stack-git-stage-area
description: "Applies Git staging area workflow when user asks to 'add files to git', 'stage changes', 'prepare a commit', 'check git status', or 'remove from staging'. Enforces correct use of git add, git status, git rm --cached, and the re-staging requirement after modifications. Make sure to use this skill whenever the user is learning Git basics or managing staged files. Not for advanced Git operations like rebasing, cherry-picking, or branch management."
---

# Git Stage Area — Adicionando e Removendo Modificações

> Antes de qualquer commit, arquivos devem ser explicitamente adicionados ao Stage Area para que o Git rastreie suas alterações.

## Rules

1. **Sempre verifique o estado antes de agir** — execute `git status` antes de qualquer `git add` ou `git commit`, porque sem visibilidade do estado atual voce pode commitar algo indesejado
2. **Adicione arquivos explicitamente** — use `git add <arquivo>` para arquivos especificos ou `git add .` para todos na pasta atual, porque o Git nao rastreia arquivos automaticamente
3. **Re-adicione arquivos modificados apos staging** — se um arquivo ja esta no Stage Area e voce o modificou, faca `git add` novamente antes do commit, porque o commit captura o estado do momento do add, nao do commit
4. **Remova do Stage Area com `git rm --cached`** — nunca delete o arquivo do disco para remover do staging, porque `--cached` remove apenas o rastreamento sem afetar o arquivo fisico
5. **`git add .` opera na pasta atual** — adiciona todos os arquivos da pasta onde o terminal esta, incluindo subpastas, porque o ponto referencia o diretorio corrente

## How to write

### Fluxo basico de staging

```bash
# 1. Verificar estado atual
git status

# 2. Adicionar arquivo especifico
git add frases.txt

# 3. Verificar novamente
git status

# 4. Ou adicionar todos os arquivos da pasta
git add .
```

### Remover do Stage Area

```bash
# Remove o rastreamento sem deletar o arquivo
git rm --cached nome-do-arquivo
```

### Re-staging apos modificacao

```bash
# Arquivo ja estava no stage, mas foi modificado
git add frases.txt   # necessario adicionar novamente
```

## Example

**Antes (erro comum — esqueceu re-staging):**
```bash
git add frases.txt        # adicionou ao stage
# ... edita frases.txt ...
git commit -m "adiciona frases"  # commit SEM a modificacao recente!
```

**Depois (com esta skill aplicada):**
```bash
git add frases.txt        # adicionou ao stage
# ... edita frases.txt ...
git status                # ve que existe modificacao nao staged
git add frases.txt        # re-adiciona com a modificacao
git commit -m "adiciona frases"  # commit COM a modificacao
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Quer ver o que mudou | `git status` |
| Arquivo novo, quer rastrear | `git add <arquivo>` |
| Varios arquivos novos | `git add .` |
| Adicionou arquivo errado ao stage | `git rm --cached <arquivo>` |
| Editou arquivo ja no stage | `git add <arquivo>` novamente |
| Arquivo oculto aparece no status | Avalie se deve ser rastreado ou ignorado (.gitignore) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `git commit` sem `git status` antes | `git status` → `git add` → `git commit` |
| Editar arquivo staged e commitar direto | Re-adicionar com `git add` apos editar |
| Deletar arquivo para remover do stage | `git rm --cached <arquivo>` |
| `git add .` sem verificar o que sera adicionado | `git status` antes do `git add .` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre Stage Area, analogias e mental model
- [code-examples.md](references/code-examples.md) — Todos os exemplos de comandos expandidos com variacoes