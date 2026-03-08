---
name: rs-saas-nextjs-rbac-setup-do-swagger
description: "Applies Fastify Swagger and OpenAPI documentation setup when configuring API docs in Fastify projects. Use when user asks to 'add swagger', 'document API', 'setup OpenAPI', 'add API documentation', or 'configure swagger-ui'. Covers fastify-swagger with Zod TypeProvider integration, swagger-ui setup, route tagging, and summary annotations. Make sure to use this skill whenever setting up API documentation in Fastify. Not for REST client testing, Postman collections, or non-Fastify frameworks."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: setup
  tags: [saas, fastify, api, routes, nextjs, zod]
---

# Setup do Swagger no Fastify

> Documente a API desde o inicio usando Fastify Swagger com integracao Zod para gerar OpenAPI spec automaticamente.

## Rules

1. **Instale swagger e swagger-ui juntos** — `@fastify/swagger` gera o JSON OpenAPI, `@fastify/swagger-ui` renderiza a interface navegavel, porque o JSON sozinho nao e util sem visualizacao
2. **Use jsonSchemaTransform do TypeProvider Zod** — porque ele converte os schemas Zod em JSON Schema compativel com OpenAPI automaticamente
3. **Registre swagger ANTES das rotas** — porque plugins registrados depois nao capturam rotas ja definidas
4. **Adicione summary em cada rota** — porque so o metodo + path nem sempre comunica o proposito da rota
5. **Use tags para agrupar rotas** — porque organiza a documentacao por dominio (auth, billing, organizations)
6. **Comece a documentar cedo** — porque documentar no final e um trabalho enorme que geralmente nao e feito

## How to write

### Configuracao do Swagger no server.ts

```typescript
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'

// Registrar swagger com transform do Zod
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'My API',
      description: 'Full-stack SaaS application',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

// Registrar UI em /docs
app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})
```

### Rota com summary e tags

```typescript
app.register(async (app) => {
  app.post(
    '/users',
    {
      schema: {
        tags: ['auth'],
        summary: 'Create a new account',
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      // handler
    },
  )
})
```

## Example

**Before (rota sem documentacao):**
```typescript
app.post('/users', {
  schema: {
    body: z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    }),
  },
}, handler)
```

**After (com swagger integrado):**
```typescript
app.post('/users', {
  schema: {
    tags: ['auth'],
    summary: 'Create a new account',
    body: z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    }),
  },
}, handler)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Nova rota adicionada | Adicionar summary e tags no schema |
| Grupo de rotas relacionadas | Usar mesma tag para agrupar |
| API em desenvolvimento | Configurar swagger desde o primeiro endpoint |
| Precisa compartilhar spec | Acessar JSON em `/docs/json` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Swagger registrado depois das rotas | Registrar swagger antes de qualquer `app.register` de rotas |
| Rota sem summary | Sempre incluir `summary: 'descrição curta'` |
| Todas as rotas com tag `default` | Tags semanticas: `auth`, `organizations`, `billing` |
| Documentar API so no final do projeto | Documentar junto com a criacao de cada rota |
| Schema sem transform do Zod | Usar `transform: jsonSchemaTransform` |

## Troubleshooting

### Rota retorna 404
**Symptom:** Endpoint nao encontrado mesmo apos definir a rota
**Cause:** Rota nao foi registrada com `app.register()` no server.ts
**Fix:** Adicione `app.register(nomeDaRota)` no arquivo do servidor

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
