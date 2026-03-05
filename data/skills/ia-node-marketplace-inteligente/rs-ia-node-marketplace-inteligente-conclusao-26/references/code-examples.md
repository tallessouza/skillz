# Code Examples: Batch Embeddings com OpenAI API

## Exemplo 1: Buscando produtos do banco

O instrutor substituiu o array fixo por uma chamada ao banco:

```typescript
// ANTES: array fixo
const products = ["Produto A descrição A", "Produto B descrição B"]

// DEPOIS: integração com banco
const allProducts = await getAllProducts()
const productTexts = allProducts.map(product => 
  `${product.name} ${product.description}`
)
```

A função `getAllProducts()` já existia no projeto, retornando todos os produtos do banco de dados.

## Exemplo 2: Fluxo completo de criação do batch

```typescript
// Rota de criação do batch (módulo 3 - collections)
// 1. Buscar produtos
const allProducts = await getAllProducts()

// 2. Mapear para strings contextualizadas
const inputs = allProducts.map(product => 
  `${product.name} ${product.description}`
)

// 3. Criar batch na OpenAI
const batch = await createBatch(inputs)
// batch.id será algo como "batch_abc123..."

// 4. Em produção: salvar batch.id no banco
```

## Exemplo 3: Processamento dos resultados

```typescript
// Rota de processamento - recebe batch ID como parâmetro
// GET /process/:batchId

const batchId = req.params.batchId

// Verificar status do batch
const batchResult = await openai.batches.retrieve(batchId)

if (batchResult.status !== "completed") {
  // Retornar que ainda está processando
  return res.json({ status: batchResult.status })
}

// Batch completou - processar resultados
const results = await getResults(batchResult.output_file_id)

// Salvar embeddings no banco
for (const result of results) {
  await updateProductEmbedding(result.custom_id, result.embedding)
}

return res.status(200).send()
```

## Exemplo 4: Chunking para grandes volumes

```typescript
// Quando o volume é muito grande para processar de uma vez
const CHUNK_SIZE = 10_000

const allProducts = await getAllProducts() // ex: 1 milhão

for (let i = 0; i < allProducts.length; i += CHUNK_SIZE) {
  const chunk = allProducts.slice(i, i + CHUNK_SIZE)
  const inputs = chunk.map(p => `${p.name} ${p.description}`)
  
  const batch = await createBatch(inputs)
  
  // Salvar cada batch ID para polling posterior
  await saveBatchRecord({
    batchId: batch.id,
    status: "processing",
    startIndex: i,
    endIndex: i + chunk.length
  })
}
```

## Exemplo 5: Rotina de polling em produção

```typescript
// Cron job ou similar que roda periodicamente
async function checkPendingBatches() {
  const pendingBatches = await getBatchesByStatus("processing")
  
  for (const record of pendingBatches) {
    const result = await openai.batches.retrieve(record.batchId)
    
    if (result.status === "completed") {
      const embeddings = await getResults(result.output_file_id)
      await saveEmbeddingsToDatabase(embeddings)
      await updateBatchStatus(record.batchId, "completed")
    } else if (result.status === "failed") {
      await updateBatchStatus(record.batchId, "failed")
      // Alertar para retry manual
    }
    // Se ainda "in_progress", não faz nada — verifica na próxima execução
  }
}
```

## Visualização dos embeddings

O instrutor mostrou que ao consultar os produtos após o processamento, os embeddings aparecem truncados (3 primeiras dimensões) para visualização:

```json
{
  "id": "product-1",
  "name": "Camiseta Azul",
  "description": "Camiseta 100% algodão...",
  "embedding": [0.0234, -0.0567, 0.0891, "..."]
}
```

Na realidade, o vetor completo tem 1536+ dimensões.