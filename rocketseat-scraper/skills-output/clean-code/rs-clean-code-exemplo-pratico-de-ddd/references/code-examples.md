# Code Examples: Exemplo Pratico de DDD

## Estrutura completa do projeto demonstrado

```
src/
├── domain/
│   ├── purchases/
│   │   ├── customer.ts
│   │   └── order.ts
│   ├── logistics/
│   │   └── recipient.ts
│   └── use-cases/
│       └── submit-order.ts
```

## Customer (subdominio de compras)

```typescript
// domain/purchases/customer.ts
export class Customer {
  public name: string
  public email: string

  constructor(name: string, email: string) {
    this.name = name
    this.email = email
  }
}
```

O Customer no contexto de compras precisa apenas de nome e email — dados de identificacao para o processo de compra.

## Order (subdominio de compras)

```typescript
// domain/purchases/order.ts
export class Order {
  public total: number
  public createdAt: Date
  public customerDocument: string

  constructor(total: number, createdAt: Date, customerDocument: string) {
    this.total = total
    this.createdAt = createdAt
    this.customerDocument = customerDocument
  }
}
```

Pontos importantes:
- Order referencia Customer apenas pelo `customerDocument` (string), nao pela entidade inteira
- Isso porque Customer pode existir independentemente de Order
- `createdAt` e do tipo Date — a entidade nao depende de como o banco armazena datas

## Recipient (subdominio de logistica)

```typescript
// domain/logistics/recipient.ts
export class Recipient {
  public street: string
  public number: number
  public zipCode: string

  constructor(street: string, number: number, zipCode: string) {
    this.street = street
    this.number = number
    this.zipCode = zipCode
  }
}
```

Mesma pessoa do mundo real que Customer, mas no contexto de logistica precisa de dados completamente diferentes (endereco, CEP).

**No banco de dados**, Customer e Recipient podem ser a mesma tabela:

```sql
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  document VARCHAR(14),
  street VARCHAR(255),
  number INTEGER,
  zip_code VARCHAR(10)
);
```

Mas no codigo sao entidades separadas por subdominio.

## Caso de uso: SubmitOrder

```typescript
// domain/use-cases/submit-order.ts
import { Order } from '../purchases/order'

interface SubmitOrderRequest {
  customerDocument: string
  total: number
}

export class SubmitOrder {
  async execute({ customerDocument, total }: SubmitOrderRequest): Promise<void> {
    const order = new Order(total, new Date(), customerDocument)

    // Aqui entrariam regras de negocio, por exemplo:
    // - Verificar se cliente tem endereco cadastrado
    // - Validar se total e positivo
    // - Verificar estoque dos produtos

    // Aqui entraria a persistencia (injetada via interface/repository)
    // await this.orderRepository.save(order)
  }
}
```

### Anatomia do caso de uso

1. **Interface de request tipada** — define exatamente o que o caso de uso precisa
2. **Classe com metodo unico `execute`** — async para permitir operacoes assincronas
3. **Regras de negocio dentro do execute** — nao no controller
4. **Retorno opcional** — SubmitOrder nao precisa retornar nada (poderia retornar o ID do pedido)

### Exemplo de regra de negocio no caso de uso

```typescript
export class SubmitOrder {
  async execute({ customerDocument, total }: SubmitOrderRequest): Promise<void> {
    // Regra: cliente so pode fazer pedido se tiver endereco cadastrado
    const recipient = await this.recipientRepository.findByDocument(customerDocument)

    if (!recipient) {
      throw new Error('Customer must have a registered address before placing an order')
    }

    const order = new Order(total, new Date(), customerDocument)
    await this.orderRepository.save(order)
  }
}
```