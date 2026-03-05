# Code Examples: OpenAI Batch API

## Exemplo 1: Construindo o conteudo JSONL

```typescript
// Cada produto e uma string ja formatada (nome + descricao)
const products = ["Sorvete de chocolate - Delicioso sorvete artesanal", "Alface crespa - Fresca e organica"];

const content = products
  .map((p, i) => JSON.stringify({
    custom_id: String(i),
    method: "POST",
    url: "/v1/embeddings",
    body: {
      input: p,
      model: "text-embedding-3-small",
      encoding_format: "float",
    },
  }))
  .join("\n");

// Resultado (cada linha e um JSON stringificado):
// {"custom_id":"0","method":"POST","url":"/v1/embeddings","body":{"input":"Sorvete de chocolate...","model":"text-embedding-3-small","encoding_format":"float"}}
// {"custom_id":"1","method":"POST","url":"/v1/embeddings","body":{"input":"Alface crespa...","model":"text-embedding-3-small","encoding_format":"float"}}
```

## Exemplo 2: Salvando JSONL localmente (para debug)

```typescript
import { writeFile } from "node:fs/promises";
import path from "node:path";

await writeFile(
  path.join(__dirname, "content-file.jsonl"),
  content
);
```

## Exemplo 3: Upload do arquivo para OpenAI

```typescript
const file = new File([content], "embeddings-batch.jsonl");

const uploaded = await client.files.create({
  file,
  purpose: "batch",
});

// uploaded.id -> ID do arquivo na infraestrutura da OpenAI
// uploaded.purpose -> "batch"
// uploaded.bytes -> tamanho do arquivo
```

## Exemplo 4: Criacao do batch

```typescript
const batch = await client.batches.create({
  input_file_id: uploaded.id,
  endpoint: "/v1/embeddings",
  completion_window: "24h",
});

// batch.id -> ID do batch para verificar status depois
// batch.status -> "validating" inicialmente
// batch.input_file_id -> ID do arquivo enviado
// batch.completion_window -> "24h"
```

## Exemplo 5: Rota Express completa

```typescript
import { createEmbeddingsBatchFile, createEmbeddingsBatch } from "./openai";

app.post("/embeddings-batch", async (req, res) => {
  // Passo 1: Criar e subir o arquivo JSONL
  const file = await createEmbeddingsBatchFile([
    "Sorvete de chocolate - Delicioso sorvete artesanal",
    "Alface crespa - Fresca e organica",
  ]);

  // Passo 2: Criar o batch com o arquivo
  const batch = await createEmbeddingsBatch(file.id);

  // Retornar o batch (salvar batch.id para consultar depois)
  res.json(batch);
});
```

## Exemplo 6: Modulo OpenAI completo

```typescript
// openai.ts
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function createEmbeddingsBatchFile(products: string[]) {
  const content = products
    .map((p, i) => JSON.stringify({
      custom_id: String(i),
      method: "POST",
      url: "/v1/embeddings",
      body: {
        input: p,
        model: "text-embedding-3-small",
        encoding_format: "float",
      },
    }))
    .join("\n");

  const file = new File([content], "embeddings-batch.jsonl");

  const uploaded = await client.files.create({
    file,
    purpose: "batch",
  });

  return uploaded;
}

export async function createEmbeddingsBatch(fileId: string) {
  const batch = await client.batches.create({
    input_file_id: fileId,
    endpoint: "/v1/embeddings",
    completion_window: "24h",
  });

  return batch;
}
```

## Variacao: Batch para Chat Completions

```typescript
const content = prompts
  .map((prompt, i) => JSON.stringify({
    custom_id: String(i),
    method: "POST",
    url: "/v1/chat/completions",
    body: {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Voce e um assistente util." },
        { role: "user", content: prompt },
      ],
    },
  }))
  .join("\n");
```

## Variacao: Batch para Response API

```typescript
const content = inputs
  .map((input, i) => JSON.stringify({
    custom_id: String(i),
    method: "POST",
    url: "/v1/responses",
    body: {
      model: "gpt-4o-mini",
      input,
    },
  }))
  .join("\n");
```