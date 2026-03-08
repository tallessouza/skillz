---
name: rs-ia-node-structured-outputs
description: "Applies OpenAI Structured Outputs pattern with Zod schema validation when generating typed JSON responses from LLMs. Use when user asks to 'parse AI response', 'get structured data from GPT', 'validate LLM output', 'use zod with openai', or 'structured outputs'. Ensures correct use of beta parse API, Zod schemas, refusal handling, and token limit errors. Make sure to use this skill whenever integrating OpenAI responses with typed schemas. Not for general Zod validation, non-OpenAI LLMs, or basic JSON mode."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: structured-outputs
  tags: [zod, node-js, function-calling, openai, ia-node, structured-outputs]
---

# Structured Outputs com OpenAI e Zod

> Usar Structured Outputs garante que a resposta da OpenAI seja JSON valido E aderente ao schema Zod definido — diferente do JSON Mode basico que so garante JSON valido.

## Rules

1. **Use `client.beta.chat.completions.parse()`** — nao `client.chat.completions.create()`, porque apenas o parse endpoint suporta validacao de schema via Zod
2. **Importe `zodResponseFormat` de `openai/helpers/zod`** — esse helper converte o schema Zod para o formato que a API espera
3. **Acesse `.message.parsed` em vez de `.message.content`** — o parsed ja retorna o objeto tipado e validado, content retorna string bruta
4. **Defina o schema Zod separadamente** — manter o schema fora da chamada melhora legibilidade e reuso
5. **Trate refusal (`message.refusal`)** — o modelo pode se recusar a responder quando nao tem contexto suficiente ou nao pode inventar dados
6. **Trate erro de token limit** — se `max_tokens` for insuficiente para o JSON completo, o parse falha com erro de tamanho

## How to write

### Setup basico

```typescript
import { zodResponseFormat } from "openai/helpers/zod"
import { z } from "zod"

const productSchema = z.object({
  products: z.array(z.string()),
})

const completion = await client.beta.chat.completions.parse({
  model: "gpt-4o",
  messages: [{ role: "user", content: prompt }],
  response_format: zodResponseFormat(productSchema, "products-schema"),
})

const result = completion.choices[0].message.parsed
// result é tipado: { products: string[] }
```

### Error handling completo

```typescript
try {
  const completion = await client.beta.chat.completions.parse({
    model: "gpt-4o",
    messages,
    response_format: zodResponseFormat(schema, "schema-name"),
  })

  if (completion.choices[0].message.refusal) {
    // Modelo se recusou a responder
    return res.status(422).json({ error: completion.choices[0].message.refusal })
  }

  const data = completion.choices[0].message.parsed
  return res.json(data)
} catch (error) {
  console.error(error)
  return res.status(500).json({ error: "Internal server error" })
}
```

## Example

**Before (JSON Mode basico — sem garantia de estrutura):**
```typescript
const completion = await client.chat.completions.create({
  model: "gpt-4o",
  messages,
  response_format: { type: "json_object" },
})
const data = JSON.parse(completion.choices[0].message.content) // sem tipagem, pode quebrar
```

**After (Structured Outputs — schema validado e tipado):**
```typescript
const schema = z.object({
  products: z.array(z.object({
    name: z.string(),
    price: z.number(),
  })),
})

const completion = await client.beta.chat.completions.parse({
  model: "gpt-4o",
  messages,
  response_format: zodResponseFormat(schema, "products-schema"),
})

const data = completion.choices[0].message.parsed // tipado: { products: { name: string, price: number }[] }
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de JSON tipado da OpenAI | Use Structured Outputs com Zod |
| So precisa de JSON valido sem schema | JSON Mode basico basta |
| Modelo pode nao ter dados suficientes | Verifique `message.refusal` antes de acessar parsed |
| Resposta pode ser grande | Aumente `max_tokens` para caber o JSON completo |
| Schema sera reutilizado | Declare o Zod schema em arquivo separado |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `JSON.parse(message.content)` com Structured Outputs | `message.parsed` (ja parseado e tipado) |
| `client.chat.completions.create()` com zodResponseFormat | `client.beta.chat.completions.parse()` |
| Schema inline na chamada da API | Schema declarado separadamente e referenciado |
| Ignorar refusal e acessar parsed direto | Checar `message.refusal` antes |
| `max_tokens: 1` com schema complexo | Tokens suficientes para o JSON completo |

## Troubleshooting

### Resposta da API retorna null ou undefined
**Symptom:** `completion.choices[0].message.content` retorna null
**Cause:** O modelo retornou tool_calls em vez de content, ou max_tokens insuficiente
**Fix:** Verifique `message.tool_calls` antes de acessar content. Aumente max_completion_tokens se a resposta foi cortada

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
