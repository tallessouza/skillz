---
name: rs-ia-node-marketplace-similaridade-embeddings
description: "Applies cosine similarity search patterns when building embedding-based product search, recommendation, or semantic matching features in Node.js. Use when user asks to 'compare embeddings', 'find similar products', 'semantic search', 'cosine similarity', or 'build recommendations with AI'. Implements generate-compare-filter-sort-slice pipeline for efficient vector search in memory or database. Make sure to use this skill whenever implementing any embedding comparison or similarity ranking logic. Not for generating embeddings from scratch, training models, or vector database configuration (pgvector, Pinecone)."
---

# Similaridade de Embeddings para Busca Semantica

> Compare embeddings usando similaridade do cosseno, filtre, ordene por relevancia e limite resultados para busca semantica eficiente.

## Rules

1. **Sempre filtre antes de comparar** — `products.filter(p => p.embedding)` antes do map, porque nem todos os registros terao embeddings pre-processados
2. **Use similaridade do cosseno** — retorna quao proximos dois vetores estao no espaco vetorial, valor entre -1 e 1, onde 1 = identicos
3. **Ordene decrescente por similaridade** — `sort((a, b) => b.similarity - a.similarity)` para os mais relevantes primeiro
4. **Limite resultados com slice** — em 10k produtos, pegue os top 100 para reduzir o que vai para o prompt do LLM, porque tokens sao caros
5. **Projete apenas campos necessarios no retorno** — `{ nome, similaridade }` em vez do objeto inteiro com embedding, porque embeddings sao arrays enormes
6. **Gere embedding do input em tempo de request** — o input do usuario (ex: "feijoada") precisa virar embedding antes da comparacao

## How to write

### Pipeline completo: generate → compare → filter → sort → slice

```typescript
// 1. Gerar embedding do input do usuario
const embedding = await generateEmbedding(message)
if (!embedding) {
  return reply.status(400).send({ error: 'Embedding nao gerada' })
}

// 2. Buscar produtos similares
const similarProducts = findSimilarProducts(embedding)

// 3. Retornar apenas campos uteis (sem o vetor de embedding)
const result = similarProducts.map(p => ({
  name: p.name,
  similarity: p.similarity,
}))

return reply.status(200).send({ products: result })
```

### Funcao de similaridade do cosseno

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

### Funcao findSimilarProducts

```typescript
function findSimilarProducts(embedding: number[], limit = 10) {
  return products
    .filter(p => p.embedding)
    .map(p => ({
      ...p,
      similarity: cosineSimilarity(p.embedding!, embedding),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
}
```

## Example

**Before (enviando todos os produtos para o LLM):**
```typescript
// Caro: manda 50 produtos inteiros no prompt
const response = await llm.chat({
  messages: [{ role: 'user', content: `Produtos: ${JSON.stringify(allProducts)}. Monte um carrinho de feijoada.` }]
})
```

**After (pre-filtrando com embeddings):**
```typescript
// Barato: gera embedding, filtra top 10, manda so os relevantes
const embedding = await generateEmbedding('feijoada')
const related = findSimilarProducts(embedding, 10)
// Resultado: farofa, calabresa, feijao, carne de sol... (os 10 mais proximos)
// Agora sim manda so esses 10 para o LLM montar o carrinho
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Banco em memoria (dev/prototipo) | Calcule cosseno manualmente com a funcao acima |
| Banco persistido (PostgreSQL) | Use pgvector com operador `<=>` para cosine distance |
| Poucos produtos (<100) | `limit = 10` e suficiente |
| Muitos produtos (>10k) | `limit = 100` para alimentar o LLM com contexto relevante |
| Embedding do input retornou null | Retorne erro 400 antes de comparar |
| Servidor reiniciou (banco em memoria) | Re-gere embeddings dos produtos no startup |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Mandar todos os produtos para o LLM | Pre-filtrar com similaridade de embeddings |
| Comparar sem filtrar `p.embedding` | `filter(p => p.embedding)` antes do map |
| Retornar o array de embedding na response | Projetar so `{ name, similarity }` |
| Ordenar crescente por similaridade | `sort((a, b) => b.similarity - a.similarity)` decrescente |
| Ignorar o caso de embedding nulo no input | Validar e retornar 400 se nao gerou |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/ia-node/rs-ia-node-marketplace-inteligente-calculando-similaridade-de-embeddings/references/deep-explanation.md)
- [Code examples](../../../data/skills/ia-node/rs-ia-node-marketplace-inteligente-calculando-similaridade-de-embeddings/references/code-examples.md)
