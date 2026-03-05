# Code Examples: Gerando Sugestoes de Carrinhos

## LLM Service — Funcao suggestCarts

```typescript
// LLMService
async suggestCarts(relevantProducts: RelevantProduct[], input: string) {
  try {
    const response = await this.sparse({
      model: "gpt-4o-mini",
      prompt: this.suggestCartsPrompt,
      input: `Input do usuario: ${input}\n\nProdutos disponiveis por loja:\n${JSON.stringify(relevantProducts, null, 2)}`,
      schema: suggestCartSchema,
    });

    if (!response?.output_parsed) return null;

    return {
      outputParsed: response.output_parsed,
      responseId: response.id,
    };
  } catch (error) {
    console.error("Error suggesting carts:", error);
    return null;
  }
}
```

## Schema Zod Completo

```typescript
import { z } from "zod";

const suggestCartSchema = z.object({
  carts: z.array(
    z.object({
      storeId: z.number(),
      score: z.number().min(0).max(100),
      items: z.array(
        z.object({
          productId: z.number(),
          quantity: z.number(),
          name: z.string(),
        })
      ),
    })
  ),
  response: z.string().describe("Mensagem do assistente para o usuario"),
});
```

## Salvamento de Carrinhos

```typescript
async saveSuggestedCarts(
  userId: number,
  carts: SuggestedCart[],
  messageId: number
) {
  for (const cart of carts) {
    const [cartResult] = await db
      .insert(cartsTable)
      .values({
        userId,
        storeId: cart.storeId,
        score: cart.score,
        suggestedByMessageId: messageId,
        active: false,
      })
      .returning();

    for (const item of cart.items) {
      await db
        .insert(cartItemsTable)
        .values({
          cartId: cartResult.id,
          productId: item.productId,
          quantity: item.quantity,
        })
        .onConflictDoUpdate({
          target: [cartItemsTable.cartId, cartItemsTable.productId],
          set: { quantity: item.quantity },
        });
    }
  }
}
```

## Populacao de Mensagens com Carrinhos

```typescript
private async populateMessages(messages: ChatMessage[]) {
  const populatedMessages = await Promise.all(
    messages.map(async (message) => {
      if (message.messageType !== "suggest_cart_result") {
        return message;
      }

      // Buscar carrinhos vinculados a esta mensagem
      const carts = await db
        .select({
          id: cartsTable.id,
          storeId: cartsTable.storeId,
          storeName: storesTable.name,
          score: cartsTable.score,
        })
        .from(cartsTable)
        .innerJoin(storesTable, eq(cartsTable.storeId, storesTable.id))
        .where(eq(cartsTable.suggestedByMessageId, message.id));

      return {
        ...message,
        carts,
      };
    })
  );

  return populatedMessages.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}
```

## Fluxo Completo no Chat Service

```typescript
async confirmAction(sessionId: number, actionId: number) {
  // 1. Atualizar action como executada
  await this.updateAction(actionId, { executedAt: new Date() });

  // 2. Buscar produtos relevantes (ja embedados anteriormente)
  const relevantProducts = await this.getRelevantProducts(sessionId);

  if (!relevantProducts.length) {
    throw new NotFoundError("No relevant products found");
  }

  // 3. Gerar sugestoes via LLM
  const llmResponse = await this.llmService.suggestCarts(
    relevantProducts,
    action.input
  );

  if (!llmResponse) {
    throw new Error("Failed to generate cart suggestions");
  }

  // 4. Salvar mensagem PRIMEIRO (precisa do messageId)
  const message = await this.addMessage(
    sessionId,
    llmResponse.outputParsed.response,
    llmResponse.responseId,
    "suggest_cart_result"
  );

  // 5. Salvar carrinhos vinculados a mensagem
  await this.saveSuggestedCarts(
    userId,
    llmResponse.outputParsed.carts,
    message.id
  );
}
```

## Alteracao de Schema (desenvolvimento)

```sql
ALTER TABLE carts ADD COLUMN score INTEGER;
ALTER TABLE carts ADD COLUMN suggested_by_message_id INTEGER
  REFERENCES messages(id);
```

## Prompt Completo (estrutura)

```typescript
const suggestCartsPrompt = `Voce e um assistente de marketplace com conhecimentos gastronomicos.
Cria carrinhos de compra por loja com base nos produtos sugeridos.

Regras:
- Atenda a quantidade necessaria de cada produto
- Tolere variacoes (ovos caipira pode substituir ovos)
- Calcule o score para cada carrinho sugerido
- Fatores que diminuem score: itens faltando, variacoes, poucos produtos

Exemplo:
Se input for "bolo de chocolate" e ingredientes sao [farinha, acucar, ovos, chocolate, fermento]:

Loja 1 (tem: farinha, acucar, ovos, chocolate, fermento):
  score: 95 (todos os itens disponiveis)

Loja 2 (tem: farinha, ovos caipira, chocolate):
  score: 70 (faltam itens, tem variacoes)

Loja 3 (tem: farinha):
  score: 20 (apenas 1 item disponivel)`;
```