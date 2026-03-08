---
name: rs-full-stack-recuperando-arquivo-deletado
description: "Applies Git file recovery techniques when user needs to 'recover a deleted file', 'restore a file from history', 'undo a file deletion', 'bring back a removed file', or 'checkout a previous version'. Guides through git checkout, git restore, and stage area management for deleted files. Make sure to use this skill whenever the user mentions recovering or restoring files deleted in Git history. Not for branch recovery, commit reversal, or general git undo operations."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: git-fundamentals
  tags:
    - git
    - restore
    - checkout
    - recovery
---

# Recuperando Arquivos Deletados com Git

> Arquivos deletados nunca estao perdidos se o Git esta rastreando — recupere qualquer versao de qualquer ponto na historia.

## Rules

1. **Use `git checkout <commit> -- <arquivo>` para recuperar de commits antigos** — porque esse comando restaura o arquivo exatamente como estava naquele ponto da historia
2. **Use `git restore <arquivo>` para desfazer delecoes nao comitadas** — porque reverte mudancas no working directory sem precisar de um commit ID
3. **Entenda que `git add` em arquivo deletado registra a delecao** — o Git rastreia a remocao e o `add` prepara essa delecao para o proximo commit
4. **Arquivo recuperado via checkout vai direto para o stage area** — remova com `git restore --staged <arquivo>` se nao quiser comitar imediatamente
5. **Mantenha commits frequentes e descritivos** — porque a recuperacao so funciona se existem pontos na historia para voltar

## How to write

### Recuperar arquivo de um commit especifico

```bash
# 1. Encontre o commit que ainda tinha o arquivo
git log --oneline

# 2. Copie o hash do commit desejado e recupere
git checkout abc1234 -- phrases.txt

# 3. O arquivo volta ao working directory E ao stage area
git status
# Output: new file: phrases.txt (staged)

# 4. Se nao quiser no stage area, remova do stage
git restore --staged phrases.txt
```

### Recuperar arquivo deletado mas nao comitado

```bash
# Deletou o arquivo mas ainda nao fez commit
git restore phrases.txt
# Pronto — arquivo de volta como estava no ultimo commit
```

### Comitar a recuperacao

```bash
git add phrases.txt
git commit -m "resgatando phrases.txt"
```

## Example

**Cenario: Deletei e comitei, agora quero de volta**

```bash
# Situacao: arquivo foi deletado e comitado
git add phrases.txt        # registra a delecao
git commit -m "deletado phrases.txt"

# Recuperacao: encontrar o commit anterior
git log --oneline
# a1b2c3d novas frases adicionadas   <-- esse tinha o arquivo
# d4e5f6g deletado phrases.txt

git checkout a1b2c3d -- phrases.txt  # recupera a versao daquele commit
git commit -m "resgatando phrases.txt"
```

**Cenario: Deletei sem querer, nao comitei**

```bash
# Apagou o arquivo no editor/explorador
git restore phrases.txt    # volta instantaneamente
```

## Heuristics

| Situacao | Comando |
|----------|---------|
| Deletou arquivo, ainda nao fez `git add` | `git restore <arquivo>` |
| Deletou e comitou, quer versao especifica | `git checkout <hash> -- <arquivo>` |
| Recuperou mas nao quer no stage area | `git restore --staged <arquivo>` |
| Quer ver em qual commit o arquivo existia | `git log --oneline` |
| Deletou ha muitos commits atras | `git log --all -- <arquivo>` para encontrar historico |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Procurar na lixeira do SO | `git restore <arquivo>` |
| Recriar o arquivo manualmente | `git checkout <hash> -- <arquivo>` |
| Entrar em panico ao deletar | Confiar no rastreamento do Git |
| Fazer commits sem mensagens claras | Descrever o que aconteceu: "resgatando X" |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre rastreamento de delecoes e stage area
- [code-examples.md](references/code-examples.md) — Todos os exemplos expandidos com variacoes

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `git restore` nao recupera o arquivo | Arquivo ja foi deletado e comitado | Use `git checkout <hash> -- <arquivo>` com o hash do commit anterior |
| Arquivo recuperado aparece no stage area | `git checkout` de commit antigo adiciona ao stage automaticamente | Use `git restore --staged <arquivo>` para remover do stage |
| Nao encontra o commit que tinha o arquivo | Historico longo e dificil de navegar | Use `git log --all -- <arquivo>` para ver apenas commits que tocaram aquele arquivo |

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-recuperando-um-arquivo-deletado/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-recuperando-um-arquivo-deletado/references/code-examples.md)
