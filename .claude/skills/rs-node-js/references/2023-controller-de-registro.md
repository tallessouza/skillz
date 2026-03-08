---
name: rs-node-js-2023-controller-de-registro
description: "Enforces controller layer separation in Node.js/Fastify applications following SOLID principles. Use when user asks to 'create a route', 'add an endpoint', 'register controller', 'separate concerns', or 'organize API layers'. Applies rules: controllers only handle HTTP request/response, business logic lives in use cases, routes registered as Fastify plugins. Make sure to use this skill whenever creating or refactoring API endpoints in Node.js. Not for frontend components, database schema design, or authentication strategies."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: node-js-2023
  module: api-solid
  tags: [nestjs, controller, clean-architecture, e2e-test, rest-api]
  mind-lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
---

# Controller de Registro — Separacao em Camadas

> Controllers lidam exclusivamente com entrada HTTP e resposta ao cliente; regras de negocio vivem em camadas independentes da porta de entrada.

## Rules

1. **Controller = funcao que recebe request e devolve reply** — nada mais, porque a regra de negocio precisa funcionar independente de como o usuario chega (HTTP, integracao entre sistemas, CLI)
2. **Separe controllers em `http/controllers/`** — um arquivo por controller, porque manter tudo no arquivo de rotas cria arquivos gigantes impossiveis de manter
3. **Rotas como plugins Fastify** — exporte uma funcao async que recebe `FastifyInstance` e registre com `app.register()`, porque o Fastify espera plugins assincronos
4. **Type os parametros com FastifyRequest e FastifyReply** — ao extrair controllers para outros arquivos, o TypeScript perde a inferencia, entao importe os tipos explicitamente
5. **Business logic e independente da porta de entrada** — hash de senha, validacao de email duplicado, criacao no banco devem ser identicos seja via HTTP, integracao com sistema externo ou qualquer outro meio
6. **Nunca coloque logica de negocio no controller** — o controller valida input HTTP e delega para um use case/service, porque se amanha a mesma operacao vier por outro canal, a logica precisa ser reaproveitada

## How to write

### Estrutura de pastas

```
src/
├── http/
│   ├── controllers/
│   │   └── register.ts      # Controller: request → reply
│   └── routes.ts             # Plugin Fastify com todas as rotas
├── app.ts                     # Setup do Fastify, registra plugins
└── server.ts                  # Inicia o servidor
```

### Controller tipado

```typescript
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  // TODO: mover para use case (proxima camada)
  await prisma.user.create({
    data: { name, email, password_hash: password },
  })

  return reply.status(201).send()
}
```

### Rotas como plugin Fastify

```typescript
import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
}
```

### Registro no app

```typescript
import fastify from 'fastify'
import { appRoutes } from './http/routes'

export const app = fastify()

app.register(appRoutes)
```

## Example

**Before (tudo no arquivo de rotas):**
```typescript
// app.ts — rotas + validacao + banco + setup tudo junto
app.post('/users', async (request, reply) => {
  const { name, email, password } = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  }).parse(request.body)

  await prisma.user.create({ data: { name, email, password_hash: password } })
  return reply.status(201).send()
})
```

**After (controller separado):**
```typescript
// http/controllers/register.ts
export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({ name: z.string(), email: z.string().email(), password: z.string().min(6) })
  const { name, email, password } = registerBodySchema.parse(request.body)
  await prisma.user.create({ data: { name, email, password_hash: password } })
  return reply.status(201).send()
}

// http/routes.ts
export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
}

// app.ts
app.register(appRoutes)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Aplicacao tem mais de 3 rotas | Separe rotas em arquivo `routes.ts` como plugin |
| Controller ultrapassa 30 linhas | Extraia logica de negocio para use case |
| Mesma operacao sera acessada por multiplos canais | Obrigatoriamente separe controller de use case |
| Arquivo de rotas cresce demais | Agrupe rotas por dominio em plugins separados |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Logica de hash/validacao dentro do controller | Delegue para use case/service |
| Todas as rotas no `app.ts` | Plugin separado com `app.register()` |
| Controller sem tipos explicitos | `FastifyRequest` e `FastifyReply` importados |
| Plugin de rotas sincrono | Sempre `async function appRoutes(...)` |
| Nomear controller genericamente (`handler.ts`) | Nomeie pelo dominio: `register.ts`, `authenticate.ts` |

## Troubleshooting

### Erro inesperado ao seguir este padrao
**Symptom:** Codigo segue o padrao mas comportamento nao e o esperado
**Cause:** Dependencia nao registrada no modulo ou configuracao incompleta
**Fix:** Verificar registro completo no modulo (controllers, providers, imports) e dependencias instaladas

## Deep reference library

- [deep-explanation.md](../../../data/skills/node-js-2023/rs-node-js-2023-controller-de-registro/references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/node-js-2023/rs-node-js-2023-controller-de-registro/references/code-examples.md) — Todos os exemplos de código expandidos com variações
