# Code Examples: Processando Batches Criados

## Funcao completa de processamento

```typescript
// openai.ts - modulo da OpenAI
export async function processEmbeddingsBatchResult(batchId: string) {
  const batch = await getBatch(batchId)

  if (batch.status !== 'completed' || !batch.output_file_id) {
    return null
  }

  const fileContent = await getFileContent(batch.output_file_id)

  const lines = fileContent.split('\n')

  const parsed = lines.map(line => {
    try {
      const parse = JSON.parse(line) as {
        custom_id: string
        response: {
          body: {
            data: Array<{ embedding: number[] }>
          }
        }
      }
      return parse
    } catch (error) {
      return null
    }
  })

  const results = parsed
    .filter((r): r is {
      custom_id: string
      response: { body: { data: Array<{ embedding: number[] }> } }
    } => r !== null)
    .map(r => ({
      id: Number(r.custom_id),
      embeddings: r.response.body.data[0].embedding
    }))

  return results
}
```

## Rota de processamento

```typescript
// routes
app.post('/process-batch', async (req, res) => {
  const { batchId } = req.body

  const result = await processEmbeddingsBatchResult(batchId)

  if (!result) {
    return res.status(200).json({ message: 'Batch still processing' })
  }

  for (const r of result) {
    await setEmbedding(r.id, r.embeddings)
  }

  return res.status(200).json({ ok: true })
})
```

## Rota de listagem com embeddings truncados

```typescript
app.get('/products', async (req, res) => {
  const products = await getAllProducts()

  return res.json(
    products.map(p => ({
      ...p,
      embedding: p.embedding ? p.embedding.slice(0, 3) : null
    }))
  )
})
```

## Engenharia reversa: criacao vs processamento

```typescript
// CRIACAO (stringify + join)
const jsonl = items
  .map(item => JSON.stringify(item))
  .join('\n')

// PROCESSAMENTO (split + parse) — exatamente o oposto
const items = content
  .split('\n')
  .map(line => {
    try { return JSON.parse(line) }
    catch { return null }
  })
  .filter(Boolean)
```

## Type predicate para filtrar nulos

```typescript
// Sem type predicate — TypeScript reclama
const results = parsed.filter(r => r !== null) // tipo ainda inclui null

// Com type predicate — TypeScript entende
const results = parsed.filter(
  (r): r is { id: number; embeddings: number[] } => r !== null
)
// tipo correto: Array<{ id: number; embeddings: number[] }>
```