---
name: rs-full-stack-iniciando-repositorio-git
description: "Initializes a Git repository with git init including terminal navigation and verification. Use when user asks to 'start a project with git', 'initialize a repo', 'git init', 'create a repository', or 'setup version control'. Covers terminal navigation with cd/pwd and repo creation. Make sure to use this skill whenever someone needs to start tracking a project with Git from scratch. Not for branching, committing, pushing, or any post-init Git operations."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: git-fundamentals
  tags: [git, git-init, terminal, version-control, setup]
---

# Iniciando Um Repositório Git

> Navegue ate a pasta do projeto no terminal e execute `git init` para criar um repositorio Git.

## Prerequisites

- Terminal disponivel (Terminal no Mac/Linux, Git Bash no Windows)
- Git instalado (`git --version` para verificar)
- Uma pasta de projeto existente no computador

## Steps

### Step 1: Abrir o terminal

Abra o terminal do seu sistema operacional. No Windows, use o Git Bash.

### Step 2: Navegar ate a pasta do projeto

```bash
cd /caminho/para/seu/projeto
```

| Sistema | Exemplo de caminho |
|---------|-------------------|
| Mac/Linux | `cd /Users/seuusuario/Desktop/meu-projeto` |
| Windows (Git Bash) | `cd /c/meu-projeto` |
| Windows (CMD) | `cd c:\meu-projeto` |

Use `cd` (change directory) seguido do caminho completo da pasta.

### Step 3: Confirmar que esta na pasta correta

```bash
pwd
```

O comando `pwd` (print working directory) exibe o caminho completo ate a pasta atual, porque confirmar antes de iniciar evita criar repositorios no lugar errado.

### Step 4: Iniciar o repositorio

```bash
git init
```

Pronto. O repositorio Git foi criado na pasta.

## Output format

```
Initialized empty Git repository in /caminho/para/seu/projeto/.git/
```

Uma pasta oculta `.git/` e criada dentro do projeto — ela contem todo o historico de versionamento.

## Error handling

- Se `git: command not found` → Git nao esta instalado. Instale em https://git-scm.com
- Se `not a directory` no `cd` → O caminho esta errado. Verifique com `ls` ou o explorador de arquivos
- Se executou `git init` na pasta errada → Delete a pasta `.git/` criada: `rm -rf .git`

## Verification

```bash
ls -la
```

Confirme que a pasta `.git/` aparece na listagem. Se aparecer, o repositorio foi iniciado com sucesso.

## Heuristics

| Situacao | Acao |
|----------|------|
| Nao sabe o caminho da pasta | No Mac, arraste a pasta para o terminal. No Windows, copie o caminho do explorador |
| Projeto ja tem `.git/` | Nao execute `git init` novamente — o repositorio ja existe |
| Quer iniciar em pasta nova | `mkdir meu-projeto && cd meu-projeto && git init` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `git: command not found` | Git nao instalado | Instalar de https://git-scm.com |
| `not a directory` ao usar `cd` | Caminho digitado incorretamente | Verificar caminho com explorador de arquivos ou `ls` |
| `git init` executado na pasta errada | Navegou para diretorio incorreto | Deletar `.git/` com `rm -rf .git` e repetir no diretorio correto |
| Pasta `.git/` nao aparece com `ls` | `ls` padrao oculta arquivos com ponto | Usar `ls -la` para listar arquivos ocultos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre navegacao no terminal e o que git init faz internamente
- [code-examples.md](references/code-examples.md) — Exemplos expandidos por sistema operacional