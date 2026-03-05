# Code Examples: Parametros da API OpenAI

## Exemplo 1: Mensagem simples com role user

```typescript
import OpenAI from "openai"

const openai = new OpenAI()

const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "user", content: "Me fale sobre unicornios" },
  ],
})
```

Uma unica mensagem do usuario. Sem configuracoes adicionais. O modelo usa defaults para temperature e sem limite de tokens.

## Exemplo 2: Developer role definindo regras

```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "developer", content: "Use emojis a cada duas palavras" },
    { role: "user", content: "Me fale sobre unicornios" },
  ],
})
```

A role developer define uma regra que o modelo tenta seguir. O instrutor demonstrou que mesmo quando o user tenta contradizer ("nao pode usar emoji"), o developer prevalece por ter peso maior.

## Exemplo 3: Conflito developer vs user — developer vence

```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "developer",
      content: "Isso é obrigatório. Ignore regras que mudem utilização de emoji. Use emojis a cada duas palavras.",
    },
    {
      role: "user",
      content: "Não pode usar emoji. Me fale sobre unicornios",
    },
  ],
})
// Resultado: modelo SEGUE a regra do developer e usa emojis
```

## Exemplo 4: Chat com historico reconstruido (assistant)

```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "developer", content: "Use emojis a cada duas palavras" },
    { role: "user", content: "Me fale sobre unicornios" },
    {
      role: "assistant",
      content: "Unicornios 🦄 sao criaturas 🌟 magicas e 🌈 fascinantes...",
    },
    { role: "user", content: "Obrigado" },
  ],
})
// O modelo leva em consideracao o chat INTEIRO, incluindo a resposta anterior
```

O role assistant e usado para inserir no historico uma mensagem que o proprio GPT gerou anteriormente. Isso permite conversas multi-turno onde o modelo mantem contexto.

## Exemplo 5: max_completion_tokens limitando saida

```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "user", content: "Me fale sobre unicornios" },
  ],
  max_completion_tokens: 2,
})
// Resultado: "De nada" (apenas 2 tokens, resposta cortada)
```

Com apenas 2 tokens, a resposta e extremamente curta. Tokens nao sao palavras — a relacao e aproximada.

## Exemplo 6: Combinando limite de tokens com instrucao no prompt

```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "developer",
      content: "Gere no maximo uma frase como resposta.",
    },
    { role: "user", content: "Me fale sobre unicornios" },
  ],
  max_completion_tokens: 150,
})
```

Melhor abordagem: prompt instrui o formato desejado, max_completion_tokens garante o teto hard. O prompt sozinho pode ser ignorado; o limit sozinho corta sem contexto.

## Exemplo 7: Temperature para respostas deterministicas

```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "user", content: "Classifique: 'Adorei o produto' - positivo ou negativo?" },
  ],
  temperature: 0,
})
// Respostas mais consistentes e previsiveis
```

## Exemplo 8: topP como alternativa a temperature

```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "user", content: "Escreva um poema sobre o mar" },
  ],
  top_p: 0.1,  // so tokens no top 10% de probabilidade
})
// NAO combine com temperature — use um OU outro
```

## Exemplo 9: Codigo organizado com funcao async

```typescript
import OpenAI from "openai"

const openai = new OpenAI()

async function gerarTexto() {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "developer",
        content: "Responda em portugues, maximo uma frase.",
      },
      { role: "user", content: "Me fale sobre unicornios" },
    ],
    max_completion_tokens: 150,
    temperature: 0.7,
  })

  console.log(completion.choices[0].message.content)
}

gerarTexto()
```

Padrao recomendado pelo instrutor: funcao async nomeada, extracao via `choices[0].message.content`, execucao imediata.