---
name: rs-ia-node-marketplace-msg-chat-pt2
description: "Applies SQL aggregation patterns with JSON aggregate and left joins when building chat message retrieval endpoints in Node.js. Use when user asks to 'fetch chat messages', 'aggregate related data in SQL', 'join messages with actions', 'return nested JSON from database', or 'build chat session query'. Ensures proper grouping, null filtering, and message_actions table design. Make sure to use this skill whenever building chat/message retrieval with related data aggregation. Not for frontend chat UI, WebSocket setup, or LLM prompt engineering."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: chat
  tags: [ia-node, node-js, chat]
---

# Agregacao de Mensagens no Chat com JSON Aggregate

> Ao buscar sessoes de chat com mensagens relacionadas, use left join com JSON aggregate para retornar um array de objetos aninhado em uma unica linha por sessao.

## Rules

1. **Use left join para mensagens** — `left join messages on sessions.id = messages.session_id`, porque inner join excluiria sessoes sem mensagens ainda
2. **Agrupe pela sessao** — `group by sessions.id`, porque sem agrupamento o banco cria uma linha por mensagem ao inves de uma linha por sessao com array de mensagens
3. **Use json_agg + json_build_object** — combine ambos para criar um array JSON onde cada item e um objeto com chaves nomeadas, porque json_agg sozinho retorna arrays de valores sem nome
4. **Filtre nulls na agregacao** — adicione `filter (where messages.id is not null)` no json_agg, porque sem isso sessoes sem mensagens retornam `[null]` ao inves de `[]`
5. **Desambigue colunas com alias** — prefixe `sessions.id`, `messages.id` explicitamente, porque colunas como `id` existem em ambas tabelas e causam erro de referencia ambigua
6. **Tabela de acoes vinculada a mensagem** — crie `message_actions` com constraint unique(message_id, type), porque evita acoes duplicadas por mensagem

## How to write

### Query de sessao com mensagens agregadas

```sql
select
  chat_sessions.*,
  coalesce(
    json_agg(
      json_build_object(
        'id', messages.id,
        'content', messages.content,
        'sender', messages.sender,
        'message_type', messages.message_type,
        'created_at', messages.created_at
      )
    ) filter (where messages.id is not null),
    '[]'::json
  ) as messages
from chat_sessions
left join messages on messages.session_id = chat_sessions.id
where chat_sessions.id = $1
group by chat_sessions.id;
```

### Tabela message_actions

```sql
create table message_actions (
  id text primary key,
  message_id text references messages(id),
  type text not null,
  payload jsonb,
  created_at timestamp default now(),
  confirmed_at timestamp,
  executed_at timestamp,
  constraint unique_message_action unique(message_id, type)
);
```

## Example

**Before (retorna linha por mensagem, null esquisito):**
```typescript
const session = await db.query(`
  select sessions.*, messages.*
  from sessions
  left join messages on messages.session_id = sessions.id
  where sessions.id = $1
`, [sessionId])
// Resultado: N linhas, ou campos null espalhados
```

**After (uma linha, array limpo):**
```typescript
const session = await db.query(`
  select
    chat_sessions.*,
    coalesce(
      json_agg(
        json_build_object(
          'id', messages.id,
          'content', messages.content,
          'sender', messages.sender
        )
      ) filter (where messages.id is not null),
      '[]'::json
    ) as messages
  from chat_sessions
  left join messages on messages.session_id = chat_sessions.id
  where chat_sessions.id = $1
  group by chat_sessions.id
`, [sessionId])
// Resultado: 1 linha com messages: [{id, content, sender}, ...]
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Sessao pode nao ter mensagens | Use `filter (where id is not null)` + `coalesce(..., '[]')` |
| Coluna `id` ambigua no join | Prefixe com nome da tabela: `chat_sessions.id` |
| Acao vinculada a mensagem | Crie tabela separada com FK + unique constraint |
| Payload da acao e variavel | Use `jsonb` para flexibilidade |
| Precisa testar mensagens do assistant | Verifique `messages[1].sender === 'assistant'` apos envio |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| `select *` com join sem group by | `select sessions.*, json_agg(...) group by sessions.id` |
| `json_agg(messages.*)` | `json_agg(json_build_object('key', value, ...))` |
| `json_agg(...)` sem filter | `json_agg(...) filter (where messages.id is not null)` |
| `inner join messages` para buscar sessao | `left join messages` (sessao pode existir sem msgs) |
| Acao como coluna na mensagem | Tabela `message_actions` separada com tipos extensiveis |

## Troubleshooting

### Resultado inesperado do modelo
**Symptom:** Resposta da IA nao corresponde ao formato ou conteudo esperado
**Cause:** Prompt insuficiente, parametros mal configurados, ou modelo sem contexto adequado
**Fix:** Revise o prompt com exemplos concretos (few-shot), ajuste temperature, e verifique se os dados necessarios foram fornecidos ao modelo

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
