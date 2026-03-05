# Code Examples: Confirmando Acao

## Tipos definidos no servico

```typescript
type ChatSession = {
  id: string
  created_at: Date
  user_id: string
}

type ChatMessage = {
  id: string
  session_id: string
  sender: 'user' | 'assistant'
  content: string
  created_at: Date
}

type ChatAction = {
  id: string
  chat_message_id: string
  action_type: string
  payload: { input: string }
  created_at: Date
  confirmed_at: Date | null
}
```

## Funcao embed no servico LLM

```typescript
async embed(input: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input,
  })
  console.log('Embedding length:', response.data[0].embedding.length) // 1536
  return response.data[0].embedding
}
```

## Funcao confirm action completa

```typescript
async confirmAction(sessionId: string, actionId: string) {
  // 1. Validar session
  const session = await sql`SELECT * FROM chat_sessions WHERE id = ${sessionId}`
  if (session.rows.length === 0) {
    throw new NotFoundException('Session not found')
  }

  // 2. Validar action
  const result = await sql`SELECT * FROM chat_actions WHERE id = ${actionId}`
  if (result.rows.length === 0) {
    throw new NotFoundException('Action not found')
  }

  const action = result.rows[0] as ChatAction

  // 3. Verificar se ja foi confirmada
  if (action.confirmed_at) {
    throw new ConflictException('Action already confirmed')
  }

  // 4. Marcar como confirmada
  await sql`
    UPDATE chat_actions
    SET confirmed_at = NOW()
    WHERE id = ${actionId}
  `

  // 5. Executar conforme tipo
  if (action.action_type === 'suggest_cards') {
    const embedding = await this.llm.embed(action.payload.input)
    const relevantProducts = await this.findRelevantProducts(embedding)
    console.log('Relevant products:', relevantProducts.rows)
    // Proxima etapa: enviar para AI montar carrinhos
  } else {
    throw new InternalServerError('Unsupported action type')
  }
}
```

## Query de produtos relevantes com cosine similarity

```typescript
async findRelevantProducts(embedding: number[]) {
  const vectorStr = JSON.stringify(embedding)

  const result = await sql`
    SELECT
      p.store_id,
      p.id,
      p.name,
      p.price,
      p.embedding <=> ${vectorStr} AS similarity
    FROM products p
    WHERE p.embedding <=> ${vectorStr} < 0.65
    ORDER BY similarity ASC
  `

  // Agrupar por loja
  const grouped: Record<string, any[]> = {}
  for (const row of result.rows) {
    if (!grouped[row.store_id]) {
      grouped[row.store_id] = []
    }
    grouped[row.store_id].push(row)
  }

  return grouped
}
```

## Controller — rota de confirmacao

```typescript
// POST /actions/:id/confirm
app.post('/actions/:id/confirm', async (req, res) => {
  const { id } = req.params
  const sessionId = req.headers['x-session-id'] as string

  await service.confirmAction(sessionId, id)

  return res.status(201).send()
})
```

## Teste — confirmando acao e verificando carrinho

```typescript
// Apos saber que ja tem uma action salva (etapa anterior)
const confirmResponse = await request(app)
  .post(`/actions/${actionId}/confirm`)
  .set('x-session-id', sessionId)

expect(confirmResponse.status).toBe(201)

// Verificar que carrinho foi gerado como nova mensagem
const afterConfirmResponse = await request(app)
  .get(`/chat/${sessionId}`)
  .set('x-session-id', sessionId)

expect(afterConfirmResponse.body.messages).toHaveLength(3)
// 1: mensagem do usuario
// 2: resposta do assistente com action
// 3: mensagem do assistente com carrinho gerado

const lastMessage = afterConfirmResponse.body.messages[2]
expect(lastMessage.sender).toBe('assistant')
```

## Operadores pgvector — referencia rapida

```sql
-- Cosine distance (usado nesta aula)
-- Mede direcao do vetor. Mais perto de 0 = mais similar
SELECT embedding <=> '[0.1, 0.2, ...]' AS cosine_dist FROM products;

-- L2 distance (euclidiana)
SELECT embedding <-> '[0.1, 0.2, ...]' AS l2_dist FROM products;

-- Inner product
SELECT embedding <#> '[0.1, 0.2, ...]' AS inner_prod FROM products;
```