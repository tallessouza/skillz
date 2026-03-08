---
name: rs-full-stack-colocando-o-projeto-no-git-hub
description: "Follows the workflow for pushing a local project to GitHub for deployment. Use when user asks to 'put project on GitHub', 'push to remote', 'create a repo', 'init git', 'prepare for deploy', or 'upload code to GitHub'. Covers git init, commit, remote add, push, and .gitignore configuration. Make sure to use this skill whenever setting up a new GitHub repository for an existing project. Not for GitHub Actions, CI/CD pipelines, or managing pull requests."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [git, github, deploy, push, gitignore, remote]
---

# Colocando o Projeto no GitHub

> Antes de fazer deploy, publique o projeto num repositório GitHub para que o ambiente de deploy consiga acessar o código.

## Prerequisites

- Git instalado na máquina local
- Conta no GitHub com acesso autenticado (SSH ou HTTPS)
- Arquivo `.gitignore` configurado no projeto

## Steps

### Step 1: Criar o repositório no GitHub

Acesse GitHub → botão "+" → "New repository". Defina nome descritivo (ex: `rocket-log-deploy`), visibilidade (private para projetos de deploy), e crie sem README/license para evitar conflitos.

### Step 2: Inicializar Git no projeto local

```bash
git init
git add .
git commit -m "chore: deploy config"
```

Use o prefixo `chore:` para commits de configuração que não adicionam funcionalidade — porque conventional commits diferenciam configuração de features.

### Step 3: Conectar ao repositório remoto

```bash
git remote add origin https://github.com/{usuario}/{repositorio}.git
```

### Step 4: Enviar o código

```bash
git push -u origin main
```

O `-u` (upstream) vincula a branch local à remota, porque nos próximos pushes basta `git push`.

## Output format

Repositório GitHub contendo todos os arquivos do projeto, **exceto**:
- `node_modules/` — dependências reinstaladas no deploy
- `build/` ou `dist/` — artefatos gerados no deploy
- `.env` — variáveis de ambiente sensíveis

## Verification

1. Acesse o repositório no GitHub e atualize a página
2. Confirme que `node_modules/`, `build/` e `.env` **não aparecem**
3. Confirme que `.env.example` (se existir) **aparece** — porque documenta as variáveis necessárias sem expor valores

## Error handling

- Se `git push` falhar com autenticação: configure SSH key ou personal access token
- Se `git push` rejeitar por histórico divergente: **não use `--force`** — verifique se criou o repo sem README/license
- Se arquivos sensíveis foram commitados: `git rm --cached .env` e adicione ao `.gitignore` antes de novo push

## Heuristics

| Situação | Ação |
|----------|------|
| Projeto novo sem histórico git | `git init` + primeiro commit |
| Projeto já tem `.git/` | Pule direto para `git remote add` |
| Repo criado com README no GitHub | `git pull --rebase origin main` antes do push |
| Deploy precisa de variáveis de ambiente | Crie `.env.example` com chaves sem valores |

## Anti-patterns

| Nunca faça | Faça instead |
|------------|-------------|
| Commitar `node_modules/` | Adicione `node_modules/` ao `.gitignore` |
| Commitar `.env` com secrets | Adicione `.env` ao `.gitignore`, use `.env.example` |
| Commitar pasta `build/` | Adicione `build/` ao `.gitignore` |
| `git push --force` no primeiro push | Crie repo vazio (sem README/license) |
| Commit message genérica "first commit" | Use conventional commit: `chore: deploy config` |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `node_modules/` aparece no GitHub | `.gitignore` ausente ou criado após o commit | `git rm -r --cached node_modules/`, adicione ao `.gitignore`, commit novamente |
| `.env` commitado acidentalmente | Arquivo não estava no `.gitignore` | `git rm --cached .env`, adicione ao `.gitignore`, force push se necessário |
| Push rejeitado por histórico divergente | Repo criado com README/license | Crie repo vazio ou `git pull --rebase origin main` |
| Autenticação falha no push | Token expirado ou SSH não configurado | Gere novo personal access token ou configure SSH key |
| Branch `master` em vez de `main` | Git local usa `master` como padrão | `git branch -M main` antes do push |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre .gitignore, conventional commits e fluxo git-to-deploy
- [code-examples.md](references/code-examples.md) — Todos os comandos git expandidos com variações e cenários