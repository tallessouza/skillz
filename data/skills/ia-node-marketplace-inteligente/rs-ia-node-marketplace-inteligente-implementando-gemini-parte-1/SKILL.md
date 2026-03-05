---
name: rs-ia-node-marketplace-implementando-gemini-1
description: "Applies Google Gemini SDK integration patterns when building LLM services in Node.js/NestJS. Use when user asks to 'integrate Gemini', 'add Google AI', 'implement LLM provider', 'generate embeddings with Gemini', or 'parse JSON from LLM response'. Covers client setup, text generation, embedding, JSON extraction from markdown-wrapped responses, and multi-provider abstraction. Make sure to use this skill whenever implementing Gemini as an LLM provider alongside OpenAI. Not for OpenAI-only implementations, frontend AI features, or prompt engineering."
---

# Implementando Gemini como Provider LLM

> Ao integrar o Gemini, estenda a classe abstrata LLM Service e trate as diferencas de API em relacao a OpenAI: parsing manual de JSON, historico de mensagens explicito, e configuracao de embeddings.

## Rules

1. **Use `@google/genai` (nao `@google/generative-ai`)** — a biblioteca antiga tem nome parecido e causa confusao na instalacao
2. **Instale `zod-to-json-schema` junto** — o Gemini nao tem helper nativo como `zodTextFormat` da OpenAI, entao converta schemas Zod manualmente
3. **Extraia JSON de respostas com regex** — o Gemini retorna JSON wrapped em markdown (triple backticks), parse manual e obrigatorio
4. **Valide com Zod apos o parse** — o Gemini nao valida o schema no servidor como a OpenAI faz, apenas reforça o formato
5. **Passe historico de mensagens explicitamente** — diferente da OpenAI Responses API que usa `previous_response_id`, o Gemini exige todas as mensagens anteriores no `contents`
6. **Mapeie roles corretamente** — `assistant` na OpenAI equivale a `model` no Gemini, `user` permanece `user`
7. **Configure `outputDimensions` nos embeddings** — para manter compatibilidade com o mesmo campo vetorial no banco, o tamanho deve ser identico ao da OpenAI

## How to write

### Client initialization

```typescript
import { GoogleGenAI } from '@google/genai';

private readonly client: GoogleGenAI;

constructor(private configService: ConfigService) {
  super();
  this.client = new GoogleGenAI({ apiKey: configService.get('GOOGLE_GENAI_API_KEY') });
}
```

### Text generation com JSON parsing

```typescript
const response = await this.client.models.generateContent({
  model: this.CHAT_MODEL,
  contents: [
    ...previousMessages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : msg.role,
      parts: [{ text: msg.content }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ],
  config: {
    systemInstruction: SYSTEM_PROMPT,
    responseMimeType: 'application/json',
    responseSchema: zodToJsonSchema(answerConversationSchema),
    temperature: 0.7,
  },
});

const text = response.text;
```

### Regex para extrair JSON de markdown

```typescript
const jsonMatch = text?.match(/```json\n([\s\S]*?)\n```/) ||
  text?.match(/```\n([\s\S]*?)\n```/) || [null, text];

const jsonContent = jsonMatch[1] ?? text ?? '{}';

try {
  const parsed = JSON.parse(jsonContent);
  const validated = schema.safeParse(parsed);
  if (!validated.success) throw new Error('Invalid response format');
  return validated.data;
} catch (error) {
  // handle parse error
}
```

### Embeddings

```typescript
const result = await this.client.models.embedContent({
  model: this.EMBEDDING_MODEL,
  contents: input,
  config: {
    taskType: 'SEMANTIC_SIMILARITY',
    outputDimensionality: 1536, // match database vector size
  },
});

const embeddings = result.embeddings?.[0]?.values;
if (!embeddings) return null;
return embeddings;
```

## Example

**Before (tentando usar API como se fosse OpenAI):**
```typescript
// Erro: Gemini nao tem responses API com historico interno
const response = await gemini.chat({ previous_response_id: lastId, message });
// Erro: esperando parse automatico
return response.parsed;
```

**After (implementacao correta para Gemini):**
```typescript
// Passa historico explicito + extrai JSON manualmente
const response = await this.client.models.generateContent({
  model: 'gemini-2.0-flash',
  contents: [...previousMessages.map(m => ({
    role: m.role === 'assistant' ? 'model' : m.role,
    parts: [{ text: m.content }],
  })), { role: 'user', parts: [{ text: message }] }],
  config: { responseSchema: zodToJsonSchema(schema) },
});

const text = response.text;
const jsonMatch = text?.match(/```json\n([\s\S]*?)\n```/) || [null, text];
const parsed = JSON.parse(jsonMatch[1] ?? text ?? '{}');
const validated = schema.parse(parsed);
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa de historico de conversa | Passe `previousMessages` array completo no `contents` |
| JSON vem wrapped em markdown | Use regex dupla: tenta `json` fence primeiro, depois fence generico |
| Embedding de modelo diferente | Nunca misture no mesmo campo vetorial — resultados incompativeis entre modelos |
| Precisa trocar entre OpenAI e Gemini | Use classe abstrata com factory no module provider |
| `response.text` retorna undefined | Trate com optional chaining e fallback para `'{}'` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `new GoogleGenerativeAI()` (lib antiga) | `new GoogleGenAI()` (@google/genai) |
| `role: 'assistant'` no Gemini | `role: 'model'` |
| `JSON.parse(response.text)` direto | Extraia com regex primeiro, depois parse |
| Confiar no schema sem validar | `schema.safeParse()` apos o parse |
| `embedContent({ contents: [input] })` | `embedContent({ contents: input })` (string direto) |
| Embedding sem `outputDimensionality` | Sempre configure para match com o banco |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
