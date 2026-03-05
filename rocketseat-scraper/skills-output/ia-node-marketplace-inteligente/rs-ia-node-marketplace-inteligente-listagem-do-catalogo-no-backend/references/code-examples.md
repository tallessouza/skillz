# Code Examples: Listagem do Catalogo no Backend

## 1. Dump SQL completo

```sql
-- dump.sql
CREATE EXTENSION IF NOT EXISTS vector;

DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS stores;

CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  store_id INTEGER REFERENCES stores(id),
  embeddings vector
);

-- Seeds (3 lojas, 36 produtos)
INSERT INTO stores (name) VALUES
  ('Loja A'),
  ('Loja B'),
  ('Loja C');

INSERT INTO products (name, description, price, store_id) VALUES
  ('Produto 1', 'Descricao do produto 1', 2990, 1),
  ('Produto 2', 'Descricao do produto 2', 4990, 1);
-- ... demais produtos ate totalizar 36
```

## 2. Estrutura de arquivos criada

```
src/
├── app.module.ts
├── catalog/
│   ├── catalog.module.ts
│   ├── catalog.controller.ts
│   └── catalog.service.ts
├── shared/
│   └── postgres.service.ts
└── main.ts
test/
└── catalog.e2e-spec.ts
.env
dump.sql
```

## 3. AppModule com ConfigModule global

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CatalogModule } from './catalog/catalog.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CatalogModule,
  ],
})
export class AppModule {}
```

## 4. CatalogModule completo

```typescript
// src/catalog/catalog.module.ts
import { Module } from '@nestjs/common'
import { CatalogController } from './catalog.controller'
import { CatalogService } from './catalog.service'
import { PostgresService } from '../shared/postgres.service'

@Module({
  controllers: [CatalogController],
  providers: [CatalogService, PostgresService],
})
export class CatalogModule {}
```

## 5. CatalogController

```typescript
// src/catalog/catalog.controller.ts
import { Controller, Get } from '@nestjs/common'
import { CatalogService } from './catalog.service'

@Controller('catalog')
export class CatalogController {
  constructor(private catalogService: CatalogService) {}

  @Get()
  async getCatalog() {
    return this.catalogService.getCatalog()
  }
}
```

## 6. CatalogService

```typescript
// src/catalog/catalog.service.ts
import { Injectable } from '@nestjs/common'
import { PostgresService } from '../shared/postgres.service'

@Injectable()
export class CatalogService {
  constructor(private postgresService: PostgresService) {}

  async getCatalog() {
    // Implementacao completa na proxima aula
    return []
  }
}
```

## 7. PostgresService completo

```typescript
// src/shared/postgres.service.ts
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Client } from 'pg'

@Injectable()
export class PostgresService implements OnApplicationBootstrap {
  private client: Client
  private readonly logger = new Logger(PostgresService.name)

  constructor(private configService: ConfigService) {
    this.client = new Client({
      user: this.configService.getOrThrow('POSTGRES_USER'),
      password: this.configService.getOrThrow('POSTGRES_PASSWORD'),
      host: this.configService.getOrThrow('POSTGRES_HOST'),
      port: Number(this.configService.getOrThrow('POSTGRES_PORT')),
      database: this.configService.getOrThrow('POSTGRES_DB'),
    })
  }

  async onApplicationBootstrap() {
    try {
      await this.client.connect()
      this.logger.log('Connected to PostgreSQL successfully')
    } catch (error) {
      this.logger.error('Failed to connect to PostgreSQL', error)
    }
  }
}
```

## 8. Teste e2e

```typescript
// test/catalog.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'

describe('Catalog (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('should fetch catalog products', async () => {
    const response = await request(app.getHttpServer())
      .get('/catalog')
      .expect(200)

    expect(response.body).toHaveLength(36)
  })
})
```

## 9. Arquivo .env

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=postgres
```

## 10. Dependencias instaladas

```bash
# Producao
npm install pg @nestjs/config

# Desenvolvimento
npm install -D @types/pg
```

## Evolucao incremental demonstrada pelo instrutor

O instrutor mostra o desenvolvimento em camadas, cada passo validado pelo teste:

```
Passo 1: Teste espera 36 itens → Falha (controller nao existe)
Passo 2: Controller retorna [] → Falha (0 itens, esperava 36)
Passo 3: Service retorna [{}] → Falha (1 item, esperava 36)
Passo 4: Service consulta banco → Passa (36 itens do seed)
```

Cada camada adicionada e verificada antes de avancar para a proxima.