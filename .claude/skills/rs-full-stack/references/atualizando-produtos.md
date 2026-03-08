---
name: rs-full-stack-atualizando-produtos
description: "Applies REST API update endpoint patterns when building PUT/PATCH routes with Node.js, Express, Knex, and Zod. Use when user asks to 'create update route', 'update endpoint', 'edit product', 'PUT route', or 'validate route params'. Enforces param ID validation with Zod transform, body schema reuse, updated_at field management, and where clause in Knex updates. Make sure to use this skill whenever implementing update operations in Express+Knex APIs. Not for GET/POST/DELETE endpoints, frontend forms, or ORM-based updates (Prisma, TypeORM)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: api
  tags: [express, knex, zod, rest-api, update-endpoint]
---

# Atualizando Produtos — Update Endpoint Pattern

> Toda rota de update valida o ID como numero, reutiliza o schema do body, e atualiza o campo `updated_at` automaticamente.

## Rules

1. **Valide o ID do param com Zod transform** — converta string para number no parse, porque params chegam sempre como string mas a chave primaria e numerica
2. **Use `z.string().transform().refine()` para params** — transform converte, refine valida que a conversao foi bem sucedida com `isNaN`, porque rejeita IDs invalidos antes de chegar no banco
3. **Reutilize o body schema do create** — update e create compartilham os mesmos campos de validacao, porque DRY evita divergencia entre validacoes
4. **Sempre atualize `updated_at`** — use `knex.fn.now()` no update, porque `created_at` e fixo (momento da criacao) mas `updated_at` reflete a ultima modificacao
5. **Use clausula `where` com o ID** — nunca faca update sem where, porque sem where atualiza TODOS os registros da tabela
6. **Retorne status 200 sem body customizado** — update bem sucedido retorna 200 OK padrao, porque o cliente pode buscar o recurso atualizado separadamente

## How to write

### Validacao do ID (param)

```typescript
const id = z
  .string()
  .transform((value) => Number(value))
  .refine((value) => !isNaN(value), { message: "id must be a number" })
  .parse(request.params.id)
```

### Controller de update completo

```typescript
async update(request: Request, response: Response, next: NextFunction) {
  try {
    const id = z
      .string()
      .transform((value) => Number(value))
      .refine((value) => !isNaN(value), { message: "id must be a number" })
      .parse(request.params.id)

    const bodySchema = z.object({
      name: z.string().trim().min(6),
      price: z.number().gt(0),
    })

    const { name, price } = bodySchema.parse(request.body)

    await knex<ProductRepository>("products")
      .update({ name, price, updated_at: knex.fn.now() })
      .where({ id })

    return response.status(200).json()
  } catch (error) {
    next(error)
  }
}
```

### Rota PUT com ID

```typescript
productRoutes.put("/:id", productsController.update)
```

## Example

**Before (sem validacao de param, sem updated_at):**

```typescript
async update(request: Request, response: Response) {
  const { id } = request.params
  const { name, price } = request.body

  await knex("products").update({ name, price }).where({ id })

  return response.json({ message: "updated" })
}
```

**After (com Zod transform + refine, updated_at):**

```typescript
async update(request: Request, response: Response, next: NextFunction) {
  try {
    const id = z
      .string()
      .transform((value) => Number(value))
      .refine((value) => !isNaN(value), { message: "id must be a number" })
      .parse(request.params.id)

    const bodySchema = z.object({
      name: z.string().trim().min(6),
      price: z.number().gt(0),
    })

    const { name, price } = bodySchema.parse(request.body)

    await knex<ProductRepository>("products")
      .update({ name, price, updated_at: knex.fn.now() })
      .where({ id })

    return response.status(200).json()
  } catch (error) {
    next(error)
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Param vem da URL (`:id`) | Sempre valide com Zod transform + refine |
| Body schema igual ao create | Reutilize o schema, nao duplique |
| Tabela tem `updated_at` | Sempre passe `knex.fn.now()` no update |
| Precisa confirmar que update funcionou | Retorne 200 OK |
| ID pode ser texto invalido | `isNaN` no refine rejeita antes do banco |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const id = request.params.id` (sem validacao) | `const id = z.string().transform(Number).refine(...).parse(request.params.id)` |
| `.update({ name, price })` (sem updated_at) | `.update({ name, price, updated_at: knex.fn.now() })` |
| `knex("products").update(...)` (sem where) | `knex("products").update(...).where({ id })` |
| `new Date()` para updated_at | `knex.fn.now()` (usa timestamp do banco) |
| Body schema duplicado entre create e update | Schema compartilhado ou copiado do create |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Erro "id must be a number" | Param da URL nao e numerico | Verifique a URL da requisicao, o `:id` deve ser numero |
| Zod parse error no body | Campos `name` ou `price` fora do schema | Confira que o body envia `name` (string min 6) e `price` (number > 0) |
| Update nao persiste | Faltou `where({ id })` no Knex | Adicione clausula where com o ID validado |
| `updated_at` nao muda | Usando `new Date()` no JS em vez de `knex.fn.now()` | Substitua por `knex.fn.now()` para usar timestamp do banco |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre validacao de params, transform vs coerce, e gestao de timestamps
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes