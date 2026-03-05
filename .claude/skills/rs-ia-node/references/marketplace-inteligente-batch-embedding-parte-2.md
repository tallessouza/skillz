---
name: rs-ia-node-marketplace-batch-embedding-2
description: "Applies batch embedding webhook handling and vector storage patterns when building AI-powered product catalogs with OpenAI Batch API and NestJS. Use when user asks to 'handle batch webhooks', 'store embeddings', 'process OpenAI batch results', 'configure webhook middleware', or 'search similar products with vectors'. Make sure to use this skill whenever implementing webhook receivers for OpenAI batch processing or storing embedding results in PostgreSQL with pgvector. Not for generating embeddings from scratch, frontend search UI, or non-OpenAI embedding providers."
---

# Batch Embedding — Webhook, Storage e Busca por Similaridade

> Ao receber resultados de batch embedding da OpenAI, processe via webhook dedicado, armazene como vetores no banco e ordene por distancia para busca por similaridade.

## Rules

1. **Inicialize embedding no bootstrap do modulo** — use `OnApplicationBootstrap` no CatalogService para disparar batch embedding automaticamente, porque garante que produtos sem embedding sejam processados ao iniciar
2. **Pule embedding em ambiente de teste** — verifique `process.env.NODE_ENV !== 'test'` antes de executar, porque testes chamam o bootstrap multiplas vezes e disparariam batches desnecessarios
3. **Filtre apenas produtos sem embedding** — busque `WHERE embedding IS NULL` antes de enviar para batch, porque re-embedar produtos ja processados desperdiça tokens e tempo
4. **Receba webhook body como string crua** — nao aplique JSON body parser na rota do webhook OpenAI, porque a OpenAI recomenda validar o payload bruto antes de fazer parse
5. **Use `for...of` para updates sequenciais** — ao salvar embeddings no banco, itere sequencialmente em vez de `Promise.all`, porque evita sobrecarga no banco com muitas escritas simultaneas
6. **Converta embedding para formato pgvector** — use `JSON.stringify()` no embedding e cast para `vector` na query SQL, porque o campo vector do PostgreSQL espera formato especifico
7. **Ordene resultados por distancia** — ao buscar produtos similares, ordene pelo score de distancia (mais proximo de zero = mais similar), porque resultados desordenados dificultam a selecao dos mais relevantes

## How to write

### Bootstrap com batch embedding

```typescript
@Injectable()
export class CatalogService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    if (process.env.NODE_ENV === 'test') {
      return; // Skip catalog embedding in test environment
    }

    const products = await this.productRepository.find({
      where: { embedding: IsNull() },
    });

    if (!products.length) return;

    await this.llmService.batchEmbedProducts(products);
  }
}
```

### Webhook handler no CatalogService

```typescript
async handleEmbeddingWebhook(body: string, headers: Record<string, string>) {
  const result = await this.llmService.handleBatchWebhook(body, headers);

  if (!result) {
    this.logger.warn('Embedding webhook processing failed');
    return;
  }

  for (const item of result) {
    await this.productRepository.update(item.productId, {
      embedding: () => `'${JSON.stringify(item.embedding)}'::vector`,
    });
  }

  this.logger.log(`Updated ${result.length} product embeddings`);
}
```

### Webhook controller com raw body

```typescript
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post('openai')
  async handleOpenAI(@Body() body: string, @Headers() headers) {
    return this.catalogService.handleEmbeddingWebhook(body, headers);
  }
}
```

### Middleware para raw body vs JSON body

```typescript
// raw-body.middleware.ts — para rota do webhook
export class RawBodyMiddleware implements NestMiddleware {
  use(req, res, next) {
    // Recebe body como text/string sem parse
    express.text({ type: '*/*' })(req, res, next);
  }
}

// Configuracao no AppModule
configure(consumer: MiddlewareConsumer) {
  consumer.apply(RawBodyMiddleware).forRoutes({
    path: 'webhooks/openai',
    method: RequestMethod.POST,
  });
  consumer.apply(JsonBodyMiddleware).forRoutes('*');
}
```

## Example

**Before (webhook com body parseado — quebra validacao OpenAI):**
```typescript
// main.ts — body parser global ativo
app.useGlobalPipes(new ValidationPipe());
// webhook recebe objeto ja parseado — OpenAI nao consegue validar

@Post('openai')
async handle(@Body() body: any) {
  const batchId = body.id; // ERRADO: pegou ID do evento, nao do batch
  const result = await this.llm.getBatchResult(batchId);
}
```

**After (raw body + ID correto do batch):**
```typescript
// main.ts — desativa body parser global
const app = await NestFactory.create(AppModule, { bodyParser: false });

@Post('openai')
async handle(@Body() body: string, @Headers() headers) {
  // Body chega como string crua
  const event = JSON.parse(body);
  const batchId = event.data.id; // CORRETO: data.id e o ID do batch
  return this.catalogService.handleEmbeddingWebhook(body, headers);
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Ngrok reiniciou e gerou nova URL | Atualizar URL do webhook no dashboard OpenAI, incluindo path `/webhooks/openai` |
| Batch ainda processando | Aguardar 2-3 minutos, verificar status no dashboard OpenAI em Batches |
| Webhook recebido duas vezes | Implementar idempotencia — verificar se embedding ja existe antes de atualizar |
| Teste end-to-end ultrapassa timeout | Aumentar timeout para 30s, porque envolve chamadas reais a OpenAI e banco |
| Produtos retornados sem ordem | Ordenar por distancia do vetor — quanto mais proximo de zero, mais similar |
| Distancia maior que 0.65 | Filtrar — produto nao e relevante o suficiente para o contexto da busca |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `body.id` no evento de webhook | `event.data.id` para pegar o ID do batch |
| Body parser global + webhook OpenAI | Desativar body parser global, usar middleware por rota |
| `Promise.all` para salvar embeddings | `for...of` sequencial para nao sobrecarregar o banco |
| Re-embedar todos os produtos no bootstrap | Filtrar `WHERE embedding IS NULL` |
| Retornar produtos similares sem ordenacao | Ordenar por score de distancia ascendente |
| Guardar embedding como string no banco | Cast para `::vector` usando pgvector |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/ia-node/rs-ia-node-marketplace-inteligente-batch-embedding-parte-2/references/deep-explanation.md)
- [Code examples](../../../data/skills/ia-node/rs-ia-node-marketplace-inteligente-batch-embedding-parte-2/references/code-examples.md)
