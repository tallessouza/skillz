# Code Examples: Function Calling Loop

## Exemplo 1: Push correto das mensagens

```typescript
// Contexto: dentro do if que verifica se há tool_calls
const toolCall = completion.choices[0].message.tool_calls[0]

// Executar a função mapeada
const functionToCall = toolsMap[toolCall.function.name]
const args = JSON.parse(toolCall.function.arguments)
const result = await functionToCall(args)

// PUSH 1: mensagem do assistant (com tool_calls)
messages.push(completion.choices[0].message)

// PUSH 2: resultado da tool
messages.push({
  role: "tool",
  tool_call_id: toolCall.id,
  content: result.toString()  // ou JSON.stringify(result)
})
```

## Exemplo 2: generateCompletion extraída

```typescript
async function generateCompletion(messages, format = null) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    tools: availableTools,
    ...(format && { response_format: format })
  })

  if (!completion.choices[0]?.message) {
    throw new Error("Failed to generate completion")
  }

  return completion
}
```

## Exemplo 3: Fluxo completo com duas chamadas

```typescript
async function chat(prompt, responseFormat) {
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: prompt }
  ]

  // Primeira chamada — pode retornar tool_calls ou resposta direta
  let completion = await generateCompletion(messages, responseFormat)

  if (completion.choices[0].message.tool_calls) {
    const toolCall = completion.choices[0].message.tool_calls[0]

    // Log para debug
    console.log("Function called:", toolCall.function.name)

    // Executar
    const fn = toolsMap[toolCall.function.name]
    const args = JSON.parse(toolCall.function.arguments)
    const result = await fn(args)

    // Reconstruir histórico
    messages.push(completion.choices[0].message)
    messages.push({
      role: "tool",
      tool_call_id: toolCall.id,
      content: JSON.stringify(result)
    })

    // Segunda chamada — agora com resultado
    const completion2 = await generateCompletion(messages, responseFormat)
    return completion2.choices[0].message.parsed
  }

  return completion.choices[0].message.parsed
}
```

## Exemplo 4: Banco retornando dados limpos

```typescript
// ERRADO: retorna objetos completos
async function getProductsInStock() {
  const products = await db.query("SELECT * FROM products WHERE stock > 0")
  return products  // [{ id: 1, name: "Aveia", stock: 50, price: 8.99 }, ...]
  // .toString() vira "[object Object],[object Object]"
}

// CORRETO: retorna só os nomes
async function getProductsInStock() {
  const products = await db.query("SELECT name FROM products WHERE stock > 0")
  return products.map(p => p.name)  // ["Aveia", "Maçã", "Banana"]
  // .toString() vira "Aveia,Maçã,Banana"
}

// ALTERNATIVA: JSON.stringify no objeto completo
async function getProductsInStock() {
  const products = await db.query("SELECT * FROM products WHERE stock > 0")
  return products  // Usar JSON.stringify() no push
}
// No push: content: JSON.stringify(result)
```

## Exemplo 5: Debug das tool_calls

```typescript
// Logar qual função foi chamada
console.log("Tool call function:", toolCall.function.name)
// Output: "Tool call function: getProductsInStock"

// Logar a resposta completa para debug
console.log("Completion message:", JSON.stringify(
  completion.choices[0].message, null, 2
))

// Logar o resultado da segunda chamada
console.log("Final response:", completion2.choices[0].message)
```

## Teste prático do instrutor

O instrutor testou com dois prompts diferentes:

1. **"café da manhã saudável"** → modelo chamou `getProductsInStock` → retornou "aveia, maçã e banana" → resposta final sugeriu café com esses produtos

2. **"considerar produtos em falta"** → modelo chamou `getOutOfStockProducts` → retornou "leite, iogurte grego e sal" → resposta final mencionou esses produtos como indisponíveis

Isso demonstra que o mapeamento dinâmico de funções funciona — o modelo escolhe qual função chamar baseado no contexto do prompt.