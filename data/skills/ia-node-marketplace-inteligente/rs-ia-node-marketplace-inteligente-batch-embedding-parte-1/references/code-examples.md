# Code Examples: Batch Embedding com OpenAI

## Exemplo completo: batchEmbedProducts

```typescript
// llm-service.ts

import { OpenAI } from "openai";
import type { CreateEmbeddingResponse } from "openai/resources";

interface ProductInput {
  id: number;
  name: string;
}

interface EmbeddedProduct {
  productId: string;
  embedding: number[];
}

class LLMService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      // webhook secret configurado aqui
    });
  }

  async batchEmbedProducts(products: ProductInput[]): Promise<void> {
    // 1. Criar arquivo JSONlines
    const jsonLineFile = products
      .map((product) =>
        JSON.stringify({
          custom_id: product.id.toString(), // MUST be string
          method: "POST",
          url: "/v1/embeddings",
          body: {
            model: "text-embedding-3-small",
            input: product.name,
          },
        })
      )
      .join("\n");

    // 2. Upload do arquivo
    const file = await this.client.files.create({
      file: new File([jsonLineFile], "embeddings.jsonl", {
        type: "application/jsonl",
      }),
      purpose: "batch",
    });

    if (!file.id) return;

    // 3. Criar o batch
    const batch = await this.client.batches.create({
      input_file_id: file.id,
      endpoint: "/v1/embeddings",
      completion_window: "24h", // unico disponivel hoje, 50% desconto
    });

    console.log("Batch criado:", batch.id);
    // Nao precisa salvar — webhook notifica quando pronto
  }

  async handleWebhook(
    rawBody: string,
    headers: Record<string, string>
  ): Promise<EmbeddedProduct[] | undefined> {
    // 1. Validar autenticidade + parse
    const event = this.client.webhooks.unwrap(rawBody, headers);

    // 2. Filtrar tipo de evento
    if (event.type !== "batch.completed") {
      console.log("Evento recebido, ignorando:", event.type);
      return;
    }

    console.log("Batch completo recebido");

    // 3. Buscar batch e output file
    const batch = event.data;
    if (!batch?.output_file_id) return;

    const outputFile = await this.client.files.content(batch.output_file_id);
    // IMPORTANTE: content() retorna response, precisa de .text()
    const text = await outputFile.text();

    // 4. Parse do JSONlines de resposta (desfaz o que fizemos na criacao)
    const results = text
      .split("\n")
      .filter((line) => line.trim() !== "") // remove linhas vazias
      .map((line) => {
        const data = JSON.parse(line) as {
          custom_id: string;
          response: { body: CreateEmbeddingResponse };
        };

        // Validacao em cadeia — qualquer nivel pode estar ausente
        if (!data.response?.body?.data?.[0]) {
          console.warn("Embedding invalido para:", data.custom_id);
          return null;
        }

        return {
          productId: data.custom_id,
          embedding: data.response.body.data[0].embedding,
        };
      })
      .filter((item): item is EmbeddedProduct => item !== null);

    console.log(`Processados ${results.length} embeddings de ${products.length}`);
    return results;
  }
}
```

## Estrutura do JSONlines de request

Cada linha do arquivo enviado:

```json
{"custom_id":"1","method":"POST","url":"/v1/embeddings","body":{"model":"text-embedding-3-small","input":"Camiseta React"}}
{"custom_id":"2","method":"POST","url":"/v1/embeddings","body":{"model":"text-embedding-3-small","input":"Caneca Node.js"}}
{"custom_id":"3","method":"POST","url":"/v1/embeddings","body":{"model":"text-embedding-3-small","input":"Adesivo TypeScript"}}
```

## Estrutura do JSONlines de response

Cada linha do arquivo retornado:

```json
{"custom_id":"1","response":{"status_code":200,"body":{"object":"list","data":[{"object":"embedding","index":0,"embedding":[0.0023,-0.0091,...]}],"model":"text-embedding-3-small","usage":{"prompt_tokens":3,"total_tokens":3}}}}
{"custom_id":"2","response":{"status_code":200,"body":{"object":"list","data":[{"object":"embedding","index":0,"embedding":[0.0045,-0.0012,...]}],"model":"text-embedding-3-small","usage":{"prompt_tokens":3,"total_tokens":3}}}}
```

## Rota de webhook (exemplo com Express/Fastify)

```typescript
// routes.ts — exemplo de como expor o webhook handler

app.post("/webhooks/openai", async (request, reply) => {
  const rawBody = request.rawBody; // precisa do raw body, nao parseado
  const headers = request.headers as Record<string, string>;

  const results = await llmService.handleWebhook(rawBody, headers);

  if (results) {
    // Salvar embeddings no banco, cache, etc.
    await productRepository.saveEmbeddings(results);
  }

  return reply.status(200).send({ received: true });
});
```

## Comparacao: embedding direto vs batch

```typescript
// DIRETO — para poucos items, resultado imediato
const response = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: "Camiseta React",
});
const embedding = response.data[0].embedding;

// BATCH — para muitos items, 50% desconto, ate 24h
// 1. JSONlines → 2. Upload → 3. Batch create → 4. Webhook recebe resultado
```