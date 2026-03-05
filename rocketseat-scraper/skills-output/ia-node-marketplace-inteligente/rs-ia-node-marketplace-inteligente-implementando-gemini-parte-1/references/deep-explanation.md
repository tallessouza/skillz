# Deep Explanation: Implementando Gemini - Parte 1

## Por que uma classe abstrata para LLM?

O instrutor segue um padrao de refatoracao onde cada provider LLM (OpenAI, Gemini) estende uma classe abstrata `LlmService`. Isso permite trocar o provider no module NestJS com uma simples condicional no factory provider:

```typescript
// No LLM Module
if (provider === 'gemini') return new GeminiLlmService(configService);
return new OpenAiLlmService(configService);
```

A classe abstrata exporta os metodos que todo provider deve implementar: `answerMessage`, `embed`, e outros.

## Diferenca fundamental: historico de mensagens

A maior diferenca pratica entre OpenAI e Gemini para chat e o gerenciamento de historico:

- **OpenAI Responses API**: Voce passa `previous_response_id` e a OpenAI recupera todo o historico do banco interno deles. Zero trabalho do lado do dev.
- **Gemini**: Voce precisa passar TODAS as mensagens anteriores no array `contents`. Isso exigiu uma mudanca na assinatura do metodo `answerMessage` para aceitar `previousMessages`.

O instrutor destaca que essa mudanca nao quebra a OpenAI porque ela simplesmente ignora o parametro extra.

## O problema do JSON parsing

O Gemini, mesmo quando configurado com `responseSchema`, retorna o JSON dentro de markdown code fences:

```
\`\`\`json
{"key": "value"}
\`\`\`
```

A OpenAI, com `zodTextFormat`, ja retorna o objeto parseado. No Gemini, o fluxo e:
1. Receber texto bruto
2. Extrair JSON com regex (tenta `json` fence, depois fence generico, depois assume texto puro)
3. `JSON.parse` no conteudo extraido
4. Validar com Zod (porque o Gemini so "reforça" o schema no modelo, nao valida de verdade)

A regex usada tem 3 fallbacks em cadeia — isso e intencional para cobrir variacoes na resposta do modelo.

## Embeddings: compatibilidade entre providers

Ponto critico levantado pelo instrutor: vetorizacoes de modelos diferentes sao **completamente incompativeis**. Nao e so uma questao de precisao — os valores nao tem nenhuma relacao entre si.

Se voce vetorizou com OpenAI e troca para Gemini, precisa re-vetorizar tudo ou usar campos separados no banco. O instrutor sugere que campos separados pode ate ser melhor para testes A/B entre providers.

O modelo de embedding usado (`text-embedding-004` experimental) foi escolhido especificamente porque permite configurar `outputDimensionality` para manter o mesmo tamanho do vetor definido no SQL (que e fixo, diferente de arrays JS).

## Modelo de embedding escolhido

O instrutor usou um modelo experimental do Gemini porque era o unico que permitia configurar o tamanho do output. Isso e critico porque o campo vetorial no banco de dados tem tamanho fixo definido no DDL — nao e como um array JavaScript que cresce dinamicamente.

## Mapeamento de roles

Detalhe sutil: no Gemini, quando o "assistant" responde, a role e `model`, nao `assistant`. O mapeamento:

| OpenAI | Gemini |
|--------|--------|
| `user` | `user` |
| `assistant` | `model` |
| `system` | via `systemInstruction` no config |

O system prompt no Gemini vai no `config.systemInstruction`, nao como uma mensagem no array de contents.