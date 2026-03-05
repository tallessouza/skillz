# Code Examples: Técnicas de Divisão (Chunking)

## Exemplo completo da aula

### Rota original (sem chunking)

```typescript
// cart.ts - versão original
import { generateResponse } from "./ai"

export async function generateCart(products: Product[], input: string) {
  return generateResponse<{ products: string[] }>({
    model: "gpt-4o-mini",
    instructions: `Return 5 products that satisfy the user's need.
Products: ${JSON.stringify(products)}
Format: { products: string[] }`,
    input,
    schema: cartSchema,
  })
}
```

### Função createCartPromptChunks

```typescript
function createCartPromptChunks(input: string, products: Product[]): string[] {
  const chunkSize = 10
  const chunks: string[] = []

  for (let i = 0; i < products.length; i += chunkSize) {
    const slice = products.slice(i, i + chunkSize)
    chunks.push(
      `Return 5 products that satisfy the user's need.
Products: ${JSON.stringify(slice)}
Input: ${input}`
    )
  }

  return chunks
}
```

### Rota com chunking aplicado

```typescript
export async function generateCart(products: Product[], input: string) {
  const promises = createCartPromptChunks(input, products).map((chunk) =>
    generateResponse<{ products: string[] }>({
      model: "gpt-4o-mini",
      instructions: chunk,
      input,
      schema: cartSchema,
    })
  )

  const results = await Promise.all(promises)

  return results
    .filter((r): r is { products: string[] } => Boolean(r))
    .flatMap((r) => r.products)
}
```

### generateResponse com Generic

```typescript
// ai.ts
import { openai } from "./client"

async function generateResponse<T = null>(params: {
  model: string
  instructions: string
  input: string
  schema?: z.ZodType
}): Promise<T | null> {
  const response = await openai.responses.parse({
    model: params.model,
    instructions: params.instructions,
    input: params.input,
    text: { format: params.schema ? { type: "json_schema", schema: params.schema } : undefined },
  })

  return (response.outputParsed as T) ?? null
}
```

## Variações do padrão

### Com deduplicação no merge

```typescript
const allProducts = results
  .filter((r): r is { products: string[] } => Boolean(r))
  .flatMap((r) => r.products)

// Remove duplicatas que podem aparecer em chunks diferentes
const uniqueProducts = [...new Set(allProducts)]
```

### Com chunk size configurável

```typescript
function createChunks<T>(items: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize))
  }
  return chunks
}

// Uso:
const productChunks = createChunks(products, 100)
const promises = productChunks.map((chunk) =>
  generateResponse<{ products: string[] }>({
    instructions: buildPrompt(chunk, input),
    ...config,
  })
)
```

### Com tratamento de erro por chunk

```typescript
const promises = chunks.map(async (chunk) => {
  try {
    return await generateResponse<{ products: string[] }>({
      instructions: chunk,
      input,
    })
  } catch (error) {
    console.error(`Chunk failed:`, error)
    return null // chunk falhou, mas não invalida os outros
  }
})
```

### Com Promise.allSettled para mais controle

```typescript
const settled = await Promise.allSettled(promises)

const fulfilled = settled
  .filter((r): r is PromiseFulfilledResult<{ products: string[] } | null> =>
    r.status === "fulfilled"
  )
  .map((r) => r.value)
  .filter((r): r is { products: string[] } => r !== null)
  .flatMap((r) => r.products)

const failedCount = settled.filter((r) => r.status === "rejected").length
if (failedCount > 0) {
  console.warn(`${failedCount} chunks failed out of ${settled.length}`)
}
```