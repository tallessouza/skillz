# Code Examples: Chat Sessions

## 1. Correcao do jest.config — rootDir

**Problema:** rootDir apontava para pasta de teste, quebrando module mapper.

```typescript
// jest.config.ts — ANTES (incorreto)
export default {
  rootDir: '.', // dentro de /test, resolve para /test
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // resolve para /test/src/ — ERRADO
  },
};

// jest.config.ts — DEPOIS (correto)
export default {
  rootDir: '..', // volta para raiz do projeto
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // resolve para /projeto/src/ — CORRETO
  },
};
```

## 2. Correcao do teste de carrinho — ordem dos itens

**Problema:** teste dependia de ordem que o banco nao garante.

```typescript
// ANTES — fragil, depende da ordem
expect(response.body[0].productId).toBe(1);
expect(response.body[1].productId).toBe(2);

// DEPOIS — resiliente, verifica conteudo independente de posicao
expect(response.body).toContainEqual(
  expect.objectContaining({ productId: 1 })
);
expect(response.body).toContainEqual(
  expect.objectContaining({ productId: 2 })
);
```

## 3. Schema SQL — chat_sessions

```sql
DROP TABLE IF EXISTS chat_sessions;
CREATE TABLE chat_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

Adicionado ao dump SQL existente do projeto. O DROP garante que ao resetar o banco, a tabela e recriada limpa.

## 4. Teste e2e completo — chat.e2e-spec.ts

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';

describe('Chat (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    // Reseta tabela entre testes para isolamento
    await resetTable('chat_sessions');
  });

  it('should create a new chat session', async () => {
    // POST cria sessao — nao precisa enviar body
    const postResponse = await request(app.getHttpServer())
      .post('/chat')
      .send();

    expect(postResponse.status).toBe(201);
    expect(postResponse.body).toHaveProperty('id');

    // GET recupera a sessao criada pelo id retornado
    const getResponse = await request(app.getHttpServer())
      .get(`/chat/${postResponse.body.id}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveProperty('id', postResponse.body.id);
    expect(getResponse.body).toHaveProperty('messages');
  });

  afterAll(async () => {
    await app.close();
  });
});
```

## 5. ChatService — operacoes CRUD

```typescript
import { Injectable } from '@nestjs/common';
import { PostgresService } from '@/database/postgres.service';

@Injectable()
export class ChatService {
  constructor(private postgresService: PostgresService) {}

  async create(userId: number): Promise<{ id: number }> {
    return this.postgresService.query(
      'INSERT INTO chat_sessions (user_id) VALUES ($1) RETURNING id',
      [userId],
    );
  }

  async findById(
    id: number,
  ): Promise<{ id: number; createdAt: Date; userId: number } | undefined> {
    return this.postgresService.query(
      'SELECT id, created_at, user_id FROM chat_sessions WHERE id = $1',
      [id],
    );
  }
}
```

## 6. ChatController — rotas com @Param

```typescript
import {
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  // Usuario fixo — autenticacao nao e o foco deste modulo
  private readonly userId = 1;

  constructor(private chatService: ChatService) {}

  @Post()
  async create() {
    return this.chatService.create(this.userId);
  }

  @Get(':sessionId')
  async findOne(@Param('sessionId') sessionId: string) {
    const session = await this.chatService.findById(Number(sessionId));
    if (!session) {
      throw new NotFoundException();
    }
    return session;
  }
}
```

## 7. ChatModule — registro de providers

```typescript
import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PostgresService } from '@/database/postgres.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, PostgresService],
})
export class ChatModule {}
```

## 8. AppModule — importando o ChatModule

```typescript
import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
// ... outros imports

@Module({
  imports: [
    ChatModule,
    // ... outros modulos
  ],
})
export class AppModule {}
```

## Fluxo TDD demonstrado na aula

```
1. Escreve teste          → FALHA (tabela nao existe)
2. Cria schema SQL        → Roda dump, tabela criada
3. Roda teste novamente   → FALHA (rota nao existe — 404)
4. Cria module/service/controller → Roda teste
5. Roda teste novamente   → FALHA (404 no GET — @Param faltando)
6. Adiciona @Param        → Roda teste
7. Teste PASSA            → Commit: "fix: test improvements"
```