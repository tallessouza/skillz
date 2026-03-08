---
name: rs-full-stack-0407-exibindo-solicitacao-especifica
description: "Enforces the pattern for building 'show' endpoints that fetch a single record by ID using Prisma findFirst with parameter validation and relation includes. Use when user asks to 'show a specific record', 'get by ID', 'fetch single item', 'detail endpoint', or 'find one record'. Applies Zod param validation, findFirst with where/include, and role-based route authorization. Make sure to use this skill whenever creating detail/show API routes. Not for list/index endpoints, creation, updates, or delete operations."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [prisma, findFirst, show, params, zod, authorization]
---

# Exibindo uma Solicitação Específica (Show Endpoint)

> Ao criar um endpoint de detalhe, valide o ID dos params com Zod, use `findFirst` com `include` para relações, e autorize múltiplos roles na rota.

## Rules

1. **Use `findFirst` para busca por ID** — não `findUnique`, porque `findFirst` permite composição flexível de filtros futuros
2. **Valide params com Zod antes de usar** — `paramsSchema.parse(request.params)` garante que o ID é válido antes de tocar no banco
3. **Inclua relações necessárias no mesmo query** — `include: { user: true }` evita N+1 e retorna dados completos em uma chamada
4. **Autorize múltiplos roles quando ambos precisam acessar** — Employee vê sua própria solicitação, Manager vê qualquer uma
5. **Retorne o objeto diretamente no JSON** — `response.json(refund)` sem wrapper desnecessário

## How to write

### Controller method (show)

```typescript
async show(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = paramsSchema.parse(request.params)

  const refund = await prisma.refund.findFirst({
    where: { id },
    include: {
      user: true,
    },
  })

  return response.json(refund)
}
```

### Rota com autorização multi-role

```typescript
refundRoutes.get(
  "/:id",
  verifyUserAuthorization(["employee", "manager"]),
  refundsController.show
)
```

## Example

**Before (sem validação, sem include):**

```typescript
async show(req: Request, res: Response) {
  const result = await prisma.refund.findFirst({
    where: { id: req.params.id },
  })
  return res.json(result)
}
```

**After (com validação Zod e include):**

```typescript
async show(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = paramsSchema.parse(request.params)

  const refund = await prisma.refund.findFirst({
    where: { id },
    include: { user: true },
  })

  return response.json(refund)
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Endpoint retorna um registro por ID | Use `findFirst` + Zod UUID validation nos params |
| Registro tem relações relevantes para o frontend | Adicione `include` com as relações necessárias |
| Múltiplos roles precisam acessar o mesmo endpoint | Passe array de roles no middleware de autorização |
| ID inválido é enviado na URL | Zod rejeita automaticamente com erro de validação |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `req.params.id` direto sem validar | `paramsSchema.parse(request.params)` |
| `findUnique` quando pode compor filtros | `findFirst` com `where` flexível |
| Query sem `include` + query separada para relação | `findFirst` com `include: { user: true }` |
| Role único quando ambos precisam | `["employee", "manager"]` no array de roles |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| Zod rejeita o ID com erro de validação | ID enviado não é UUID válido | Verifique o formato do ID na URL — deve ser UUID v4 |
| `findFirst` retorna `null` | Registro não existe no banco | Adicione tratamento para 404 quando resultado é null |
| Relação retorna `null` mesmo com include | Foreign key não referencia registro existente | Verifique integridade referencial no banco |
| Endpoint acessível sem autorização | Middleware de autorização não aplicado na rota | Confirme que `verifyUserAuthorization` está antes do controller |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre findFirst vs findUnique, validação de params e autorização multi-role
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações