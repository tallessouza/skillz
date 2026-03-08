# Code Examples: Delivery API — Domain Model & Architecture

## Estrutura de tabelas (SQL)

```sql
-- Tabela de usuários com role
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('seller', 'customer')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de entregas com status e relacionamentos
CREATE TABLE deliveries (
  id TEXT PRIMARY KEY,
  seller_id TEXT NOT NULL REFERENCES users(id),
  customer_id TEXT NOT NULL REFERENCES users(id),
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'shipped', 'delivered')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de movimentações (audit trail)
CREATE TABLE delivery_movements (
  id TEXT PRIMARY KEY,
  delivery_id TEXT NOT NULL REFERENCES deliveries(id),
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Entidades em código

```typescript
// entities/User.ts
interface User {
  id: string
  name: string
  email: string
  role: 'seller' | 'customer'
}

// entities/Delivery.ts
type DeliveryStatus = 'processing' | 'shipped' | 'delivered'

interface Delivery {
  id: string
  sellerId: string
  customerId: string
  description: string
  status: DeliveryStatus
  createdAt: Date
  updatedAt: Date
}

// entities/DeliveryMovement.ts
interface DeliveryMovement {
  id: string
  deliveryId: string
  description: string
  createdAt: Date
}
```

## Máquina de estados para status

```typescript
// Transições válidas de status
const validTransitions: Record<DeliveryStatus, DeliveryStatus[]> = {
  processing: ['shipped'],
  shipped: ['delivered'],
  delivered: [], // estado final, sem transições
}

function canTransition(from: DeliveryStatus, to: DeliveryStatus): boolean {
  return validTransitions[from].includes(to)
}

// Descrições automáticas para movimentações
const transitionDescriptions: Record<string, string> = {
  'processing→shipped': 'Produto saiu para entrega',
  'shipped→delivered': 'Produto entregue ao destinatário',
}

function getMovementDescription(from: DeliveryStatus, to: DeliveryStatus): string {
  const key = `${from}→${to}`
  return transitionDescriptions[key] ?? `Status alterado de ${from} para ${to}`
}
```

## Middleware de autorização por role

```typescript
// middleware/ensureRole.ts
function ensureRole(allowedRoles: string[]) {
  return (request, response, next) => {
    const userRole = request.user.role

    if (!allowedRoles.includes(userRole)) {
      return response.status(403).json({
        message: 'Acesso não autorizado para este perfil',
      })
    }

    return next()
  }
}

// Uso nas rotas:
// Apenas sellers podem criar entregas
router.post('/deliveries', ensureRole(['seller']), createDeliveryController)

// Apenas sellers podem atualizar status
router.patch('/deliveries/:id/status', ensureRole(['seller']), updateStatusController)

// Ambos podem consultar movimentações
router.get('/deliveries/:id/movements', ensureRole(['seller', 'customer']), listMovementsController)
```

## Controller de criação de entrega

```typescript
// controllers/createDelivery.ts
async function createDeliveryController(request, response) {
  const { customerId, description } = request.body
  const sellerId = request.user.id

  const deliveryId = randomUUID()

  // Criar a entrega com status inicial
  await database.run(
    `INSERT INTO deliveries (id, seller_id, customer_id, description, status)
     VALUES (?, ?, ?, ?, 'processing')`,
    [deliveryId, sellerId, customerId, description]
  )

  // Registrar movimentação inicial
  await database.run(
    `INSERT INTO delivery_movements (id, delivery_id, description)
     VALUES (?, ?, ?)`,
    [randomUUID(), deliveryId, 'Pedido criado e em processamento']
  )

  return response.status(201).json({ deliveryId })
}
```

## Controller de atualização de status

```typescript
// controllers/updateDeliveryStatus.ts
async function updateDeliveryStatusController(request, response) {
  const { id } = request.params
  const { status: newStatus } = request.body
  const sellerId = request.user.id

  // Buscar entrega atual
  const delivery = await database.get(
    'SELECT * FROM deliveries WHERE id = ? AND seller_id = ?',
    [id, sellerId]
  )

  if (!delivery) {
    return response.status(404).json({ message: 'Entrega não encontrada' })
  }

  // Validar transição de status
  if (!canTransition(delivery.status, newStatus)) {
    return response.status(400).json({
      message: `Transição de "${delivery.status}" para "${newStatus}" não é permitida`,
    })
  }

  // Atualizar status
  await database.run(
    'UPDATE deliveries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [newStatus, id]
  )

  // Registrar movimentação
  const movementDescription = getMovementDescription(delivery.status, newStatus)
  await database.run(
    'INSERT INTO delivery_movements (id, delivery_id, description) VALUES (?, ?, ?)',
    [randomUUID(), id, movementDescription]
  )

  return response.json({ status: newStatus })
}
```

## Listagem de entregas filtrada por role

```typescript
// controllers/listDeliveries.ts
async function listDeliveriesController(request, response) {
  const userId = request.user.id
  const userRole = request.user.role

  let deliveries

  if (userRole === 'seller') {
    // Vendedor vê as entregas que criou
    deliveries = await database.all(
      'SELECT * FROM deliveries WHERE seller_id = ? ORDER BY created_at DESC',
      [userId]
    )
  } else {
    // Cliente vê as entregas endereçadas a ele
    deliveries = await database.all(
      'SELECT * FROM deliveries WHERE customer_id = ? ORDER BY created_at DESC',
      [userId]
    )
  }

  return response.json({ deliveries })
}
```

## Consulta de movimentações

```typescript
// controllers/listMovements.ts
async function listMovementsController(request, response) {
  const { id: deliveryId } = request.params
  const userId = request.user.id

  // Verificar se o usuário tem acesso a essa entrega
  const delivery = await database.get(
    'SELECT * FROM deliveries WHERE id = ? AND (seller_id = ? OR customer_id = ?)',
    [deliveryId, userId, userId]
  )

  if (!delivery) {
    return response.status(404).json({ message: 'Entrega não encontrada' })
  }

  const movements = await database.all(
    'SELECT * FROM delivery_movements WHERE delivery_id = ? ORDER BY created_at ASC',
    [deliveryId]
  )

  return response.json({ movements })
}
```

## Estrutura de rotas completa

```typescript
// routes/deliveryRoutes.ts
import { Router } from 'express'
import { ensureAuthenticated } from '../middleware/ensureAuthenticated'
import { ensureRole } from '../middleware/ensureRole'

const deliveryRoutes = Router()

// Todas as rotas exigem autenticação
deliveryRoutes.use(ensureAuthenticated)

// Criar entrega — apenas seller
deliveryRoutes.post('/', ensureRole(['seller']), createDeliveryController)

// Listar entregas — ambos (filtrado por role internamente)
deliveryRoutes.get('/', listDeliveriesController)

// Atualizar status — apenas seller
deliveryRoutes.patch('/:id/status', ensureRole(['seller']), updateDeliveryStatusController)

// Listar movimentações — ambos (com verificação de acesso)
deliveryRoutes.get('/:id/movements', listMovementsController)

export { deliveryRoutes }
```