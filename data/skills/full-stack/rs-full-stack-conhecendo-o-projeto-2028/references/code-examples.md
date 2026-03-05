# Code Examples: API de Pedidos para Restaurante

## Schema SQL completo

```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL
);

CREATE TABLE tables (
  id TEXT PRIMARY KEY,
  table_number INTEGER NOT NULL UNIQUE
);

CREATE TABLE table_sessions (
  id TEXT PRIMARY KEY,
  table_id TEXT NOT NULL REFERENCES tables(id),
  opened_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  closed_at DATETIME
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  table_session_id TEXT NOT NULL REFERENCES table_sessions(id),
  product_id TEXT NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Endpoints Express esperados

### Abrir sessão (cliente chega)

```typescript
// POST /table-sessions
app.post("/table-sessions", async (req, res) => {
  const { table_id } = req.body

  // Verificar se mesa já tem sessão aberta
  const openSession = await db.query(
    "SELECT id FROM table_sessions WHERE table_id = ? AND closed_at IS NULL",
    [table_id]
  )

  if (openSession.length > 0) {
    return res.status(400).json({ error: "Mesa já está ocupada" })
  }

  const session = await db.query(
    "INSERT INTO table_sessions (id, table_id) VALUES (?, ?)",
    [generateId(), table_id]
  )

  return res.status(201).json(session)
})
```

### Registrar pedido

```typescript
// POST /orders
app.post("/orders", async (req, res) => {
  const { table_session_id, product_id, quantity } = req.body

  // Verificar se sessão está aberta
  const session = await db.query(
    "SELECT id FROM table_sessions WHERE id = ? AND closed_at IS NULL",
    [table_session_id]
  )

  if (session.length === 0) {
    return res.status(400).json({ error: "Sessão não encontrada ou já fechada" })
  }

  const order = await db.query(
    "INSERT INTO orders (id, table_session_id, product_id, quantity) VALUES (?, ?, ?, ?)",
    [generateId(), table_session_id, product_id, quantity]
  )

  return res.status(201).json(order)
})
```

### Fechar sessão (encerrar conta)

```typescript
// PATCH /table-sessions/:id/close
app.patch("/table-sessions/:id/close", async (req, res) => {
  const { id } = req.params

  // Calcular total antes de fechar
  const total = await db.query(
    `SELECT SUM(p.price * o.quantity) as total
     FROM orders o
     JOIN products p ON p.id = o.product_id
     WHERE o.table_session_id = ?`,
    [id]
  )

  await db.query(
    "UPDATE table_sessions SET closed_at = CURRENT_TIMESTAMP WHERE id = ?",
    [id]
  )

  return res.json({
    session_id: id,
    total: total[0].total,
    closed_at: new Date().toISOString()
  })
})
```

### Listar mesas disponíveis

```typescript
// GET /tables/available
app.get("/tables/available", async (req, res) => {
  const availableTables = await db.query(
    `SELECT t.* FROM tables t
     WHERE t.id NOT IN (
       SELECT table_id FROM table_sessions WHERE closed_at IS NULL
     )`
  )

  return res.json(availableTables)
})
```

## Queries úteis

### Total da conta de uma sessão

```sql
SELECT
  ts.id as session_id,
  t.table_number,
  SUM(p.price * o.quantity) as total
FROM table_sessions ts
JOIN tables t ON t.id = ts.table_id
JOIN orders o ON o.table_session_id = ts.id
JOIN products p ON p.id = o.product_id
WHERE ts.id = ?
GROUP BY ts.id;
```

### Detalhamento dos pedidos de uma sessão

```sql
SELECT
  p.name as product_name,
  p.price,
  o.quantity,
  (p.price * o.quantity) as subtotal
FROM orders o
JOIN products p ON p.id = o.product_id
WHERE o.table_session_id = ?
ORDER BY o.created_at;
```

### Mesas ocupadas com sessão ativa

```sql
SELECT
  t.table_number,
  ts.id as session_id,
  ts.opened_at
FROM tables t
JOIN table_sessions ts ON ts.table_id = t.id
WHERE ts.closed_at IS NULL;
```