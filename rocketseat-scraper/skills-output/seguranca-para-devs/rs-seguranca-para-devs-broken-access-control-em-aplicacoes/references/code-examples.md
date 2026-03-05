# Code Examples: Broken Access Control

## Exemplo 1: Sistema de tickets (da aula)

### Modelo de dados

```python
# models.py (Py4Web)
db.define_table('ticket',
    Field('subject'),
    Field('description'),
    Field('status', requires=IS_IN_SET(['open', 'progress', 'closed']), default='open'),
    Field('user', 'reference auth_user')
)
```

### Controller vulneravel (ANTES)

```python
# Listagem — correta (filtra por usuario)
@action('index')
@action.uses('index.html', auth.user)
def index():
    user = auth.get_user()
    tickets = db(db.ticket.user == user['id']).select()
    return dict(tickets=tickets)

# Detalhe — VULNERAVEL (nao valida ownership)
@action('ticket/<id:int>')
@action.uses('ticket.html', auth.user)
def ticket(id):
    ticket = db(db.ticket.id == id).select().first()
    return dict(ticket=ticket)
```

### Controller corrigido (DEPOIS)

```python
@action('ticket/<id:int>')
@action.uses('ticket.html', auth.user)
def ticket(id):
    user = auth.get_user()
    ticket = db(
        (db.ticket.id == id) & (db.ticket.user == user['id'])
    ).select().first()
    if not ticket:
        return "Not authorized"  # Em producao: retornar 403
    return dict(ticket=ticket)
```

## Exemplo 2: IDOR em payload JSON

### Vulneravel

```typescript
// POST /entries
app.post('/entries', auth, async (req, res) => {
  const { description, amount, accountId } = req.body
  // Nao valida se accountId pertence ao usuario!
  const entry = await db.entry.create({
    data: { description, amount, accountId }
  })
  return res.json(entry)
})
```

O atacante envia:
```json
{
  "description": "teste",
  "amount": 123.55,
  "accountId": 20
}
```

Onde `accountId: 20` pertence a outra empresa.

### Corrigido

```typescript
app.post('/entries', auth, async (req, res) => {
  const { description, amount, accountId } = req.body

  // Validar que a conta pertence a empresa do usuario
  const account = await db.account.findFirst({
    where: { id: accountId, companyId: req.user.companyId }
  })
  if (!account) {
    return res.status(403).json({ error: 'Not authorized' })
  }

  const entry = await db.entry.create({
    data: { description, amount, accountId, userId: req.user.id }
  })
  return res.json(entry)
})
```

## Exemplo 3: Endpoint generico vulneravel

### Vulneravel

```
GET /api/update?object=user&id=33
```

O atacante troca para:
```
GET /api/update?object=group&id=1
GET /api/update?object=environment&id=5
```

### Corrigido

```typescript
const ALLOWED_OBJECTS = ['user', 'ticket'] as const

app.get('/api/update', auth, async (req, res) => {
  const { object, id } = req.query

  if (!ALLOWED_OBJECTS.includes(object)) {
    return res.status(400).json({ error: 'Invalid object type' })
  }

  // Validacao de ownership especifica por tipo de objeto
  const ownershipValidators = {
    user: (id, userId) => db.user.findFirst({ where: { id, id: userId } }),
    ticket: (id, userId) => db.ticket.findFirst({ where: { id, userId } }),
  }

  const resource = await ownershipValidators[object](Number(id), req.user.id)
  if (!resource) {
    return res.status(403).json({ error: 'Not authorized' })
  }

  return res.json(resource)
})
```

## Exemplo 4: CRUD completo com validacao em todos os metodos

```typescript
// GET — listagem filtrada
app.get('/entries', auth, async (req, res) => {
  const entries = await db.entry.findMany({
    where: { userId: req.user.id }
  })
  return res.json(entries)
})

// GET — detalhe com ownership
app.get('/entries/:id', auth, async (req, res) => {
  const entry = await db.entry.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id }
  })
  if (!entry) return res.status(403).json({ error: 'Not authorized' })
  return res.json(entry)
})

// POST — criar com validacao de referencias
app.post('/entries', auth, async (req, res) => {
  const { description, amount, accountId } = req.body
  const account = await db.account.findFirst({
    where: { id: accountId, companyId: req.user.companyId }
  })
  if (!account) return res.status(403).json({ error: 'Not authorized' })
  const entry = await db.entry.create({
    data: { description, amount, accountId, userId: req.user.id }
  })
  return res.json(entry)
})

// PUT — atualizar com ownership
app.put('/entries/:id', auth, async (req, res) => {
  const entry = await db.entry.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id }
  })
  if (!entry) return res.status(403).json({ error: 'Not authorized' })
  const updated = await db.entry.update({
    where: { id: entry.id },
    data: req.body
  })
  return res.json(updated)
})

// DELETE — NAO ESQUECER de validar aqui tambem!
app.delete('/entries/:id', auth, async (req, res) => {
  const entry = await db.entry.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id }
  })
  if (!entry) return res.status(403).json({ error: 'Not authorized' })
  await db.entry.delete({ where: { id: entry.id } })
  return res.status(204).send()
})
```

## Exemplo 5: Teste automatizado para Broken Access Control

```typescript
describe('Broken Access Control - Tickets', () => {
  it('should not allow user to access another users ticket', async () => {
    // Criar ticket do usuario A
    const ticketA = await createTicket({ userId: userA.id, subject: 'Ticket A' })

    // Tentar acessar como usuario B
    const res = await request(app)
      .get(`/tickets/${ticketA.id}`)
      .set('Authorization', `Bearer ${userB.token}`)

    expect(res.status).toBe(403)
  })

  it('should not allow user to delete another users ticket', async () => {
    const ticketA = await createTicket({ userId: userA.id, subject: 'Ticket A' })

    const res = await request(app)
      .delete(`/tickets/${ticketA.id}`)
      .set('Authorization', `Bearer ${userB.token}`)

    expect(res.status).toBe(403)

    // Verificar que o ticket ainda existe
    const ticket = await db.ticket.findUnique({ where: { id: ticketA.id } })
    expect(ticket).not.toBeNull()
  })

  it('should not allow user to update ticket with another users accountId', async () => {
    const res = await request(app)
      .post('/entries')
      .set('Authorization', `Bearer ${userB.token}`)
      .send({ description: 'test', amount: 100, accountId: userA.accountId })

    expect(res.status).toBe(403)
  })
})
```