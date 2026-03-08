---
name: rs-full-stack-criando-o-projeto-11
description: "Generates a new React + TypeScript project using Vite for React Router studies. Use when user asks to 'create a react project', 'setup vite react', 'start a new react router project', 'scaffold react app', or 'init react typescript'. Follows the Vite CLI workflow with React framework and TypeScript template selection. Make sure to use this skill whenever bootstrapping a new React project with Vite. Not for Next.js projects, CRA migrations, or non-React frameworks."
---

# Criando Projeto React com Vite para React Router

> Inicialize um projeto React + TypeScript com Vite usando o CLI interativo, pronto para estudar React Router.

## Prerequisites

- Node.js 18+ instalado
- npm disponivel no terminal
- VS Code (ou editor preferido)

## Steps

### Step 1: Navegar ate a pasta de destino

```bash
cd /caminho/para/pasta-de-projetos
```

Arrastar a pasta para o terminal fornece o caminho absoluto correto automaticamente.

### Step 2: Criar o projeto com Vite

```bash
npm create vite@latest
```

O CLI interativo pergunta:
1. **Project name** — usar nome descritivo em kebab-case (ex: `react-router-study`)
2. **Framework** — selecionar `React`
3. **Variant** — selecionar `TypeScript`

### Step 3: Instalar dependencias e abrir no editor

```bash
cd react-router-study
npm install
code .
```

## Output format

Estrutura gerada pelo Vite:

```
react-router-study/
├── public/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Error handling

- Se `npm create vite@latest` falhar, verificar versao do Node.js com `node -v` (minimo 18)
- Se a pasta ja existir com o mesmo nome, escolher outro nome ou remover a pasta existente

## Verification

```bash
npm run dev
```

O servidor de desenvolvimento deve iniciar em `http://localhost:5173` com a pagina padrao do Vite + React.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escolha do Vite, comparacao com CRA, e fluxo do CLI
- [code-examples.md](references/code-examples.md) — Exemplos de configuracao inicial e variantes de setup