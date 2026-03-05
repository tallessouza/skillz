---
name: rs-ia-node-marketplace-implementando-gemini-2
description: "Applies Gemini API integration patterns for cart suggestion generation and batch embeddings in Node.js/NestJS. Use when user asks to 'integrate Gemini', 'switch LLM provider', 'generate embeddings with Gemini', 'implement multi-provider AI', or 'adapt OpenAI code to Gemini'. Covers generateContent, embedContent, structured output extraction, and prompt adaptation between models. Make sure to use this skill whenever implementing Gemini as alternative provider or migrating from OpenAI. Not for OpenAI-specific implementation, frontend components, or database schema design."
---

# Implementando Gemini — Geracao de Carrinhos e Embeddings

> Ao integrar um segundo provider de LLM, adapte prompts e parsing ao comportamento especifico do modelo, nunca assuma compatibilidade 1:1.

## Rules

1. **Nunca misture embeddings entre modelos** — embeddings gerados pelo Gemini sao incompativeis com os da OpenAI, porque cada modelo projeta vetores em espacos dimensionais diferentes. Usar embeddings cruzados retorna resultados sem relevancia alguma.
2. **Extraia JSON manualmente do response** — Gemini retorna conteudo em formato markdown com JSON embutido, nao JSON puro. Crie funcao utilitaria para extrair o JSON do texto.
3. **Reforce formato no prompt quando schema nao basta** — se o modelo ignora discriminated unions no schema (ex: retorna string ao inves de objeto), descreva o formato esperado diretamente no prompt como comentario.
4. **Use embedContent com array para batch** — diferente da OpenAI, a API do Gemini aceita multiplos conteudos em uma unica chamada de embedContent, retornando array de embeddings correspondente.
5. **Mantenha assinatura da classe abstrata** — ao implementar provider alternativo, nao mude a interface. Adapte internamente (ex: salvar embeddings direto no batch ao inves de via webhook).

## How to write

### generateContent para sugestao de carrinho

```typescript
async suggestCarts(input: string, productsByStore: string): Promise<SuggestCartResult | null> {
  const response = await this.client.models.generateContent({
    model: this.model,
    config: {
      systemInstruction: SUGGEST_CART_PROMPT,
      responseMimeType: 'application/json',
      responseSchema: suggestCartSchema,
    },
    contents: `User input: ${input}\n\nAvailable products by store:\n${productsByStore}`,
  });

  const jsonContent = this.extractJsonFromResponse(response.text ?? '');
  if (!jsonContent) return null;

  const parsed = suggestCartZodSchema.safeParse(JSON.parse(jsonContent));
  return parsed.success ? parsed.data : null;
}
```

### Extrator de JSON reutilizavel

```typescript
private extractJsonFromResponse(text: string): string {
  const match = text.match(/```json\s*([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}
```

### Batch embedding de produtos

```typescript
async batchEmbedProducts(products: Product[]): Promise<void> {
  const result = await this.client.models.embedContent({
    model: 'gemini-embedding-exp-03-07',
    contents: products.map(p => p.name),
    config: {
      outputDimensionality: 1536,
      taskType: 'SEMANTIC_SIMILARITY',
    },
  });

  for (const [index, resultItem] of result.embeddings.entries()) {
    if (!resultItem) continue;
    await this.postgreService.query(
      `UPDATE products SET embedding = $1::vector WHERE id = $2`,
      [JSON.stringify(resultItem.values), products[index].id]
    );
  }
}
```

### Injecao de dependencia no modulo NestJS

```typescript
// No LLM module factory, injetar PostgreService para Gemini
{
  provide: 'LLM_SERVICE',
  useFactory: (postgreService: PostgreService) => {
    if (process.env.LLM_PROVIDER === 'gemini') {
      return new GeminiLlmService(postgreService);
    }
    return new OpenAiLlmService();
  },
  inject: [PostgreService],
}
```

## Example

**Before (assume que resposta vem formatada):**
```typescript
const response = await this.client.models.generateContent({ ... });
const data = JSON.parse(response.text); // QUEBRA — response vem com markdown
```

**After (extrai JSON do markdown):**
```typescript
const response = await this.client.models.generateContent({ ... });
const jsonContent = this.extractJsonFromResponse(response.text ?? '');
if (!jsonContent) return null;
const data = JSON.parse(jsonContent);
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Modelo ignora responseSchema para unions | Reforce formato esperado no systemInstruction |
| Precisa embedar muitos produtos | Use array no embedContent (nao um por um) |
| Batch API do Gemini nao suporta embeddings | Processe em chunks localmente (50-100 por vez) |
| Troca de provider em runtime | Use .env + factory pattern, reset banco ao trocar |
| Embeddings ja existem no banco | Verifique antes de re-embedar (WHERE embedding IS NULL) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `JSON.parse(response.text)` direto | Extraia JSON do markdown primeiro com regex |
| Usar embeddings da OpenAI com query Gemini | Re-gere embeddings com o modelo ativo |
| Chamar embedContent um produto por vez | Passe array de conteudos em uma chamada |
| Deixar webhook obrigatorio na interface | Torne opcional — Gemini retorna sincrono |
| Assumir mesmo formato de resposta entre providers | Teste e adapte parsing por provider |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/ia-node/rs-ia-node-marketplace-inteligente-implementando-gemini-parte-2/references/deep-explanation.md)
- [Code examples](../../../data/skills/ia-node/rs-ia-node-marketplace-inteligente-implementando-gemini-parte-2/references/code-examples.md)
