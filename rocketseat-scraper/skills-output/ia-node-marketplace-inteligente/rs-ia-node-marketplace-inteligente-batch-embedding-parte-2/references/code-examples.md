# Code Examples: Batch Embedding — Webhook, Storage e Busca por Similaridade

## 1. CatalogService completo com bootstrap e webhook

```typescript
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { IsNull } from 'typeorm';
import { LlmService } from './llm.service';
import { ProductRepository } from './product.repository';

@Injectable()
export class CatalogService implements OnApplicationBootstrap {
  private readonly logger = new Logger(CatalogService.name);

  constructor(
    private readonly llmService: LlmService,
    private readonly productRepository: ProductRepository,
  ) {}

  async onApplicationBootstrap() {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    const products = await this.productRepository.find({
      where: { embedding: IsNull() },
    });

    if (!products.length) {
      return;
    }

    this.logger.log(`Starting batch embedding for ${products.length} products`);
    await this.llmService.batchEmbedProducts(products);
  }

  async handleEmbeddingWebhook(body: string, headers: Record<string, string>) {
    const result = await this.llmService.handleBatchWebhook(body, headers);

    if (!result) {
      this.logger.warn('Embedding webhook returned no results');
      return;
    }

    for (const item of result) {
      await this.productRepository.update(item.productId, {
        embedding: () => `'${JSON.stringify(item.embedding)}'::vector`,
      });
    }

    this.logger.log(`Successfully updated ${result.length} embeddings`);
  }
}
```

## 2. WebhooksController

```typescript
import { Controller, Post, Body, Headers } from '@nestjs/common';
import { CatalogService } from '../catalog/catalog.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post('openai')
  async handleOpenAI(
    @Body() body: string,
    @Headers() headers: Record<string, string>,
  ) {
    return this.catalogService.handleEmbeddingWebhook(body, headers);
  }
}
```

## 3. Middlewares para body parsing seletivo

### Raw Body Middleware
```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import * as express from 'express';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: express.Request, res: express.Response, next: express.NextFunction) {
    express.text({ type: '*/*' })(req, res, next);
  }
}
```

### JSON Body Middleware
```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import * as express from 'express';

@Injectable()
export class JsonBodyMiddleware implements NestMiddleware {
  use(req: express.Request, res: express.Response, next: express.NextFunction) {
    express.json()(req, res, next);
  }
}
```

## 4. Configuracao no AppModule

```typescript
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RawBodyMiddleware } from './middlewares/raw-body.middleware';
import { JsonBodyMiddleware } from './middlewares/json-body.middleware';

@Module({
  // ... imports, controllers, providers
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RawBodyMiddleware)
      .forRoutes({ path: 'webhooks/openai', method: RequestMethod.POST });

    consumer
      .apply(JsonBodyMiddleware)
      .forRoutes('*');
  }
}
```

## 5. main.ts — desativando body parser global

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Desativado para permitir middleware customizado por rota
  });

  await app.listen(3000);
}
bootstrap();
```

## 6. Exportando CatalogService do modulo

```typescript
// catalog.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [CatalogService, LlmService],
  exports: [CatalogService], // Necessario para WebhooksController acessar
})
export class CatalogModule {}
```

## 7. Processamento do evento de webhook (dentro do LlmService)

```typescript
async handleBatchWebhook(body: string, headers: Record<string, string>) {
  const event = JSON.parse(body);

  if (event.type !== 'batch.completed') {
    return null;
  }

  // CORRETO: event.data.id (ID do batch)
  // ERRADO: event.id (ID do evento)
  const batchId = event.data.id;

  const batchResult = await this.openai.batches.retrieve(batchId);
  // ... processar resultados e retornar embeddings
}
```

## 8. Teste end-to-end com timeout aumentado

```typescript
describe('Cart AI (e2e)', () => {
  it('should find relevant products and build cart', async () => {
    // Timeout aumentado porque teste faz chamadas reais a OpenAI + banco
  }, 30_000);
});
```

## 9. Query de busca por similaridade com ordenacao

```sql
-- Buscar produtos similares ordenados por distancia
SELECT *, embedding <-> $1 AS distance
FROM products
WHERE embedding <-> $1 < 0.65
ORDER BY distance ASC;
```