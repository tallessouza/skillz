---
name: rs-full-stack-adicionando-solucao-ticket
description: "Applies pattern of combining route params with request body data in PATCH/PUT endpoints when updating resources. Use when user asks to 'close a ticket', 'update with additional data', 'add fields to patch request', 'combine params and body', or 'enrich update endpoint'. Ensures update operations spread body data into the persisted object. Make sure to use this skill whenever building REST update endpoints that need both identifier params and payload body. Not for GET requests, query filtering, or creating new resources."
---

# Combinando Params e Body em Endpoints de Update

> Ao atualizar um recurso via PATCH/PUT, extraia o identificador dos route params e os dados adicionais do body da requisicao, despejando ambos na operacao de update.

## Rules

1. **Separe identificacao de dados** — `req.params` para o ID, `req.body` para os campos a atualizar, porque misturar identificadores no body gera ambiguidade e quebra REST semantics
2. **Espalhe os dados do body no objeto de update** — use spread operator para que novas propriedades sejam automaticamente persistidas sem alterar a logica de update existente
3. **Propriedades novas propagam automaticamente** — se o objeto de dados aceita propriedades dinamicas (JSON store), nao precisa alterar o schema para cada campo novo, porque o spread ja cobre
4. **Remova console.log de debug antes de finalizar** — logs temporarios poluem o output de producao

## How to write

### Endpoint PATCH com params + body

```typescript
// Extraia id dos params e dados do body separadamente
app.patch("/tickets/:id/close", (req, res) => {
  const { id } = req.params
  const { solution } = req.body

  // Passe ambos para a camada de dados
  updateTicket(id, { status: "closed", solution })

  return res.status(204).send()
})
```

### Camada de update com spread

```typescript
function updateTicket(id: string, data: Partial<Ticket>) {
  const ticket = findById(id)
  // Spread despeja todas as propriedades novas no objeto
  Object.assign(ticket, data)
  save(ticket)
}
```

## Example

**Before (apenas status, sem solucao):**
```typescript
app.patch("/tickets/:id/close", (req, res) => {
  const { id } = req.params
  updateStatus(id, "closed")
  return res.status(204).send()
})
```

**After (status + solucao do body):**
```typescript
app.patch("/tickets/:id/close", (req, res) => {
  const { id } = req.params
  const { solution } = req.body
  updateTicket(id, { status: "closed", solution })
  return res.status(204).send()
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Update precisa de ID + dados extras | Params para ID, body para dados |
| Novo campo no update | Adicione no body e no spread, sem mudar logica |
| Debug temporario com console.log | Remova antes do commit |
| Testando endpoint PATCH | Configure body como JSON no client (Insomnia/Postman) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `req.body.id` para identificar recurso | `req.params.id` |
| Hardcode de cada campo no update | Spread do objeto de dados |
| console.log permanente em producao | Remova apos testar |
| PATCH sem body quando ha dados extras | Configure Content-Type: application/json |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao params/body e propagacao de propriedades
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-0420-adicionando-a-solucao-no-ticket-mkv-mp-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-0420-adicionando-a-solucao-no-ticket-mkv-mp-4/references/code-examples.md)
