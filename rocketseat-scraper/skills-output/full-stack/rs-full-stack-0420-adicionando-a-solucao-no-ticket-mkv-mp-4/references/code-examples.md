# Code Examples: Combinando Params e Body em Updates

## Exemplo 1: Controller antes (apenas status)

```typescript
// Antes: updateStatus so mudava o status
app.patch("/tickets/:id/close", (req, res) => {
  const { id } = req.params
  // Sem body, apenas muda status
  updateStatus(id, "closed")
  return res.status(204).send()
})
```

## Exemplo 2: Controller depois (status + solution)

```typescript
// Depois: extrai solution do body e passa para update
app.patch("/tickets/:id/close", (req, res) => {
  const { id } = req.params
  const { solution } = req.body

  // Agora passa solution junto com status
  updateTicket(id, { status: "closed", solution })
  return res.status(204).send()
})
```

## Exemplo 3: Funcao de update com spread

```typescript
function updateTicket(id: string, data: Record<string, unknown>) {
  const index = tickets.findIndex(t => t.id === id)
  if (index === -1) throw new Error("Ticket not found")

  // Spread despeja TODOS os campos de data no ticket
  tickets[index] = {
    ...tickets[index],
    ...data,
  }

  return tickets[index]
}
```

## Exemplo 4: Body JSON no client (Insomnia/Postman)

```json
// PATCH /tickets/:id/close
// Content-Type: application/json
{
  "solution": "Trocamos a memória do computador que estava causando o problema"
}
```

## Exemplo 5: Filtrando tickets por status para verificar

```typescript
// GET /tickets?status=open → mostra apenas abertos
// GET /tickets?status=closed → mostra apenas fechados
app.get("/tickets", (req, res) => {
  const { status } = req.query

  const filtered = status
    ? tickets.filter(t => t.status === status)
    : tickets

  return res.json(filtered)
})
```

## Exemplo 6: Fluxo completo de teste (como o instrutor fez)

```bash
# 1. Criar ticket
# POST /tickets { "equipment": "computador", "description": "fica reiniciando", "user_name": "jose" }

# 2. Listar abertos
# GET /tickets?status=open

# 3. Encerrar com solucao
# PATCH /tickets/{id}/close { "solution": "trocamos a memória do computador" }

# 4. Verificar que sumiu dos abertos
# GET /tickets?status=open → nao aparece mais

# 5. Verificar nos fechados
# GET /tickets?status=closed → aparece com solution preenchida
```

## Variacao: Validando que solution e obrigatoria ao fechar

```typescript
app.patch("/tickets/:id/close", (req, res) => {
  const { id } = req.params
  const { solution } = req.body

  if (!solution) {
    return res.status(400).json({
      error: "Solution is required when closing a ticket",
    })
  }

  updateTicket(id, { status: "closed", solution })
  return res.status(204).send()
})
```

## Variacao: Usando com banco de dados real (SQL)

```typescript
// Com Knex/Prisma, o mesmo padrao se aplica
app.patch("/tickets/:id/close", async (req, res) => {
  const { id } = req.params
  const { solution } = req.body

  await db("tickets")
    .where({ id })
    .update({ status: "closed", solution })

  return res.status(204).send()
})
```