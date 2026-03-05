# Code Examples: Setup OpenAI com Structured Outputs

## 1. Schema Zod completo com discriminatedUnion

```typescript
import { z } from 'zod';

const answerMessageSchema = z.object({
  message: z.string(),
  action: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('send_message'),
    }),
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

## 2. LLM Service completo

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';

@Injectable()
export class LLMService {
  private readonly client: OpenAI;

  private static readonly ANSWER_MESSAGE_PROMPT = `
Você é um assistente no marketplace com conhecimentos gastronômicos.
Identifique que ação o usuário está solicitando.

Se for send_message: use para responder o usuário antes de cometer uma ação.
Caso o usuário tenha solicitado uma ação mas você ainda precisa de mais informações,
use essa ação para perguntar ao usuário. Informe em message.

Se for suggest_cards: use apenas quando tiver TODAS as informações necessárias.
Crie um input descrevendo exatamente o que o usuário está solicitando.
A message deve ser uma confirmação perguntando se é isso mesmo.

Exemplo:
- Mensagem do usuário: "montar carrinho para receita de bolo de chocolate"
- action: suggest_cards
- message: "Você solicitou um bolo de chocolate. Confirma que é isso?"
- input: "Ingredientes para receita de bolo de chocolate tradicional"

Não use suggest_cards para responder ao usuário, apenas para sugerir carrinho.
Use send_message para responder.
Não precisa ir a fundo em detalhes - sugira ingredientes básicos.
`;

  constructor(private configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  async answerMessage(
    text: string,
  ): Promise<(AnswerMessage & { responseId: string }) | null> {
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

## 3. Integracao no Chat Service

```typescript
// chat.service.ts
@Injectable()
export class ChatService {
  constructor(
    private llmService: LLMService,
    // ...other deps
  ) {}

  async addUserMessage(sessionId: string, text: string) {
    // 1. Salva mensagem do usuario
    const userMessage = await this.addMessageToSession(sessionId, {
      content: text,
      role: 'user',
      type: 'text',
    });

    // 2. Gera resposta via LLM
    const llmResponse = await this.llmService.answerMessage(text);

    if (!llmResponse) {
      throw new BadGatewayException('Failed to get response');
    }

    // 3. Salva resposta do assistente
    const assistantMessage = await this.addMessageToSession(sessionId, {
      openaiId: llmResponse.responseId,
      type: 'text',
      content: llmResponse.message,
      role: 'assistant',
    });

    return assistantMessage;
  }
}
```

## 4. Registro no modulo

```typescript
// chat.module.ts
@Module({
  providers: [ChatService, LLMService],
  // ...
})
export class ChatModule {}
```

## 5. Configuracao .env

```env
OPENAI_API_KEY=sk-proj-...
OPENAI_WEBHOOK_SECRET=whsec_...
```

## 6. Setup ngrok para webhooks

```bash
# Instalar ngrok (seguir getting started em ngrok.com)
ngrok http 3000

# Output: https://abc123.ngrok.io -> http://localhost:3000
# Registrar na OpenAI: https://abc123.ngrok.io/webhooks/openai
# Evento: batch_completed
```

## 7. Exemplo de resposta da API parseada

```typescript
// Input: "hello world"
// response.outputParsed:
{
  message: "Olá! Posso ajudar você?",
  action: {
    type: "send_message"
  }
}

// Input: "montar carrinho para receita de bolo de chocolate"
// response.outputParsed:
{
  message: "Você solicitou um bolo de chocolate. Confirma?",
  action: {
    type: "suggest_cards",
    payload: {
      input: "Ingredientes para receita de bolo de chocolate tradicional"
    }
  }
}
```