# Code Examples: Chat Message Flow com Ações

## 1. Buscar última mensagem do assistente para histórico

```typescript
// No serviço de mensagens, antes de chamar o LLM
const chatMessages = await this.postgresService.query(
  `SELECT openai_message_id
   FROM chat_messages
   WHERE session_id = $1 AND sender = 'assistant'
   ORDER BY created_at DESC
   LIMIT 1`,
  [sessionId]
);

// Acessa de forma segura — pode não existir mensagem anterior
const previousResponseId = chatMessages.rows[0]?.openai_message_id ?? null;
```

## 2. Chamada ao LLM com previous_response_id

```typescript
const response = await this.openai.responses.create({
  model: "gpt-4o",
  input: message,
  previous_response_id: previousResponseId, // null é aceito pela API
});

// Log melhorado: mostrar output_parsed quando disponível
if (response.output_parsed) {
  console.log("Output parsed:", response.output_parsed);
} else {
  console.log("Full response:", response);
}
```

## 3. Salvar mensagem do assistente e ação

```typescript
// Salva mensagem do assistente
const llmMessage = await this.postgresService.query(
  `INSERT INTO chat_messages (session_id, section_id, sender, content, openai_message_id)
   VALUES ($1, $2, 'assistant', $3, $4)
   RETURNING id`,
  [sessionId, sectionId, response.output_text, response.id]
);

// Verifica se há ação para salvar
if (response.action?.type === "suggest_cart") {
  await this.postgresService.query(
    `INSERT INTO chat_messages_actions (chat_message_id, action_type, payload)
     VALUES ($1, $2, $3)
     ON CONFLICT (chat_message_id, action_type) DO NOTHING`,
    [
      llmMessage.rows[0].id,
      response.action.type,
      JSON.stringify(response.action.payload),
    ]
  );
}
```

## 4. Query completa de leitura com LEFT JOIN

```typescript
const result = await this.postgresService.query(
  `SELECT
    s.id as section_id,
    json_agg(
      json_build_object(
        'id', m.id,
        'content', m.content,
        'sender', m.sender,
        'action', CASE
          WHEN a.id IS NOT NULL THEN json_build_object(
            'type', a.action_type,
            'payload', a.payload,
            'created_at', a.created_at,
            'confirmed_at', a.confirmed_at,
            'executed_at', a.executed_at
          )
          ELSE NULL
        END
      ) ORDER BY m.created_at
    ) as messages
  FROM chat_sections s
  JOIN chat_messages m ON m.section_id = s.id
  LEFT JOIN chat_messages_actions a ON a.chat_message_id = m.id
  WHERE s.session_id = $1
  GROUP BY s.id
  ORDER BY s.created_at`,
  [sessionId]
);
```

## 5. Schema das tabelas envolvidas

```sql
-- Tabela de ações vinculadas a mensagens
CREATE TABLE chat_messages_actions (
  id SERIAL PRIMARY KEY,
  chat_message_id INTEGER REFERENCES chat_messages(id) NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  payload JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  confirmed_at TIMESTAMP,
  executed_at TIMESTAMP,
  UNIQUE(chat_message_id, action_type)
);
```

## 6. Teste: mensagem simples vs mensagem com ação

```typescript
// Teste 1: mensagem simples (só texto)
it("should return text response for greeting", async () => {
  const response = await service.sendMessage(sessionId, "Olá");
  expect(response.content).toBeDefined();
  expect(response).not.toHaveProperty("action");
});

// Teste 2: mensagem que gera ação
it("should return action for cart request", async () => {
  const response = await service.sendMessage(
    sessionId,
    "Quero preparar um bolo de chocolate"
  );
  expect(response.content).toBeDefined();
  expect(response).toHaveProperty("action");
  expect(response.action.type).toBe("suggest_cart");
});
```

## 7. Exemplo de resposta do LLM com ação identificada

```json
{
  "output_text": "Você solicitou preparar um bolo de chocolate. Posso confirmar para montar o carrinho de compras?",
  "action": {
    "type": "suggest_cart",
    "input": "ingredientes do bolo de chocolate: farinha, açúcar, chocolate em pó, ovos, manteiga, leite, fermento"
  }
}
```