---
name: rs-ia-node-marketplace-file-search-api
description: "Applies OpenAI File Search API pattern when implementing RAG with static data files. Use when user asks to 'add context to AI', 'upload files to OpenAI', 'create vector store', 'use file search', 'give AI access to documents', or 'contextualize a model'. Covers upload, VectorStore creation, and Responses API integration. Make sure to use this skill whenever integrating static knowledge bases with OpenAI models. Not for dynamic data, real-time inventory, embeddings from scratch, or non-OpenAI providers."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: file-search
  tags: [node-js, function-calling, file-search, responses-api, openai, ia-node]
---

# File Search API — Contextualizacao com Arquivos Estaticos

> Use File Search para dar ao modelo acesso a informacoes estaticas (receitas, catalogos, documentacao) que ele nao conhece nativamente.

## Rules

1. **Escolha a estrategia certa de contextualizacao** — File Search para dados estaticos, embeddings para dados dinamicos, prompt injection para poucos dados, porque cada abordagem tem trade-offs de custo e latencia
2. **Nunca injete grandes volumes no prompt** — custa mais por token e pode estourar o limite de contexto, porque File Search vetoriza e busca apenas o trecho relevante
3. **Separe upload, VectorStore e consulta em etapas distintas** — porque cada passo pode falhar independentemente e precisa de verificacao
4. **Verifique o status de processamento antes de consultar** — porque a VectorStore demora para processar e consultas antes da conclusao falham silenciosamente
5. **Persista IDs no banco de dados** — file ID e vectorStore ID devem ser salvos, porque sao necessarios para consultas futuras e nao devem ficar hardcoded

## Decision framework

| Cenario | Estrategia | Razao |
|---------|-----------|-------|
| Poucos dados, mudam frequentemente (estoque) | Injecao no prompt | Simples, sem setup |
| Muitos dados, mudam frequentemente | Embeddings proprios | Controle total, custo por query baixo |
| Dados estaticos (receitas, docs, catalogos) | File Search API | OpenAI vetoriza automaticamente, zero infra |
| Dados estaticos + dinamicos juntos | File Search + prompt injection | Combina ambos |

## How to implement

### Step 1: Upload do arquivo

```typescript
import OpenAI from "openai";
import fs from "node:fs";
import path from "node:path";

const client = new OpenAI();

async function uploadFile(filePath: string) {
  const file = fs.createReadStream(filePath);

  const uploaded = await client.files.create({
    file,
    purpose: "assistants",
  });

  // Salvar uploaded.id no banco de dados
  console.log("File ID:", uploaded.id);
  return uploaded;
}
```

### Step 2: Criar VectorStore com o arquivo

```typescript
async function createVectorStore(fileId: string) {
  const vectorStore = await client.vectorStores.create({
    name: "minha-base-de-conhecimento",
    file_ids: [fileId], // Aceita N arquivos
  });

  // Salvar vectorStore.id no banco de dados
  console.log("VectorStore ID:", vectorStore.id);
  return vectorStore;
}
```

### Step 3: Verificar status de processamento

```typescript
async function checkProcessingStatus(vectorStoreId: string) {
  const files = await client.vectorStores.files.list(vectorStoreId);

  for (const file of files.data) {
    console.log(`${file.id}: ${file.status}`);
    // status: "in_progress" | "completed" | "failed"
  }

  return files.data.every((f) => f.status === "completed");
}
```

### Step 4: Usar na Responses API

```typescript
const response = await client.responses.create({
  model: "gpt-4o",
  input: "Como fazer arrumadinho?",
  tools: [
    {
      type: "file_search",
      vector_store_ids: [vectorStoreId], // Apenas 1 por enquanto
    },
  ],
});
```

## Example

**Sem File Search — modelo nao conhece receitas proprias:**
```typescript
// Input: "arrumadinho"
// Output: "Nao tenho informacoes sobre essa receita"
const response = await client.responses.create({
  model: "gpt-4o",
  input: `Retorna os produtos para: arrumadinho.
          Produtos disponiveis: ${productList}`,
});
```

**Com File Search — modelo consulta base de receitas:**
```typescript
// Input: "arrumadinho"
// Output: lista completa de ingredientes da receita propria
const response = await client.responses.create({
  model: "gpt-4o",
  input: `Retorna os produtos para: arrumadinho.
          Produtos disponiveis: ${productList}`,
  tools: [
    {
      type: "file_search",
      vector_store_ids: [vectorStoreId],
    },
  ],
});
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Dados mudam diariamente (estoque) | NAO use File Search, injete no prompt ou use embeddings |
| Dados mudam semanalmente (cardapio) | File Search com rotina de re-upload semanal |
| Dados nunca mudam (documentacao interna) | File Search, configure uma vez |
| Precisa de multiplos arquivos | Adicione todos na mesma VectorStore |
| Arquivo grande demora para processar | Implemente polling de status antes de liberar consultas |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Hardcodar file ID e vectorStore ID no codigo | Salvar no banco de dados apos criacao |
| Consultar sem verificar se processamento terminou | Checar `status === "completed"` antes |
| Criar uma VectorStore por arquivo | Agrupar arquivos relacionados na mesma VectorStore |
| Usar File Search para dados que mudam toda hora | Usar embeddings proprios ou injecao no prompt |
| Injetar 10k+ tokens de contexto direto no prompt | Usar File Search para a OpenAI vetorizar automaticamente |

## Troubleshooting

### Resposta da API retorna null ou undefined
**Symptom:** `completion.choices[0].message.content` retorna null
**Cause:** O modelo retornou tool_calls em vez de content, ou max_tokens insuficiente
**Fix:** Verifique `message.tool_calls` antes de acessar content. Aumente max_completion_tokens se a resposta foi cortada

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
