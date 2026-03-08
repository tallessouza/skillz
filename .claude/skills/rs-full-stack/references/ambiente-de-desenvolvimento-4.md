---
name: rs-full-stack-ambiente-de-desenvolvimento-4
description: "Configures React development environment setup with Vite, Node.js, and VS Code. Use when user asks to 'setup React project', 'create React app with Vite', 'configure development environment for React', 'install Node for React', or 'start a new React project'. Make sure to use this skill whenever bootstrapping a new React+Vite project or configuring the dev environment from scratch. Not for React component development, state management, or deployment configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [react, vite, nodejs, setup, environment]
---

# Ambiente de Desenvolvimento React com Vite

> Configure o ambiente de desenvolvimento React usando Vite como ferramenta de build, Node.js para gerenciamento de pacotes, e VS Code como editor.

## Prerequisites

- **Node.js** (versao LTS) instalado — verificar com `npm --version`
- **VS Code** como editor de codigo
- Se Node nao esta instalado: acessar nodejs.org, baixar versao LTS, instalar

## Steps

### Step 1: Verificar Node.js e NPM

```bash
node --version
npm --version
```

Se ambos retornam versoes, o ambiente base esta pronto. Usar sempre NPM como gerenciador padrao para evitar inconsistencias durante o desenvolvimento.

### Step 2: Criar projeto React com Vite

```bash
npm create vite@latest
```

Seguir o wizard interativo: escolher nome do projeto, selecionar React como framework, escolher variante (JavaScript ou TypeScript).

### Step 3: Organizar estrutura de pastas

Criar uma pasta dedicada para organizar os projetos React:

```bash
mkdir -p aulas/react
cd aulas/react
```

Todos os projetos React ficam dentro desta pasta para facilitar navegacao e organizacao.

### Step 4: Instalar dependencias e iniciar

```bash
cd nome-do-projeto
npm install
npm run dev
```

## Decisoes importantes

| Decisao | Recomendacao | Motivo |
|---------|-------------|--------|
| Gerenciador de pacotes | NPM | Padrao do Node, evita problemas de compatibilidade |
| Ferramenta de build | Vite | Estrutura moderna, HMR rapido, configuracao minima |
| Editor | VS Code | Extensoes ricas para React, terminal integrado |
| Versao Node | LTS | Estabilidade e suporte de longo prazo |

## Contexto: React + Vite

- **React** e a biblioteca/framework para construir a interface da aplicacao — o motor do desenvolvimento
- **Vite** e a ferramenta de scaffolding que cria o projeto React com estrutura moderna (build, dev server, HMR)
- Vite substitui Create React App como forma recomendada de iniciar projetos React

## Gerenciadores de pacotes alternativos

| Gerenciador | Comando equivalente |
|-------------|-------------------|
| NPM (padrao) | `npm create vite@latest` |
| Yarn | `yarn create vite` |
| PNPM | `pnpm create vite` |
| Bun | `bun create vite` |

## Verification

- `npm --version` retorna uma versao valida
- `npm create vite@latest` executa sem erros
- `npm run dev` inicia o servidor de desenvolvimento
- Projeto abre no navegador sem erros no console

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `npm --version` não encontrado | Node.js não está instalado | Baixe e instale a versão LTS em nodejs.org |
| `npm create vite@latest` falha | Versão do Node muito antiga | Atualize Node para versão LTS mais recente |
| `npm run dev` não abre no navegador | Porta já em uso por outro processo | Encerre o processo na porta ou use outra porta com `--port` |
| Erros de permissão ao instalar pacotes | Faltam permissões no diretório | Execute com `sudo` (Linux/Mac) ou abra terminal como admin (Windows) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escolha de ferramentas e organizacao do ambiente
- [code-examples.md](references/code-examples.md) — Todos os comandos expandidos com variacoes e cenarios alternativos