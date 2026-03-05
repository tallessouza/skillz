---
name: rs-ia-node-marketplace-batch-embeddings
description: "Applies batch embedding patterns when generating vector embeddings with OpenAI Batch API and storing in database. Use when user asks to 'embed products', 'generate embeddings in batch', 'process embeddings', 'store vectors in database', or 'batch API OpenAI'. Covers chunking strategy, batch lifecycle management, and persistence. Make sure to use this skill whenever implementing embedding pipelines with OpenAI Batch API. Not for real-time single-embedding generation, semantic search queries, or RAG retrieval logic."
---

# Batch Embeddings com OpenAI API

> Ao implementar embedding em batch, integre com o banco de dados real, gerencie o ciclo de vida do batch, e persista os resultados automaticamente.

## Rules

1. **Nunca use arrays fixos em producao** — busque produtos do banco de dados, porque dados hardcoded nao escalam e ficam desatualizados
2. **Contextualize o texto do embedding** — concatene `nome + descricao` do produto, porque embeddings com mais contexto geram vetores mais precisos para busca semantica
3. **Divida em chunks para grandes volumes** — se sao 1 milhao de produtos, processe em lotes de 10k, porque a memoria tem limite e a API tem rate limits
4. **Persista o batch ID no banco** — salve o ID retornado pela API com status "processing", porque nao existe webhook na OpenAI e voce precisa fazer polling
5. **Implemente polling para verificar conclusao** — crie rotina que verifica recorrentemente se o batch completou, porque a OpenAI Batch API e assincrona
6. **Salve embeddings no banco apos processamento** — ao receber resultados, persista os vetores junto aos produtos, porque embeddings precisam estar disponiveis para busca

## How to write

### Gerando batch a partir do banco

```typescript
const allProducts = await getAllProducts()

const inputs = allProducts.map(product => 
  `${product.name} ${product.description}`
)

const batch = await openai.batches.create({
  // ... batch config com os inputs
})

// Salvar batch.id no banco com status "processing"
await saveBatchRecord({ batchId: batch.id, status: "processing" })
```

### Chunking para grandes volumes

```typescript
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

const productChunks = chunkArray(allProducts, 10_000)
for (const chunk of productChunks) {
  await createEmbeddingBatch(chunk)
}
```

### Polling e processamento de resultados

```typescript
const batchResult = await openai.batches.retrieve(batchId)

if (batchResult.status === "completed") {
  const results = await processResults(batchResult)
  // Salvar embeddings no banco de dados
  for (const result of results) {
    await updateProductEmbedding(result.customId, result.embedding)
  }
} else {
  // Ainda processando — retornar status atual
  return { status: batchResult.status }
}
```

## Example

**Before (array fixo, sem persistencia):**
```typescript
const products = ["Produto A", "Produto B", "Produto C"]
const batchId = "batch_abc123" // ID fixo hardcoded
const result = await openai.batches.retrieve(batchId)
console.log(result)
```

**After (integrado com banco, ciclo completo):**
```typescript
// 1. Gerar batch com dados reais
const allProducts = await getAllProducts()
const inputs = allProducts.map(p => `${p.name} ${p.description}`)
const batch = await createEmbeddingBatch(inputs)
await saveBatchRecord({ batchId: batch.id, status: "processing" })

// 2. Processar resultados (rota separada, chamada via polling)
const batchRecord = await getBatchRecord(batchId)
const result = await openai.batches.retrieve(batchRecord.batchId)
if (result.status === "completed") {
  const embeddings = await parseResults(result)
  await saveEmbeddingsToDatabase(embeddings)
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| < 1000 produtos | Pode passar todos de uma vez no batch |
| 1000-100k produtos | Dividir em chunks de 10k |
| > 100k produtos | Chunks menores, monitorar memoria, considerar filas |
| Batch ainda processando | Retornar status atual, nao bloquear |
| Batch completou | Processar e salvar embeddings imediatamente |
| Precisa de polling | Criar rota/cron que verifica status periodicamente |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Array fixo de produtos | Buscar do banco de dados |
| Batch ID hardcoded | Salvar ID no banco com status |
| Esperar bloqueando o servidor | Polling assincrono com rota separada |
| Embedar so o nome | Concatenar nome + descricao para contexto |
| Processar 1M de uma vez | Dividir em chunks que cabem na memoria |
| Descartar resultados do batch | Persistir embeddings no banco |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
