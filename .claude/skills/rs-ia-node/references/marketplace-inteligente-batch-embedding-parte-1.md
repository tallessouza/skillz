---
name: rs-ia-node-marketplace-batch-embedding-1
description: "Generates batch embedding pipelines using OpenAI Batch API with JSONlines and webhooks. Use when user asks to 'embed products', 'batch process embeddings', 'create batch openai', 'process embeddings in bulk', or 'use openai batch api'. Applies patterns: JSONlines file creation, batch upload, webhook handling with signature validation, and response parsing. Make sure to use this skill whenever implementing bulk embedding or batch processing with OpenAI. Not for single embedding calls, streaming responses, or chat completions."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: embeddings
  tags: [embeddings, batch-api, async-processing, node-js, openai, ia-node]
---

# Batch Embedding com OpenAI Batch API

> Ao processar embeddings em massa, use a Batch API com JSONlines e webhooks — nunca um loop sequencial de requisicoes individuais.

## Rules

1. **Use JSONlines para descrever requisicoes em batch** — cada linha e um JSON stringificado com `custom_id`, `method`, `url` e `body`, porque a Batch API exige esse formato especifico
2. **Identifique cada item pelo custom_id** — a OpenAI nao garante ordem de retorno, entao o `custom_id` e o unico vinculo entre request e response
3. **Use webhooks em vez de polling** — configure o webhook secret no client e valide com `unwrap`, porque polling desperdia recursos e webhooks notificam automaticamente
4. **Valide autenticidade do webhook** — use `unwrap` que valida headers + secret E faz o parse do payload, porque aceitar eventos sem validacao expoe a ataques
5. **Filtre respostas invalidas** — embeddings podem falhar individualmente, entao valide `data.response.body.data[0]` antes de extrair e filtre nulos no final
6. **Extraia texto antes de parsear** — o output file retorna uma response que precisa de `.text()` antes do split por linhas

## How to write

### Criacao do arquivo JSONlines

```typescript
const jsonLineFile = products
  .map((product) =>
    JSON.stringify({
      custom_id: product.id.toString(),
      method: "POST",
      url: "/v1/embeddings",
      body: {
        model: "text-embedding-3-small",
        input: product.name,
      },
    })
  )
  .join("\n");
```

### Upload e criacao do batch

```typescript
const file = await this.client.files.create({
  file: new File([jsonLineFile], "embeddings.jsonl", { type: "application/jsonl" }),
  purpose: "batch",
});

if (!file.id) return;

const batch = await this.client.batches.create({
  input_file_id: file.id,
  endpoint: "/v1/embeddings",
  completion_window: "24h",
});
```

### Webhook handler com validacao

```typescript
async handleWebhook(rawBody: string, headers: Record<string, string>) {
  const event = this.client.webhooks.unwrap(rawBody, headers);

  if (event.type !== "batch.completed") {
    console.log("Evento ignorado:", event.type);
    return;
  }

  const batch = event.data;
  if (!batch?.output_file_id) return;

  const outputFile = await this.client.files.content(batch.output_file_id);
  const text = await outputFile.text();

  const results = text
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const data = JSON.parse(line) as {
        custom_id: string;
        response: { body: CreateEmbeddingResponse };
      };

      if (!data.response?.body?.data?.[0]) return null;

      return {
        productId: data.custom_id,
        embedding: data.response.body.data[0].embedding,
      };
    })
    .filter((item) => item !== null);

  return results;
}
```

## Example

**Before (loop sequencial — nao escala):**
```typescript
for (const product of products) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: product.name,
  });
  // processa um por um...
}
```

**After (batch API — producao):**
```typescript
// 1. Cria JSONlines
const jsonLineFile = products.map(p => JSON.stringify({
  custom_id: p.id.toString(),
  method: "POST",
  url: "/v1/embeddings",
  body: { model: "text-embedding-3-small", input: p.name },
})).join("\n");

// 2. Upload + batch create
const file = await client.files.create({ file: new File([jsonLineFile], "embed.jsonl"), purpose: "batch" });
const batch = await client.batches.create({
  input_file_id: file.id,
  endpoint: "/v1/embeddings",
  completion_window: "24h",
});

// 3. Webhook notifica quando pronto — sem polling
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Poucos produtos (< 10) | Embedding direto com `embeddings.create` e OK |
| Dezenas a milhares de produtos | Batch API obrigatoria |
| Precisa do resultado imediato | Embedding direto, batch nao garante tempo |
| Producao com volume | Batch API — 50% desconto + rate limits maiores |
| custom_id precisa ser string | Sempre `.toString()` em IDs numericos |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `for (const p of products) { await embed(p) }` | Batch API com JSONlines |
| Polling com `setInterval` no batch | Webhook handler com `unwrap` |
| `files.retrieve(id)` para pegar conteudo | `files.content(id)` — retrieve so retorna metadados |
| Aceitar webhook sem validar | `client.webhooks.unwrap(rawBody, headers)` |
| Assumir ordem dos resultados | Usar `custom_id` para vincular request/response |
| Parse direto do output file | `.text()` primeiro, depois `.split("\n")` e parse |

## Troubleshooting

### Batch API retorna status mas sem resultados
**Symptom:** Batch status e `completed` mas output_file_id esta undefined
**Cause:** Batch pode ter falhado silenciosamente ou ainda estar processando
**Fix:** Verifique `batch.errors` para diagnostico. Confirme que `status === 'completed'` E `output_file_id` existe antes de processar

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
