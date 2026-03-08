---
name: rs-ia-node-explorando-parametros-api
description: "Applies correct OpenAI API parameter configuration when writing chat completion calls. Use when user asks to 'call OpenAI API', 'configure GPT parameters', 'set temperature', 'create chat completion', 'limit tokens', or 'set up messages array'. Enforces proper message roles (user/developer/assistant), max_completion_tokens usage, temperature vs topP selection, and response extraction patterns. Make sure to use this skill whenever writing OpenAI chat.completions.create() calls. Not for streaming, function calling, embeddings, or image generation APIs."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: fundamentos
  tags: [openai, ia-node, node-js, function-calling]
---

# Parametros da API OpenAI — Chat Completions

> Configurar cada parametro do chat.completions.create() com intencao explicita, nunca usar valores padrao sem justificativa.

## Rules

1. **Use max_completion_tokens, nao max_tokens** — `max_tokens` foi depreciado, porque `max_completion_tokens` e a versao atual da API
2. **Escolha temperature OU topP, nunca ambos** — a OpenAI recomenda usar um ou outro, porque combinar os dois gera comportamento imprevisivel
3. **Regras de sistema vao na role developer** — use `developer` para instrucoes do desenvolvedor, porque tem peso maior que `user` e substitui o antigo `system`
4. **Reconstrua historico com role assistant** — ao manter contexto de chat, mensagens anteriores do GPT usam role `assistant`, porque o modelo precisa do historico completo para respostas coerentes
5. **Combine limites de tokens com instrucoes no prompt** — defina max_completion_tokens como trava hard E instrua no prompt o tamanho desejado, porque o prompt sozinho pode ser ignorado (alucinacao) e o token limit sozinho corta sem contexto
6. **Extraia resposta via choices[0].message.content** — o retorno vem em `completion.choices[0].message.content`, porque a API retorna array de choices mesmo com uma unica resposta

## How to write

### Chamada basica com parametros corretos

```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "developer", content: "Responda em portugues, maximo uma frase." },
    { role: "user", content: "O que sao unicornios?" },
  ],
  max_completion_tokens: 150,
  temperature: 0.7,
})

const resposta = completion.choices[0].message.content
```

### Chat com historico reconstruido

```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "developer", content: "Use emojis a cada duas palavras." },
    { role: "user", content: "Me fale sobre unicornios" },
    { role: "assistant", content: "Unicornios 🦄 sao criaturas 🌟 magicas..." },
    { role: "user", content: "Obrigado! Conte mais." },
  ],
  max_completion_tokens: 300,
  temperature: 1.2,
})
```

## Example

**Before (parametros incorretos):**
```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: "Seja breve." },  // system depreciado
    { role: "user", content: "Explique IA" },
  ],
  max_tokens: 100,        // depreciado
  temperature: 0.5,
  top_p: 0.9,             // nao usar junto com temperature
})
console.log(completion)   // objeto inteiro, nao o conteudo
```

**After (com esta skill aplicada):**
```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "developer", content: "Responda em no maximo uma frase." },
    { role: "user", content: "Explique IA" },
  ],
  max_completion_tokens: 100,
  temperature: 0.5,
})
console.log(completion.choices[0].message.content)
```

## Heuristics

| Situacao | Do |
|----------|-----|
| Respostas precisam ser deterministicas (classificacao, extracao) | temperature: 0 a 0.3 |
| Respostas criativas (copywriting, brainstorm) | temperature: 1.0 a 2.0 |
| Controle fino de probabilidade de tokens | Use topP em vez de temperature |
| Chat com multiplas rodadas | Reconstrua historico completo com roles corretas |
| Limitar custo da API | Defina max_completion_tokens conservador |
| Instrucoes do desenvolvedor que nao podem ser ignoradas | role: developer (peso maior que user) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `role: "system"` | `role: "developer"` |
| `max_tokens: 100` | `max_completion_tokens: 100` |
| `temperature: 0.5, top_p: 0.9` (ambos) | `temperature: 0.5` (apenas um) |
| `console.log(completion)` | `console.log(completion.choices[0].message.content)` |
| Historico do GPT com `role: "user"` | Historico do GPT com `role: "assistant"` |

## Troubleshooting

### Resposta da API retorna null ou undefined
**Symptom:** `completion.choices[0].message.content` retorna null
**Cause:** O modelo retornou tool_calls em vez de content, ou max_tokens insuficiente
**Fix:** Verifique `message.tool_calls` antes de acessar content. Aumente max_completion_tokens se a resposta foi cortada

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
