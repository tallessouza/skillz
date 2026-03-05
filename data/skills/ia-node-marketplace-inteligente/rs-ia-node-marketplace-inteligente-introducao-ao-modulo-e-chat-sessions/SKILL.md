---
name: rs-ia-node-marketplace-intro-chat-sessions
description: "Applies TDD-first chat session module pattern when building NestJS chat features with PostgreSQL. Use when user asks to 'create chat sessions', 'build a chat module', 'implement session management', 'add conversation feature', or 'create NestJS module with tests first'. Follows test-first development, raw SQL with PostgreSQL, and NestJS module structure. Make sure to use this skill whenever implementing chat or session CRUD in NestJS projects. Not for LLM integration, message handling, or frontend chat UI implementation."
---

# Chat Sessions — Modulo NestJS com TDD

> Construa modulos NestJS partindo do teste end-to-end, depois banco, depois implementacao — nunca ao contrario.

## Rules

1. **Teste primeiro, implemente depois** — escreva o teste e2e antes de criar rotas, services ou controllers, porque o teste define o contrato esperado antes de qualquer codigo de producao
2. **Resete tabelas por teste** — cada teste deve limpar suas tabelas no beforeEach, porque testes que dependem de estado compartilhado quebram de forma imprevisivel
3. **Nao dependa de ordenacao sem ORDER BY** — se a query nao tem ORDER BY, use `expect.arrayContaining` ou `toContainEqual` no teste, porque a ordem de retorno nao e garantida
4. **SQL direto no PostgresService** — sem ORM, sem camada de abstracao extra, porque o projeto usa interacao direta com o banco via servico proprio
5. **Modulo autocontido** — cada feature e um modulo NestJS com controller + service + registro no AppModule, porque isso mantem separacao de responsabilidades
6. **Parametros de rota com @Param** — sempre decore parametros de rota com `@Param('name')`, porque sem isso o NestJS nao injeta o valor e retorna 404

## How to write

### Schema SQL com drop + create

```sql
DROP TABLE IF EXISTS chat_sessions;
CREATE TABLE chat_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Teste e2e (contrato primeiro)

```typescript
describe('Chat', () => {
  beforeEach(async () => {
    await resetTable('chat_sessions');
  });

  it('should create a new chat session', async () => {
    const postResponse = await request(app.getHttpServer())
      .post('/chat')
      .send();

    expect(postResponse.status).toBe(201);
    expect(postResponse.body).toHaveProperty('id');

    const getResponse = await request(app.getHttpServer())
      .get(`/chat/${postResponse.body.id}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveProperty('id', postResponse.body.id);
  });
});
```

### Service com SQL direto

```typescript
@Injectable()
export class ChatService {
  constructor(private postgresService: PostgresService) {}

  async create(userId: number): Promise<{ id: number }> {
    return this.postgresService.query(
      'INSERT INTO chat_sessions (user_id) VALUES ($1) RETURNING id',
      [userId],
    );
  }

  async findById(id: number): Promise<{ id: number; createdAt: Date; userId: number } | undefined> {
    return this.postgresService.query(
      'SELECT id, created_at, user_id FROM chat_sessions WHERE id = $1',
      [id],
    );
  }
}
```

### Controller com @Param decorado

```typescript
@Controller('chat')
export class ChatController {
  private readonly userId = 1; // usuario fixo durante desenvolvimento

  constructor(private chatService: ChatService) {}

  @Post()
  async create() {
    return this.chatService.create(this.userId);
  }

  @Get(':sessionId')
  async findOne(@Param('sessionId') sessionId: string) {
    const session = await this.chatService.findById(Number(sessionId));
    if (!session) throw new NotFoundException();
    return session;
  }
}
```

## Example

**Before (teste fragil com ordem fixa):**
```typescript
expect(response.body[0].productId).toBe(1);
expect(response.body[1].productId).toBe(2);
```

**After (teste resiliente sem depender de ordem):**
```typescript
expect(response.body).toContainEqual(expect.objectContaining({ productId: 1 }));
expect(response.body).toContainEqual(expect.objectContaining({ productId: 2 }));
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Nova feature com CRUD | Escreva teste e2e primeiro, depois schema, depois service/controller |
| Query sem ORDER BY | Use `toContainEqual` no teste, nunca acesse por indice |
| Parametro de rota nao chega no handler | Verifique se `@Param('name')` esta presente no argumento |
| Banco nao esta rodando | `docker compose up -d` antes de rodar testes e2e |
| Autenticacao nao e o foco | Use userId fixo como propriedade privada do controller |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Controller sem `@Param` em rota dinamica | `@Get(':id') find(@Param('id') id: string)` |
| `expect(arr[0]).toBe(x)` sem ORDER BY | `expect(arr).toContainEqual(expect.objectContaining({...}))` |
| Criar rota sem teste primeiro | Teste e2e definindo o contrato, depois implemente |
| Modulo sem registrar no AppModule | Sempre adicione ao `imports` do AppModule |
| Service sem tipar retorno | Tipe com interface ou tipo inline para evitar `any` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
