---
name: rs-full-stack-executando-o-projeto
description: "Applies Express + TypeScript project structure when scaffolding a Node.js API with separate app.ts and server.ts files, configuring tsconfig.json with path aliases, and running with tsx watch. Use when user asks to 'create an Express app', 'setup TypeScript API', 'configure tsconfig paths', 'run a Node server', or 'scaffold API project'. Make sure to use this skill whenever initializing a new Express + TypeScript backend project. Not for frontend apps, Next.js projects, or Fastify/NestJS setups."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [express, typescript, tsconfig, path-aliases, tsx, project-structure]
---

# Estrutura Express + TypeScript — Setup e Execução

> Separe app (configuração Express) de server (inicialização), configure path aliases no tsconfig, e execute com tsx watch.

## Regra principal

Sempre separar `app.ts` (instância Express + middlewares + rotas) de `server.ts` (listen + porta), porque isso permite importar o app em testes sem iniciar o servidor.

## Steps

### Step 1: Criar estrutura de pastas

```
src/
├── app.ts      # Express instance + middlewares + routes
└── server.ts   # Listen + port
```

### Step 2: Configurar app.ts

```typescript
import express from "express"

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello World")
})

export { app }
```

**Pontos-chave:**
- `express.json()` como primeiro middleware — habilita parsing de JSON no body
- `res.send()` para respostas simples de texto (formata automaticamente no navegador)
- `res.json()` para respostas JSON de API (usar nas rotas reais)
- Exportar `app` para que `server.ts` e testes possam importar

### Step 3: Configurar tsconfig.json

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

**Path aliases:** `@/` mapeia para `./src/`, permitindo imports como `import { app } from "@/app"` em vez de caminhos relativos.

### Step 4: Configurar server.ts

```typescript
import { app } from "@/app"

const PORT = 3333

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

**Separação de responsabilidades:**
- `app.ts` — configura o Express (middlewares, rotas)
- `server.ts` — inicia o servidor (porta, listen)

### Step 5: Configurar script de desenvolvimento

```json
{
  "main": "src/server.ts",
  "scripts": {
    "dev": "tsx watch src/server.ts"
  }
}
```

- `tsx` — executa TypeScript diretamente sem build
- `watch` — reinicia automaticamente ao detectar alterações em arquivos

### Step 6: Executar e testar

```bash
npm run dev
# Server is running on port 3333
```

Verificar no navegador: `http://localhost:3333`

## Heuristics

| Situação | Faça |
|----------|------|
| Resposta simples de texto/HTML | `res.send("texto")` |
| Resposta JSON de API | `res.json({ key: "value" })` |
| Testar endpoint rapidamente | Navegador para GET, Insomnia/Postman para POST/PUT/DELETE |
| Porta do servidor | Variável const agora, variável de ambiente depois |
| Imports entre arquivos src/ | Use `@/` path alias, nunca `../../` |

## Anti-patterns

| Nunca faça | Faça instead |
|------------|-------------|
| `app.listen()` dentro de `app.ts` | Separar em `server.ts` — porque testes precisam do app sem listen |
| Imports com `./../../src/file` | Use `@/file` com path alias configurado no tsconfig |
| `"test": "echo..."` como único script | Configure `"dev": "tsx watch src/server.ts"` |
| Hardcode sem const para porta | `const PORT = 3333` — facilita trocar para env depois |
| Esquecer `express.json()` | Sempre adicionar antes das rotas — sem ele, `req.body` é undefined |

## Verificação

- `npm run dev` exibe "Server is running on port 3333" no terminal
- `http://localhost:3333` retorna "Hello World" no navegador
- Alterar código e salvar reinicia o servidor automaticamente (flag watch)

## Troubleshooting

### Problem: `req.body` is undefined when receiving POST requests
- **Cause**: Missing `express.json()` middleware before the route handlers
- **Fix**: Add `app.use(express.json())` before any route definitions in `app.ts`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre separação app/server, tsconfig options e path aliases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações