# Code Examples: Frontend e Correções no Backend

## 1. Rota getChatSessions completa

```typescript
// routes/chat.ts — rota que foi esquecida inicialmente
router.get('/chat-sessions', async (req, res) => {
  const sessions = await chatService.getChatSessions()
  return res.json(sessions)
})
```

## 2. Query SQL com GROUP BY para sessoes + mensagens

```typescript
// Buscar todas as sessoes com mensagens agrupadas
const result = await db
  .select({
    sessionId: chatSessions.id,
    title: sql`COALESCE(${chatSessions.title}, '')`,
    createdAt: chatSessions.createdAt,
    messageId: chatMessages.id,
    content: chatMessages.content,
    role: chatMessages.role,
    suggestedCarts: chatMessages.suggestedCarts,
  })
  .from(chatSessions)
  .leftJoin(chatMessages, eq(chatSessions.id, chatMessages.sessionId))
  .orderBy(chatSessions.createdAt)

// Group by para agrupar mensagens na mesma sessao
const grouped = result.reduce((acc, row) => {
  if (!acc[row.sessionId]) {
    acc[row.sessionId] = {
      id: row.sessionId,
      title: row.title,
      createdAt: row.createdAt,
      messages: [],
    }
  }
  if (row.messageId) {
    acc[row.sessionId].messages.push({
      id: row.messageId,
      content: row.content,
      role: row.role,
      suggestedCarts: row.suggestedCarts,
    })
  }
  return acc
}, {})
```

## 3. Calcular total do carrinho com joins

```typescript
// O problema: cart_items nao tem price, products nao tem quantity
// Solucao: join triplo

const cartsWithItems = await db
  .select({
    cartId: carts.id,
    cartRelevance: carts.relevance,
    cartActive: carts.active,
    itemQuantity: cartItems.quantity,
    productName: products.name,
    productPrice: products.price,
  })
  .from(carts)
  .leftJoin(cartItems, eq(carts.id, cartItems.cartId))
  .leftJoin(products, eq(cartItems.productId, products.id))
  .where(eq(carts.messageId, messageId))

// Agregar por carrinho
const cartsGrouped = Object.values(
  cartsWithItems.reduce((acc, row) => {
    if (!acc[row.cartId]) {
      acc[row.cartId] = {
        id: row.cartId,
        relevance: row.cartRelevance,
        items: [],
        total: 0,
      }
    }
    if (row.productName) {
      const itemTotal = row.productPrice * row.itemQuantity
      acc[row.cartId].items.push({
        name: row.productName,
        price: row.productPrice,
        quantity: row.itemQuantity,
      })
      acc[row.cartId].total += itemTotal
    }
    return acc
  }, {})
)
```

## 4. Componente ChatMessage com carrinhos sugeridos

```tsx
function ChatMessage({ message }: { message: ChatMessageType }) {
  return (
    <div className={message.role === 'user' ? 'user-msg' : 'assistant-msg'}>
      <p>{message.content}</p>

      {message.suggestedCarts && message.suggestedCarts.length > 0 && (
        <div className="suggested-carts">
          {message.suggestedCarts.map(cart => (
            <div key={cart.id} className="cart-card">
              <span>Relevância: {cart.relevance}%</span>
              <ul>
                {cart.items.map(item => (
                  <li key={item.name}>
                    {item.name} x{item.quantity} — R${item.price}
                  </li>
                ))}
              </ul>
              <strong>Total: R${cart.total}</strong>
              <button onClick={() => onChooseCart(cart.id)}>
                Aplicar carrinho
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

## 5. Navegacao por search params

```tsx
function ConversationSidebar({ chats }: { chats: ChatSession[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedChatId = searchParams.get('chatId')

  const selectChat = (chatId: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('chatId', chatId)
    router.push(`?${params.toString()}`)
  }

  return (
    <aside>
      <button onClick={createNewChat}>+ Novo Chat</button>
      {chats.map(chat => (
        <button
          key={chat.id}
          onClick={() => selectChat(chat.id)}
          data-active={chat.id === selectedChatId}
        >
          {chat.messages[0]?.content ?? 'Nova conversa'}
        </button>
      ))}
    </aside>
  )
}
```

## 6. SWR para dados do chat selecionado

```tsx
const { data: chatData, mutate } = useSWR(
  selectedChatId ? `/api/chats/${selectedChatId}` : null,
  fetcher
)

// Mutacao local apos escolher carrinho (otimistic update)
const handleChooseCart = async (cartId: string) => {
  try {
    await api.post(`/api/chat/choose-cart`, { cartId })
    mutate() // revalida dados do SWR
    toast.success('Carrinho aplicado!')
  } catch {
    toast.error('Erro ao escolher carrinho')
  }
}
```

## 7. Correcao do payload — content vs message

```typescript
// ERRADO — frontend mandava 'message'
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message: inputText }),
})

// CORRETO — backend espera 'content'
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ content: inputText }),
})
```

## 8. Correcao da rota — controller correto

```typescript
// ERRADO — rota de escolher carrinho no router de cart
// router de /cart
router.post('/choose', cartController.choose)

// CORRETO — rota no router de /chat (pertence ao dominio de chat)
// router de /chat
router.post('/choose-cart', chatController.chooseCart)
```