---
name: rs-ia-node-marketplace-batch-api
description: "Applies OpenAI Batch API patterns when processing bulk AI requests in Node.js. Use when user asks to 'process in bulk', 'batch embeddings', 'batch requests to OpenAI', 'process multiple products', or 'use Batch API'. Covers JSONL file creation, file upload, batch creation, and async processing. Make sure to use this skill whenever user needs to send many OpenAI requests at once instead of one-by-one. Not for single synchronous requests, streaming responses, or real-time user-facing interactions."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: batch-api
  tags: [embeddings, batch-api, async-processing, node-js, openai, ia-node]
---

# OpenAI Batch API — Processamento em Massa

> Quando precisar fazer muitas requisicoes para a OpenAI de uma vez, use a Batch API: crie um arquivo JSONL, suba para a OpenAI, crie o batch e processe os resultados assincronamente.

## Rules

1. **Use Batch API para processamento em background** — nunca para respostas em tempo real ao usuario, porque o processamento leva ate 24 horas
2. **Arquivo deve ser JSON Lines (.jsonl)** — cada linha e um objeto JSON stringificado separado por `\n`, sem virgulas entre objetos, porque esse e o formato que a API exige
3. **Cada linha descreve uma requisicao completa** — inclua `custom_id`, `method`, `url` e `body`, porque a OpenAI precisa saber exatamente o que executar
4. **Use custom_id para rastrear resultados** — associe cada requisicao a um identificador do seu dominio, porque os resultados voltam fora de ordem
5. **Endpoints suportados sao limitados** — apenas `/v1/chat/completions`, `/v1/embeddings`, `/v1/completions` e `/v1/responses`, porque a Batch API nao suporta outros endpoints
6. **completion_window e obrigatoriamente "24h"** — unico valor aceito hoje, porque a OpenAI nao garante processamento mais rapido

## How to write

### Criar arquivo JSONL para embeddings

```typescript
function buildBatchContent(products: string[]): string {
  return products
    .map((product, index) => JSON.stringify({
      custom_id: String(index),
      method: "POST",
      url: "/v1/embeddings",
      body: {
        input: product,
        model: "text-embedding-3-small",
        encoding_format: "float",
      },
    }))
    .join("\n");
}
```

### Upload do arquivo e criacao do batch

```typescript
async function createEmbeddingsBatch(products: string[]) {
  const content = buildBatchContent(products);

  const file = new File([content], "embeddings-batch.jsonl");
  const uploaded = await client.files.create({
    file,
    purpose: "batch",
  });

  const batch = await client.batches.create({
    input_file_id: uploaded.id,
    endpoint: "/v1/embeddings",
    completion_window: "24h",
  });

  return batch;
}
```

## Example

**Before (requisicoes individuais — lento e caro):**
```typescript
for (const product of products) {
  const embedding = await client.embeddings.create({
    input: product,
    model: "text-embedding-3-small",
  });
  await saveEmbedding(embedding);
}
```

**After (Batch API — 50% mais barato, rate limits maiores):**
```typescript
const batch = await createEmbeddingsBatch(products);
// Salvar batch.id no banco para verificar status depois
await saveBatchId(batch.id);
// Processar resultados quando batch.status === "completed"
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Embedar banco inteiro de produtos | Batch API |
| Usuario espera resposta imediata | Requisicao sincrona normal |
| Processar milhares de chat completions | Batch API |
| Orcamento apertado com muitas requisicoes | Batch API (50% desconto) |
| Rate limit sendo atingido frequentemente | Batch API (limites maiores) |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Arquivo JSON normal com array | JSON Lines: um objeto por linha, separado por `\n` |
| Loop sincrono para milhares de embeddings | Batch API com arquivo JSONL |
| Esquecer custom_id nos objetos | Sempre incluir custom_id para rastrear resultados |
| Esperar resposta sincrona do batch | Implementar polling ou verificacao posterior |
| Hardcodar completion_window diferente de "24h" | Usar "24h" (unico valor aceito) |

## Troubleshooting

### Batch API retorna status mas sem resultados
**Symptom:** Batch status e `completed` mas output_file_id esta undefined
**Cause:** Batch pode ter falhado silenciosamente ou ainda estar processando
**Fix:** Verifique `batch.errors` para diagnostico. Confirme que `status === 'completed'` E `output_file_id` existe antes de processar

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
