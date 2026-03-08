---
name: rs-ia-node-mkt-visao-geral-api
description: "Provides an overview of the OpenAI API ecosystem when planning AI feature integration in Node.js projects. Use when user asks to 'understand openai api', 'overview of openai', 'what apis does openai have', 'plan ai integration', or 'choose openai endpoint'. Maps Chat Completions, Responses API, Embeddings, Batch API, File Search, and Function Calling to use cases. Make sure to use this skill whenever evaluating which OpenAI API to use for a given requirement. Not for implementation details of specific APIs (use dedicated skills for each), non-OpenAI providers, or frontend integration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: fundamentos
  tags: [openai, api-overview, architecture, planning, node-js]
---

# Visao Geral da API OpenAI

> Escolha o endpoint correto da OpenAI baseado no tipo de problema: texto livre usa Chat Completions, dados tipados usam Structured Outputs, busca semantica usa Embeddings, volume usa Batch API.

## Decision framework

| Necessidade | API | Razao |
|-------------|-----|-------|
| Gerar texto livre (chat, copywriting) | Chat Completions / Responses API | Modelo gera texto natural |
| Obter JSON tipado do modelo | Structured Outputs + Zod | Garante schema valido |
| Busca por similaridade semantica | Embeddings API | Vetores para comparacao |
| Processar muitos itens de uma vez | Batch API | 50% desconto, rate limits maiores |
| Dar contexto estatico ao modelo | File Search API | Vetoriza e busca automaticamente |
| Modelo precisa de dados reais | Function Calling | Modelo decide quando buscar |
| Chat com historico | Responses API + previous_response_id | Estado gerenciado pela API |

## Key concept

A OpenAI oferece multiplas APIs que se complementam. O erro mais comum e usar Chat Completions para tudo quando APIs especializadas existem para cada caso. Chat Completions e o canivete suico, mas Structured Outputs garante formato, Embeddings escala busca, e Batch API reduz custos.

## How to think about it

### Texto vs Dados
Se o output sera exibido diretamente ao usuario, Chat Completions basta. Se o output sera consumido por codigo (salvar no banco, alimentar outro servico), use Structured Outputs com Zod schema.

### Real-time vs Background
Se o usuario espera resposta imediata, use chamadas sincronas. Se e processamento em massa (embedar catalogo), use Batch API que custa 50% menos.

### Contexto estatico vs dinamico
Documentos que raramente mudam (receitas, manuais) vao para File Search. Dados que mudam frequentemente (estoque, precos) vao via Function Calling ou injecao no prompt.

## Troubleshooting

### Modelo inventa dados que deveriam vir do banco
**Symptom:** Resposta contem produtos ou precos que nao existem
**Cause:** Dados reais nao foram fornecidos ao modelo — ele alucinou
**Fix:** Use Function Calling para que o modelo busque dados reais sob demanda

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos
