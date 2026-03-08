# Code Examples: Estrutura do Banco de Dados — API de Entregas

## Schema completo

```sql
-- Tabela de usuários
CREATE TABLE users (
  id TEXT PRIMARY KEY,        -- UUID gerado pela aplicação
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL,          -- 'customer', 'seller', 'admin'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de entregas (vinculada a users)
CREATE TABLE deliveries (
  id TEXT PRIMARY KEY,        -- UUID
  user_id TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,       -- 'processing', 'shipped', 'in_transit', 'delivered'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela de logs de entrega (vinculada a deliveries)
CREATE TABLE delivery_logs (
  id TEXT PRIMARY KEY,        -- UUID
  delivery_id TEXT NOT NULL,
  description TEXT NOT NULL,  -- Descrição da movimentação
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (delivery_id) REFERENCES deliveries(id)
);
```

## Queries comuns

### Inserir um usuário

```sql
INSERT INTO users (id, name, email, password, role)
VALUES ('uuid-1234', 'João Silva', 'joao@email.com', 'hashed_password', 'customer');
```

### Criar uma entrega para um usuário

```sql
INSERT INTO deliveries (id, user_id, description, status)
VALUES ('uuid-5678', 'uuid-1234', 'Notebook Dell Inspiron', 'processing');
```

### Registrar movimentações (logs)

```sql
-- Pedido processando
INSERT INTO delivery_logs (id, delivery_id, description)
VALUES ('uuid-log-1', 'uuid-5678', 'Pedido recebido e em processamento');

-- Saiu do centro de distribuição
INSERT INTO delivery_logs (id, delivery_id, description)
VALUES ('uuid-log-2', 'uuid-5678', 'Saiu do centro de distribuição');

-- Em rota de entrega
INSERT INTO delivery_logs (id, delivery_id, description)
VALUES ('uuid-log-3', 'uuid-5678', 'Em rota de entrega');

-- Entregue
INSERT INTO delivery_logs (id, delivery_id, description)
VALUES ('uuid-log-4', 'uuid-5678', 'Entregue ao destinatário');

-- Atualizar status da entrega
UPDATE deliveries SET status = 'delivered', updated_at = CURRENT_TIMESTAMP
WHERE id = 'uuid-5678';
```

### Buscar todas as entregas de um usuário

```sql
SELECT d.id, d.description, d.status, d.created_at
FROM deliveries d
WHERE d.user_id = 'uuid-1234'
ORDER BY d.created_at DESC;
```

### Buscar histórico completo de uma entrega (com logs)

```sql
SELECT
  d.id AS delivery_id,
  d.description AS delivery_description,
  d.status,
  dl.description AS log_description,
  dl.created_at AS log_date
FROM deliveries d
JOIN delivery_logs dl ON dl.delivery_id = d.id
WHERE d.id = 'uuid-5678'
ORDER BY dl.created_at ASC;
```

### Buscar todas as entregas de um usuário com último log

```sql
SELECT
  d.id,
  d.description,
  d.status,
  (
    SELECT dl.description
    FROM delivery_logs dl
    WHERE dl.delivery_id = d.id
    ORDER BY dl.created_at DESC
    LIMIT 1
  ) AS last_movement
FROM deliveries d
WHERE d.user_id = 'uuid-1234'
ORDER BY d.created_at DESC;
```

## Variação: Usando Knex.js para criar as migrations

### Migration de users

```javascript
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary();
    table.text('name').notNullable();
    table.text('email').notNullable().unique();
    table.text('password').notNullable();
    table.text('role').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
```

### Migration de deliveries

```javascript
exports.up = function(knex) {
  return knex.schema.createTable('deliveries', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').notNullable().references('id').inTable('users');
    table.text('description').notNullable();
    table.text('status').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('deliveries');
};
```

### Migration de delivery_logs

```javascript
exports.up = function(knex) {
  return knex.schema.createTable('delivery_logs', (table) => {
    table.uuid('id').primary();
    table.uuid('delivery_id').notNullable().references('id').inTable('deliveries');
    table.text('description').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('delivery_logs');
};
```

## Variação: Prisma schema

```prisma
model User {
  id         String     @id @default(uuid())
  name       String
  email      String     @unique
  password   String
  role       String
  createdAt  DateTime   @default(now()) @map("created_at")
  updatedAt  DateTime   @updatedAt @map("updated_at")
  deliveries Delivery[]

  @@map("users")
}

model Delivery {
  id          String        @id @default(uuid())
  userId      String        @map("user_id")
  description String
  status      String
  createdAt   DateTime      @default(now()) @map("created_at")
  updatedAt   DateTime      @updatedAt @map("updated_at")
  user        User          @relation(fields: [userId], references: [id])
  logs        DeliveryLog[]

  @@map("deliveries")
}

model DeliveryLog {
  id          String   @id @default(uuid())
  deliveryId  String   @map("delivery_id")
  description String
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  delivery    Delivery @relation(fields: [deliveryId], references: [id])

  @@map("delivery_logs")
}
```