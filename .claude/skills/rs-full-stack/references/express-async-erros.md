---
name: rs-full-stack-express-async-erros
description: "Applies express-async-errors pattern when setting up Express error handling middleware. Use when user asks to 'create express app', 'handle errors in express', 'setup middleware', 'add error handling', or 'create API routes'. Eliminates manual try-catch and next() boilerplate in async route handlers. Make sure to use this skill whenever creating or refactoring Express.js applications with async controllers. Not for frontend error handling, non-Express frameworks, or synchronous error flows."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: express-api
  tags: [express, error-handling, async, middleware, express-async-errors]
---

# Express Async Errors

> Importe `express-async-errors` no topo do server para eliminar try-catch e next() manuais em todas as rotas async.

## Rules

1. **Importe antes de tudo** — `import 'express-async-errors'` deve ser a primeira importacao apos o import do express, porque a biblioteca faz monkey-patch no Express para capturar rejeicoes de promises automaticamente
2. **Nunca use try-catch em controllers para repassar erros** — a biblioteca encaminha erros async automaticamente para o middleware de erro, porque try-catch em cada rota e boilerplate desnecessario
3. **Nunca use next() para erros async** — remova o parametro `next: NextFunction` dos controllers, porque express-async-errors substitui essa mecanica
4. **Mantenha o middleware de erro no server** — o middleware `(error, req, res, next)` com 4 parametros continua necessario, porque express-async-errors apenas encaminha o erro, nao o trata
5. **Fixe a versao** — instale `express-async-errors@3.1.1`, porque versoes diferentes podem ter comportamento distinto

## How to write

### Setup no server.ts

```typescript
import express from 'express'
import 'express-async-errors' // DEVE vir logo apos o express

import { routes } from './routes'

const app = express()
app.use(express.json())
app.use(routes)

// Middleware de tratamento de erros (4 parametros obrigatorios)
app.use((error, request, response, next) => {
  return response.status(500).json({
    status: 'error',
    message: error.message || 'Internal server error',
  })
})
```

### Controller limpo (sem try-catch, sem next)

```typescript
import { Request, Response } from 'express'

class UsersController {
  async create(request: Request, response: Response) {
    // Se qualquer throw ou rejeicao ocorrer aqui,
    // express-async-errors encaminha automaticamente pro middleware de erro
    const user = await createUser(request.body)
    return response.status(201).json(user)
  }
}
```

## Example

**Before (forma padrao com try-catch e next):**

```typescript
import { Request, Response, NextFunction } from 'express'

class UsersController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const user = await createUser(request.body)
      return response.status(201).json(user)
    } catch (error) {
      next(error)
    }
  }
}
```

**After (com express-async-errors):**

```typescript
import { Request, Response } from 'express'

class UsersController {
  async create(request: Request, response: Response) {
    const user = await createUser(request.body)
    return response.status(201).json(user)
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Novo projeto Express com rotas async | Instalar express-async-errors desde o inicio |
| Projeto existente com try-catch em todas as rotas | Migrar: adicionar import e remover try-catch/next dos controllers |
| Middleware customizado de erro | Manter — a biblioteca nao substitui o middleware, apenas o alimenta |
| Funcao sincrona no controller | Funciona tambem, mas o beneficio principal e para async |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `try { ... } catch(e) { next(e) }` em cada rota | Throw direto, express-async-errors encaminha |
| `next: NextFunction` em controller async | Remover o parametro next |
| `import 'express-async-errors'` no final do arquivo | Importar logo apos `import express` |
| Middleware de erro com 3 parametros | Sempre 4 parametros: `(error, req, res, next)` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Erros async nao chegam ao middleware de erro | Import do `express-async-errors` esta depois das rotas | Mover import para logo apos `import express` |
| Middleware de erro nao e chamado | Middleware tem apenas 3 parametros | Garantir 4 parametros: `(error, req, res, next)` |
| `UnhandledPromiseRejection` no console | `express-async-errors` nao foi importado | Adicionar `import 'express-async-errors'` no topo do server |
| Erro 500 generico sem mensagem util | Middleware de erro nao extrai `error.message` | Usar `error.message \|\| 'Internal server error'` na resposta |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que try-catch e problematico e como a biblioteca funciona internamente
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes