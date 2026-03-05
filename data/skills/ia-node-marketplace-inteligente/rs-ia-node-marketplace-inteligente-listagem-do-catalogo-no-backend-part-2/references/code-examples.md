# Code Examples: Listagem do Catalogo no Backend - Part. 2

## 1. Servico PostgreSQL com lifecycle

```typescript
// src/shared/postgres/postgres.service.ts
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class PostgresService implements OnApplicationShutdown {
  public client: Client;

  async onModuleInit() {
    this.client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    await this.client.connect();
  }

  async onApplicationShutdown() {
    await this.client.end();
  }
}
```

## 2. Tipo Product

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  store_id: number;
  embedding: string;
}
```

## 3. Servico de Catalogo completo

```typescript
// src/catalog/catalog.service.ts
import { Injectable } from '@nestjs/common';
import { PostgresService } from '@shared/postgres/postgres.service';

@Injectable()
export class CatalogService {
  constructor(private postgresService: PostgresService) {}

  async findAll(search?: string) {
    let query = `
      SELECT
        products.id,
        products.name,
        products.price,
        products.embedding,
        json_build_object(
          'id', stores.id,
          'name', stores.name
        ) as store
      FROM products
      JOIN stores ON stores.id = products.store_id
    `;

    if (search) {
      query += ` WHERE products.name ILIKE $1`;
      const result = await this.postgresService.client.query(query, [
        `%${search}%`,
      ]);
      return result.rows;
    }

    const result = await this.postgresService.client.query(query);
    return result.rows;
  }
}
```

## 4. Controller recebendo query param

```typescript
// src/catalog/catalog.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private catalogService: CatalogService) {}

  @Get()
  async findAll(@Query('search') search?: string) {
    return this.catalogService.findAll(search || undefined);
  }
}
```

## 5. Teste E2E completo

```typescript
// test/catalog.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Catalog', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.enableShutdownHooks();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should get products', async () => {
    const response = await request(app.getHttpServer())
      .get('/catalog')
      .expect(200);

    expect(response.body).toHaveLength(36);
    expect(response.body[0].store).toHaveProperty('id');
  });

  it('should search products', async () => {
    const response = await request(app.getHttpServer())
      .get('/catalog')
      .query({ search: 'feijão' })
      .expect(200);

    expect(response.body).toHaveLength(2);
  });
});
```

## 6. Evolucao da query (passo a passo)

### Passo 1: Query simples (so select)
```sql
SELECT * FROM products
```

### Passo 2: Com JOIN para trazer store
```sql
SELECT products.id, products.name, products.price, products.embedding,
  json_build_object('id', stores.id, 'name', stores.name) as store
FROM products
JOIN stores ON stores.id = products.store_id
```

### Passo 3: Com filtro de busca parametrizado
```sql
SELECT products.id, products.name, products.price, products.embedding,
  json_build_object('id', stores.id, 'name', stores.name) as store
FROM products
JOIN stores ON stores.id = products.store_id
WHERE products.name ILIKE $1
-- params: ['%feijão%']
```

## 7. Main com shutdown hooks

```typescript
// src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap();
```