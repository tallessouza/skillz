# Code Examples: Agregacao de Mensagens no Chat

## Schema completo da tabela message_actions

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

## Query completa do getSession com mensagens

```sql
select
  chat_sessions.id,
  chat_sessions.cart_id,
  chat_sessions.created_at,
  coalesce(
    json_agg(
      json_build_object(
        'id', messages.id,
        'content', messages.content,
        'sender', messages.sender,
        'pni', messages.pni,
        'created_at', messages.created_at,
        'message_type', messages.message_type
      )
    ) filter (where messages.id is not null),
    '[]'::json
  ) as messages
from chat_sessions
left join messages on messages.session_id = chat_sessions.id
where chat_sessions.id = $1
group by chat_sessions.id;
```

## Teste verificando mensagens no chat

```typescript
// Apos enviar mensagem "hello world"
const session = await getSession(sessionId)

// Verifica que existem mensagens
expect(session.messages).toHaveLength(2)

// Primeira mensagem: enviada pelo usuario
expect(session.messages[0]).toHaveProperty('sender', 'user')
expect(session.messages[0]).toHaveProperty('content', 'hello world')

// Segunda mensagem: resposta do assistant
expect(session.messages[1]).toHaveProperty('sender', 'assistant')
```

## Variacao: agregando tambem as actions de cada mensagem

```sql
select
  chat_sessions.*,
  coalesce(
    json_agg(
      json_build_object(
        'id', messages.id,
        'content', messages.content,
        'sender', messages.sender,
        'actions', (
          select coalesce(
            json_agg(
              json_build_object(
                'type', ma.type,
                'payload', ma.payload,
                'confirmed_at', ma.confirmed_at,
                'executed_at', ma.executed_at
              )
            ) filter (where ma.id is not null),
            '[]'::json
          )
          from message_actions ma
          where ma.message_id = messages.id
        )
      )
    ) filter (where messages.id is not null),
    '[]'::json
  ) as messages
from chat_sessions
left join messages on messages.session_id = chat_sessions.id
where chat_sessions.id = $1
group by chat_sessions.id;
```

## Drop table na ordem correta (respeitando FKs)

```sql
-- Ordem correta: tabelas dependentes primeiro
drop table if exists message_actions;
drop table if exists messages;
drop table if exists chat_sessions;
drop table if exists carts;
```