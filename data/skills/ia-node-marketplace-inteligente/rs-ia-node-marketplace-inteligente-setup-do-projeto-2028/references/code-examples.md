# Code Examples: Setup do Projeto com OpenAI SDK

## Exemplo completo do instrutor

O instrutor construiu este codigo passo a passo durante a aula:

```typescript
import OpenAI from "openai"

// Inicializacao do client com API key
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Criacao do chat completion
client.chat.completions
  .create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: "Escreva uma mensagem de uma frase sobre unicórnios",
      },
    ],
  })
  .then((completion) => {
    console.log(completion.choices[0].message.content)
  })
```

## Versao com async/await (recomendada)

```typescript
import OpenAI from "openai"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function main() {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: "Escreva uma mensagem de uma frase sobre unicórnios",
      },
    ],
  })

  console.log(completion.choices[0].message.content)
}

main()
```

## Exemplo da documentacao oficial (mostrado pelo instrutor)

```typescript
import OpenAI from "openai"

const client = new OpenAI()

const completion = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "user",
      content: "Write a one-sentence bedtime story about a unicorn.",
    },
  ],
})

console.log(completion.choices[0].message.content)
```

## Execucao do script

```bash
npx tsx src/index.ts
```

O instrutor usou `tsx` para executar TypeScript diretamente sem compilacao previa.

## Exemplo de retorno da API

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Os unicórnios, criaturas mágicas e míticas..."
      },
      "index": 0,
      "finish_reason": "stop"
    }
  ],
  "model": "gpt-4o-mini",
  "usage": {
    "prompt_tokens": 18,
    "completion_tokens": 42,
    "total_tokens": 60
  }
}
```

## Multiplas mensagens de contexto

```typescript
const completion = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "user", content: "O que sao unicornios?" },
    { role: "assistant", content: "Unicornios sao criaturas miticas..." },
    { role: "user", content: "Escreva uma historia curta sobre eles" },
  ],
})
```

O instrutor explicou que voce pode enviar N mensagens previas para dar contexto ao modelo antes dele gerar a proxima resposta.