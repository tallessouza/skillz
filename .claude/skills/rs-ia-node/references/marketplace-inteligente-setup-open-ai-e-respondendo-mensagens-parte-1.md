---
name: rs-ia-node-marketplace-setup-openai-resp
description: "Applies OpenAI Responses API setup with Zod structured outputs in NestJS projects. Use when user asks to 'integrate OpenAI', 'setup LLM service', 'structured output with Zod', 'parse AI responses', or 'create chat assistant'. Covers API client initialization, webhook configuration, discriminated union schemas, and zodTextFormat for type-safe AI responses. Make sure to use this skill whenever building NestJS services that call OpenAI with structured response parsing. Not for streaming responses, embeddings, image generation, or non-NestJS frameworks."
---

# Setup OpenAI com Structured Outputs em NestJS

> Configure o cliente OpenAI como servico NestJS injetavel e use Zod + zodTextFormat para garantir respostas tipadas e parseadas automaticamente.

## Rules

1. **Crie um servico dedicado para LLM** — `LLMService` como provider injetavel, porque isola a dependencia da OpenAI e permite substituir por versao fake em testes
2. **Use `responses.parse()` em vez de `responses.create()`** — porque `.parse()` ja aplica o schema Zod e retorna `outputParsed` tipado automaticamente
3. **Use `zodTextFormat` de `openai/helpers/zod`** — para converter o schema Zod em formato aceito pela Responses API, passando schema e nome
4. **Use `z.discriminatedUnion` para acoes multiplas** — porque OpenAI nao aceita campos optional bem; discrimine pelo campo `type` para cada variante de acao
5. **Retorne nulo em vez de lancar erro no servico** — deixe o caller decidir como tratar falha (`BadGatewayException`, retry, etc.)
6. **Guarde o `response.id` da OpenAI** — porque permite recuperar historico da conversa na OpenAI depois
7. **Configure webhooks com endpoint especifico** — `/webhooks/openai` em vez da raiz, porque restringe onde a OpenAI faz requisicoes na sua API

## How to write

### Schema com discriminatedUnion

```typescript
import { z } from 'zod';

const answerMessageSchema = z.object({
  message: z.string(),
  action: z.discriminatedUnion('type', [
    z.object({ type: z.literal('send_message') }),
    z.object({
      type: z.literal('suggest_cards'),
      payload: z.object({
        input: z.string(),
      }),
    }),
  ]),
});

type AnswerMessage = z.infer<typeof answerMessageSchema>;
```

### LLM Service com responses.parse

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';

@Injectable()
export class LLMService {
  private readonly client: OpenAI;

  private static readonly ANSWER_MESSAGE_PROMPT = `Você é um assistente...`;

  constructor(private configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  async answerMessage(text: string): Promise<AnswerMessage & { responseId: string } | null> {
    try {
      const response = await this.client.responses.parse({
        model: 'gpt-4.1-nano',
        instructions: LLMService.ANSWER_MESSAGE_PROMPT,
        input: text,
        text: {
          format: zodTextFormat(answerMessageSchema, 'answer_message_schema'),
        },
      });

      if (!response.outputParsed) return null;

      return {
        ...response.outputParsed,
        responseId: response.id,
      };
    } catch (error) {
      console.error('LLM answerMessage error:', error);
      return null;
    }
  }
}
```

### Uso no Chat Service

```typescript
const llmResponse = await this.llmService.answerMessage(text);

if (!llmResponse) {
  throw new BadGatewayException('Failed to get response');
}

const assistantMessage = await this.addMessageToSession(sessionId, {
  openaiId: llmResponse.responseId,
  type: 'text',
  content: llmResponse.message,
  role: 'assistant',
});
```

## Example

**Before (sem structured output):**
```typescript
const response = await openai.responses.create({
  model: 'gpt-4.1-nano',
  input: userMessage,
});
// response.output e string bruta — precisa parsear manualmente
const parsed = JSON.parse(response.output_text); // pode quebrar
```

**After (com zodTextFormat):**
```typescript
const response = await this.client.responses.parse({
  model: 'gpt-4.1-nano',
  instructions: LLMService.ANSWER_MESSAGE_PROMPT,
  input: userMessage,
  text: {
    format: zodTextFormat(answerMessageSchema, 'answer_message_schema'),
  },
});
// response.outputParsed ja e tipado como AnswerMessage
const action = response.outputParsed.action.type; // TypeScript OK
```

## Heuristics

| Situacao | Faca |
|----------|------|
| AI precisa retornar formatos diferentes por acao | Use `z.discriminatedUnion` pelo campo `type` |
| Campo so existe em uma variante | Coloque dentro da variante, nao como optional no root |
| Precisa expor API local para webhook | Use ngrok na porta da API e registre endpoint especifico |
| Testes durante desenvolvimento | Deixe API real ativa; em producao, moque o LLMService |
| Prompt muito permissivo (AI pergunta demais) | Adicione instrucoes explicitas: "nao precisa ir a fundo em detalhes" |

## Anti-patterns

| Nunca faca | Faca instead |
|------------|--------------|
| `JSON.parse(response.output_text)` | `responses.parse()` com `zodTextFormat` |
| `z.object({ input: z.string().optional() })` | `z.discriminatedUnion('type', [...])` |
| Webhook na raiz `/` | Endpoint especifico `/webhooks/openai` |
| `new OpenAI({ apiKey: process.env.KEY })` em NestJS | Injete `ConfigService` no constructor |
| Lancar excecao dentro do LLM service | Retorne `null`, deixe o caller tratar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/ia-node/rs-ia-node-marketplace-inteligente-setup-open-ai-e-respondendo-mensagens-parte-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/ia-node/rs-ia-node-marketplace-inteligente-setup-open-ai-e-respondendo-mensagens-parte-1/references/code-examples.md)
