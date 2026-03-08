---
name: rs-full-stack-criando-o-projeto-6
description: "Generates Express + TypeScript project scaffolding when starting a new Node.js API from scratch. Use when user asks to 'create a new project', 'setup Express API', 'initialize Node.js app', 'scaffold TypeScript project', or 'start a new backend'. Applies structure: separate app.ts from server.ts, configure tsconfig with path aliases, add tsx watch for dev. Make sure to use this skill whenever bootstrapping a new Express-based API project. Not for React/Next.js frontends, Fastify projects, or adding features to existing projects."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: node-api-express
  tags: [express, typescript, project-setup, tsconfig, path-aliases]
---

# Criando Projeto Express + TypeScript

> Ao criar um novo projeto Express com TypeScript, separe a aplicação (app.ts) da execução do servidor (server.ts) e configure path aliases desde o início.

## Prerequisites

- Node.js 18+ instalado
- VS Code com terminal integrado
- npm disponível no PATH

## Steps

### Step 1: Inicializar o projeto

```bash
mkdir rocket-log && cd rocket-log
npm init -y
```

Ajustar `package.json` — remover `keywords` vazio, adicionar `description` e `author`:

```json
{
  "name": "rocket-log",
  "author": "Seu Nome",
  "description": "API de Entregas de encomendas"
}
```

### Step 2: Instalar Express

```bash
npm i express@4.19.2
```

Fixar versão com `@` para garantir reprodutibilidade entre ambientes.

### Step 3: Criar estrutura src/app.ts + src/server.ts

```
src/
├── app.ts      # Configuração do Express (middlewares, rotas)
└── server.ts   # Execução do servidor (listen na porta)
```

**src/app.ts** — aplicação isolada, exportável para testes:

```typescript
import express from "express"

const app = express()
app.use(express.json())

export { app }
```

**src/server.ts** — ponto de entrada, importa app e escuta na porta:

```typescript
import { app } from "@/app"

const PORT = 3333

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

### Step 4: Instalar TypeScript e tipagens

```bash
npm i typescript@5.5.4 @types/node@20.14.12 -D
npm i @types/express@4.17.21 -D
npm i tsx@4.16.2 -D
```

### Step 5: Configurar tsconfig.json

```bash
npx tsc --init
```

Substituir o conteúdo gerado por configuração limpa:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "paths": {
      "@/*": ["./src/*"]
    },
    "module": "Node16",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

### Step 6: Configurar script dev

No `package.json`:

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts"
  }
}
```

### Step 7: Executar

```bash
npm run dev
# Server is running on port 3333
```

## Output format

```
rocket-log/
├── node_modules/
├── src/
│   ├── app.ts        # Express config, middlewares, export app
│   └── server.ts     # app.listen(), console.log da porta
├── package.json       # scripts.dev = "tsx watch src/server.ts"
├── tsconfig.json      # strict, path aliases, ES2022
└── package-lock.json
```

## Heuristics

| Situação | Faça |
|----------|------|
| Precisa testar app sem subir servidor | Importe `app` de `app.ts` direto no teste, porque `server.ts` não é importado |
| Quer trocar a porta | Use variável `PORT` em `server.ts`, porque centraliza a configuração |
| TypeScript não reconhece `@/` | Verifique se `paths` está no `tsconfig.json` com `"@/*": ["./src/*"]` |
| Express pede tipagens | Instale `@types/express` como devDependency, porque só é usado em compilação |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Tudo num arquivo só (app + listen) | Separe `app.ts` (config) de `server.ts` (execução), porque permite testar app isoladamente |
| `npm i express` sem versão | `npm i express@4.19.2`, porque garante reprodutibilidade |
| `require("express")` em projeto TS | `import express from "express"`, porque aproveita tipagem e tree-shaking |
| `tsconfig.json` com defaults do `--init` | Configure manualmente só o necessário, porque reduz ruído e facilita manutenção |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `Cannot find module '@/app'` | Path alias `@/*` nao configurado no tsconfig.json | Adicione `"paths": { "@/*": ["./src/*"] }` em `compilerOptions` |
| `tsx: command not found` | tsx nao instalado como devDependency | `npm i tsx -D` |
| Porta 3333 em uso | Outro processo ocupando a porta | Mude a porta em `server.ts` ou finalize o processo com `lsof -i :3333` |
| TypeScript nao compila imports do Express | Faltam tipagens | `npm i @types/express @types/node -D` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre separação app/server, path aliases e escolha de versões
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações