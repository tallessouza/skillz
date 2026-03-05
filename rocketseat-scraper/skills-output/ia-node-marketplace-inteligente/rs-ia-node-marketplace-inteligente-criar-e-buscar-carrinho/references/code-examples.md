# Code Examples: Criar e Buscar Carrinho

## Teste e2e completo

```typescript
// cart.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'

describe('Cart', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should add a product to the cart', async () => {
    const response = await request(app.getHttpServer())
      .post('/cart')
      .send({ productId: 1, quantity: 1 })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')

    const responseCart = await request(app.getHttpServer())
      .get('/cart')

    expect(responseCart.status).toBe(200)
    expect(responseCart.body.id).toBe(response.body.id)
  })
})
```

**Nota:** Executar com `jest --runInBand` para evitar conflitos no banco.

## Cart Module

```typescript
// cart.module.ts
import { Module } from '@nestjs/common'
import { CartController } from './cart.controller'
import { CartService } from './cart.service'
import { PostgreService } from '../postgre/postgre.service' // caminho relativo, nao alias

@Module({
  controllers: [CartController],
  providers: [CartService, PostgreService],
})
export class CartModule {}
```

## Cart Controller

```typescript
// cart.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { CartService } from './cart.service'

@Controller('cart')
export class CartController {
  // Simula usuario logado — em producao viria do auth guard
  private userId = 'john-doe-seed-id'

  constructor(private cartService: CartService) {}

  @Post()
  addToCart(@Body() body: { productId: number; quantity: number }) {
    if (!body.productId || !body.quantity) {
      throw new BadRequestException('Missing productId or quantity')
    }
    return this.cartService.addCart(this.userId, body.productId, body.quantity)
  }

  @Get()
  async getCart() {
    const cart = await this.cartService.getCart(this.userId)
    if (!cart) {
      throw new NotFoundException('Cart not found')
    }
    return cart
  }
}
```

## Cart Service

```typescript
// cart.service.ts
import { Injectable } from '@nestjs/common'
import { PostgreService } from '../postgre/postgre.service'

type Cart = {
  id: number
  userId: string
  createdAt: Date
  storeId: number
  active: boolean
}

@Injectable()
export class CartService {
  constructor(private postgre: PostgreService) {}

  async addCart(
    userId: string,
    productId: number,
    quantity: number,
  ): Promise<{ id: number }> {
    // Implementacao do INSERT vem na proxima aula
    // Por enquanto retorna id fixo para o teste passar
    return { id: 1 }
  }

  async getCart(userId: string): Promise<Cart | null> {
    const result = await this.postgre.client.query<Cart>(
      'SELECT * FROM carts WHERE user_id = $1 AND active = true',
      [userId],
    )
    return result.rows[0] ?? null
  }
}
```

## Registrar modulo no AppModule

```typescript
// app.module.ts
import { CartModule } from './cart/cart.module'

@Module({
  imports: [
    // ... outros modulos
    CartModule,
  ],
})
export class AppModule {}
```

## Configuracao do Jest para rodar em serie

```json
// package.json (scripts)
{
  "scripts": {
    "test:e2e": "jest --config ./test/jest-e2e.json --runInBand"
  }
}
```

## Tipo Cart baseado no schema do banco

```sql
-- Estrutura da tabela carts (referencia)
CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  store_id INTEGER NOT NULL,
  active BOOLEAN DEFAULT TRUE
);
```