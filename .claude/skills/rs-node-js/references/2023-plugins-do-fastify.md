---
name: rs-node-js-2023-plugins-do-fastify
description: "Enforces Fastify plugin architecture when structuring Node.js APIs with Fastify. Use when user asks to 'create a route', 'add an endpoint', 'organize fastify app', 'separate routes', or 'register a plugin'. Applies rules: routes in separate files as async plugins, typed with FastifyInstance, registered via app.register, order-aware. Make sure to use this skill whenever creating or refactoring Fastify route files. Not for Express, Hapi, or non-Fastify frameworks."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: fastify-architecture
  tags: [fastify, plugin, routes, register, fastify-instance, typescript, api-structure]
---

# Plugins do Fastify

> Separe cada dominio de rotas em seu proprio arquivo como plugin assincrono, registrado via app.register na ordem correta de dependencia.

## Rules

1. **Todo plugin e uma funcao async exportada** — `export async function myRoutes(app)`, porque o Fastify aguarda o carregamento completo de cada plugin antes de prosseguir
2. **Nunca exporte o app do server** — o server importa as rotas, nunca o contrario, porque plugins se acoplam ao app principal, nao o inverso
3. **Type o parametro com FastifyInstance** — `app: FastifyInstance`, porque sem isso o TypeScript nao infere metodos como `.get`, `.post`, `.register`
4. **Registre com app.register()** — nunca chame rotas diretamente, porque register e o mecanismo que o Fastify usa para encapsular e carregar plugins
5. **Ordem de registro importa** — plugins que modificam estado global (auth, database) devem ser registrados antes dos plugins de rotas, porque a execucao segue a ordem de registro
6. **Um arquivo por dominio** — `routes/transactions.ts`, `routes/users.ts`, porque separacao por dominio facilita manutencao e evita arquivos monoliticos

## How to write

### Plugin de rotas

```typescript
// src/routes/transactions.ts
import { FastifyInstance } from 'fastify'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/transactions', async () => {
    const transactions = await knex('transactions').select('*')
    return transactions
  })

  app.post('/transactions', async (request, reply) => {
    // handler
  })
}
```

### Registro no server

```typescript
// src/server.ts
import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

// Ordem: infraestrutura primeiro, rotas depois
app.register(transactionsRoutes)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP Server Running!')
})
```

## Example

**Before (rotas no server.ts):**
```typescript
import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/hello', async () => {
  const transactions = await knex('transactions').select('*')
  return transactions
})

app.listen({ port: 3333 })
```

**After (plugin separado):**
```typescript
// src/routes/transactions.ts
import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
    const transactions = await knex('transactions').select('*')
    return transactions
  })
}

// src/server.ts
import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()
app.register(transactionsRoutes)
app.listen({ port: 3333 })
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Novo dominio (users, products) | Criar novo arquivo em `routes/` como plugin async |
| Plugin depende de outro (auth antes de rotas) | Registrar na ordem correta no server |
| TypeScript nao sugere metodos no app | Tipar parametro com `FastifyInstance` |
| Mais de 5-6 rotas no mesmo dominio | Manter no mesmo plugin, separar apenas por dominio |
| Plugin precisa de configuracao | Usar segundo parametro `opts` do register |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `export const app = fastify()` no arquivo de rotas | `export async function routes(app: FastifyInstance)` |
| Funcao de plugin sincrona | Funcao de plugin `async` (obrigatorio) |
| `app: any` no parametro do plugin | `app: FastifyInstance` |
| Chamar rotas diretamente sem register | `app.register(myPlugin)` |
| Todas as rotas no server.ts | Um plugin por dominio em `routes/` |

## Troubleshooting

### TypeScript nao sugere metodos como get, post no parametro app do plugin
**Symptom:** Autocomplete nao funciona e TypeScript mostra erro ao usar `app.get()` dentro do plugin
**Cause:** O parametro `app` nao esta tipado com `FastifyInstance`
**Fix:** Tipe o parametro explicitamente: `export async function myRoutes(app: FastifyInstance)`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
