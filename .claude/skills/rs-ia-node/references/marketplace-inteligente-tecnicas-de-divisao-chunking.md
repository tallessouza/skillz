---
name: rs-ia-node-mkt-chunking
description: "Applies prompt chunking technique when processing large datasets through LLM APIs. Use when user asks to 'process many items with AI', 'split prompt into chunks', 'handle large product lists', 'improve LLM response quality', or 'avoid context window limits'. Splits large inputs into smaller prompts, processes in parallel with Promise.all, then merges results with filter and flatMap. Make sure to use this skill whenever sending large arrays of data to an LLM and quality degrades. Not for text splitting for embeddings/RAG, nor for streaming or pagination."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: prompt-engineering
  tags: [chunking, ia-node, node-js]
---

# Técnicas de Divisão (Chunking) para Prompts

> Quando o volume de dados enviados ao modelo compromete a qualidade, divida o prompt em chunks menores, processe em paralelo e junte os resultados.

## Rules

1. **Divida quando a quantidade de dados é grande demais para o contexto** — se após pré-filtragem ainda restam centenas/milhares de itens, o modelo perde detalhes e alucina, porque a janela de contexto tem limites práticos de atenção
2. **Defina chunk size empiricamente** — comece com valores como 100-250 itens por chunk e ajuste conforme o comportamento do modelo, porque cada modelo tem janela de contexto e capacidade de atenção diferentes
3. **Processe chunks em paralelo com Promise.all** — não encadeie sequencialmente, porque o tempo total seria multiplicado pelo número de chunks
4. **Filtre resultados nulos antes de mergear** — chunks podem falhar individualmente, porque erros de rede ou do modelo não devem invalidar todo o resultado
5. **Use flatMap para juntar arrays aninhados** — cada chunk retorna seu próprio array de resultados, porque o resultado final deve ser um array plano unificado

## How to write

### Função de criação de chunks

```typescript
function createCartPromptChunks(input: string, products: Product[]): string[] {
  const chunkSize = 10 // ajustar conforme volume real
  const chunks: string[] = []

  for (let i = 0; i < products.length; i += chunkSize) {
    const slice = products.slice(i, i + chunkSize)
    chunks.push(`Return 5 products satisfying the user need.
Products: ${JSON.stringify(slice)}
Input: ${input}`)
  }

  return chunks
}
```

### Processamento paralelo e merge

```typescript
type CartResult = { products: string[] }

const promises = createCartPromptChunks(input, products).map((chunk) =>
  generateResponse<CartResult>({
    model: "gpt-4o-mini",
    instructions: chunk,
    input,
    schema: cartSchema,
  })
)

const results = await Promise.all(promises)

return results
  .filter((r): r is CartResult => Boolean(r))
  .flatMap((r) => r.products)
```

### Generic na generateResponse para tipagem correta

```typescript
async function generateResponse<T = null>(params: GenerateParams): Promise<T | null> {
  const response = await openai.responses.parse(params)
  return response.outputParsed ?? null
}

// Uso com tipo explícito:
const result = await generateResponse<{ products: string[] }>({ ... })
// result é { products: string[] } | null
```

## Example

**Before (todos os produtos em um único prompt):**
```typescript
const result = await generateResponse({
  model: "gpt-4o-mini",
  instructions: `Return 5 products. Products: ${JSON.stringify(allProducts)}`,
  input: "feijoada",
})
// Com 1000 produtos, modelo perde detalhes e alucina
```

**After (com chunking):**
```typescript
const chunks = createCartPromptChunks("feijoada", allProducts) // 100 chunks de 10
const promises = chunks.map((chunk) =>
  generateResponse<{ products: string[] }>({ instructions: chunk, input: "feijoada" })
)
const results = await Promise.all(promises)
const products = results
  .filter((r): r is { products: string[] } => Boolean(r))
  .flatMap((r) => r.products)
// Cada chunk recebe atenção total do modelo
```

## Heuristics

| Situação | Ação |
|----------|------|
| < 50 itens e modelo grande | Chunk desnecessário, envie tudo |
| 50-500 itens | Teste com e sem chunk, compare qualidade |
| > 500 itens após pré-filtragem | Chunk obrigatório |
| Modelo com janela pequena (8K) | Chunks menores (10-50 itens) |
| Modelo com janela grande (128K) | Chunks maiores (100-250 itens) |
| Resultados duplicados entre chunks | Adicione deduplicação no merge |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Enviar milhares de itens em um prompt só | Dividir em chunks e processar em paralelo |
| Encadear chunks sequencialmente com await em loop | Usar `Promise.all` para paralelismo |
| Ignorar chunks que falharam e retornar vazio | Filtrar nulos e retornar resultados válidos |
| Hardcodar chunk size sem considerar o modelo | Definir chunk size baseado no modelo e volume |
| Retornar arrays aninhados `[[a,b],[c,d]]` | Usar `flatMap` para resultado plano `[a,b,c,d]` |

## Troubleshooting

### Resultado inesperado do modelo
**Symptom:** Resposta da IA nao corresponde ao formato ou conteudo esperado
**Cause:** Prompt insuficiente, parametros mal configurados, ou modelo sem contexto adequado
**Fix:** Revise o prompt com exemplos concretos (few-shot), ajuste temperature, e verifique se os dados necessarios foram fornecidos ao modelo

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
