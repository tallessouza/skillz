# Code Examples: Otimizando Function Calling com Recursão

## Exemplo 1: Versão serial (antes da refatoração)

Este é o código que o instrutor tinha antes — processamento de tool_calls feito manualmente fora da função de completion:

```typescript
// Primeira completion
const completion1 = await openai.chat.completions.create({
  model: "gpt-4o",
  messages,
  tools,
});

const toolCalls1 = completion1.choices[0].message.tool_calls;

if (toolCalls1) {
  messages.push(completion1.choices[0].message);

  for (const toolCall of toolCalls1) {
    const fn = availableFunctions[toolCall.function.name];
    const args = JSON.parse(toolCall.function.arguments);
    const result = await fn(args);

    messages.push({
      role: "tool",
      tool_call_id: toolCall.id,
      content: JSON.stringify(result),
    });
  }
}

// Segunda completion — e se precisar de uma terceira?
const completion2 = await openai.chat.completions.create({
  model: "gpt-4o",
  messages,
  tools,
});

// Terceira? Quarta? Não escala.
const parsed = completion2.choices[0].message.parsed;
```

## Exemplo 2: Versão recursiva (após refatoração)

```typescript
const availableFunctions: Record<string, (args: any) => Promise<any>> = {
  listProducts: async (args) => {
    // busca produtos no banco/API
    return await productRepository.list(args);
  },
  getProductDetails: async (args) => {
    return await productRepository.getById(args.id);
  },
  checkStock: async (args) => {
    return await stockService.check(args.productId);
  },
};

async function completionWithToolResults(
  messages: ChatCompletionMessageParam[]
): Promise<ChatCompletion> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    tools,
  });

  const choice = completion.choices[0];
  const toolCalls = choice.message.tool_calls;

  if (toolCalls && toolCalls.length > 0) {
    // Adiciona resposta do assistente ao histórico
    messages.push(choice.message);

    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const handler = availableFunctions[functionName];
      const args = JSON.parse(toolCall.function.arguments);

      console.log(`Calling function: ${functionName}`, args);

      const result = await handler(args);

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      });
    }

    // Recursão: nova completion com os resultados das tools
    return completionWithToolResults(messages);
  }

  // Caso base: sem tool_calls, retorna a completion final
  return completion;
}

// Uso:
const messages: ChatCompletionMessageParam[] = [
  { role: "system", content: "Você é um assistente de marketplace..." },
  { role: "user", content: "Quero um almoço saudável até R$40" },
];

const finalCompletion = await completionWithToolResults(messages);
const parsed = finalCompletion.choices[0].message.parsed;
console.log(parsed);
```

## Exemplo 3: O bug que o instrutor encontrou

```typescript
// ERRADO — retorna parsed dentro da recursão
async function completionWithToolResults(messages) {
  const completion = await openai.chat.completions.create({ model, messages, tools });
  const choice = completion.choices[0];

  if (choice.message.tool_calls?.length) {
    messages.push(choice.message);
    // ... processa tool_calls ...

    // BUG: retorna o parsed da chamada recursiva
    const result = await completionWithToolResults(messages);
    return result.choices[0].message.parsed; // ← ERRO: parsed pode ser undefined
  }

  return completion.choices[0].message.parsed; // ← retorna parsed, não completion
}

// Quando chamado: result.choices → TypeError: Cannot read properties of undefined
```

```typescript
// CORRETO — retorna completion completa, extrai parsed no consumidor
async function completionWithToolResults(messages) {
  const completion = await openai.chat.completions.create({ model, messages, tools });
  const choice = completion.choices[0];

  if (choice.message.tool_calls?.length) {
    messages.push(choice.message);
    // ... processa tool_calls ...

    return completionWithToolResults(messages); // ← retorna completion completa
  }

  return completion; // ← retorna completion completa
}

// Extrai parsed FORA:
const completion = await completionWithToolResults(messages);
const parsed = completion.choices[0].message.parsed;
```

## Exemplo 4: Versão parametrizada (evolução mencionada pelo instrutor)

```typescript
interface CompletionOptions {
  model: string;
  tools: ChatCompletionTool[];
  functionMap: Record<string, (args: any) => Promise<any>>;
  maxRecursionDepth?: number;
}

async function completionWithToolResults(
  messages: ChatCompletionMessageParam[],
  options: CompletionOptions,
  depth = 0
): Promise<ChatCompletion> {
  const maxDepth = options.maxRecursionDepth ?? 10;

  if (depth >= maxDepth) {
    throw new Error(`Max recursion depth (${maxDepth}) reached in tool calling loop`);
  }

  const completion = await openai.chat.completions.create({
    model: options.model,
    messages,
    tools: options.tools,
  });

  const choice = completion.choices[0];
  const toolCalls = choice.message.tool_calls;

  if (toolCalls && toolCalls.length > 0) {
    messages.push(choice.message);

    for (const toolCall of toolCalls) {
      const handler = options.functionMap[toolCall.function.name];

      if (!handler) {
        throw new Error(`Unknown function: ${toolCall.function.name}`);
      }

      const args = JSON.parse(toolCall.function.arguments);
      const result = await handler(args);

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      });
    }

    return completionWithToolResults(messages, options, depth + 1);
  }

  return completion;
}
```