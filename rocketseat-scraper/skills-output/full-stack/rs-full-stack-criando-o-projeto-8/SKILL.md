---
name: rs-full-stack-criando-o-projeto-8
description: "Generates React projects with Vite scaffolding when user asks to 'create a React project', 'init React app', 'scaffold with Vite', 'start a new frontend', or 'setup React TypeScript'. Follows the npm create vite@latest workflow with TypeScript selection. Make sure to use this skill whenever bootstrapping a new React application with Vite. Not for Next.js projects, backend APIs, or non-React frameworks."
---

# Criando Projeto React com Vite

> Utilize `npm create vite@latest` para iniciar projetos React com TypeScript de forma rapida e padronizada.

## Prerequisites

- Node.js 18+ instalado
- npm disponivel no terminal
- Terminal aberto na pasta onde o projeto sera criado

## Steps

### Step 1: Navegar ate a pasta desejada

```bash
cd /caminho/da/pasta
```

### Step 2: Criar o projeto com Vite

```bash
npm create vite@latest
```

Responder aos prompts interativos:
1. **Confirmar instalacao do create-vite** — pressionar Enter
2. **Project name** — digitar o nome do projeto (ex: `classroom`)
3. **Select a framework** — usar setas do teclado para selecionar **React**
4. **Select a variant** — selecionar **TypeScript**

### Step 3: Instalar dependencias e iniciar

```bash
cd nome-do-projeto
npm install
npm run dev
```

## Output format

Apos execucao, o Vite gera a seguinte estrutura:

```
nome-do-projeto/
├── public/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto React novo com TypeScript | `npm create vite@latest` → React → TypeScript |
| Precisa de variante sem type checking | Selecionar TypeScript + SWC para builds mais rapidos |
| Projeto ja existe e quer adicionar Vite | Migrar manualmente, nao usar este fluxo |

## Error handling

- Se `npm create` falhar com permissao, executar `npm cache clean --force` e tentar novamente
- Se a porta 5173 estiver ocupada, o Vite automaticamente tenta a proxima porta disponivel

## Verification

- `npm run dev` inicia o servidor local sem erros
- Acessar `http://localhost:5173` exibe a pagina padrao do Vite + React

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que usar Vite, comparacao com CRA, e detalhes do processo
- [code-examples.md](references/code-examples.md) — Todos os comandos expandidos com variacoes e cenarios alternativos