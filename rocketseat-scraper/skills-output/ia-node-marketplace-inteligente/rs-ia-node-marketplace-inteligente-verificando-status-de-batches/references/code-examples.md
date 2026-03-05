# Code Examples: Verificando Status de Batches OpenAI

## 1. Funcao basica de consulta de batch

```typescript
import OpenAI from 'openai'

const client = new OpenAI()

const getBatch = async (batchId: string) => {
  return await client.batches.retrieve(batchId)
}
```

## 2. Funcao de leitura de arquivo de resultado

```typescript
const getFileContent = async (fileId: string) => {
  const response = await client.files.content(fileId)
  return await response.text()
}
```

## 3. Teste rapido de verificacao (script direto)

```typescript
// Para testar manualmente — depois substituir por rota ou cron
const result = await getBatch('batch_abc123')
console.log(result)

// Se falhou, verificar erros
if (result.status === 'failed') {
  console.log(result.errors)
}
```

## 4. Rota Express completa com verificacao condicional

```typescript
app.get('/embedded-results', async (req, res) => {
  const batch = await getBatch(savedBatchId)

  // Guard: precisa estar completed E ter output_file_id
  if (batch.status !== 'completed' || !batch.output_file_id) {
    return res.json({ status: batch.status })
  }

  console.log('Processing results...')

  const fileContent = await getFileContent(batch.output_file_id)

  return res.json({ results: fileContent })
})
```

## 5. Correcao do custom_id (no momento de criar o JSONL)

```typescript
// ERRADO — custom_id como inteiro
const line = {
  custom_id: index, // number — vai falhar
  method: 'POST',
  url: '/v1/embeddings',
  body: { model: 'text-embedding-3-small', input: product.description }
}

// CORRETO — custom_id como string
const line = {
  custom_id: String(index), // string — aceito pela API
  method: 'POST',
  url: '/v1/embeddings',
  body: { model: 'text-embedding-3-small', input: product.description }
}
```

## 6. Estrategia de polling com cron (conceitual)

```typescript
import cron from 'node-cron'

// A cada 10 minutos, verificar batches pendentes
cron.schedule('*/10 * * * *', async () => {
  const pendingBatches = await db.batches.findMany({
    where: { status: { not: 'completed' } }
  })

  for (const record of pendingBatches) {
    const batch = await getBatch(record.batchId)

    if (batch.status === 'completed' && batch.output_file_id) {
      const content = await getFileContent(batch.output_file_id)
      await processResults(content, record.id)
      await db.batches.update({
        where: { id: record.id },
        data: { status: 'completed' }
      })
    }

    if (batch.status === 'failed') {
      console.error(`Batch ${record.batchId} failed:`, batch.errors)
      await db.batches.update({
        where: { id: record.id },
        data: { status: 'failed' }
      })
    }
  }
})
```

## 7. Status possiveis de um batch

```typescript
// Fluxo normal:
// validating → in_progress → completed

// Fluxo com erro:
// validating → failed (erros no arquivo JSONL)
// in_progress → failed (erros durante processamento)

type BatchStatus =
  | 'validating'    // OpenAI validando o arquivo
  | 'in_progress'   // Processando as requisicoes
  | 'completed'     // Pronto — output_file_id disponivel
  | 'failed'        // Erro — consultar batch.errors
  | 'expired'       // Batch expirou (timeout da OpenAI)
  | 'cancelling'    // Cancelamento em andamento
  | 'cancelled'     // Cancelado
```