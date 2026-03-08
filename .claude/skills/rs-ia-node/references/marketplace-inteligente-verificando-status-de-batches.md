---
name: rs-ia-node-marketplace-verificando-status-batches
description: "Applies OpenAI Batch API status checking and result processing patterns when building batch pipelines in Node.js. Use when user asks to 'check batch status', 'poll OpenAI batch', 'process batch results', 'handle batch errors', or 'monitor batch progress'. Covers polling strategy, error handling, output file retrieval, and custom_id typing. Make sure to use this skill whenever implementing OpenAI Batch API consumption logic. Not for creating batch files or JSONL generation — only for status verification and result processing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: batch-api
  tags: [batch-api, async-processing, node-js, openai, ia-node]
---

# Verificando Status de Batches OpenAI

> Batches na OpenAI nao notificam via webhook — implemente polling ativo com verificacao de status e processamento condicional dos resultados.

## Rules

1. **OpenAI nao notifica conclusao** — implemente polling (cron ou intervalo) porque nao existe webhook para batches
2. **custom_id deve ser string** — mesmo que o ID original seja inteiro, converta com `String(id)` porque a API rejeita inteiros silenciosamente
3. **Verifique status antes de processar** — so acesse `output_file_id` quando `status === 'completed'` porque antes disso o campo nao existe
4. **Resultados vem em arquivo, nao inline** — batches grandes retornam um `output_file_id` que voce consulta separadamente porque o volume pode ser massivo
5. **Trate erros do batch antes de recriar** — consulte `batch.errors` quando `status === 'failed'` porque recriar sem corrigir desperdiça creditos
6. **Processamento leva de 1 min a 24h** — depende da fila interna da OpenAI, nao apenas do tamanho do batch

## How to write

### Funcao de consulta de batch

```typescript
async function getBatch(batchId: string) {
  return await client.batches.retrieve(batchId)
}
```

### Funcao de leitura do arquivo de resultado

```typescript
async function getFileContent(fileId: string) {
  const response = await client.files.content(fileId)
  return await response.text()
}
```

### Rota de verificacao com processamento condicional

```typescript
app.get('/embedded-results', async (req, res) => {
  const batch = await getBatch(savedBatchId)

  if (batch.status !== 'completed' || !batch.output_file_id) {
    return res.json({ status: batch.status, completed: false })
  }

  const fileContent = await getFileContent(batch.output_file_id)
  // fileContent eh JSONL — cada linha eh um resultado com custom_id
  return res.json({ status: 'completed', results: fileContent })
})
```

## Example

**Before (sem tratamento de status):**
```typescript
const batch = await client.batches.retrieve(batchId)
const file = await client.files.content(batch.output_file_id) // ERRO: pode ser undefined
const results = await file.text()
```

**After (com verificacao correta):**
```typescript
const batch = await client.batches.retrieve(batchId)

if (batch.status === 'failed') {
  console.error('Batch failed:', batch.errors)
  return
}

if (batch.status !== 'completed' || !batch.output_file_id) {
  console.log(`Batch still ${batch.status}, retry later`)
  return
}

const file = await client.files.content(batch.output_file_id)
const results = await file.text()
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Batch status `validated` | Aguardar — ainda nao comecou a processar |
| Batch status `in_progress` | Aguardar — esta na fila, pode levar ate 24h |
| Batch status `failed` | Consultar `batch.errors` para diagnosticar |
| Batch status `completed` | Acessar `output_file_id` e processar resultados |
| Poucos itens mas demora | Normal — depende da fila interna da OpenAI |
| custom_id com inteiro | Converter para string antes de criar o JSONL |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `custom_id: index` (inteiro) | `custom_id: String(index)` |
| Acessar `output_file_id` sem checar status | Verificar `status === 'completed'` primeiro |
| Polling a cada segundo | Polling a cada 10min ou 1h conforme necessidade |
| Recriar batch sem consultar erros | Ler `batch.errors` e corrigir antes de recriar |
| Esperar resposta inline do batch | Usar `client.files.content()` no `output_file_id` |

## Troubleshooting

### Batch API retorna status mas sem resultados
**Symptom:** Batch status e `completed` mas output_file_id esta undefined
**Cause:** Batch pode ter falhado silenciosamente ou ainda estar processando
**Fix:** Verifique `batch.errors` para diagnostico. Confirme que `status === 'completed'` E `output_file_id` existe antes de processar

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
