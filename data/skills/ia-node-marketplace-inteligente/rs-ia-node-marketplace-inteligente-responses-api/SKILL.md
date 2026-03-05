---
name: rs-ia-node-marketplace-responses-api
description: "Applies OpenAI Responses API patterns when writing Node.js code that interacts with OpenAI. Use when user asks to 'call OpenAI', 'generate response', 'create chat', 'use GPT', 'parse structured output', or any OpenAI integration task. Enforces client.responses.create over ChatCompletions, stateful conversations via previous_response_id, outputText access, and Zod-based parseResponse for structured output. Make sure to use this skill whenever generating OpenAI API calls in Node.js/TypeScript. Not for Python OpenAI SDK, Anthropic/Claude API, or non-OpenAI LLM integrations."
---

# OpenAI Responses API

> Usar `client.responses.create` como padrao para chamadas OpenAI, reservando ChatCompletions apenas para casos legados simples.

## Rules

1. **Use Responses API por padrao** — `client.responses.create` nao `client.chat.completions.create`, porque a Responses API e a recomendacao atual da OpenAI e oferece melhor integracao com tools, reasoning e estado
2. **Acesse outputText diretamente** — `response.outputText` nao `response.choices[0].message.content`, porque a Responses API ja condensa a resposta automaticamente
3. **Use parseResponse para output estruturado** — `client.responses.parse` com Zod schema nao parse manual de JSON, porque garante tipagem e validacao automatica
4. **Passe instructions separado do input** — `instructions` para system prompt e `input` para mensagem do usuario, porque separa contexto do desenvolvedor da entrada do usuario
5. **Aproveite stateful conversations** — passe `previous_response_id` para manter historico, nao monte array de mensagens manualmente, porque a API gerencia estado internamente
6. **Receba params tipados** — use `ResponseCreateParams` do SDK para tipar parametros da funcao wrapper, porque garante autocomplete e validacao em tempo de compilacao

## How to write

### Chamada basica

```typescript
import OpenAI from "openai";

const client = new OpenAI();

async function generateResponse(params: OpenAI.ResponseCreateParams) {
  const response = await client.responses.create(params);
  return response.outputText ?? null;
}
```

### Output estruturado com Zod

```typescript
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const CartSchema = z.object({
  products: z.array(z.object({
    name: z.string(),
    quantity: z.number(),
  })),
});

async function generateCart(input: string, availableProducts: string[]) {
  const response = await client.responses.parse({
    model: "gpt-4.1-nano",
    instructions: `Retorne uma lista de ate cinco produtos que satisfacam a necessidade do usuario. Produtos disponiveis: ${JSON.stringify(availableProducts)}`,
    input,
    text: {
      format: zodTextFormat(CartSchema, "cart"),
    },
  });

  return response.outputParsed;
}
```

### Conversa stateful

```typescript
// Primeira mensagem
const first = await client.responses.create({
  model: "gpt-4.1-nano",
  input: "Quero fazer feijoada",
  instructions: "Voce e um assistente de compras.",
});

// Proxima mensagem com historico automatico
const second = await client.responses.create({
  model: "gpt-4.1-nano",
  input: "Adicione arroz tambem",
  previous_response_id: first.id,
});
```

## Example

**Before (ChatCompletions — legado):**
```typescript
const completion = await client.chat.completions.create({
  model: "gpt-4.1-nano",
  messages: [
    { role: "system", content: "Voce e um assistente de compras." },
    { role: "user", content: "Quero fazer feijoada" },
  ],
});
const text = completion.choices[0].message.content;
// Para structured output: JSON.parse manual, sem validacao
```

**After (Responses API):**
```typescript
const response = await client.responses.create({
  model: "gpt-4.1-nano",
  instructions: "Voce e um assistente de compras.",
  input: "Quero fazer feijoada",
});
const text = response.outputText;
// Para structured output: client.responses.parse com Zod
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Nova integracao OpenAI | Usar Responses API |
| Projeto legado com ChatCompletions funcionando | Manter ChatCompletions, nao migrar sem necessidade |
| Precisa de output JSON tipado | `client.responses.parse` + `zodTextFormat` |
| Chatbot com historico | `previous_response_id` em vez de array de messages |
| Precisa de web search, file search, function calling | Responses API — melhor integrada com tools |
| Caso simples, sem tools, sem estado | Ambas funcionam, preferir Responses API |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `client.chat.completions.create` (novo projeto) | `client.responses.create` |
| `response.choices[0].message.content` | `response.outputText` |
| `JSON.parse(response.outputText)` para structured output | `client.responses.parse` + Zod schema |
| Array manual de messages para historico | `previous_response_id: response.id` |
| System message no array de messages | `instructions` como parametro separado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
