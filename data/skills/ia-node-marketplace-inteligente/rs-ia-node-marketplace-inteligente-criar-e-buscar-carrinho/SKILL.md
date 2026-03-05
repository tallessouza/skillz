---
name: rs-ia-node-marketplace-criar-buscar-carrinho
description: "Applies TDD workflow for implementing cart creation and retrieval in NestJS with PostgreSQL. Use when user asks to 'create a cart feature', 'add to cart endpoint', 'implement shopping cart', 'write cart tests', or 'TDD with NestJS'. Follows pattern: write e2e test first, create module/service/controller, implement route, verify. Make sure to use this skill whenever building cart or similar CRUD features with test-first approach in NestJS. Not for frontend cart UI, payment processing, or authentication implementation."
---

# Criar e Buscar Carrinho (TDD em NestJS)

> Escreva o teste e2e primeiro, depois implemente o minimo necessario para o teste passar.

## Prerequisites

- NestJS project com Jest configurado para e2e
- PostgreSQL com tabela `carts` (id, user_id, created_at, store_id, active)
- Seed com usuario padrao (ex: John Doe) para simular autenticacao

## Steps

### Step 1: Criar teste e2e com `--runInBand`

Testes que fazem mutacoes no banco devem rodar em serie para evitar conflitos.

```typescript
// cart.e2e-spec.ts
describe('Cart', () => {
  it('should add a product to the cart', async () => {
    const response = await request(app.getHttpServer())
      .post('/cart')
      .send({ productId: 1, quantity: 1 })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')

    // Verificar que o carrinho foi criado buscando ele
    const responseCart = await request(app.getHttpServer())
      .get('/cart')

    expect(responseCart.status).toBe(200)
    expect(responseCart.body.id).toBe(response.body.id)
  })
})
```

### Step 2: Criar modulo, service e controller

```typescript
// cart.module.ts
@Module({
  controllers: [CartController],
  providers: [CartService, PostgreService],
})
export class CartModule {}
```

### Step 3: Implementar controller com userId hardcoded

Simular usuario logado com userId fixo do seed, porque autenticacao nao e o foco.

```typescript
// cart.controller.ts
@Controller('cart')
export class CartController {
  private userId = 'seed-user-id'

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
    if (!cart) throw new NotFoundException('Cart not found')
    return cart
  }
}
```

### Step 4: Implementar service com query direta

```typescript
// cart.service.ts
type Cart = { id: number; userId: string; createdAt: Date; storeId: number; active: boolean }

@Injectable()
export class CartService {
  constructor(private postgre: PostgreService) {}

  async getCart(userId: string): Promise<Cart | null> {
    const result = await this.postgre.client.query<Cart>(
      'SELECT * FROM carts WHERE user_id = $1 AND active = true',
      [userId]
    )
    return result.rows[0] ?? null
  }
}
```

### Step 5: Importar o modulo no app e rodar testes

Registrar `CartModule` no `AppModule` e executar `test:e2e --runInBand`.

## Heuristics

| Situacao | Faca |
|----------|------|
| Testes com mutacao no banco | Use `--runInBand` para rodar em serie |
| Autenticacao nao e o foco | Hardcode userId do seed no controller |
| Validacao de body simples | Validacao manual no controller, pipes depois |
| Carrinho nao encontrado | Retorne 404 (NotFoundException), nao 400 |
| Alias de import quebra no teste | Use caminho relativo no ambiente de teste |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Rodar testes de mutacao em paralelo | `--runInBand` para execucao em serie |
| Implementar auth completa quando nao e o foco | Hardcode userId do seed |
| Retornar 400 quando recurso nao existe | Retornar 404 (NotFoundException) |
| Fazer query direto no service sem tipar | Criar tipo `Cart` e tipar o retorno da query |
| Usar alias `@/` nos testes sem configurar tsconfig do jest | Usar caminho relativo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
