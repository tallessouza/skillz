---
name: rs-ia-node-marketplace-chat-messages
description: "Enforces incremental chat message architecture when building AI-powered chat systems with Node.js and PostgreSQL. Use when user asks to 'add messages to chat', 'create chat message route', 'implement chat with AI actions', 'build message flow with LLM', or 'handle different message types'. Applies patterns: separate public/private service methods, message type flags for frontend rendering, LLM action detection before execution, confirmation-before-action flow. Make sure to use this skill whenever implementing chat messaging with AI decision-making backends. Not for simple CRUD without AI, frontend-only chat UI, or WebSocket real-time implementations."
---

# Chat Messages com AI Action Detection

> Implementar mensagens de chat incrementalmente: primeiro o envio basico, depois o processamento com LLM, sempre com confirmacao antes de executar acoes.

## Rules

1. **Separe servicos publicos de privados** — crie um metodo privado generico para insert (recebe todos os campos) e um publico especifico para cada contexto (`addUserMessage` so recebe sessionId e content), porque permite reuso quando o assistente tambem precisar salvar mensagens
2. **Use message type como flag para o frontend** — campo `message_type` indica se e texto puro ou tem dados estruturados (ex: sugestao de carrinho), porque o frontend precisa saber como renderizar sem inspecionar o conteudo
3. **Implemente em roundtrips incrementais** — primeiro teste o envio basico sem AI, depois adicione o processamento LLM, porque misturar tudo vira baguncaa e dificulta debugging
4. **LLM decide a acao, nao o codigo** — envie a mensagem ao LLM para classificar se requer acao (`suggest_cart`) ou apenas resposta (`send_message`), porque regras hardcoded nao escalam para linguagem natural
5. **Confirmacao antes de executar** — quando o LLM identifica uma acao, retorne uma confirmacao pendente ao usuario antes de executar (embedding, busca, etc), porque acoes irreversiveis precisam de consentimento explicito
6. **LLM pode melhorar o input** — permita que o LLM refine o texto do usuario antes de embedar (ex: "quero fazer bolo" → "bolo: farinha, ovos, acucar..."), porque input com mais contexto gera vetores mais relevantes

## How to write

### Schema de mensagens

```sql
CREATE TABLE chat_session_messages (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES chat_sessions(id),
  content TEXT NOT NULL,
  sender TEXT NOT NULL, -- 'user' | 'assistant'
  openai_message_id TEXT, -- necessario para historico na API OpenAI
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  message_type TEXT DEFAULT 'text' -- 'text' | 'suggestion' | etc
);
```

### Service com metodo privado + publico

```typescript
// Privado: generico, recebe todos os campos
private async addMessage({
  sessionId, content, sender, openaiMessageId = null, messageType = 'text'
}) {
  const result = await db.query(
    `INSERT INTO chat_session_messages (id, session_id, content, sender, openai_message_id, message_type)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [generateId(), sessionId, content, sender, openaiMessageId, messageType]
  )
  return result.rows[0]
}

// Publico: especifico para mensagem do usuario
async addUserMessage(sessionId: string, content: string) {
  return this.addMessage({ sessionId, content, sender: 'user' })
}
```

### Controller com validacao

```typescript
app.post('/chat/:sessionId/messages', async (req, res) => {
  const { sessionId } = req.params
  const { content } = req.body

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'Content is required' })
  }

  const message = await chatService.addUserMessage(sessionId, content)
  return res.status(201).json(message)
})
```

### Teste incremental

```typescript
it('should add new message to the chat session', async () => {
  // 1. Criar sessao primeiro
  const chatRes = await request(app).post('/chat').send()
  const sessionId = chatRes.body.id

  // 2. Enviar mensagem basica (sem AI ainda)
  const msgRes = await request(app)
    .post(`/chat/${sessionId}/messages`)
    .send({ content: 'hello world' })

  expect(msgRes.status).toBe(201)
  expect(msgRes.body).toHaveProperty('id')
  expect(msgRes.body.content).toBe('hello world')
})
```

## Example

**Fluxo completo (apos implementar AI):**

```
Usuario envia: "Quero fazer um bolo"
    ↓
API salva mensagem do usuario (sender: 'user', type: 'text')
    ↓
API envia ao LLM para classificar
    ↓
LLM retorna: { action: 'suggest_cart', refined_input: 'bolo: farinha, ovos, acucar, fermento' }
    ↓
API salva mensagem do assistente (sender: 'assistant', type: 'suggestion')
  + salva acao pendente de confirmacao
    ↓
Frontend renderiza botoes [Confirmar] [Cancelar]
    ↓
Usuario confirma → API embeda refined_input → busca vetorial → monta carrinho
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Mensagem simples sem acao | Salve com `message_type: 'text'`, retorne direto |
| LLM identifica acao | Salve com `message_type: 'suggestion'`, retorne com confirmacao pendente |
| Precisa do historico OpenAI | Guarde `openai_message_id` no insert do assistente |
| Novo tipo de acao no futuro | Adicione ao enum de `message_type`, frontend decide renderizacao |
| Input do usuario e vago | Deixe o LLM refinar antes de embedar |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Executar acao direto sem confirmar | Retornar confirmacao pendente, esperar aceite |
| Um metodo service que faz tudo (insert + AI + embedding) | Metodos separados por etapa, compostos no controller |
| Hardcodar regras de "quando e acao" | Delegar classificacao ao LLM |
| Testar tudo junto na primeira vez | Testar envio basico primeiro, AI depois |
| Ignorar `message_type` e inspecionar content no frontend | Usar flag explicita para tipo de renderizacao |
| Usar o input cru do usuario para embedding | Permitir que LLM refine o input com mais contexto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/ia-node/rs-ia-node-marketplace-inteligente-adicionando-mensagens-ao-chat-parte-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/ia-node/rs-ia-node-marketplace-inteligente-adicionando-mensagens-ao-chat-parte-1/references/code-examples.md)
