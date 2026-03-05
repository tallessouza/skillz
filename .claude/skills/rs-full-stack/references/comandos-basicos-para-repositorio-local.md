---
name: rs-full-stack-comandos-basicos-repo-local
description: "Applies Git local repository workflow commands when user asks to 'initialize a project', 'start a repo', 'commit changes', 'check git status', or 'view commit history'. Enforces correct usage of git init, git status, git add, git commit -m, and git log for local development. Make sure to use this skill whenever setting up or managing a local Git repository. Not for remote operations, branching, merging, or GitHub/GitLab workflows."
---

# Comandos Basicos para Repositorio Local Git

> Dominar cinco comandos fundamentais cobre 80% do trabalho com repositorio local Git.

## Rules

1. **Sempre inicie com `git init`** — execute na raiz do projeto para criar o repositorio, porque sem isso nenhum outro comando Git funciona
2. **Verifique antes de adicionar** — use `git status` antes de `git add`, porque mostra exatamente quais arquivos e pastas foram modificados
3. **Adicione com intencao** — prefira `git add <arquivo>` ao inves de `git add .` quando possivel, porque controle granular evita commits acidentais com arquivos indesejados
4. **Mensagens de commit com ate 50 caracteres** — use `git commit -m "mensagem"` com descricao breve do ponto na historia, porque mensagens longas sao truncadas em ferramentas visuais
5. **Consulte o historico com `git log`** — visualize todos os pontos na historia antes de tomar decisoes, porque o log e a fonte de verdade do que aconteceu no projeto

## Workflow

### 1. Iniciar repositorio
```bash
git init
```

### 2. Verificar alteracoes
```bash
git status
```

### 3. Adicionar ao stage area
```bash
# Todos os arquivos modificados
git add .

# Arquivo especifico
git add src/index.ts

# Pasta especifica
git add src/components/
```

### 4. Criar ponto na historia
```bash
git commit -m "add user authentication endpoint"
```

### 5. Visualizar historico
```bash
git log
```

## Example

**Fluxo completo de trabalho local:**
```bash
# Iniciar projeto
mkdir meu-projeto && cd meu-projeto
git init

# Trabalhar nos arquivos...
# Verificar o que mudou
git status

# Adicionar arquivos ao stage
git add .

# Criar ponto na historia com mensagem descritiva
git commit -m "create initial project structure"

# Ver todos os commits
git log
```

## Heuristics

| Situacao | Comando |
|----------|---------|
| Projeto novo, sem Git | `git init` |
| Quer saber o que mudou | `git status` |
| Quer salvar tudo de uma vez | `git add .` |
| Quer salvar apenas um arquivo | `git add <arquivo>` |
| Quer registrar um ponto na historia | `git commit -m "mensagem"` |
| Quer ver o que ja foi feito | `git log` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `git commit` sem mensagem | `git commit -m "descricao breve"` |
| `git add .` sem verificar antes | `git status` → depois `git add .` |
| Mensagem de commit vaga: `"changes"` | Mensagem descritiva: `"fix login validation bug"` |
| Commit sem verificar status | Sempre `git status` antes de `git add` e `git commit` |
| Ignorar `git log` | Consultar historico regularmente para contexto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-comandos-basicos-para-repositorio-local/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-comandos-basicos-para-repositorio-local/references/code-examples.md)
