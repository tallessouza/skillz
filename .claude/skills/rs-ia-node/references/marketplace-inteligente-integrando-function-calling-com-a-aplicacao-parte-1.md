---
name: rs-ia-node-marketplace-function-calling-pt1
description: "Applies OpenAI function calling integration pattern when building AI-powered Node.js applications. Use when user asks to 'add tools to OpenAI', 'implement function calling', 'let AI call my functions', 'connect OpenAI to database', or 'make AI use real data'. Covers tool definition schema, tool_calls response handling, and dynamic function dispatch. Make sure to use this skill whenever integrating OpenAI chat completions with application-specific functions. Not for streaming, embeddings, or image generation."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: function-calling
  tags: [openai, ia-node, node-js, function-calling]
---

# Integrando Function Calling com OpenAI

> Defina funcoes da aplicacao como tools para a OpenAI, intercepte tool_calls na resposta, e dispatch dinamicamente antes de gerar a resposta final.

## Rules

1. **Modularize o cliente OpenAI** — separe inicializacao e interacao em modulo proprio, porque o route handler so deve saber chamar `generateProducts(input)`, nao os detalhes da API
2. **Passe tools junto com o prompt** — sempre que o modelo precisar de dados reais (estoque, precos, disponibilidade), declare as funcoes disponiveis no array `tools`, porque sem isso ele inventa dados
3. **Instrua no prompt que use as tools** — adicione "considere apenas os produtos em estoque" no system/user message, porque o modelo precisa saber QUANDO chamar a tool
4. **Trate tool_calls antes do content** — quando o modelo decide chamar uma funcao, `message.content` sera `null` e `message.tool_calls` tera a lista de chamadas, porque ele nao gera resposta direta sem os dados
5. **Use strict mode nas tools** — `strict: true` + `additionalProperties: false` garante que o modelo respeita o schema exato dos parametros
6. **Dispatch dinamico com mapa de funcoes** — use um objeto `{ nome: funcao }` ao inves de if/else encadeado, porque escala melhor com mais tools

## How to write

### Definicao de tools

```typescript
import { ChatCompletionTool } from "openai/resources/chat/completions";

const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "produtos_em_estoque",
      description: "Lista os produtos que estao em estoque",
      strict: true,
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "produtos_em_falta",
      description: "Lista os produtos que estao em falta no estoque",
      strict: true,
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
    },
  },
];
```

### Chamada com tools

```typescript
const completion = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages,
  tools,
});
```

### Interceptar e dispatch tool_calls

```typescript
const { tool_calls } = completion.choices[0].message;

if (tool_calls) {
  const toolCall = tool_calls[0]; // sem paralelismo, sempre 1 item

  const toolsMap: Record<string, () => Product[]> = {
    produtos_em_estoque: produtosEmEstoque,
    produtos_em_falta: produtosEmFalta,
  };

  const functionToCall = toolsMap[toolCall.function.name];

  if (!functionToCall) {
    throw new Error(`Funcao nao encontrada: ${toolCall.function.name}`);
  }

  const result = functionToCall();
  // Proximo passo: devolver result para a OpenAI (parte 2)
}
```

## Example

**Before (sem function calling — modelo inventa produtos):**
```typescript
const completion = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "user", content: "Liste 3 produtos para cafe da manha saudavel" },
  ],
});
// Retorna produtos inventados, ignora estoque real
```

**After (com function calling — modelo consulta dados reais):**
```typescript
const completion = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "user",
      content: "Liste 3 produtos para cafe da manha saudavel. Considere apenas produtos em estoque.",
    },
  ],
  tools,
});

// completion.choices[0].message.content === null
// completion.choices[0].message.tool_calls === [{ function: { name: "produtos_em_estoque", arguments: "{}" } }]
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Modelo precisa de dados reais da aplicacao | Defina tools com as funcoes que fornecem esses dados |
| Tool nao recebe parametros | Passe `properties: {}` e `additionalProperties: false` mesmo assim |
| Precisa de paralelismo de tools | Itere sobre todo o array `tool_calls` (nesta aula usa so index 0) |
| content volta null | Verifique `tool_calls` — o modelo quer chamar uma funcao antes de responder |
| Modelo nao chama a tool esperada | Melhore a `description` da tool e o prompt do usuario |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Confiar que content sempre tem valor | Cheque `tool_calls` antes de usar `content` |
| if/else para cada funcao | Use mapa `{ nome: fn }` para dispatch |
| Omitir `description` na tool | Sempre descreva o proposito da funcao |
| Omitir `strict: true` | Sempre use strict para garantir schema |
| Deixar todo codigo no route handler | Separe modulo OpenAI do handler HTTP |
| Passar dados de estoque hardcoded no prompt | Use function calling para buscar dados dinamicamente |

## Troubleshooting

### Modelo nao chama a funcao esperada
**Symptom:** completion retorna content direto em vez de tool_calls
**Cause:** Description da tool muito vaga, ou prompt do usuario nao indica necessidade de dados reais
**Fix:** Melhore a description da tool com casos de uso claros. Adicione no prompt instrucoes explicitas como "considere apenas produtos em estoque" 

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
