# Code Examples: Utilizando a Embedding API

## Exemplo 1: Geracao basica de embedding

```typescript
import OpenAI from "openai"

const client = new OpenAI()

async function generateEmbedding(input: string): Promise<number[] | null> {
  try {
    const response = await client.embeddings.create({
      input,
      model: "text-embedding-3-small",
    })
    return response.data[0].embedding
  } catch {
    return null
  }
}
```

**O que retorna:** Um array de ~1536 numeros float representando a posicao semantica do texto.

## Exemplo 2: Rota simples para testar embedding

```typescript
app.post("/embeddings-test", async (req, res) => {
  const { input } = req.body
  const embedding = await generateEmbedding(input)
  console.log(embedding)
  res.status(200).json({ embedding })
})
```

**Teste com Thunder Client:**
```json
POST http://localhost:3000/embeddings-test
Body: { "input": "sushi" }
// Retorna: { "embedding": [0.0023, -0.0145, 0.0312, ...] } (~1536 numeros)
```

## Exemplo 3: Banco de dados simulado

```typescript
// database.ts
interface Product {
  name: string
  description: string
  embedding?: number[]
}

const products: Product[] = [
  { name: "Escova de dente", description: "Escova para higiene bucal diaria" },
  { name: "Creme dental", description: "Pasta para limpeza dos dentes" },
  { name: "Condicionador", description: "Produto para hidratar cabelos" },
  // ... mais produtos
]

export function getAllProducts(): Product[] {
  return [...products] // retorna copia
}

export function setEmbedding(index: number, embedding: number[]): void {
  products[index].embedding = embedding
}
```

## Exemplo 4: Pre-processamento completo

```typescript
async function embedProducts(): Promise<void> {
  const products = getAllProducts()

  await Promise.all(
    products.map(async (product, index) => {
      // Inclui nome E descricao para evitar ambiguidades
      const embedding = await generateEmbedding(
        `${product.name} ${product.description}`
      )

      if (!embedding) return // ignora falhas silenciosamente

      setEmbedding(index, embedding)
    })
  )
}
```

## Exemplo 5: Rota de pre-processamento

```typescript
app.post("/embeddings", async (req, res) => {
  await embedProducts()

  // Log para verificar que embeddings foram salvos
  const products = getAllProducts() // pega copia atualizada
  console.log(products)

  res.status(201).send()
})
```

## Exemplo 6: Variacao com chunks para muitos produtos

```typescript
async function embedProductsInChunks(chunkSize = 10): Promise<void> {
  const products = getAllProducts()

  for (let i = 0; i < products.length; i += chunkSize) {
    const chunk = products.slice(i, i + chunkSize)

    await Promise.all(
      chunk.map(async (product, chunkIndex) => {
        const index = i + chunkIndex
        const embedding = await generateEmbedding(
          `${product.name} ${product.description}`
        )
        if (!embedding) return
        setEmbedding(index, embedding)
      })
    )
  }
}
```

## Exemplo 7: Parametros opcionais da API

```typescript
// Reduzir dimensoes (vetor menor, menos storage, um pouco menos preciso)
const response = await client.embeddings.create({
  input: "sushi",
  model: "text-embedding-3-small",
  dimensions: 512, // ao inves de 1536 padrao
})

// Formato base64 (mais compacto para transferencia)
const response2 = await client.embeddings.create({
  input: "sushi",
  model: "text-embedding-3-small",
  encoding_format: "base64",
})
```