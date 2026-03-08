---
name: rs-full-stack-o-projeto-que-vamos-utilizar-1
description: "Guides project setup from a GitHub template repository for deployment preparation. Use when user asks to 'clone a template', 'download a project', 'setup project for deploy', 'prepare application for deployment', or 'install dependencies from template'. Covers downloading zip from GitHub, extracting, organizing folders, opening in VSCode, and running npm install. Make sure to use this skill whenever bootstrapping a project from an existing GitHub template before deployment. Not for creating projects from scratch, CI/CD pipeline configuration, or actual deployment steps."
---

# Preparação de Projeto para Deploy

> Antes de fazer deploy, garanta que o projeto está corretamente baixado, organizado e com dependências instaladas.

## Prerequisites

- Node.js instalado
- npm disponível no terminal
- VSCode (ou editor de preferência)
- Acesso ao repositório template no GitHub

## Steps

### Step 1: Baixar o projeto template

Acesse o repositório no GitHub, clique em **Code** → **Download ZIP**.

```bash
# Alternativa via CLI (se preferir ao invés do ZIP)
git clone https://github.com/{org}/{repo-template}.git nome-do-projeto
```

### Step 2: Extrair e organizar

```bash
# Extrair o ZIP
unzip fullstack-deploy-template-main.zip

# Renomear para o nome do projeto
mv fullstack-deploy-template-main rocket-log

# Mover para pasta de trabalho organizada
mv rocket-log ~/projetos/deploy/
```

### Step 3: Abrir no editor e instalar dependências

```bash
cd rocket-log
code .        # Abre no VSCode
npm install   # ou npm i (abreviação)
```

### Step 4: Verificar instalação

Confirme que `node_modules/` foi criada e que o projeto está pronto.

```bash
ls node_modules/  # Deve existir e conter pacotes
```

## Output format

Projeto pronto para deploy com:
- Pasta organizada com nome descritivo
- `node_modules/` instalada
- Pronto para configuração de deploy

## Error handling

- Se `npm install` falhar, verifique a versão do Node.js compatível no `package.json` (campo `engines`)
- Se o ZIP não extrair, baixe novamente ou use `git clone` como alternativa

## Verification

```bash
# Verificar que dependências foram instaladas
npm ls --depth=0

# Verificar que o projeto executa
npm run dev  # ou o script disponível no package.json
```

## Heuristics

| Situação | Ação |
|----------|------|
| Já tem o projeto completo de módulo anterior | Pode usar o próprio projeto, não precisa do template |
| Não encontra o projeto original | Use o link do template na descrição da aula |
| Quer organizar projetos por módulo | Crie pasta específica (ex: `deploy/`) para separar contextos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre organização de projetos para deploy
- [code-examples.md](references/code-examples.md) — Comandos e variações para setup de projeto