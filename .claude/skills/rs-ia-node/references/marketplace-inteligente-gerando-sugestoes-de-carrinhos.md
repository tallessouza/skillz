---
name: rs-ia-node-marketplace-gerando-sugestoes-carrinhos
description: "Applies AI-powered cart suggestion patterns when building marketplace or e-commerce features with LLM integration in Node.js. Use when user asks to 'generate cart suggestions', 'suggest products by store', 'build AI shopping cart', 'create marketplace assistant', or 'score product recommendations'. Enforces structured LLM output with Zod schemas, store-grouped cart generation, scoring systems, and message-cart linking. Make sure to use this skill whenever implementing AI-driven product suggestion or cart creation flows. Not for simple CRUD carts, payment processing, or non-AI product listing."
---

# Gerando Sugestoes de Carrinhos com IA

> Ao implementar sugestoes de carrinho via LLM, estruture o fluxo em: prompt com exemplos concretos, schema Zod para validacao, persistencia por loja com score, e vinculacao carrinho-mensagem.

## Rules

1. **Prompt com exemplos concretos de scoring** — inclua no prompt exemplos de lojas com score alto (todos os itens), medio (variacoes/faltas) e baixo (poucos itens), porque o LLM precisa de referencia concreta para calibrar scores
2. **Schema Zod para toda resposta estruturada** — defina schema com `z.object` para carrinhos (storeId, items, score) e response text, porque sem schema o parse falha silenciosamente
3. **Carrinhos agrupados por loja** — cada carrinho pertence a uma loja com seu proprio score, porque o usuario precisa comparar opcoes entre lojas
4. **Vincule carrinho a mensagem** — salve `suggestedByMessageId` no carrinho para rastreabilidade, porque sem vinculo perde-se o contexto de qual sugestao gerou qual carrinho
5. **Carrinhos inativos por padrao** — salve com `active: false` ate o usuario confirmar, porque sugestao nao e confirmacao
6. **Popule mensagens com dados de carrinho** — ao retornar mensagens do tipo `suggest_cart_result`, faca join com carrinhos e lojas para incluir nome da loja e score

## How to write

### Prompt de sugestao

```typescript
const suggestCartsPrompt = `Voce e um assistente de marketplace com conhecimentos gastronomicos.
Cria carrinhos de compra por loja com base nos produtos sugeridos.

Regras:
- Atenda a quantidade necessaria de cada produto
- Tolere variacoes (ex: ovos caipira = ovos)
- Calcule score para cada carrinho (0-100)
- Score diminui quando: faltam itens, tem variacoes, poucos produtos

Exemplo:
Input: "bolo de chocolate" + lista de ingredientes
Loja 1 (farinha, acucar, ovos, chocolate, fermento): score 95
Loja 2 (farinha, ovos caipira, chocolate): score 70
Loja 3 (farinha): score 20

Produtos disponiveis por loja:
{JSON.stringify(relevantProducts, null, 2)}

Input do usuario: {input}`;
```

### Schema Zod de retorno

```typescript
const suggestCartSchema = z.object({
  carts: z.array(
    z.object({
      storeId: z.number(),
      score: z.number(),
      items: z.array(
        z.object({
          productId: z.number(),
          quantity: z.number(),
          name: z.string(),
        })
      ),
    })
  ),
  response: z.string(),
});
```

### Salvar carrinhos vinculados a mensagem

```typescript
for (const cart of carts) {
  const [cartResult] = await db.insert(cartsTable).values({
    userId,
    storeId: cart.storeId,
    score: cart.score,
    suggestedByMessageId: messageId,
    active: false,
  }).returning();

  for (const item of cart.items) {
    await db.insert(cartItemsTable).values({
      cartId: cartResult.id,
      productId: item.productId,
      quantity: item.quantity,
    }).onConflictDoUpdate({
      target: [cartItemsTable.cartId, cartItemsTable.productId],
      set: { quantity: item.quantity },
    });
  }
}
```

## Example

**Before (sem estrutura):**
```typescript
const result = await llm.chat("sugira produtos para bolo");
return { message: result };
```

**After (com este skill aplicado):**
```typescript
// 1. LLM com schema estruturado
const llmResponse = await llmService.suggestCarts(relevantProducts, input);
if (!llmResponse) throw new Error("Failed to generate suggestions");

// 2. Salvar mensagem primeiro (para ter messageId)
const message = await addMessage(sessionId, llmResponse.response, 
  llmResponse.responseId, "suggest_cart_result");

// 3. Salvar carrinhos vinculados a mensagem
await saveSuggestedCarts(userId, llmResponse.parsed.carts, message.id);

// 4. Ao listar mensagens, popular com dados de carrinho
const populated = await populateMessages(messages);
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nenhum produto relevante encontrado | Retorne erro claro, nao envie prompt vazio ao LLM |
| LLM retorna null/parse falha | Try-catch e retorne null, trate no caller |
| Mensagens sem ordenacao | Sempre `.sort()` por `createdAt` crescente |
| Mensagem tipo `suggest_cart_result` | Faca join com carts + stores para popular dados |
| Conflito em cart items | Use `onConflictDoUpdate` para atualizar quantidade |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Salvar carrinho sem vincular a mensagem | Sempre inclua `suggestedByMessageId` |
| Carrinho ativo por padrao na sugestao | `active: false` ate usuario confirmar |
| Prompt sem exemplos de scoring | Inclua 3 exemplos concretos (alto/medio/baixo) |
| Retornar mensagens sem popular carrinhos | Verifique `messageType` e faca join quando necessario |
| Stringify produtos sem formatacao | `JSON.stringify(products, null, 2)` para legibilidade do LLM |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/ia-node/rs-ia-node-marketplace-inteligente-gerando-sugestoes-de-carrinhos/references/deep-explanation.md)
- [Code examples](../../../data/skills/ia-node/rs-ia-node-marketplace-inteligente-gerando-sugestoes-de-carrinhos/references/code-examples.md)
