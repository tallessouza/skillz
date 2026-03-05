# Code Examples: API de Tickets de Suporte

## Estrutura completa das rotas

### POST /tickets — Criar ticket

```typescript
import { randomUUID } from 'node:crypto'

const tickets = []

// Criar novo ticket
app.post('/tickets', (req, res) => {
  const { equipment, description, username } = req.body

  const ticket = {
    id: randomUUID(),
    equipment,
    description,
    username,
    status: 'open',
    createdAt: new Date()
  }

  tickets.push(ticket)

  return res.status(201).json(ticket)
})
```

### GET /tickets — Listar com filtro opcional

```typescript
// Listar tickets com filtro opcional por status
app.get('/tickets', (req, res) => {
  const { status } = req.query

  if (status) {
    const filteredTickets = tickets.filter(ticket => ticket.status === status)
    return res.json(filteredTickets)
  }

  return res.json(tickets)
})
```

**Exemplos de chamada:**
```
GET /tickets              → todos os tickets
GET /tickets?status=open  → apenas tickets abertos
GET /tickets?status=closed → apenas tickets fechados
```

### PUT /tickets/:id — Atualizar dados (sem username)

```typescript
// Atualizar apenas equipment e description
app.put('/tickets/:id', (req, res) => {
  const { id } = req.params
  const { equipment, description } = req.body
  // username NAO e extraido — imutavel

  const ticketIndex = tickets.findIndex(ticket => ticket.id === id)

  if (ticketIndex === -1) {
    return res.status(404).json({ error: 'Ticket not found' })
  }

  tickets[ticketIndex] = {
    ...tickets[ticketIndex],
    equipment,
    description
    // username preservado do original
    // status preservado do original
  }

  return res.json(tickets[ticketIndex])
})
```

### PATCH /tickets/:id/status — Fechar ticket

```typescript
// Transicionar status para closed
app.patch('/tickets/:id/status', (req, res) => {
  const { id } = req.params

  const ticketIndex = tickets.findIndex(ticket => ticket.id === id)

  if (ticketIndex === -1) {
    return res.status(404).json({ error: 'Ticket not found' })
  }

  tickets[ticketIndex].status = 'closed'

  return res.json(tickets[ticketIndex])
})
```

### DELETE /tickets/:id — Remover ticket

```typescript
// Deletar permanentemente
app.delete('/tickets/:id', (req, res) => {
  const { id } = req.params

  const ticketIndex = tickets.findIndex(ticket => ticket.id === id)

  if (ticketIndex === -1) {
    return res.status(404).json({ error: 'Ticket not found' })
  }

  tickets.splice(ticketIndex, 1)

  return res.status(204).send()
})
```

## Variacoes e cenarios

### Filtro com multiplos query params (extensao futura)

```typescript
app.get('/tickets', (req, res) => {
  const { status, username } = req.query
  let result = tickets

  if (status) {
    result = result.filter(ticket => ticket.status === status)
  }

  if (username) {
    result = result.filter(ticket => ticket.username === username)
  }

  return res.json(result)
})
```

### Validacao de campos na criacao

```typescript
app.post('/tickets', (req, res) => {
  const { equipment, description, username } = req.body

  if (!equipment || !description || !username) {
    return res.status(400).json({
      error: 'Missing required fields: equipment, description, username'
    })
  }

  // ... criar ticket
})
```

### UUID com node:crypto

```typescript
import { randomUUID } from 'node:crypto'

// Gera IDs como: "550e8400-e29b-41d4-a716-446655440000"
const id = randomUUID()
```