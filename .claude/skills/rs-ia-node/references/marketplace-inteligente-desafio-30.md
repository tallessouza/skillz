---
name: rs-ia-node-marketplace-desafio-receitas
description: "Applies knowledge base enrichment patterns when building AI chat systems that accept user-provided content (PDFs, text). Use when user asks to 'add documents to AI context', 'upload PDFs for RAG', 'enrich model knowledge', 'implement file upload for chatbot', or 'build recipe/document ingestion'. Guides decision between inline prompt injection, vector store embeddings, or text extraction pipelines. Make sure to use this skill whenever implementing document ingestion for LLM-powered features. Not for general file upload, image processing, or non-AI document storage."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: projeto-final
  tags: [embeddings, ia-node, node-js]
---

# Enriquecimento de Base de Conhecimento para Chat AI

> Ao implementar ingestao de documentos (PDF, texto) para enriquecer um chat AI, escolha a estrategia de processamento baseada no volume e tipo de uso.

## Rules

1. **Avalie o volume antes de escolher a estrategia** — poucos documentos curtos podem ir direto no prompt, muitos documentos longos exigem vetorizacao, porque custo de tokens e latencia crescem linearmente com contexto inline
2. **Suporte multiplos formatos de entrada** — aceite PDF upload E texto digitado, porque usuarios tem conteudo em formatos diferentes e fricção de conversão reduz adoção
3. **Extraia texto antes de qualquer processamento** — PDF precisa virar texto limpo antes de ir pro prompt ou pro vector store, porque modelos nao processam binarios
4. **Considere o conteudo ingerido em toda interacao do chat** — tudo que o usuario upou deve influenciar as respostas, porque o valor esta na personalizacao

## Decision Framework

| Cenario | Estrategia | Razao |
|---------|-----------|-------|
| Poucos docs, texto curto (<4K tokens total) | Inline no prompt | Simples, sem infra extra |
| Muitos docs ou textos longos (>4K tokens) | Vector store (ex: OpenAI Vector Store) | Busca semantica escala melhor |
| Docs estruturados com campos especificos | Extração + parsing customizado | Preserva estrutura dos dados |
| Mix de formatos (PDF + texto livre) | Pipeline: extrai texto → decide rota | Normaliza entrada antes de processar |

## How to Implement

### Pipeline de Ingestao

```typescript
// 1. Receber input (PDF ou texto)
// 2. Normalizar para texto puro
// 3. Decidir rota baseado no volume
// 4. Disponibilizar para o chat

async function ingestRecipe(input: PDFFile | string): Promise<void> {
  const text = typeof input === 'string'
    ? input
    : await extractTextFromPDF(input)

  if (totalKnowledgeBaseTokens + countTokens(text) < INLINE_THRESHOLD) {
    await addToInlineContext(text)
  } else {
    await addToVectorStore(text)
  }
}
```

### Uso no Chat

```typescript
// Inline: concatena no system prompt
const systemPrompt = `${BASE_PROMPT}\n\nReceitas do usuario:\n${recipes.join('\n')}`

// Vector store: busca semantica antes de responder
const relevantRecipes = await vectorStore.search(userQuestion, { topK: 3 })
const systemPrompt = `${BASE_PROMPT}\n\nReceitas relevantes:\n${relevantRecipes.join('\n')}`
```

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Mandar PDF binario direto pro modelo | Extrair texto primeiro, depois enviar |
| Sempre usar vector store para 2-3 docs curtos | Avaliar se inline no prompt resolve |
| Ignorar conteudo upado nas respostas do chat | Incluir receitas no contexto de toda interacao |
| Forcar um unico formato de entrada | Aceitar PDF e texto, normalizar internamente |

## Troubleshooting

### Resultado inesperado do modelo
**Symptom:** Resposta da IA nao corresponde ao formato ou conteudo esperado
**Cause:** Prompt insuficiente, parametros mal configurados, ou modelo sem contexto adequado
**Fix:** Revise o prompt com exemplos concretos (few-shot), ajuste temperature, e verifique se os dados necessarios foram fornecidos ao modelo

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
