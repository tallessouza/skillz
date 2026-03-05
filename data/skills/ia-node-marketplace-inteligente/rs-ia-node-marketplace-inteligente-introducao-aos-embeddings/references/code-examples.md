# Code Examples: Embeddings — Transformando Texto em Numeros

## 1. Gerando embedding com OpenAI API

```typescript
import OpenAI from "openai"

const openai = new OpenAI()

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  })

  // response.data[0].embedding e um array de 1536 numeros
  // Cada numero e um float entre -1 e 1
  return response.data[0].embedding
}

// Exemplo de uso
const embeddingFeijao = await generateEmbedding("feijão preto")
console.log(embeddingFeijao.length) // 1536
console.log(embeddingFeijao.slice(0, 5)) // [-0.023, 0.041, -0.012, 0.087, -0.065]
```

## 2. Pre-processamento no cadastro de produto

```typescript
// Ao criar produto, gerar e salvar embedding
async function createProduct(data: { name: string; description: string }) {
  const textForEmbedding = `${data.name} ${data.description}`
  const embedding = await generateEmbedding(textForEmbedding)

  const product = await db.products.insert({
    name: data.name,
    description: data.description,
    embedding, // salvo como vetor no banco
  })

  return product
}

// Ao atualizar produto, regenerar embedding
async function updateProduct(id: string, data: Partial<Product>) {
  const product = await db.products.findById(id)
  const textForEmbedding = `${data.name ?? product.name} ${data.description ?? product.description}`
  const embedding = await generateEmbedding(textForEmbedding)

  await db.products.update(id, { ...data, embedding })
}
```

## 3. Busca por similaridade com PostgreSQL (pgvector)

```sql
-- Setup: extensao pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabela com coluna vetorial
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  embedding vector(1536)
);

-- Indice para busca rapida
CREATE INDEX ON products USING hnsw (embedding vector_cosine_ops);

-- Busca: top 10 mais similares
SELECT name, 1 - (embedding <=> $1::vector) AS similarity
FROM products
ORDER BY embedding <=> $1::vector
LIMIT 10;
```

```typescript
async function findSimilarProducts(query: string, limit = 10) {
  const queryEmbedding = await generateEmbedding(query)

  const result = await pool.query(
    `SELECT id, name, 1 - (embedding <=> $1::vector) AS similarity
     FROM products
     ORDER BY embedding <=> $1::vector
     LIMIT $2`,
    [JSON.stringify(queryEmbedding), limit]
  )

  return result.rows
  // [{ id: 1, name: "Feijão Preto", similarity: 0.95 }, ...]
}
```

## 4. Busca por similaridade com MongoDB (Atlas Vector Search)

```typescript
// Indice no Atlas: tipo vectorSearch no campo embedding

async function findSimilarProducts(query: string, limit = 10) {
  const queryEmbedding = await generateEmbedding(query)

  const results = await db.collection("products").aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 100,
        limit,
      },
    },
    {
      $project: {
        name: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]).toArray()

  return results
}
```

## 5. Fluxo completo: busca inteligente com embeddings + LLM

```typescript
// Passo 1: buscar produtos similares via embedding
const similarProducts = await findSimilarProducts("feijoada", 10)
// Retorna: feijão, arroz, charque, couve, linguiça...

// Passo 2: usar LLM apenas com o contexto filtrado
const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    {
      role: "user",
      content: `Liste os produtos necessários para fazer feijoada.
Considere apenas estes produtos disponíveis: ${similarProducts.map(p => p.name).join(", ")}`,
    },
  ],
})

// Prompt pequeno, focado, barato
```

## 6. Abordagem ingenua vs embeddings (comparacao de custo)

```typescript
// RUIM: enviar tudo no prompt
// 10.000 produtos × ~3 tokens cada = ~30.000 tokens por requisicao
// A cada busca: $0.03 (input) + custo de output
// 1000 buscas/dia = $30/dia so de input

// BOM: embeddings
// Geracao: 10.000 produtos × $0.00002 = $0.20 (uma vez)
// Busca: 1 embedding por query = $0.00002 por busca
// Prompt com top-10: ~30 tokens de contexto
// 1000 buscas/dia = $0.02/dia + custo minimo de prompt
```