---
name: rs-agentes-ia-n8n-memoria-parte-2
description: "Applies Redis memory configuration patterns when building N8n AI agents with conversation history. Use when user asks to 'add memory to agent', 'configure Redis in N8n', 'manage conversation history', 'session memory for chatbot', or 'prevent server overload from chat history'. Covers session ID mapping, TTL management, context window sizing, and how memory becomes part of the prompt. Make sure to use this skill whenever configuring memory for N8n AI agents or discussing Redis as conversation store. Not for general Redis caching, database design, or non-N8n chatbot architectures."
---

# Memoria com Redis em Agentes N8n

> Memoria de agente de IA e historico de conversa agregado ao prompt — configure Redis com TTL e janela de contexto para producao.

## Rules

1. **Use Redis, nunca Simple Memory em producao** — Simple Memory e interno do N8n e nao preparado para producao, porque nao tem gestao de TTL nem escalabilidade
2. **Associe tabelas a session IDs** — cada conversa cria uma tabela no Redis nomeada pelo sessionId do trigger, porque isso isola historicos entre usuarios
3. **Configure TTL (time to live) sempre** — sem TTL a tabela cresce infinitamente ate derrubar o servidor, consumindo memoria e disco ate o N8n parar
4. **Limite a janela de contexto** — use as ultimas N mensagens (padrao 5) como contexto enviado a OpenAI, porque mensagens antigas perdem relevancia e aumentam custo de tokens
5. **Entenda que memoria e prompt** — historico do Redis e concatenado ao system message + input do usuario formando o "promptzao" enviado a OpenAI

## Como funciona

### Estrutura do prompt final enviado a OpenAI

```
[System Message]       ← prompt do agente configurado no bloco
[Format Instructions]  ← prompt interno do N8n (automatico)
[Historico Redis]      ← ultimas N mensagens (humano/IA alternadas)
[Input do Usuario]     ← mensagem atual
```

Tudo isso junto forma o "promptzao" que a OpenAI recebe.

### Configuracao do Redis no N8n

```
AI Agent Node
  └── Memory: Window Buffer Memory
        ├── Session Key Type: "From previous node" (automatico via sessionId)
        ├── Context Window Length: 5 (ultimas mensagens)
        └── Credentials: Redis
              ├── Host: host interno do Redis
              ├── Port: 6379
              └── Session Time To Live: 604800000 (1 semana em ms)
```

### Calculo de TTL

```
1 semana  = 604800000 ms
3 dias    = 259200000 ms
1 dia     = 86400000 ms
1 hora    = 3600000 ms
```

## Example

**Before (Simple Memory — nunca usar em producao):**
```
AI Agent → Simple Memory (interno N8n)
- Sem TTL
- Sem gestao de sessoes
- Servidor vai sobrecarregar
```

**After (Redis com TTL e janela):**
```
AI Agent → Window Buffer Memory → Redis
- TTL: 604800000 ms (1 semana)
- Context Window: 5 mensagens
- Session ID: automatico do trigger
- Tabela auto-destruida apos TTL
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Agente em producao | Sempre Redis, nunca Simple Memory |
| Muitos usuarios simultaneos | Cada sessionId cria tabela isolada |
| Servidor ficando lento | Reduza TTL ou janela de contexto |
| Usuario quer lembrar conversa de dias atras | Aumente TTL (mas monitore consumo) |
| Custo de tokens alto | Reduza janela de contexto de 5 para 3 |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Simple Memory em producao | Redis com TTL configurado |
| TTL sem limite (infinito) | TTL de 1-7 dias conforme caso de uso |
| Enviar historico inteiro a OpenAI | Janela de contexto com ultimas N mensagens |
| Session ID manual hardcoded | Session ID dinamico do trigger |
| Ignorar consumo de memoria | Monitorar e ajustar TTL regularmente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
