---
name: rs-full-stack-conectando-repo-remoto
description: "Guides connecting a local Git repository to a remote GitHub repository. Use when user asks to 'connect to GitHub', 'push to remote', 'add remote origin', 'create GitHub repo', or 'link local repo to GitHub'. Covers repository creation on GitHub, adding remote origin, and first push. Make sure to use this skill whenever setting up a new GitHub remote for an existing local project. Not for Git basics like commits, branches, or resolving merge conflicts."
---

# Conectando Repositório Local com Repositório Remoto

> Conecte um repositório Git local existente a um repositório remoto no GitHub usando três comandos.

## Prerequisites

- Git instalado e configurado (`git config --global user.name` e `user.email` devem bater com a conta GitHub)
- Conta no GitHub criada e autenticada
- Repositório local já inicializado com `git init` e pelo menos um commit

## Steps

### Step 1: Criar o repositório no GitHub

1. Na home do GitHub, clicar em **New** (ou **Create new repository**)
2. Preencher:
   - **Repository name** — nome descritivo do projeto
   - **Description** — breve descrição do que o projeto faz
   - **Visibility** — Public (portfólio, projetos open source) ou Private (projetos de empresa, experimentos)
3. **Não marcar** "Add a README", "Add .gitignore" ou "Choose a license" se já existe um repositório local com commits, porque isso criaria commits no remoto que conflitam com o histórico local
4. Clicar em **Create repository**

### Step 2: Conectar e enviar via terminal

Copiar os três comandos da seção "push an existing repository from the command line":

```bash
git remote add origin https://github.com/USUARIO/REPOSITORIO.git
git branch -M main
git push -u origin main
```

| Comando | O que faz |
|---------|-----------|
| `git remote add origin URL` | Registra o repositório remoto como "origin" |
| `git branch -M main` | Garante que a branch principal se chama `main` (padronização histórica) |
| `git push -u origin main` | Envia commits locais para o remoto e configura tracking |

### Step 3: Verificar

Voltar ao GitHub, clicar em **Code** e confirmar que os arquivos aparecem.

## Output format

Repositório remoto configurado com todos os commits locais disponíveis no GitHub.

## Error handling

- Se `git push` falhar com erro de autenticação: verificar se o email do `git config --global user.email` é o mesmo da conta GitHub
- Se houver conflito (rejected push): provavelmente o repositório remoto foi criado com README/gitignore — usar `git pull --rebase origin main` antes do push, ou recriar o repositório remoto sem arquivos iniciais

## Verification

```bash
git remote -v
# Deve mostrar origin apontando para o repositório GitHub (fetch e push)
```

## Heuristics

| Situação | Ação |
|----------|------|
| Projeto novo sem commits | Criar README.md local primeiro, fazer commit, depois conectar |
| Projeto existente com histórico | Usar os 3 comandos diretamente (não criar README no GitHub) |
| Projeto de empresa/privado | Selecionar **Private** na criação |
| Portfólio/aprendizado | Selecionar **Public** para visibilidade |

## Quando usar cada opção do GitHub

| Opção | Usar quando |
|-------|-------------|
| **README** | Não tem repositório local ainda (criando tudo do zero no GitHub) |
| **.gitignore** | Idem — criando do zero. Se já tem local, criar o `.gitignore` manualmente |
| **License** | Quer definir como outros podem usar seu código (MIT, Apache, etc.) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre public vs private, README, gitignore, licenças e histórico do nome main
- [code-examples.md](references/code-examples.md) — Todos os comandos expandidos com variações e cenários