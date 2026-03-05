# Code Examples: Implementando Gemini — Parte 2

## 1. Metodo suggestCarts completo

```typescript
async suggestCarts(input: string, productsByStore: string): Promise<SuggestCartResult | null> {
  const response = await this.client.models.generateContent({
    model: this.model,
    config: {
      systemInstruction: SUGGEST_CART_PROMPT,
      responseMimeType: 'application/json',
      responseSchema: suggestCartSchema,
    },
    // Injeta tanto o input do usuario quanto os produtos disponiveis por loja
    contents: `User input: ${input}\n\nAvailable products by store:\n${productsByStore}`,
  });

  const jsonContent = this.extractJsonFromResponse(response.text ?? '');
  if (!jsonContent) return null;

  const parsed = suggestCartZodSchema.safeParse(JSON.parse(jsonContent));
  if (!parsed.success) return null;

  return parsed.data;
}
```

**Ponto-chave:** O contents inclui nao so o input do usuario mas tambem os produtos relevantes agrupados por loja. Sem isso, o modelo nao tem dados para montar carrinhos reais.

## 2. Funcao utilitaria de extracao de JSON

```typescript
private extractJsonFromResponse(text: string): string {
  const match = text.match(/```json\s*([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}
```

**Antes (inline no answerMessage):**
```typescript
// Codigo duplicado em cada metodo
const match = response.text.match(/```json\s*([\s\S]*?)```/);
const jsonContent = match ? match[1].trim() : '';
```

**Depois (extraido para funcao reutilizavel):**
```typescript
const jsonContent = this.extractJsonFromResponse(response.text ?? '');
```

## 3. Batch embedding com salvamento direto

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
    if (!resultItem) {
      console.log('No embedding for product', products[index].name);
      continue; // Pula para proximo item
    }

    console.log(
      `Embedding for product ${products[index].name}: ${resultItem.values?.length}`
    );

    await this.postgreService.query(
      `UPDATE products SET embedding = $1::vector WHERE id = $2`,
      [JSON.stringify(resultItem.values), products[index].id]
    );
  }
}
```

**Diferenca arquitetural:** Na OpenAI, resultados vem via webhook. No Gemini, o resultado e sincrono e salvo diretamente no banco dentro do mesmo metodo.

## 4. Ajuste no NestJS module para injetar PostgreService

```typescript
// llm.module.ts
@Module({
  providers: [
    PostgreService, // Necessario para Gemini salvar embeddings
    {
      provide: 'LLM_SERVICE',
      useFactory: (postgreService: PostgreService) => {
        if (process.env.LLM_PROVIDER === 'gemini') {
          return new GeminiLlmService(postgreService);
        }
        return new OpenAiLlmService();
      },
      inject: [PostgreService],
    },
  ],
})
export class LlmModule {}
```

## 5. Ajuste no ChatService para passar mensagens

```typescript
// Antes: pegava so o id da ultima mensagem
const { rows } = await this.postgreService.query(
  'SELECT id FROM messages WHERE chat_id = $1 ORDER BY created_at DESC LIMIT 1',
  [chatId]
);

// Depois: pega conteudo e sender de todas as mensagens
const { rows } = await this.postgreService.query(
  'SELECT id, content, sender FROM messages WHERE chat_id = $1 ORDER BY created_at DESC',
  [chatId]
);

const lastMessage = rows[0] ?? null;
const messages = rows.map(row => ({
  content: row.content,
  sender: row.sender,
}));

// Passa mensagens para o answerMessage
await this.llmService.answerMessage(input, messages);
```

## 6. Reforco de formato no prompt para discriminated unions

```typescript
// No system prompt, adicionar descricao explicita do formato:
const ANSWER_MESSAGE_PROMPT = `
...existing prompt...

Response format:
- If action is sendMessage: { "action": { "type": "sendMessage", "message": "..." } }
- If action is suggestCards: { "action": { "type": "suggestCards" }, "message": "..." }

Do NOT return action as a plain string. It must be an object with a type field.
`;
```

**Motivo:** O Gemini estava retornando `"action": "sendMessage"` (string) ao inves de `"action": { "type": "sendMessage" }` (objeto). O schema sozinho nao foi suficiente para enforcar o formato correto.

## 7. Log de acompanhamento do batch

```typescript
// Antes do batch
console.log(`Batch embedding for ${products.length} products`);

// Dentro do loop
console.log(`Embedding for product ${products[index].name}: ${resultItem.values?.length}`);

// Se nao encontrou produtos para embedar
console.log('No products to embedding');
```

**Output observado:** Todos os 36 produtos geraram embeddings com o mesmo tamanho (1536), confirmando que a configuracao de outputDimensionality funcionou corretamente.