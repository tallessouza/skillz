# Code Examples: Implementando Gemini - Parte 1

## Estrutura completa da classe GeminiLlmService

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { LlmService } from './llm.service';

const CHAT_MODEL = 'gemini-2.0-flash' as const;
const EMBEDDING_MODEL = 'text-embedding-004' as const;

@Injectable()
export class GeminiLlmService extends LlmService {
  private readonly client: GoogleGenAI;

  constructor(private configService: ConfigService) {
    super();
    this.client = new GoogleGenAI({
      apiKey: this.configService.get('GOOGLE_GENAI_API_KEY'),
    });
  }

  async answerMessage(
    message: string,
    previousMessages: { content: string; role: string }[],
  ) {
    const response = await this.client.models.generateContent({
      model: CHAT_MODEL,
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
      },
    });

    const text = response.text;

    // Extract JSON from markdown-wrapped response
    const jsonMatch = text?.match(/```json\n([\s\S]*?)\n```/) ||
      text?.match(/```\n([\s\S]*?)\n```/) || [null, text];

    const jsonContent = jsonMatch[1] ?? text ?? '{}';

    try {
      const parsed = JSON.parse(jsonContent);
      const validated = answerConversationSchema.safeParse(parsed);

      if (!validated.success) {
        throw new Error('Invalid response format');
      }

      return {
        data: validated.data,
        responseId: `gemini-${Date.now()}`,
      };
    } catch (error) {
      throw new Error(`Error parsing Gemini response: ${error}`);
    }
  }

  async embed(input: string): Promise<number[] | null> {
    try {
      const result = await this.client.models.embedContent({
        model: EMBEDDING_MODEL,
        contents: input,
        config: {
          taskType: 'SEMANTIC_SIMILARITY',
          outputDimensionality: 1536,
        },
      });

      const embeddings = result.embeddings?.[0]?.values;
      if (!embeddings) return null;

      return embeddings;
    } catch (error) {
      console.error('Error generating embeddings:', error);
      return null;
    }
  }
}
```

## Instalacao de dependencias

```bash
npm install @google/genai zod-to-json-schema
```

Cuidado: **NAO** instalar `@google/generative-ai` (biblioteca antiga com nome parecido).

## Configuracao no LLM Module (factory provider)

```typescript
// llm.module.ts
{
  provide: LlmService,
  useFactory: (configService: ConfigService) => {
    const provider = configService.get('LLM_PROVIDER');
    if (provider === 'gemini') {
      return new GeminiLlmService(configService);
    }
    return new OpenAiLlmService(configService);
  },
  inject: [ConfigService],
}
```

## Variavel de ambiente

```env
GOOGLE_GENAI_API_KEY=your-api-key-here
LLM_PROVIDER=gemini
```

## Assinatura atualizada do metodo abstrato

```typescript
// llm.service.ts (classe abstrata)
abstract answerMessage(
  message: string,
  previousMessages: { content: string; role: string }[],
): Promise<{ data: AnswerConversation; responseId: string }>;
```

A OpenAI simplesmente ignora `previousMessages` pois usa `previous_response_id` internamente.

## Regex de extracao JSON — explicacao detalhada

```typescript
// Tentativa 1: JSON fence explicito
text?.match(/```json\n([\s\S]*?)\n```/)
// Captura: ```json\n{ "key": "value" }\n```

// Tentativa 2: fence generico (sem "json")
text?.match(/```\n([\s\S]*?)\n```/)
// Captura: ```\n{ "key": "value" }\n```

// Fallback: assume que o texto ja e JSON puro
[null, text]
// Usa text diretamente

// Resultado: posicao [1] do match e o JSON limpo
const jsonContent = jsonMatch[1] ?? text ?? '{}';
```

## Embed: taskType options do Gemini

```typescript
// Opcoes disponiveis para taskType:
// - 'SEMANTIC_SIMILARITY' — comparar similaridade entre textos
// - 'RETRIEVAL_DOCUMENT' — otimizado para documentos em busca
// - 'RETRIEVAL_QUERY' — otimizado para queries de busca
// - 'CLASSIFICATION' — classificacao de texto
// - 'CLUSTERING' — agrupamento de textos
```