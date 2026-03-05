# Code Examples: Unindo DDD ao SOLID

## Exemplo completo do fluxo mostrado na aula

### 1. Interface do repositorio

```typescript
// repositories/orders-repository.ts
import { Order } from '../entities/order'

export interface OrdersRepository {
  create(order: Order): Promise<void>
}
```

### 2. Use case com inversao de dependencia

```typescript
// use-cases/submit-order.ts
import { Order } from '../entities/order'
import { OrdersRepository } from '../repositories/orders-repository'

export class SubmitOrder {
  // Synthetic sugar do TypeScript: private no parametro
  // cria a propriedade automaticamente
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(order: Order): Promise<void> {
    // Regras de negocio aqui (validacoes, calculos, etc.)
    await this.ordersRepository.create(order)
  }
}
```

### 3. Implementacao concreta (Postgres)

```typescript
// repositories/postgres/postgres-orders-repository.ts
import { Order } from '../../entities/order'
import { OrdersRepository } from '../orders-repository'

export class PostgresOrdersRepository implements OrdersRepository {
  async create(order: Order): Promise<void> {
    // Aqui pode usar Prisma, TypeORM, query raw, etc.
    // Toda a logica de conexao e persistencia fica AQUI
  }
}
```

### 4. Composicao no ponto de entrada

```typescript
// Onde o servidor HTTP e configurado
import { SubmitOrder } from './use-cases/submit-order'
import { PostgresOrdersRepository } from './repositories/postgres/postgres-orders-repository'

const submitOrder = new SubmitOrder(new PostgresOrdersRepository())

// Quando receber request HTTP:
// await submitOrder.execute(order)
```

## Estrutura de pastas resultante

```
src/
├── entities/
│   └── order.ts                          # Entidade de dominio
├── repositories/
│   ├── orders-repository.ts              # Interface (contrato)
│   └── postgres/
│       └── postgres-orders-repository.ts # Implementacao concreta
└── use-cases/
    └── submit-order.ts                   # Caso de uso (regras de negocio)
```

## Variacao: implementacao InMemory para testes

```typescript
// repositories/in-memory/in-memory-orders-repository.ts
import { Order } from '../../entities/order'
import { OrdersRepository } from '../orders-repository'

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  async create(order: Order): Promise<void> {
    this.items.push(order)
  }
}
```

```typescript
// Nos testes:
const repository = new InMemoryOrdersRepository()
const submitOrder = new SubmitOrder(repository)

await submitOrder.execute(someOrder)

expect(repository.items).toHaveLength(1)
expect(repository.items[0]).toEqual(someOrder)
```

## Variacao: expandindo a interface com mais metodos

```typescript
export interface OrdersRepository {
  create(order: Order): Promise<void>
  findById(id: string): Promise<Order | null>
  findManyByCustomerId(customerId: string): Promise<Order[]>
  save(order: Order): Promise<void>
  delete(id: string): Promise<void>
}
```

Cada implementacao (Postgres, InMemory, MongoDB) deve implementar todos os metodos do contrato.