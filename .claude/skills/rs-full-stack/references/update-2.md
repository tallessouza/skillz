---
name: rs-full-stack-update-2
description: "Applies Prisma ORM update patterns when writing database update operations in Node.js/TypeScript. Use when user asks to 'update a record', 'edit database entry', 'modify with Prisma', 'put route', or 'update query'. Enforces correct use of where clause, data separation, and route parameter extraction. Make sure to use this skill whenever generating Prisma update code or PUT/PATCH endpoints. Not for create, delete, or read operations."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: database-prisma
  tags: [prisma, update, put-route, orm, node-js]
---

# Update com Prisma ORM

> Ao atualizar registros com Prisma, sempre separe claramente o `where` (qual registro) do `data` (quais campos), extraindo o identificador dos parametros da rota.

## Rules

1. **Extraia o ID de `request.params`** — o identificador do registro vem da URL, nunca do body, porque o body contem apenas os dados a serem alterados
2. **Extraia dados editaveis de `request.body`** — titulo, conteudo e campos mutaveis vem do body, porque sao os dados que o usuario quer modificar
3. **Sempre use a clausula `where`** — sem `where`, o Prisma atualiza todos os registros da tabela, causando corrupcao de dados
4. **Nao envie campos imutaveis no body** — campos como `userId` (dono do registro) nao devem ser alteraveis via update, porque a propriedade do registro nao muda
5. **Use o metodo HTTP PUT para updates completos** — PUT indica substituicao dos campos editaveis, alinhado com semantica REST

## How to write

### Rota de update com Prisma

```typescript
// Extrair ID da URL e dados do body separadamente
const { id } = request.params
const { title, content } = request.body

// Update com where explicito
await prisma.question.update({
  data: {
    title,
    content,
  },
  where: {
    id,
  },
})
```

### Registro da rota (Fastify)

```typescript
app.put('/questions/:id', async (request, reply) => {
  const { id } = request.params as { id: string }
  const { title, content } = request.body as { title: string; content: string }

  await prisma.question.update({
    data: { title, content },
    where: { id },
  })

  return reply.status(204).send()
})
```

## Example

**Before (errado — sem where, campos imutaveis no body):**
```typescript
app.put('/questions/:id', async (request, reply) => {
  const { id, title, content, userId } = request.body

  await prisma.question.update({
    data: { title, content, userId },
  })
})
```

**After (com esta skill aplicada):**
```typescript
app.put('/questions/:id', async (request, reply) => {
  const { id } = request.params as { id: string }
  const { title, content } = request.body as { title: string; content: string }

  await prisma.question.update({
    data: { title, content },
    where: { id },
  })

  return reply.status(204).send()
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Update de registro unico | `prisma.model.update({ where: { id }, data })` |
| Update de multiplos registros | `prisma.model.updateMany({ where: { filtro }, data })` |
| Campo nao deve mudar (userId, createdAt) | Nao inclua no `data`, extraia apenas campos editaveis do body |
| Testar update | Verifique no Prisma Studio ou faca GET apos o PUT |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `update({ data })` sem `where` | `update({ data, where: { id } })` |
| ID no body: `request.body.id` | ID na URL: `request.params.id` |
| `userId` no body do update | Omita campos imutaveis do body |
| `app.post('/questions/:id')` para update | `app.put('/questions/:id')` |

## Troubleshooting

| Problema | Causa | Solução |
|----------|-------|---------|
| `Record to update not found` | ID no `where` não existe no banco | Verifique o valor de `request.params.id` e se o registro existe |
| Update silencioso sem efeito | Campos no `data` são undefined | Confirme que `request.body` contém os campos esperados |
| Erro de tipo no `where` | ID é string mas schema espera número | Converta o tipo ou ajuste o schema do Prisma para usar String |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao where/data e seguranca de updates
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo com variacoes e cenarios reais

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-update-2/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-update-2/references/code-examples.md)
