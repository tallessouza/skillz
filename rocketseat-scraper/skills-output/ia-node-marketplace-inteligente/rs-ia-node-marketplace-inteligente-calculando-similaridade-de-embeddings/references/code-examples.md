# Code Examples: Similaridade de Embeddings

## Exemplo 1: Rota completa de geracao de carrinho

```typescript
// Rota POST /cart - gera carrinho baseado em busca semantica
app.post('/cart', async (request, reply) => {
  const { message } = request.body as { message: string }

  // Gerar embedding do input do usuario
  const embedding = await generateEmbedding(message)

  if (!embedding) {
    return reply.status(400).send({ error: 'Embedding nao gerada' })
  }

  // Buscar produtos similares
  const similarProducts = findSimilarProducts(embedding)

  // Retornar so nome e similaridade (sem o vetor gigante)
  const result = similarProducts.map(p => ({
    name: p.name,
    similarity: p.similarity,
  }))

  return reply.status(200).send({ products: result })
})
```

## Exemplo 2: Funcao cosineSimilarity

```typescript
function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}
```

## Exemplo 3: Funcao findSimilarProducts com pipeline completo

```typescript
interface Product {
  name: string
  embedding?: number[]
}

interface ScoredProduct extends Product {
  similarity: number
}

function findSimilarProducts(
  embedding: number[],
  limit = 10
): ScoredProduct[] {
  return products
    .filter((p): p is Product & { embedding: number[] } => !!p.embedding)
    .map(p => ({
      ...p,
      similarity: cosineSimilarity(p.embedding, embedding),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
}
```

## Exemplo 4: Request HTTP para testar

```http
### Gerar carrinho para feijoada
POST http://localhost:3000/cart
Content-Type: application/json

{
  "message": "feijoada"
}

### Resposta esperada:
# {
#   "products": [
#     { "name": "Farofa", "similarity": 0.92 },
#     { "name": "Calabresa", "similarity": 0.88 },
#     { "name": "Feijão", "similarity": 0.87 },
#     { "name": "Carne de Sol", "similarity": 0.83 },
#     ...
#   ]
# }
```

## Exemplo 5: Variacao com threshold minimo de similaridade

```typescript
function findSimilarProducts(
  embedding: number[],
  limit = 10,
  minSimilarity = 0.5
): ScoredProduct[] {
  return products
    .filter(p => p.embedding)
    .map(p => ({
      ...p,
      similarity: cosineSimilarity(p.embedding!, embedding),
    }))
    .filter(p => p.similarity >= minSimilarity) // so os realmente relevantes
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
}
```

## Exemplo 6: Equivalente com pgvector (producao)

```sql
-- Em vez de calcular em memoria, usar pgvector no PostgreSQL
SELECT
  name,
  1 - (embedding <=> $1::vector) AS similarity
FROM products
WHERE embedding IS NOT NULL
ORDER BY embedding <=> $1::vector
LIMIT 10;
```