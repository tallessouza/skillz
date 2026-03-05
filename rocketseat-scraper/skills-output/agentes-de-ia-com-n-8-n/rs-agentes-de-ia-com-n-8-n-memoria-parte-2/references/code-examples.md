# Code Examples: Memoria com Redis em Agentes N8n

## Exemplo 1: Fluxo completo do agente com memoria

### Estrutura do workflow N8n

```
[Chat Trigger] → [AI Agent] → [Response]
                     │
                     ├── [OpenAI Chat Model]
                     └── [Window Buffer Memory]
                              └── [Redis Credentials]
```

### Configuracao do Chat Trigger

O trigger fornece o `sessionId` automaticamente. Cada usuario/conversa recebe um ID unico.

```json
{
  "sessionId": "abc123-unique-session",
  "input": "Oi, eu sou o Bruno"
}
```

### Configuracao do Window Buffer Memory

```yaml
Node: Window Buffer Memory
Parameters:
  Session Key Type: "Automatically (from previous node)"  # pega sessionId do trigger
  Context Window Length: 5  # ultimas 5 mensagens
  
Credentials: Redis
  Host: "redis-internal-host"  # host interno da sua instancia
  Port: 6379
  Session Time To Live: 604800000  # 1 semana em milissegundos
```

### Alternativa: Session ID manual

```yaml
Session Key Type: "Define below"
Session Key: "custom-session-name"
```

## Exemplo 2: Conversa demonstrando memoria funcionando

### Sequencia de mensagens

```
Usuario: "Oi"
IA: "Ola! Como posso te ajudar hoje?"

Usuario: "Eu sou o Bruno"
IA: "Ola, Bruno! Prazer em te conhecer."

Usuario: "Qual e a capital do Japao?"
IA: "A capital do Japao e Toquio."

Usuario: "Qual e o meu nome?"
IA: "Seu nome e Bruno."  ← MEMORIA FUNCIONANDO
```

### O que o Redis armazena neste ponto

```json
{
  "key": "abc123-unique-session",
  "ttl": 604800000,
  "messages": [
    { "role": "human", "content": "Oi" },
    { "role": "ai", "content": "Ola! Como posso te ajudar hoje?" },
    { "role": "human", "content": "Eu sou o Bruno" },
    { "role": "ai", "content": "Ola, Bruno! Prazer em te conhecer." },
    { "role": "human", "content": "Qual e a capital do Japao?" },
    { "role": "ai", "content": "A capital do Japao e Toquio." },
    { "role": "human", "content": "Qual e o meu nome?" },
    { "role": "ai", "content": "Seu nome e Bruno." }
  ]
}
```

## Exemplo 3: Prompt final enviado a OpenAI

Quando o usuario pergunta "Qual e o meu nome?", o N8n monta:

```json
{
  "messages": [
    {
      "role": "system",
      "content": "Voce e o assistente..."
    },
    {
      "role": "system",
      "content": "[Format Instructions - interno N8n]"
    },
    {
      "role": "user",
      "content": "Oi"
    },
    {
      "role": "assistant",
      "content": "Ola! Como posso te ajudar hoje?"
    },
    {
      "role": "user",
      "content": "Eu sou o Bruno"
    },
    {
      "role": "assistant",
      "content": "Ola, Bruno! Prazer em te conhecer."
    },
    {
      "role": "user",
      "content": "Qual e a capital do Japao?"
    },
    {
      "role": "assistant",
      "content": "A capital do Japao e Toquio."
    },
    {
      "role": "user",
      "content": "Qual e o meu nome?"
    }
  ]
}
```

A OpenAI ve todo o historico e responde "Seu nome e Bruno" porque o nome esta no contexto.

## Exemplo 4: Calculos de TTL para diferentes casos de uso

```javascript
// Atendimento ao cliente (conversa curta)
const ttl1hora = 1000 * 60 * 60           // 3.600.000 ms

// Suporte tecnico (pode durar dias)
const ttl3dias = 1000 * 60 * 60 * 24 * 3  // 259.200.000 ms

// Assistente pessoal (lembrar por semana)
const ttl1semana = 1000 * 60 * 60 * 24 * 7 // 604.800.000 ms

// Onboarding (processo de 30 dias)
const ttl30dias = 1000 * 60 * 60 * 24 * 30 // 2.592.000.000 ms
// CUIDADO: TTL longo = mais consumo de memoria
```

## Exemplo 5: Comparacao Simple Memory vs Redis

```yaml
# ERRADO - Simple Memory (so para testes)
AI Agent:
  Memory: Simple Memory
  # Sem TTL
  # Sem isolamento de sessoes
  # Memoria perdida no restart
  # Servidor vai sobrecarregar

# CORRETO - Redis (producao)
AI Agent:
  Memory: Window Buffer Memory
    Credentials: Redis
    TTL: 604800000
    Context Window: 5
  # TTL auto-limpa tabelas
  # Sessoes isoladas por ID
  # Persistente entre restarts
  # Escalavel independentemente
```