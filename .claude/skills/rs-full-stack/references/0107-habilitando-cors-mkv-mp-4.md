---
name: rs-full-stack-0107-habilitando-cors
description: "Enforces CORS configuration best practices when setting up Express APIs to handle cross-origin requests. Use when user asks to 'enable CORS', 'configure cross-origin', 'setup API for frontend access', 'fix CORS error', or 'allow requests from other origins'. Applies correct installation, typing, and middleware initialization pattern. Make sure to use this skill whenever building an Express API that will receive requests from a different origin. Not for Fastify CORS, Next.js API routes, or browser-side fetch configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [cors, express, middleware, typescript, cross-origin]
---

# Habilitando CORS no Express

> Configure o middleware CORS como primeiro passo ao criar uma API Express que sera consumida por clientes em origens diferentes.

## Rules

1. **Instale o pacote e sua tipagem separadamente** — `cors` como dependencia de producao, `@types/cors` como dependencia de desenvolvimento, porque Express com TypeScript exige tipagens explicitas
2. **Inicialize CORS via `app.use(cors())`** — registre antes das rotas, porque middlewares executam na ordem de registro e CORS precisa processar preflight antes de qualquer handler
3. **Nao pare o servidor para instalar dependencias** — abra um terminal separado para `npm install`, porque o processo de desenvolvimento nao precisa ser interrompido

## How to write

### Instalacao

```bash
# Terminal separado (nao precisa parar o servidor)
npm install cors@2.8.5
npm install -D @types/cors@2.8.17
```

### Configuracao no app

```typescript
import cors from "cors"
import express from "express"

const app = express()

// Registrar CORS antes das rotas
app.use(cors())

// ... rotas da aplicacao
```

## Example

**Before (API sem CORS — frontend recebe erro de cross-origin):**
```typescript
import express from "express"

const app = express()

app.get("/users", (req, res) => {
  res.json([{ name: "João" }])
})
```

**After (CORS habilitado — frontend acessa normalmente):**
```typescript
import cors from "cors"
import express from "express"

const app = express()

app.use(cors())

app.get("/users", (req, res) => {
  res.json([{ name: "João" }])
})
```

## Heuristics

| Situacao | Acao |
|----------|------|
| API sera consumida apenas pelo mesmo dominio | CORS nao e necessario |
| API sera consumida por frontend em outro dominio/porta | Habilitar CORS com `app.use(cors())` |
| Precisa restringir origens permitidas | Passar opcoes: `cors({ origin: "https://meusite.com" })` |
| Precisa permitir cookies cross-origin | Adicionar `cors({ credentials: true })` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Configurar headers CORS manualmente com `res.setHeader` | Use o middleware `cors()` que trata todos os casos |
| Registrar CORS depois das rotas | Registre CORS antes de todas as rotas |
| Instalar `cors` sem `@types/cors` em projeto TypeScript | Instale ambos: `cors` e `@types/cors` |
| Parar o servidor para instalar pacotes | Use um terminal separado |

## Troubleshooting

### Problem: TypeScript error when importing `cors` — "Could not find a declaration file"
- **Cause**: Missing `@types/cors` type definitions package
- **Fix**: Install the type definitions as a dev dependency with `npm install -D @types/cors`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre CORS, preflight requests e configuracao avancada
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com variacoes de configuracao