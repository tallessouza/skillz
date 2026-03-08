---
name: rs-ia-node-mkt-estruturacao-dados
description: "Enforces structured output patterns when integrating OpenAI completions into backend applications. Use when user asks to 'parse AI response', 'get JSON from GPT', 'integrate LLM output', 'structured output', or 'function calling'. Applies JSONMode and StructuredOutputs instead of naive prompt-based JSON. Make sure to use this skill whenever code sends OpenAI completions to a database or API integration. Not for prompt engineering, embeddings, or RAG pipelines."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: structured-outputs
  tags: [openai, ia-node, node-js, function-calling]
---

# Estruturação de Dados com OpenAI

> Nunca confie em texto livre de um LLM quando o resultado precisa ser consumido por código — use saídas estruturadas.

## Rules

1. **Nunca peça JSON via prompt sozinho** — `"responda em JSON"` no prompt gera Markdown com crases, não JSON parseável, porque o modelo trata a resposta como texto formatado
2. **Use JSONMode ou StructuredOutputs** — ferramentas da OpenAI que garantem formato válido, porque prompts não são determinísticos
3. **Texto livre só para exibição direta** — se o resultado vai para banco, carrinho, API ou qualquer integração, estruture a saída
4. **Defina o schema explicitamente** — não deixe o modelo inferir a estrutura, porque cada chamada pode retornar formato diferente

## O problema

Completions normais retornam texto livre. Mesmo pedindo JSON no prompt, o modelo pode:
- Envolver o JSON em crases de Markdown (` ```json ... ``` `)
- Mudar a estrutura entre chamadas (não é determinístico)
- Adicionar texto antes/depois do JSON
- Usar nomes de campos diferentes

Isso impossibilita `JSON.parse()` confiável e integração com banco de dados.

## How to write

### Problema: prompt ingênuo pedindo JSON

```typescript
// ERRADO: pedir JSON no prompt retorna texto com Markdown
const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "developer",
      content: "Responda em JSON no formato { produtos: string[] }"
    },
    { role: "user", content: userMessage }
  ]
})
// completion.choices[0].message.content pode vir como:
// ```json\n{"produtos": ["Aveia"]}\n```
// JSON.parse() QUEBRA aqui
```

### Solução: usar response_format (JSONMode)

```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "developer",
      content: "Liste 3 produtos que atendam à necessidade do usuário. Retorne um objeto com produtos: string[]"
    },
    { role: "user", content: userMessage }
  ],
  response_format: { type: "json_object" }
})

const data = JSON.parse(completion.choices[0].message.content)
// data.produtos é garantidamente um array
```

## Example

**Before (texto livre, impossível integrar):**
```typescript
app.post("/generate", async (req, res) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "developer", content: "Liste 3 produtos. Responda em JSON" },
      { role: "user", content: req.body.message }
    ]
  })
  // Retorna texto com Markdown, não JSON
  res.json({ result: completion.choices[0].message.content })
})
```

**After (saída estruturada, integrável):**
```typescript
app.post("/generate", async (req, res) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "developer", content: "Liste 3 produtos que atendam à necessidade do usuário. Retorne { produtos: string[] }" },
      { role: "user", content: req.body.message }
    ],
    response_format: { type: "json_object" }
  })
  const data = JSON.parse(completion.choices[0].message.content)
  // Agora posso buscar cada produto no banco
  const products = await db.products.findMany({
    where: { name: { in: data.produtos } }
  })
  res.json({ products })
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Resultado vai ser exibido como texto para o usuário | Completion normal (texto livre) é OK |
| Resultado precisa ser parseado por código | Use `response_format: { type: "json_object" }` no mínimo |
| Resultado precisa de schema garantido com tipos | Use StructuredOutputs com Zod schema |
| Modelo retorna JSON com crases Markdown | Sinal de que você pediu JSON via prompt — use JSONMode |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| `"Responda em JSON"` no prompt | `response_format: { type: "json_object" }` |
| `JSON.parse()` em texto livre sem validação | Parse com try/catch + schema validation |
| Regex para extrair dados de texto do LLM | StructuredOutputs com schema definido |
| Confiar que o formato será o mesmo entre chamadas | Definir schema explícito |

## Troubleshooting

### Resposta da API retorna null ou undefined
**Symptom:** `completion.choices[0].message.content` retorna null
**Cause:** O modelo retornou tool_calls em vez de content, ou max_tokens insuficiente
**Fix:** Verifique `message.tool_calls` antes de acessar content. Aumente max_completion_tokens se a resposta foi cortada

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
