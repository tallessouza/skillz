# Code Examples: Refatorando Para Integrar Outros Providers

## Passo 1: Criar o LLM Module

Antes existia apenas `llm.service.ts` usado diretamente. Agora cria-se a pasta `llm/` com o modulo:

```typescript
// src/llm/llm.module.ts
import { Module } from '@nestjs/common';
import { LLMService } from './llm.service';
import { OpenAILLMService } from './openai.llm.service';

@Module({
  providers: [
    {
      provide: LLMService,
      useClass: OpenAILLMService, // Versao inicial simples
    },
  ],
  exports: [LLMService],
})
export class LLMModule {}
```

## Passo 2: Atualizar consumidores

```typescript
// src/catalog/catalog.module.ts
// ANTES:
import { LLMService } from '../llm.service';
@Module({ providers: [LLMService] })

// DEPOIS:
import { LLMModule } from '../llm/llm.module';
@Module({ imports: [LLMModule] })
```

```typescript
// src/chat/chat.module.ts — mesma mudanca
import { LLMModule } from '../llm/llm.module';
@Module({ imports: [LLMModule] })
```

## Passo 3: Extrair schemas para arquivo separado

```typescript
// src/llm/schemas.ts
import { z } from 'zod';

export const suggestCartSchema = z.object({
  // schema de sugestao de carrinho
});

export const productEmbeddingSchema = z.object({
  productId: z.string(),
  embedding: z.array(z.number()),
});
```

## Passo 4: Transformar LLMService em classe abstrata

```typescript
// src/llm/llm.service.ts
import { SuggestCart } from './schemas';

export abstract class LLMService {
  abstract suggestCart(message: string): Promise<(SuggestCart & { responseId: string }) | null>;

  abstract matchAndEmbedProducts(): void;

  abstract webhookEvent(products: any[]): Promise<Array<{
    productId: string;
    embeddings: number[];
  }> | null>;
}
```

Pontos importantes:
- Sem `async` nos metodos abstratos (nao ha `await`)
- Sem valores default nos parametros (isso e da implementacao)
- Retornos tipados explicitamente

## Passo 5: Criar implementacao concreta OpenAI

```typescript
// src/llm/openai.llm.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { LLMService } from './llm.service';

@Injectable()
export class OpenAILLMService extends LLMService {
  private client: OpenAI;

  constructor(private configService: ConfigService) {
    super(); // Obrigatorio
    this.client = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  async suggestCart(message: string) {
    // Implementacao completa com cliente OpenAI e prompts especificos
  }

  async matchAndEmbedProducts() {
    // Implementacao especifica OpenAI
  }

  async webhookEvent(products: any[]) {
    // Implementacao especifica OpenAI
  }
}
```

## Passo 6: Evoluir para useFactory com ConfigService

```typescript
// src/llm/llm.module.ts — versao final
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LLMService } from './llm.service';
import { OpenAILLMService } from './openai.llm.service';

@Module({
  providers: [
    {
      provide: LLMService,
      useFactory: (configService: ConfigService) => {
        const provider = configService.get('LLM_PROVIDER');

        switch (provider) {
          case 'openai':
            return new OpenAILLMService(configService);
          default:
            throw new Error(`Unsupported LLM provider: ${provider}`);
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: [LLMService],
})
export class LLMModule {}
```

## Variavel de ambiente

```env
# .env
LLM_PROVIDER=openai
```

## Estrutura final de arquivos

```
src/llm/
├── llm.module.ts          # Modulo com factory
├── llm.service.ts         # Classe abstrata (contrato)
├── openai.llm.service.ts  # Implementacao OpenAI
└── schemas.ts             # Schemas Zod compartilhados
```

## Sequencia de commits do instrutor

1. `refactor: extract llm service to llm module` — cria modulo, atualiza imports
2. `refactor: extract schemas to separate file` — separa schemas.ts
3. Commit final com classe abstrata + implementacao OpenAI + factory