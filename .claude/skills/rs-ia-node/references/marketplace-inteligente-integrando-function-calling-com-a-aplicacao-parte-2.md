---
name: rs-ia-node-function-calling-loop
description: "Enforces correct OpenAI function calling message flow when implementing tool use in Node.js applications. Use when user asks to 'implement function calling', 'add tool use to chat', 'integrate OpenAI tools', 'handle tool_calls response', or 'build AI agent with functions'. Applies rules: maintain full message history, use role 'tool' (not 'function'), push assistant tool_call message before result, extract completion logic to avoid repetition. Make sure to use this skill whenever building OpenAI function calling flows in Node.js. Not for prompt engineering, embeddings, or non-tool chat completions."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: function-calling
  tags: [openai, ia-node, node-js, function-calling]
---

# Function Calling — Loop de Mensagens

> Ao implementar function calling, mantenha o historico completo de mensagens e respeite a ordem: prompt → tool_call → execucao → resultado → resposta final.

## Rules

1. **Role e 'tool', nao 'function'** — `role: "tool"` com `tool_call_id`, porque a API OpenAI rejeita `role: "function"` nas versoes atuais
2. **Sempre faca dois pushes** — primeiro o message do assistant (que contem tool_calls), depois o resultado da tool, porque o modelo precisa do historico completo para gerar a resposta final
3. **Extraia a chamada de completion** — crie uma funcao `generateCompletion(messages, format)` reutilizavel, porque voce vai chamar a API multiplas vezes no loop
4. **Resultado da funcao deve ser string** — use `.toString()` ou `JSON.stringify()` no conteudo retornado, porque o campo `content` da role tool espera string
5. **Retorne dados uteis, nao objetos brutos** — no banco, retorne so os campos necessarios (ex: nomes), nao o objeto completo, porque o modelo precisa de texto legivel
6. **Log da funcao chamada** — sempre logue `toolCall.function.name` para debug, porque o modelo pode chamar funcoes inesperadas

## How to write

### Estrutura do historico de mensagens

```typescript
// 1. Push da resposta do assistant (com tool_calls)
messages.push(completion.choices[0].message)

// 2. Push do resultado da tool
messages.push({
  role: "tool",
  tool_call_id: toolCall.id,
  content: result.toString()
})
```

### Funcao generateCompletion reutilizavel

```typescript
async function generateCompletion(messages, format = null) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    tools: availableTools,
    ...(format && { response_format: format })
  })

  if (!completion.choices[0]?.message) {
    throw new Error("No response from model")
  }

  return completion
}
```

### Fluxo completo

```typescript
const messages = [{ role: "user", content: prompt }]
let completion = await generateCompletion(messages, responseFormat)

if (completion.choices[0].message.tool_calls) {
  const toolCall = completion.choices[0].message.tool_calls[0]

  console.log("Function called:", toolCall.function.name)

  const args = JSON.parse(toolCall.function.arguments)
  const result = await toolsMap[toolCall.function.name](args)

  // Push assistant message (com tool_calls)
  messages.push(completion.choices[0].message)

  // Push resultado da tool
  messages.push({
    role: "tool",
    tool_call_id: toolCall.id,
    content: JSON.stringify(result)
  })

  const completion2 = await generateCompletion(messages, responseFormat)
  return completion2.choices[0].message.parsed
}
```

## Example

**Before (erros comuns):**
```typescript
// Erro 1: role errada
messages.push({ role: "function", name: fn, content: result })

// Erro 2: esqueceu de pushar a mensagem do assistant
messages.push({ role: "tool", tool_call_id: id, content: result })
// modelo nao sabe qual tool_call corresponde ao resultado

// Erro 3: passou objeto ao inves de string
messages.push({ role: "tool", tool_call_id: id, content: result })
// result eh um array de objetos — TypeError ou resposta errada
```

**After (correto):**
```typescript
// 1. Push da mensagem do assistant (com tool_calls dentro)
messages.push(completion.choices[0].message)

// 2. Push do resultado como string
messages.push({
  role: "tool",
  tool_call_id: toolCall.id,
  content: JSON.stringify(result)
})

// 3. Segunda chamada com historico completo
const completion2 = await generateCompletion(messages, responseFormat)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Modelo retorna tool_calls | Faca 2 pushes (assistant msg + tool result) antes de chamar novamente |
| Resultado eh objeto/array | Use `JSON.stringify()` no content |
| Resultado eh lista de nomes | Retorne so os nomes do banco, nao objetos completos |
| Modelo pede outra tool_call apos resultado | Precisa de loop/recursao (proximo passo) |
| Nao sabe qual funcao foi chamada | Logue `toolCall.function.name` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `role: "function"` | `role: "tool"` com `tool_call_id` |
| Pushar so o resultado sem a msg do assistant | Pushar `completion.choices[0].message` primeiro |
| Duplicar codigo de chamada a API | Extrair `generateCompletion()` reutilizavel |
| `content: resultObject` | `content: JSON.stringify(result)` |
| Retornar objeto completo do banco | Retornar so campos necessarios (ex: `.name`) |
| Criar completion2, completion3, completion4... | Usar loop/recursao (resolvido na proxima aula) |

## Troubleshooting

### Modelo nao chama a funcao esperada
**Symptom:** completion retorna content direto em vez de tool_calls
**Cause:** Description da tool muito vaga, ou prompt do usuario nao indica necessidade de dados reais
**Fix:** Melhore a description da tool com casos de uso claros. Adicione no prompt instrucoes explicitas como "considere apenas produtos em estoque" 

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
