---
name: rs-full-stack-find-unique
description: "Applies Prisma findUnique patterns when querying single records by unique field. Use when user asks to 'find one record', 'get by id', 'fetch single user', 'show endpoint', or implements detail/show routes. Enforces where clause with unique fields, singular naming, and clean parameter extraction. Make sure to use this skill whenever building Prisma queries that return a single entity. Not for listing multiple records (findMany), creating, updating, or deleting."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: prisma-orm
  tags: [prisma, findUnique, database, rest-api, node-js]
---

# Prisma findUnique

> Ao buscar um registro unico por campo identificador, use findUnique com where explicito e nomeacao singular.

## Rules

1. **Use findUnique para registro unico** — `prisma.user.findUnique()` nao `findMany()` com filtro, porque findUnique expressa a intencao e otimiza a query para campos unicos
2. **Nomeie no singular** — `const user = ...` nao `const users = ...`, porque o retorno e um objeto, nao um array
3. **Extraia parametros antes do uso** — `const { id } = request.params` separado da query, porque fica mais clean e organizado
4. **Passe where com campo nomeado** — `where: { id }` nao `where: { id: request.params.id }` inline, porque separar extracao de uso melhora legibilidade
5. **Retorne o objeto diretamente** — findUnique retorna objeto ou null, nao array como findMany

## How to write

### Show endpoint com findUnique

```typescript
async show(request: FastifyRequest) {
  const { id } = request.params

  const user = await prisma.user.findUnique({
    where: { id },
  })

  return user
}
```

### Rota correspondente

```typescript
app.get("/users/:id", userController.show)
```

## Example

**Before (misturando findMany com filtro):**
```typescript
async show(request) {
  const users = await prisma.user.findMany({
    where: { id: request.params.id },
  })
  return users[0]
}
```

**After (com findUnique):**
```typescript
async show(request) {
  const { id } = request.params

  const user = await prisma.user.findUnique({
    where: { id },
  })

  return user
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Buscar por ID ou campo unico | `findUnique` com `where: { campo }` |
| Buscar por campo nao-unico | `findFirst` com `where: { campo }` |
| Listar varios registros | `findMany` (retorna array) |
| Parametro vem de request | Extraia antes: `const { id } = request.params` |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `findMany({ where: { id } })[0]` | `findUnique({ where: { id } })` |
| `const users = await prisma.user.findUnique(...)` | `const user = await prisma.user.findUnique(...)` |
| `where: { id: request.params.id }` | `const { id } = request.params` + `where: { id }` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `findUnique` retorna `null` | Registro nao existe com o ID fornecido | Adicione tratamento para null e retorne 404 |
| Erro `Argument where must have exactly one unique field` | Campo passado no `where` nao e unico no schema | Use `findFirst` para campos nao-unicos ou adicione `@unique` no schema |
| Parametro `id` chega como string em vez de number | Route params sao strings por padrao | Converta com `Number(id)` ou use validacao com Zod |
| Erro de tipo no `request.params` | Falta tipagem do parametro no Fastify/Express | Defina o schema de params na rota |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre findUnique vs findMany e organizacao de codigo
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes