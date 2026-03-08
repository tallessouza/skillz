---
name: rs-full-stack-cadastra-log
description: "Enforces delivery log registration patterns when building audit/tracking endpoints with Prisma, Zod validation, and business rule guards. Use when user asks to 'create a log endpoint', 'add delivery tracking', 'implement audit trail', 'register status changes', or 'build order tracking API'. Applies patterns: Zod body validation, existence check with 404, status guard before mutation, Prisma create for log entry, 201 response. Make sure to use this skill whenever implementing endpoints that record events or state changes tied to a parent entity. Not for listing/querying logs, updating delivery status, or frontend tracking UI."
---

# Cadastra Log — Registro de Movimentação de Entrega

> Antes de registrar qualquer log, valide o payload com Zod, confirme que a entidade pai existe, e verifique que o estado atual permite a operação.

## Rules

1. **Valide o body com Zod antes de qualquer operação** — defina um schema com os campos obrigatórios (ID da entidade pai + dados do log), porque rejeitar cedo evita queries desnecessárias ao banco
2. **Verifique existência da entidade pai com findUnique** — se retornar null, lance AppError com mensagem descritiva e status 404, porque operações em entidades inexistentes devem falhar explicitamente
3. **Guarde a mutação com verificação de estado** — antes de criar o log, confirme que a entidade pai está no estado correto (ex: pedido já foi enviado), porque regras de negócio definem a ordem válida de operações
4. **Crie o log com Prisma create vinculando à entidade pai** — passe o foreign key e os dados descritivos, porque logs são sempre filhos de uma entidade principal
5. **Retorne 201 sem corpo** — log criado com sucesso não precisa devolver dados, porque o cliente já tem as informações que enviou

## How to write

### Validação do body com Zod

```typescript
const bodySchema = z.object({
  delivery_id: z.string().uuid(),
  description: z.string(),
})

const { delivery_id, description } = bodySchema.parse(request.body)
```

### Verificação de existência + guard de estado

```typescript
const delivery = await prisma.delivery.findUnique({
  where: { id: delivery_id },
})

if (!delivery) {
  throw new AppError("Delivery not found", 404)
}

if (delivery.status === "processing") {
  throw new AppError("Change status to shipped first", 400)
}
```

### Criação do log e resposta

```typescript
await prisma.deliveryLog.create({
  data: {
    delivery_id,
    description,
  },
})

return response.status(201).json()
```

## Example

**Before (sem validação nem guards):**
```typescript
app.post("/deliveries/log", async (request, response) => {
  const { delivery_id, description } = request.body
  await prisma.deliveryLog.create({
    data: { delivery_id, description },
  })
  return response.json({ ok: true })
})
```

**After (com este skill aplicado):**
```typescript
app.post("/deliveries/log", async (request, response) => {
  const bodySchema = z.object({
    delivery_id: z.string().uuid(),
    description: z.string(),
  })

  const { delivery_id, description } = bodySchema.parse(request.body)

  const delivery = await prisma.delivery.findUnique({
    where: { id: delivery_id },
  })

  if (!delivery) {
    throw new AppError("Delivery not found", 404)
  }

  if (delivery.status === "processing") {
    throw new AppError("Change status to shipped first", 400)
  }

  await prisma.deliveryLog.create({
    data: { delivery_id, description },
  })

  return response.status(201).json()
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Endpoint cria registro filho de outra entidade | Sempre verifique existência do pai antes |
| Entidade pai tem status/estado | Adicione guard verificando estado válido antes da mutação |
| Body tem ID de referência | Valide como `z.string().uuid()` no schema Zod |
| Log/audit trail criado com sucesso | Retorne 201 sem corpo |
| Múltiplos logs por entidade | Use relação 1:N no Prisma (delivery → deliveryLog[]) |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `request.body.delivery_id` direto sem validação | `bodySchema.parse(request.body)` com Zod |
| Criar log sem verificar se entidade pai existe | `findUnique` + check null + throw 404 |
| Criar log sem verificar estado da entidade | Guard com `if (entity.status === "processing")` |
| Retornar 200 para criação | Retornar `status(201)` |
| Mensagem genérica "Error" | Mensagem descritiva: "Delivery not found", "Change status to shipped first" |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre ordem de validações, regras de negócio de movimentação, e pattern de log/audit
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e cenários de teste