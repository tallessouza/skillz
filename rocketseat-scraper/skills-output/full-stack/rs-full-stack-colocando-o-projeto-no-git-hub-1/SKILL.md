---
name: rs-full-stack-colocando-projeto-no-github
description: "Follows the Git + GitHub repository setup workflow when pushing a local project to GitHub for the first time. Use when user asks to 'push to GitHub', 'create a repository', 'upload project to GitHub', 'init git repo', or 'prepare for deploy'. Covers git init, git add, commit, remote add origin, and git push. Make sure to use this skill whenever setting up version control for a new project or connecting a local repo to GitHub. Not for CI/CD pipelines, GitHub Actions, branch strategies, or PR workflows."
---

# Colocando o Projeto no GitHub

> Conecte um projeto local ao GitHub seguindo a sequência: criar repositório remoto, iniciar git local, adicionar arquivos, commitar, conectar remoto e push.

## Prerequisites

- Conta no GitHub ativa
- Git instalado localmente (`git --version` para verificar)
- Projeto local funcional (testado antes de subir)
- Se repositório já existe no GitHub: pule a criação e use o URL existente

## Steps

### Step 1: Criar repositório no GitHub

1. Acesse GitHub → clique no ícone **+** → **New Repository**
2. Selecione o owner correto (conta pessoal ou organização)
3. Defina o nome do repositório (use o nome do projeto)
4. Adicione uma descrição clara do projeto
5. Escolha a visibilidade:
   - **Private** — projetos de clientes, freelance, dados sensíveis, projetos de empresa
   - **Public** — open source, portfólio, projetos para visibilidade
6. Não adicione README, .gitignore ou license (o projeto local já tem seus arquivos)
7. Clique em **Create repository**

### Step 2: Iniciar versionamento local

```bash
git init
```

### Step 3: Adicionar todos os arquivos ao staging

```bash
git add .
```

Verificar o que será commitado:

```bash
git status
```

### Step 4: Fazer o primeiro commit

```bash
git commit -m "v1 do projeto"
```

### Step 5: Conectar ao repositório remoto

```bash
git remote add origin https://github.com/{usuario}/{repositorio}.git
```

### Step 6: Enviar código para o GitHub

```bash
git push -u origin main
```

O flag `-u` configura o tracking — após isso, `git push` sem argumentos já envia para `origin main`.

## Output format

Após o push, o repositório no GitHub deve conter todos os arquivos do projeto, pronto para ser conectado a um serviço de deploy.

## Error handling

- Se `git push` falha com "remote already exists": `git remote set-url origin {url}`
- Se branch local é `master` e remoto espera `main`: `git branch -M main`
- Se push é rejeitado por histórico divergente: verifique se o repositório remoto foi criado vazio (sem README)

## Verification

1. Recarregue a página do repositório no GitHub
2. Confirme que todos os arquivos do projeto aparecem
3. O código está pronto para conectar a um serviço de deploy

## Heuristics

| Situação | Ação |
|----------|------|
| Projeto de cliente ou freelance | Sempre **private** |
| Projeto para portfólio | **Public** para recrutadores verem |
| Projeto open source | **Public** com README e LICENSE |
| Já tem repo no GitHub | Pule Steps 1-2, use o repo existente |
| Organização no GitHub | Selecione o owner correto na criação |

## Anti-patterns

| Evite | Faça em vez disso |
|-------|-------------------|
| Criar repo público com dados sensíveis | Use private para qualquer projeto com credenciais |
| Adicionar README pelo GitHub quando já tem arquivos locais | Crie vazio e faça push do projeto local |
| Fazer push sem verificar `git status` | Sempre confira o staging antes do commit |
| Esquecer `-u` no primeiro push | Use `git push -u origin main` para configurar tracking |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre visibilidade de repositórios, organizações e fluxo git
- [code-examples.md](references/code-examples.md) — Comandos git completos com variações e troubleshooting