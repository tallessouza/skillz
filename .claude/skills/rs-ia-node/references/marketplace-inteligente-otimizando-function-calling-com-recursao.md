---
name: rs-ia-node-marketplace-function-calling-recursao
description: "Applies recursive function calling pattern when implementing OpenAI tool_calls loops in Node.js. Use when user asks to 'implement function calling', 'handle tool calls', 'create AI agent with tools', 'recursive completion', or builds any LLM chat completion that uses tools/functions. Ensures tool_calls are processed in a recursive loop instead of sequential completions. Make sure to use this skill whenever generating code that handles OpenAI function calling or tool use patterns. Not for prompt engineering, embedding, or non-tool LLM completions."
---

# Otimizando Function Calling com Recursão

> Quando uma completion retorna tool_calls, processe-as em loop recursivo — nunca encadeie completions manuais em série.

## Rules

1. **Use recursão para tool_calls** — uma função que chama a si mesma até não haver mais tool_calls, porque o número de chamadas encadeadas é imprevisível e código serial não escala
2. **Retorne a completion completa na recursão, não o parsed** — o parsed só é extraído quando a recursão termina (sem mais tool_calls), porque retornar parsed dentro do loop quebra a cadeia
3. **Mapeie as funções disponíveis em um objeto** — `{ functionName: handlerFn }`, porque permite lookup dinâmico sem if/else chains
4. **Preencha o array de messages com cada resultado de tool** — role `tool` com `tool_call_id`, porque a API exige o histórico completo para a próxima completion
5. **Retorne apenas no caso base** — quando `finish_reason !== 'tool_calls'` ou não há mais tool_calls, porque retornar cedo dentro do loop causa `properties of undefined`

## How to write

### Completion recursiva com tool_calls

```typescript
async function completionWithToolResults(
  messages: ChatCompletionMessageParam[]
): Promise<ChatCompletion> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    tools,
  });

  const choice = completion.choices[0];

  if (choice.finish_reason === "tool_calls" || choice.message.tool_calls?.length) {
    // Adiciona a resposta do assistente ao histórico
    messages.push(choice.message);

    const toolCalls = choice.message.tool_calls ?? [];

    for (const toolCall of toolCalls) {
      const handler = availableFunctions[toolCall.function.name];
      const args = JSON.parse(toolCall.function.arguments);
      const result = await handler(args);

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      });
    }

    // Recursão: volta ao topo, faz nova completion
    return completionWithToolResults(messages);
  }

  // Caso base: sem tool_calls, retorna completion final
  return completion;
}
```

## Example

**Before (completions encadeadas manualmente):**

```typescript
const completion1 = await openai.chat.completions.create({ model, messages, tools });
// processa tool_calls de completion1...
messages.push(/* tool results */);

const completion2 = await openai.chat.completions.create({ model, messages, tools });
// processa tool_calls de completion2...
messages.push(/* tool results */);

const completion3 = await openai.chat.completions.create({ model, messages, tools });
// E se precisar de completion4? completion5?
const parsed = completion3.choices[0].message.parsed;
```

**After (recursão):**

```typescript
const finalCompletion = await completionWithToolResults(messages);
const parsed = finalCompletion.choices[0].message.parsed;
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Primeira implementação de function calling | Comece serial para entender o fluxo, depois refatore para recursivo |
| Função pode gerar N tool_calls encadeadas | Sempre use recursão — nunca assuma quantas iterações serão |
| Resultado da tool_call volta errado | Verifique se está retornando a completion completa na recursão, não o parsed |
| Debug de recursão | Logue `toolCall.function.name` e `finish_reason` a cada iteração |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `completion1`, `completion2`, `completion3` em série | Uma função recursiva `completionWithToolResults` |
| `return completion.choices[0].message.parsed` dentro do loop | `return completionWithToolResults(messages)` dentro do loop, `parsed` só no final |
| `if/else` chain para selecionar função | `availableFunctions[toolCall.function.name](args)` com mapa de handlers |
| Assumir que uma tool_call resolve tudo | Loop recursivo que verifica `tool_calls` a cada completion |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/ia-node/rs-ia-node-marketplace-inteligente-otimizando-function-calling-com-recursao/references/deep-explanation.md)
- [Code examples](../../../data/skills/ia-node/rs-ia-node-marketplace-inteligente-otimizando-function-calling-com-recursao/references/code-examples.md)
