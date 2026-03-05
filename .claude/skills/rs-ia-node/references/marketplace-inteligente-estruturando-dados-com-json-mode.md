---
name: rs-ia-node-marketplace-json-mode
description: "Enforces correct OpenAI JSON Mode usage with Zod validation when building AI-powered APIs in Node.js. Use when user asks to 'parse AI response', 'get structured data from OpenAI', 'validate LLM output', 'use JSON mode', or 'structured output from GPT'. Applies rules: always set response_format, always include 'JSON' in prompt, always validate with Zod, handle parse errors. Make sure to use this skill whenever integrating OpenAI responses into typed backends. Not for Structured Outputs (response_format type json_schema), prompt engineering, or frontend rendering."
---

# Estruturando Dados com JSON Mode

> Ao usar JSON Mode da OpenAI, sempre valide a estrutura da resposta com Zod, porque JSON Mode garante JSON valido mas NAO garante o formato solicitado.

## Rules

1. **Sempre configure `response_format: { type: "json_object" }`** — sem isso a API retorna texto livre, porque JSON Mode e opt-in explicito
2. **Sempre inclua a palavra "JSON" no prompt** — a API da OpenAI retorna erro se o prompt nao contem "JSON", porque e uma validacao obrigatoria deles
3. **Sempre faca `JSON.parse` do `content`** — o retorno e string mesmo com JSON Mode, porque `message.content` e sempre string
4. **Sempre valide com Zod apos o parse** — JSON Mode garante JSON valido mas nao garante a estrutura pedida, porque em contextos complexos campos podem ser omitidos ou renomeados
5. **Trate o caso de `content` nulo** — `message.content` pode ser `null`, porque a API pode retornar nulo em edge cases
6. **Retorne 500 (nao 400) quando a estrutura falhar** — o erro e do servidor (IA retornou formato errado), nao do cliente

## How to write

### Configuracao do JSON Mode

```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: "Liste produtos em JSON..." }],
  response_format: { type: "json_object" },
})
```

### Parse + Validacao com Zod

```typescript
import { z } from "zod"

const schema = z.object({
  produtos: z.array(z.string()),
})

const output = JSON.parse(completion.choices[0].message.content ?? "")
const result = schema.safeParse(output)

if (!result.success) {
  return res.status(500).json({ error: "Estrutura inesperada da IA" })
}

// result.data esta tipado e validado
return res.json(result.data)
```

## Example

**Before (sem validacao — bug silencioso):**

```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: "Liste produtos" }], // falta "JSON" no prompt
  // falta response_format
})

const data = JSON.parse(completion.choices[0].message.content) // pode ser null
return res.json(data) // estrutura desconhecida, sem tipo
```

**After (com this skill applied):**

```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: "Liste produtos em formato JSON com array de nomes" }],
  response_format: { type: "json_object" },
})

const output = JSON.parse(completion.choices[0].message.content ?? "")
const result = productSchema.safeParse(output)

if (!result.success) {
  return res.status(500).json({ error: "Formato inesperado" })
}

return res.json(result.data)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Resposta da IA usada em logica de negocio | Validar com Zod schema especifico |
| Estrutura muito complexa (objetos aninhados) | Aumentar risco de formato incorreto — schema Zod mais rigoroso |
| Prompt nao menciona "JSON" | Adicionar instrucao de formato no prompt antes de tudo |
| `content` pode ser null | Usar `?? ""` ou `?? "{}"` no parse |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `JSON.parse(message.content)` sem null check | `JSON.parse(message.content ?? "")` |
| Confiar no formato sem Zod | `schema.safeParse(output)` |
| `res.status(400)` para erro de formato da IA | `res.status(500)` — erro do servidor |
| Prompt sem a palavra "JSON" | Incluir "JSON" explicitamente no prompt |
| Usar `schema.parse()` (throws) em API | Usar `schema.safeParse()` e tratar `.success` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/ia-node/rs-ia-node-marketplace-inteligente-estruturando-dados-com-json-mode/references/deep-explanation.md)
- [Code examples](../../../data/skills/ia-node/rs-ia-node-marketplace-inteligente-estruturando-dados-com-json-mode/references/code-examples.md)
