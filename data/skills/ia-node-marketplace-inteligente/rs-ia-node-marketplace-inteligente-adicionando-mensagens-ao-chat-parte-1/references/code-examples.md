# Code Examples: Chat Messages com AI Action Detection

## 1. Schema SQL completo

```sql
-- Drop para reset local
DROP TABLE IF EXISTS chat_session_messages;

CREATE TABLE chat_session_messages (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES chat_sessions(id),
  content TEXT NOT NULL,
  sender TEXT NOT NULL,           -- 'user' | 'assistant'
  openai_message_id TEXT,         -- ID da mensagem na API OpenAI (null para user)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  message_type TEXT DEFAULT 'text' -- 'text' | 'suggestion'
);
```

## 2. Teste: envio basico de mensagem

```typescript
it('should add new message to the chat session', async () => {
  // Criar sessao
  const chatResponse = await request(app)
    .post('/chat')
    .send()

  const sessionId = chatResponse.body.id
  expect(sessionId).toBeDefined()

  // Enviar mensagem
  const messageResponse = await request(app)
    .post(`/chat/${sessionId}/messages`)
    .send({ content: 'hello world' })

  expect(messageResponse.status).toBe(201)
  expect(messageResponse.body).toHaveProperty('id')
  expect(messageResponse.body.content).toBe('hello world')
})
```

## 3. Service: metodo privado + publico

```typescript
class ChatService {
  // Generico: usado internamente por qualquer contexto
  private async addMessage({
    sessionId,
    content,
    sender,
    openaiMessageId = null,
    messageType = 'text',
  }: {
    sessionId: string
    content: string
    sender: 'user' | 'assistant'
    openaiMessageId?: string | null
    messageType?: string
  }) {
    const id = generateId()
    const result = await db.query(
      `INSERT INTO chat_session_messages
        (id, session_id, content, sender, openai_message_id, message_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id, sessionId, content, sender, openaiMessageId, messageType]
    )
    return result.rows[0]
  }

  // Publico: so para mensagens do usuario
  async addUserMessage(sessionId: string, content: string) {
    return this.addMessage({
      sessionId,
      content,
      sender: 'user',
    })
  }

  // Futuro: para mensagens do assistente
  async addAssistantMessage(
    sessionId: string,
    content: string,
    openaiMessageId: string,
    messageType: string = 'text'
  ) {
    return this.addMessage({
      sessionId,
      content,
      sender: 'assistant',
      openaiMessageId,
      messageType,
    })
  }
}
```

## 4. Controller: rota POST com validacao

```typescript
app.post('/chat/:sessionId/messages', async (req, res) => {
  const { sessionId } = req.params
  const { content } = req.body

  // Validacao: content obrigatorio e string
  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'Content is required' })
  }

  const message = await chatService.addUserMessage(sessionId, content)
  return res.status(201).json(message)
})
```

## 5. Estrutura de resposta do LLM (proximo passo)

```typescript
// O que o LLM vai retornar apos classificar a mensagem
interface LLMActionResponse {
  // Tipo de acao identificada
  action: 'send_message' | 'suggest_cart'

  // Mensagem de resposta do assistente
  message: string

  // Input refinado pelo LLM (so quando action != 'send_message')
  refinedInput?: string
}

// Exemplo: mensagem sem acao
{
  action: 'send_message',
  message: 'Para fazer um bolo, voce vai precisar de farinha, ovos...'
}

// Exemplo: mensagem com acao de sugestao
{
  action: 'suggest_cart',
  message: 'Posso montar um carrinho com os ingredientes para bolo?',
  refinedInput: 'bolo de ovos: farinha de trigo, ovos, acucar, fermento em po, manteiga'
}
```

## 6. Fluxo visual do roundtrip

```
POST /chat/:sessionId/messages  { content: "Quero fazer um bolo" }
         │
         ▼
   ┌─────────────┐
   │ Salva msg   │  sender: 'user', type: 'text'
   │ do usuario  │
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │ Envia ao    │  "Quero fazer um bolo"
   │ LLM         │
   └──────┬──────┘
          │
          ├── action: 'send_message' ──► Salva resposta (type: 'text') ──► 201
          │
          └── action: 'suggest_cart' ──► Salva resposta (type: 'suggestion')
                                         + salva acao pendente
                                         ──► 201 com confirmacao pendente
```