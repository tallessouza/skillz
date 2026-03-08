---
name: rs-ia-node-marketplace-embedding-api
description: "Applies OpenAI Embedding API patterns when building semantic search or similarity features in Node.js. Use when user asks to 'create embeddings', 'implement semantic search', 'compare text similarity', 'embed products', or 'pre-process vectors'. Covers embedding generation, storage, and pre-processing workflow. Make sure to use this skill whenever integrating OpenAI embeddings into a Node.js backend. Not for chat completions, image generation, or front-end search UI."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: embeddings
  tags: [embeddings, openai, ia-node, node-js]
---

# Utilizando a Embedding API

> Gere embeddings com a API da OpenAI, armazene-os no banco e pre-processe todos os itens antes de receber requisicoes do usuario.

## Rules

1. **Use `client.embeddings.create`** — nao `client.completions`, porque embeddings sao vetores numericos para similaridade, nao texto gerado
2. **Modelo padrao: `text-embedding-3-small`** — retorna ~1536 dimensoes por padrao, suficiente para a maioria dos casos
3. **Inclua descricao no input do embedding** — `nome + descricao` evita ambiguidades (ex: "manga" fruta vs manga de camisa)
4. **Pre-processe embeddings no banco** — gere e salve ANTES das requisicoes do usuario, porque gerar em tempo real e lento
5. **Trate falhas com try/catch retornando null** — se um embedding falhar, nao quebre o processamento dos demais
6. **Use Promise.all para poucos itens** — para muitos produtos, processe em chunks sequenciais para respeitar rate limits

## How to write

### Gerar embedding de um texto

```typescript
import OpenAI from "openai"

const client = new OpenAI()

async function generateEmbedding(input: string): Promise<number[] | null> {
  try {
    const response = await client.embeddings.create({
      input,
      model: "text-embedding-3-small",
    })
    return response.data[0].embedding
  } catch {
    return null
  }
}
```

### Pre-processar embeddings de todos os produtos

```typescript
async function embedProducts() {
  const products = getAllProducts()

  await Promise.all(
    products.map(async (product, index) => {
      const embedding = await generateEmbedding(
        `${product.name} ${product.description}`
      )
      if (!embedding) return
      setEmbedding(index, embedding)
    })
  )
}
```

### Rota para disparar pre-processamento

```typescript
app.post("/embeddings", async (req, res) => {
  await embedProducts()
  res.status(201).send()
})
```

## Example

**Before (embedding gerado por requisicao, sem descricao):**
```typescript
app.post("/search", async (req, res) => {
  const { query } = req.body
  const products = getAllProducts()
  // Gera embedding de TODOS os produtos a cada request — lento
  for (const p of products) {
    p.embedding = await generateEmbedding(p.name) // sem descricao = ambiguo
  }
  // compara...
})
```

**After (pre-processado com descricao):**
```typescript
// 1. Pre-processa uma vez
app.post("/embeddings", async (req, res) => {
  await embedProducts() // salva no banco com nome + descricao
  res.status(201).send()
})

// 2. Na busca, so gera embedding do input do usuario
app.post("/search", async (req, res) => {
  const { query } = req.body
  const queryEmbedding = await generateEmbedding(query)
  const products = getAllProducts() // ja tem embeddings salvos
  // compara queryEmbedding com product.embedding
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Poucos produtos (<100) | `Promise.all` para gerar todos de uma vez |
| Muitos produtos (>100) | Chunks sequenciais para respeitar rate limits |
| Texto curto (so nome) | Adicione descricao para contexto semantico |
| Embedding pode ser null | Verifique antes de salvar ou comparar |
| Produto sem descricao | Use so o nome, mas documente a limitacao |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Gerar embeddings a cada request | Pre-processar e salvar no banco |
| Usar so `product.name` no input | `${product.name} ${product.description}` |
| Deixar erro de embedding quebrar o loop | Try/catch retornando null, continue os demais |
| Ignorar o campo `model` | Sempre especificar `text-embedding-3-small` explicitamente |
| Mutar o array original do banco | Trabalhar com copia ou usar funcao setter |

## Troubleshooting

### Busca por similaridade retorna produtos irrelevantes
**Symptom:** Produtos retornados nao tem relacao semantica com o input
**Cause:** Embeddings gerados com pouco contexto (so nome, sem descricao) ou modelo de embedding diferente entre geracao e busca
**Fix:** Concatene nome + descricao ao gerar embeddings. Garanta que o mesmo modelo de embedding e usado na geracao e na busca

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
