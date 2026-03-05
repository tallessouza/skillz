---
name: rs-full-stack-delete-6
description: "Applies Prisma delete pattern when writing record deletion endpoints in Node.js APIs. Use when user asks to 'delete a record', 'remove from database', 'create delete endpoint', or 'implement CRUD delete'. Enforces ID extraction from route params and prisma.model.delete() with where clause. Make sure to use this skill whenever implementing delete operations with Prisma ORM. Not for soft-delete logic, bulk deletion, or cascade configuration."
---

# Prisma Delete — Remover Registros

> Extraia o ID dos parametros da rota e use `prisma.model.delete()` com filtro `where` para remover um registro.

## Rules

1. **Recupere o ID de `request.params`** — o ID vem da rota dinamica (ex: `/questions/:id`), porque e o contrato REST padrao
2. **Use `prisma.model.delete()` com `where`** — uma unica linha resolve a delecao, porque o Prisma gera o SQL otimizado
3. **Nao envie body na requisicao DELETE** — o unico dado necessario e o ID na URL, porque DELETE semanticamente nao tem corpo
4. **Retorne confirmacao apos deletar** — responda com status adequado para o cliente saber que a operacao completou

## How to write

### Endpoint de delete

```typescript
app.delete('/questions/:id', async (request, reply) => {
  const { id } = request.params

  await prisma.question.delete({
    where: { id }
  })

  return reply.status(204).send()
})
```

## Example

**Before (verbose e incorreto):**
```typescript
app.delete('/questions/:id', async (request, reply) => {
  const params = request.params
  const question = await prisma.question.findUnique({ where: { id: params.id } })
  if (question) {
    await prisma.question.delete({ where: { id: params.id } })
    return reply.send({ message: 'deleted' })
  }
})
```

**After (com esta skill aplicada):**
```typescript
app.delete('/questions/:id', async (request, reply) => {
  const { id } = request.params

  await prisma.question.delete({
    where: { id }
  })

  return reply.status(204).send()
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| DELETE endpoint REST | Extraia ID de `request.params`, use `prisma.model.delete()` |
| Precisa validar existencia antes | Deixe o Prisma lancar erro se nao encontrar (handle no error handler) |
| Precisa deletar registros relacionados | Configure `onDelete: Cascade` no schema, nao faca delecoes manuais |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `findUnique` + `delete` separados | `delete` direto (Prisma ja lanca erro se nao existir) |
| Body na requisicao DELETE | ID apenas na URL via params |
| `request.body.id` para delete | `request.params.id` (padrao REST) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre delete no Prisma e fluxo REST
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes