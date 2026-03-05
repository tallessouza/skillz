---
name: rs-ia-node-marketplace-frontend-correcoes
description: "Applies frontend-backend integration patterns for AI chat marketplace applications. Use when user asks to 'integrate chat frontend', 'fix API routes', 'aggregate cart totals', 'debug frontend-backend communication', or 'build chat with suggested carts'. Covers SWR data fetching, SQL aggregation with joins for computed totals, search params state management, and common integration pitfalls. Make sure to use this skill whenever building chat interfaces that display AI-generated product suggestions or shopping carts. Not for pure backend AI logic, prompt engineering, or CSS styling."
---

# Frontend e Correções no Backend — Chat AI Marketplace

> Ao integrar frontend com backend de chat AI, valide cada camada isoladamente: rota existe, propriedade correta no payload, dados agregados corretamente no SQL.

## Rules

1. **Valide rotas antes de integrar** — crie todas as rotas no backend antes de conectar o frontend, porque um 404 silencioso desperdiça tempo de debug
2. **Nomes de propriedade consistentes entre camadas** — se o backend espera `content`, o frontend manda `content`, nao `message`, porque inconsistencia gera 400 sem mensagem clara
3. **Chaves de resposta devem bater com o frontend** — se o componente espera `suggestedCarts`, o backend manda `suggestedCarts`, nao `carts`, porque renomear silenciosamente quebra a UI
4. **Compute totais no SQL, nao no frontend** — use joins + aggregate para calcular totais de carrinho no banco, porque evita N+1 e garante consistencia
5. **Inclua IDs em todos os payloads de entidade** — todo carrinho, item ou sessao deve incluir seu ID na resposta, porque o frontend precisa dele para acoes subsequentes
6. **Use search params para estado de navegacao** — controle qual chat esta selecionado via URL search params, porque permite deep linking e compartilhamento

## How to write

### Rota de listagem com agregacao (SQL com Drizzle)

```typescript
// Buscar sessoes de chat com mensagens agregadas
async getChatSessions() {
  const result = await db
    .select()
    .from(chatSessions)
    .leftJoin(chatMessages, eq(chatSessions.id, chatMessages.sessionId))
    .orderBy(chatSessions.createdAt)

  // Agrupar mensagens por sessao
  const grouped = groupBy(result, row => row.chat_sessions.id)
  return Object.values(grouped).map(rows => ({
    ...rows[0].chat_sessions,
    messages: rows.map(r => r.chat_messages).filter(Boolean),
  }))
}
```

### Calcular total do carrinho com join

```typescript
// Join cart_items com products para ter price e quantity
const cartsWithTotal = await db
  .select()
  .from(carts)
  .leftJoin(cartItems, eq(carts.id, cartItems.cartId))
  .leftJoin(products, eq(cartItems.productId, products.id))

// Agregar total por carrinho
const total = items.reduce(
  (sum, item) => sum + item.price * item.quantity, 0
)
```

### SWR para buscar chat selecionado

```typescript
const searchParams = useSearchParams()
const chatId = searchParams.get('chatId')

const { data: chat } = useSWR(
  chatId ? `/api/chats/${chatId}` : null,
  fetcher
)
```

## Example

**Before (propriedades inconsistentes):**
```typescript
// Frontend envia
fetch('/api/chat', { body: JSON.stringify({ message: text }) })

// Backend espera
const { content } = req.body // undefined! 400 error

// Resposta do backend
return { carts: suggestedCarts }

// Frontend espera
data.suggestedCarts // undefined! UI vazia
```

**After (propriedades alinhadas):**
```typescript
// Frontend envia
fetch('/api/chat', { body: JSON.stringify({ content: text }) })

// Backend recebe
const { content } = req.body // OK

// Resposta inclui ID e chave correta
return { suggestedCarts: carts.map(c => ({ id: c.id, items, total, relevance })) }

// Frontend recebe
data.suggestedCarts // OK, com ID para acao de escolher
```

## Heuristics

| Situacao | Acao |
|----------|------|
| 404 no frontend | Verificar se a rota existe no backend — provavelmente esqueceu de criar |
| 400 sem motivo claro | Comparar nomes de propriedades entre frontend e backend |
| Dados aparecem no banco mas nao na UI | Verificar chave da resposta JSON vs o que o componente espera |
| Total do carrinho nao aparece | Verificar se o SQL faz join com products e agrega price * quantity |
| Acao de escolher carrinho falha | Verificar se o ID da entidade esta incluido no payload |
| Rota funciona mas no controller errado | Verificar se o endpoint esta registrado no router correto (ex: `/chat` vs `/cart`) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Mandar `message` quando backend espera `content` | Alinhar nomes antes de integrar |
| Retornar `carts` quando frontend espera `suggestedCarts` | Usar mesma chave em ambas camadas |
| Calcular total no frontend com map/reduce sobre N requests | Calcular no SQL com join + aggregate |
| Omitir ID nas respostas de entidade | Sempre incluir `id` para acoes futuras |
| Registrar rota de chat no router de cart | Manter rotas no dominio correto |
| Usar setState para navegacao entre chats | Usar search params (URL state) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/ia-node/rs-ia-node-marketplace-inteligente-frontend-e-correcoes-no-backend/references/deep-explanation.md)
- [Code examples](../../../data/skills/ia-node/rs-ia-node-marketplace-inteligente-frontend-e-correcoes-no-backend/references/code-examples.md)
