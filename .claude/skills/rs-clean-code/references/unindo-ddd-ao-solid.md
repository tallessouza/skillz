---
name: rs-clean-code-unindo-ddd-ao-solid
description: "Enforces dependency inversion between domain and infrastructure layers when writing TypeScript/Node.js applications. Use when user asks to 'create a repository', 'connect to database', 'implement use case', 'add persistence', or 'decouple infrastructure'. Applies repository interface pattern, constructor injection, and infrastructure isolation. Make sure to use this skill whenever generating code that touches database, external APIs, or any infrastructure concern. Not for UI components, styling, or frontend-only code."
---

# Unindo DDD ao SOLID — Inversao de Dependencias na Pratica

> Regras de negocio NUNCA importam implementacoes de infraestrutura — apenas interfaces.

## Rules

1. **Repositorios sao interfaces, nao classes concretas** — `interface OrdersRepository` nao `class OrdersRepository`, porque a interface permite multiplas implementacoes (Postgres, InMemory, API) sem alterar o dominio
2. **Use cases recebem dependencias via construtor** — `constructor(private ordersRepository: OrdersRepository)`, porque inversao de dependencia garante que o dominio nao conhece a infraestrutura
3. **Use o synthetic sugar do TypeScript** — `constructor(private ordersRepository: OrdersRepository)` nao `this.ordersRepository = ordersRepository` separado, porque reduz boilerplate sem perder clareza
4. **Implementacoes concretas ficam em subpastas de infra** — `repositories/postgres/PostgresOrdersRepository.ts`, porque separa fisicamente dominio de infraestrutura
5. **A composicao acontece na camada mais externa** — instancie `new SubmitOrder(new PostgresOrdersRepository())` no servidor HTTP ou bootstrap, nunca dentro do use case
6. **Metodos de repositorio retornam Promise** — `create(order: Order): Promise<void>`, porque operacoes de persistencia sao assincronas por natureza

## How to write

### Interface de repositorio

```typescript
// repositories/orders-repository.ts
export interface OrdersRepository {
  create(order: Order): Promise<void>
}
```

### Use case com inversao de dependencia

```typescript
// use-cases/submit-order.ts
export class SubmitOrder {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(order: Order): Promise<void> {
    // regras de negocio aqui
    await this.ordersRepository.create(order)
  }
}
```

### Implementacao concreta (infraestrutura)

```typescript
// repositories/postgres/postgres-orders-repository.ts
export class PostgresOrdersRepository implements OrdersRepository {
  async create(order: Order): Promise<void> {
    // conexao com banco, Prisma, ORM, etc.
  }
}
```

### Composicao no ponto de entrada

```typescript
// server.ts ou bootstrap
import { SubmitOrder } from './use-cases/submit-order'
import { PostgresOrdersRepository } from './repositories/postgres/postgres-orders-repository'

const submitOrder = new SubmitOrder(new PostgresOrdersRepository())
```

## Example

**Before (acoplado ao banco):**
```typescript
import { prisma } from './lib/prisma'

export class SubmitOrder {
  async execute(data: CreateOrderDTO) {
    const order = await prisma.order.create({ data })
    return order
  }
}
```

**After (desacoplado via interface):**
```typescript
export class SubmitOrder {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(data: CreateOrderDTO) {
    const order = new Order(data)
    await this.ordersRepository.create(order)
    return order
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Use case precisa salvar dados | Receba repositorio via construtor, nunca importe ORM direto |
| Precisa trocar banco de dados | Crie nova implementacao da interface, nao altere o use case |
| Escrevendo testes | Use implementacao InMemory do repositorio |
| Conectando a API externa | Trate como repositorio — interface no dominio, implementacao na infra |
| Codigo depende de framework | Isole atras de interface — framework e infraestrutura |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `import { prisma } from './lib/prisma'` no use case | `constructor(private repo: OrdersRepository)` |
| `class SubmitOrder { db = new PostgresClient() }` | `class SubmitOrder { constructor(private repo: OrdersRepository) {} }` |
| `this.ordersRepo = new PostgresOrdersRepository()` dentro do use case | Receba via construtor, instancie no bootstrap |
| Repositorio como classe concreta sem interface | Interface primeiro, implementacao depois |
| Regra de negocio que so funciona com banco rodando | Regra de negocio que funciona sem nenhuma infra |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/clean-code/rs-clean-code-unindo-ddd-ao-solid/references/deep-explanation.md)
- [Code examples](../../../data/skills/clean-code/rs-clean-code-unindo-ddd-ao-solid/references/code-examples.md)
