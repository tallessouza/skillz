---
name: rs-ia-node-marketplace-embeddings-intro
description: "Applies embedding-based similarity search patterns when building product recommendation, semantic search, or text-to-number comparison features in Node.js. Use when user asks to 'find similar items', 'recommend products', 'semantic search', 'compare texts', 'use embeddings', or 'OpenAI embedding API'. Covers pre-processing strategy, cosine similarity, and vector storage. Make sure to use this skill whenever implementing any feature that requires measuring similarity between texts or items. Not for image embeddings, fine-tuning models, or RAG with document chunking."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: embeddings
  tags: [postgresql, embeddings, node-js, openai, ia-node]
---

# Embeddings — Transformando Texto em Numeros

> Pre-processe embeddings no cadastro, compare no momento da busca — nunca envie o catalogo inteiro no prompt.

## Rules

1. **Nunca envie todos os produtos no prompt** — limite de tokens e custo explodem com catalogos grandes (1K+ itens), porque cada requisicao reprocessa tudo
2. **Pre-processe embeddings no cadastro** — gere e salve o vetor quando o produto for criado/atualizado, porque a geracao e barata e o custo se paga uma vez so
3. **Gere embedding apenas do input na busca** — no momento da requisicao, processe so o texto do usuario e compare com vetores ja salvos, porque isso e rapido e barato
4. **Use funcoes nativas do banco para similaridade** — Postgres (pgvector) e Mongo tem operacoes vetoriais otimizadas, porque comparacao em massa precisa de performance
5. **Limite resultados por top-K** — retorne os 10-20 itens mais similares, nao todos, porque o modelo de linguagem trabalha melhor com contexto focado
6. **Embeddings sao vetores multidimensionais** — o menor modelo da OpenAI usa 1536 dimensoes, cada dimensao captura um fator de analise implicito

## How to write

### Pre-processamento no cadastro

```typescript
import OpenAI from "openai"

const openai = new OpenAI()

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  })
  return response.data[0].embedding
}

// Ao cadastrar produto, salvar embedding junto
async function createProduct(name: string, description: string) {
  const embedding = await generateEmbedding(`${name} ${description}`)
  await db.products.insert({ name, description, embedding })
}
```

### Busca por similaridade

```typescript
async function findSimilarProducts(query: string, limit = 10) {
  const queryEmbedding = await generateEmbedding(query)

  // Banco faz a comparacao vetorial (ex: pgvector)
  const similar = await db.query(
    `SELECT name, 1 - (embedding <=> $1) AS similarity
     FROM products
     ORDER BY embedding <=> $1
     LIMIT $2`,
    [JSON.stringify(queryEmbedding), limit]
  )

  return similar
}
```

## Example

**Before (abordagem ingênua — cara e limitada):**
```typescript
const products = await db.products.findAll() // 10K produtos
const prompt = `Liste produtos para feijoada.
Considere: ${products.map(p => p.name).join(", ")}`
// Prompt gigante, caro, pode estourar limite de tokens
const result = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: prompt }],
})
```

**After (com embeddings — eficiente e escalavel):**
```typescript
// Embeddings ja pre-processados no banco
const similar = await findSimilarProducts("feijoada", 10)
// similar: feijao (0.95), arroz (0.92), charque (0.85), couve (0.83)...

const prompt = `Liste produtos para feijoada.
Considere: ${similar.map(p => p.name).join(", ")}`
// Prompt pequeno, so com itens relevantes
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Catalogo com 100+ itens | Use embeddings, nunca envie tudo no prompt |
| Produto criado/atualizado | Gere embedding e salve no banco |
| Busca do usuario | Gere embedding so do input, compare com banco |
| Precisa de similaridade entre textos | Use distancia coseno (angulo entre vetores) |
| Banco e Postgres | Use extensao pgvector com operador `<=>` |
| Banco e MongoDB | Use Atlas Vector Search |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Enviar catalogo inteiro no prompt | Pre-processar embeddings e buscar top-K similares |
| Gerar embeddings a cada busca para todos os itens | Gerar uma vez no cadastro, consultar no banco |
| Comparar vetores manualmente no codigo | Usar funcoes vetoriais nativas do banco |
| Retornar todos os resultados da comparacao | Limitar a top 10-20 mais similares |
| Ignorar embedding ao cadastrar produto | Sempre gerar e salvar junto com o produto |

## Troubleshooting

### Busca por similaridade retorna produtos irrelevantes
**Symptom:** Produtos retornados nao tem relacao semantica com o input
**Cause:** Embeddings gerados com pouco contexto (so nome, sem descricao) ou modelo de embedding diferente entre geracao e busca
**Fix:** Concatene nome + descricao ao gerar embeddings. Garanta que o mesmo modelo de embedding e usado na geracao e na busca

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
