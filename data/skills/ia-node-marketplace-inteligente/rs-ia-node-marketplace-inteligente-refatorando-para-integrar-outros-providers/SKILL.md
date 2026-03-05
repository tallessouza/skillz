---
name: rs-ia-node-refatorando-providers
description: "Applies the abstract provider pattern when integrating multiple LLM or API providers in NestJS. Use when user asks to 'add a new provider', 'support multiple APIs', 'switch between OpenAI and Gemini', 'make provider configurable', or 'refactor to support multiple implementations'. Enforces module encapsulation, abstract service classes, and factory-based provider selection via environment config. Make sure to use this skill whenever creating swappable service implementations in NestJS. Not for single-provider setups, frontend code, or non-NestJS frameworks."
---

# Refatorando Para Integrar Outros Providers

> Encapsule providers em modulos NestJS com classes abstratas e factories, nunca exponha implementacoes concretas diretamente.

## Rules

1. **Crie um modulo dedicado para o dominio** — `LLMModule` encapsula o servico, porque consumidores importam o modulo, nao o servico diretamente
2. **Use classe abstrata, nao interface** — porque interfaces somem na compilacao JavaScript e nao podem ser usadas como valor no `provide` do NestJS
3. **Separe contrato de implementacao** — `LLMService` (abstrato) define metodos, `OpenAILLMService` implementa, porque permite trocar provider sem alterar consumidores
4. **Separe schemas em arquivo proprio** — schemas Zod compartilhados entre providers ficam em `schemas.ts`, porque ambos providers validam com os mesmos contratos
5. **Prompts sao especificos por provider** — copie prompts para cada implementacao ao inves de compartilhar, porque modelos diferentes exigem adaptacoes diferentes
6. **Use useFactory com ConfigService** — selecione a implementacao concreta via variavel de ambiente, porque permite trocar provider sem alterar codigo

## How to write

### Modulo encapsulador

```typescript
// llm/llm.module.ts
@Module({
  providers: [
    {
      provide: LLMService,
      useFactory: (configService: ConfigService) => {
        const provider = configService.get('LLM_PROVIDER');
        switch (provider) {
          case 'openai':
            return new OpenAILLMService(configService);
          case 'gemini':
            return new GeminiLLMService(configService);
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

### Classe abstrata (contrato)

```typescript
// llm/llm.service.ts
export abstract class LLMService {
  abstract suggestCart(message: string): Promise<SuggestCart | null>;
  abstract matchAndEmbedProducts(products: Product[]): Promise<ProductEmbedding[] | null>;
  // Sem async — metodos abstratos nao precisam de await
}
```

### Implementacao concreta

```typescript
// llm/openai.llm.service.ts
export class OpenAILLMService extends LLMService {
  constructor(private configService: ConfigService) {
    super(); // Obrigatorio chamar super mesmo sem construtor na classe pai
  }

  async suggestCart(message: string): Promise<SuggestCart | null> {
    // Implementacao especifica OpenAI com prompts proprios
  }
}
```

### Consumidores importam o modulo

```typescript
// catalog/catalog.module.ts
@Module({
  imports: [LLMModule], // Importa modulo, nao servico
})
export class CatalogModule {}
```

## Example

**Before (acoplamento direto):**
```typescript
// catalog.module.ts
@Module({
  providers: [LLMService], // Implementacao concreta direta
})
export class CatalogModule {}

// llm.service.ts — tudo junto: cliente OpenAI, prompts, schemas
export class LLMService {
  private client = new OpenAI();
  async suggestCart() { /* ... */ }
}
```

**After (provider abstrato e configuravel):**
```typescript
// llm.module.ts — modulo dedicado com factory
@Module({
  providers: [{
    provide: LLMService,
    useFactory: (config: ConfigService) => {
      if (config.get('LLM_PROVIDER') === 'openai')
        return new OpenAILLMService(config);
      throw new Error('Unsupported provider');
    },
    inject: [ConfigService],
  }],
  exports: [LLMService],
})
export class LLMModule {}

// catalog.module.ts — importa modulo
@Module({ imports: [LLMModule] })
export class CatalogModule {}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Apenas um provider hoje mas possibilidade de mais | Ja crie a abstracao — custo baixo, beneficio alto |
| Schemas Zod compartilhados entre providers | Extraia para `schemas.ts` |
| Prompts identicos entre providers | Copie mesmo assim — divergem rapidamente |
| Metodo abstrato sem await | Nao use `async` na assinatura abstrata |
| Classe filha tem construtor proprio | Chame `super()` explicitamente |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `providers: [OpenAILLMService]` direto no modulo consumidor | `imports: [LLMModule]` e deixe o modulo resolver |
| Interface para o contrato do provider | Classe abstrata — interfaces somem no JS compilado |
| `useClass: OpenAILLMService` hardcoded | `useFactory` com `ConfigService` para ler variavel de ambiente |
| Compartilhar prompts entre providers | Copiar prompts — modelos diferentes precisam de adaptacoes |
| Exportar implementacao concreta do modulo | Exportar a classe abstrata (`exports: [LLMService]`) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
