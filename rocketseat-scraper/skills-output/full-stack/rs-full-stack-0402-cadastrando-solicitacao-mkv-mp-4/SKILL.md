---
name: rs-full-stack-0402-cadastrando-solicitacao
description: "Enforces Prisma create patterns with user validation when inserting records into the database. Use when user asks to 'create a record', 'insert into database', 'save to database with Prisma', 'register a request', or 'cadastrar no banco'. Applies pattern: validate authenticated user before insert, use Prisma create with typed data, return 201 with created entity. Make sure to use this skill whenever implementing POST endpoints that persist data with Prisma and require authentication. Not for read queries, migrations, schema design, or frontend form handling."
---

# Cadastrando Solicitação com Prisma

> Antes de inserir no banco, valide o usuário autenticado; depois persista com Prisma e retorne 201 com a entidade criada.

## Prerequisites

- Prisma configurado com `@/database/prisma`
- Middleware de autenticação populando `request.user.id`
- AppError disponível para exceções padronizadas

## Steps

### Step 1: Importar dependências

```typescript
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
```

### Step 2: Validar existência do usuário (double check)

```typescript
if (!request.user?.id) {
  throw new AppError("Unauthorized", 401)
}
```

Mesmo com middleware de autenticação, faça double check antes de operações de escrita — porque o `user.id` é obrigatório no banco e um null causaria erro de constraint.

### Step 3: Criar registro com Prisma

```typescript
const refund = await prisma.refund.create({
  data: {
    name,
    category,
    amount,
    filename,
    userId: request.user.id,
  },
})
```

### Step 4: Retornar 201 com entidade criada

```typescript
return response.status(201).json(refund)
```

Status 201 (Created) é o correto para POST que cria recurso. Retorne a entidade completa para que o cliente tenha acesso ao `id`, `createdAt` e `updatedAt` gerados pelo banco.

## Output format

```json
{
  "id": "uuid-gerado",
  "name": "Reembolso viagem",
  "category": "transport",
  "amount": 15000,
  "filename": "receipt.pdf",
  "userId": "user-uuid",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Error handling

- Se `request.user.id` não existir → `throw new AppError("Unauthorized", 401)`
- Padronize a mensagem de erro com o mesmo texto usado no middleware de autenticação, porque consistência facilita debugging no cliente

## Verification

- Envie POST via Insomnia/Thunder Client e confirme status 201
- Abra Prisma Studio (`npx prisma studio`) e verifique o registro na tabela

## Heuristics

| Situação | Ação |
|----------|------|
| POST que cria recurso no banco | Sempre retorne 201, nunca 200 |
| Campo vem de `request.user` | Double check antes de usar no `create` |
| Prisma create retorna o objeto | Use o retorno direto no `json()`, sem query extra |
| Mensagem de erro de auth | Padronize com o middleware para consistência |

## Anti-patterns

| Nunca faça | Faça assim |
|------------|------------|
| `response.status(200)` para criação | `response.status(201)` |
| Usar `request.user.id` sem verificar | Verificar `if (!request.user?.id)` antes |
| Fazer `create` e depois `findUnique` | Usar o retorno direto do `create` |
| Mensagem de erro diferente do middleware | Padronizar mensagem entre middleware e controller |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre double check de autenticação e padrão de resposta 201
- [code-examples.md](references/code-examples.md) — Exemplo completo do controller com variações