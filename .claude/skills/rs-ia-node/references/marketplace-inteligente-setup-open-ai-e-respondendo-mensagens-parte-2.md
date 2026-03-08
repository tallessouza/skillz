---
name: rs-ia-node-marketplace-setup-openai-msg-pt2
description: "Applies chat message flow with LLM action detection and persistence pattern when building Node.js AI chat features. Use when user asks to 'handle chat messages', 'save LLM actions', 'link actions to messages', 'build AI cart', or 'integrate OpenAI responses with database'. Covers message history passing, action extraction from LLM output, action persistence with JSON payload, and left join retrieval. Make sure to use this skill whenever implementing chat-to-action pipelines with OpenAI. Not for frontend rendering, payment processing, or embedding/vector search."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: chat
  tags: [node-js, function-calling, responses-api, openai, ia-node]
---

# Chat Message Flow com Detecção e Persistência de Ações

> Ao implementar um fluxo de chat com LLM, sempre recupere o histórico de mensagens antes de enviar ao modelo, extraia ações estruturadas da resposta, persista-as vinculadas à mensagem do assistente, e retorne tudo junto na leitura.

## Rules

1. **Passe o histórico de mensagens ao LLM** — use `previous_response_id` da última mensagem do assistente na sessão, porque o LLM precisa de contexto completo para identificar ações corretamente
2. **Vincule ações à mensagem do assistente, não do usuário** — a ação é gerada pelo LLM, então o `chat_message_id` na tabela de actions aponta para a mensagem do assistente
3. **Armazene payloads como JSON stringificado** — use `JSON.stringify(payload)` no campo payload da action, porque diferentes tipos de ação têm schemas diferentes e isso evita tipagem forte no banco
4. **Use conflict do nothing ao inserir ações** — `ON CONFLICT (chat_message_id, action_type) DO NOTHING` previne duplicatas em retentativas
5. **Use LEFT JOIN para ler mensagens com ações** — nem toda mensagem tem ação, então LEFT JOIN garante que mensagens sem ação ainda apareçam
6. **Monte o objeto action dentro da mensagem com CASE WHEN** — retorne `null` quando não há ação vinculada, evitando objetos vazios no response

## How to write

### Recuperar histórico de mensagens

```typescript
const chatMessages = await this.postgresService.query(
  `SELECT openai_message_id FROM chat_messages
   WHERE session_id = $1 AND sender = 'assistant'
   ORDER BY created_at DESC LIMIT 1`,
  [sessionId]
);

const previousResponseId = chatMessages.rows[0]?.openai_message_id ?? null;
```

### Chamar LLM com histórico

```typescript
const response = await openai.responses.create({
  model: "gpt-4o",
  input: userMessage,
  previous_response_id: previousResponseId,
  // OpenAI aceita null sem erro — testado
});
```

### Salvar ação vinculada à mensagem do assistente

```typescript
if (response.action?.type === "suggest_cart") {
  await this.postgresService.query(
    `INSERT INTO chat_messages_actions (chat_message_id, action_type, payload)
     VALUES ($1, $2, $3)
     ON CONFLICT (chat_message_id, action_type) DO NOTHING`,
    [llmMessage.id, response.action.type, JSON.stringify(response.action.payload)]
  );
}
```

### Ler mensagens com ações (LEFT JOIN + CASE WHEN)

```typescript
const sections = await this.postgresService.query(
  `SELECT s.id, json_agg(json_build_object(
    'id', m.id,
    'content', m.content,
    'action', CASE WHEN a.id IS NOT NULL THEN json_build_object(
      'type', a.action_type,
      'payload', a.payload,
      'created_at', a.created_at,
      'confirmed_at', a.confirmed_at,
      'executed_at', a.executed_at
    ) ELSE NULL END
  )) as messages
  FROM chat_sections s
  JOIN chat_messages m ON m.section_id = s.id
  LEFT JOIN chat_messages_actions a ON a.chat_message_id = m.id
  WHERE s.session_id = $1
  GROUP BY s.id`
);
```

## Example

**Before (sem histórico nem ações):**
```typescript
const response = await openai.responses.create({
  model: "gpt-4o",
  input: userMessage,
});
await saveMessage(response.output_text);
// Ação perdida, sem contexto de conversa
```

**After (com histórico e persistência de ações):**
```typescript
const prev = await getLastAssistantMessage(sessionId);
const response = await openai.responses.create({
  model: "gpt-4o",
  input: userMessage,
  previous_response_id: prev?.openai_message_id ?? null,
});
const llmMsg = await saveAssistantMessage(response);
if (response.action?.type === "suggest_cart") {
  await saveAction(llmMsg.id, response.action);
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Primeira mensagem do chat | `previous_response_id` será `null` — OpenAI aceita sem erro |
| Ação retornada pelo LLM | Salve vinculada à mensagem do **assistente** |
| Payload com estrutura variável | `JSON.stringify()` no campo payload |
| Leitura de seção com mensagens | LEFT JOIN em actions, CASE WHEN para montar objeto |
| Teste automatizado | Verifique que mensagem do assistente tem `action` property |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Enviar só mensagem atual sem histórico | Buscar `previous_response_id` da última msg assistant |
| Vincular ação à mensagem do usuário | Vincular ao `id` da mensagem do assistente |
| Criar colunas tipadas por tipo de ação | Campo `payload` JSON genérico |
| INNER JOIN mensagens com ações | LEFT JOIN — nem toda mensagem tem ação |
| Ignorar output_parsed e logar response inteiro | Logar `output_parsed` quando disponível, response completo só como fallback |

## Troubleshooting

### Resposta da API retorna null ou undefined
**Symptom:** `completion.choices[0].message.content` retorna null
**Cause:** O modelo retornou tool_calls em vez de content, ou max_tokens insuficiente
**Fix:** Verifique `message.tool_calls` antes de acessar content. Aumente max_completion_tokens se a resposta foi cortada

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
