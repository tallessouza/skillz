# Code Examples: Estruturação de Dados com OpenAI

## Exemplo 1: App Express original (problema)

Aplicação base demonstrada pelo instrutor — uma rota Express que gera completions:

```typescript
import express from "express"
import OpenAI from "openai"

const app = express()
app.use(express.json())

const openai = new OpenAI()

app.post("/generate", async (req, res) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "developer",
        content: "Liste três produtos que atendam à necessidade do usuário."
      },
      {
        role: "user",
        content: req.body.message
      }
    ]
  })

  res.json({ result: completion.choices[0].message.content })
})

app.listen(3000)
```

**Problema:** cada chamada retorna texto em formato diferente. Impossível fazer `JSON.parse()`.

**Input:** `{ "message": "café da manhã saudável" }`

**Output (varia a cada chamada):**
```
"Aqui estão três produtos que atendem a necessidade de um café da manhã saudável:\n1. Aveia em flocos\n2. ..."
```

## Exemplo 2: Tentativa ingênua com prompt (problema persiste)

```typescript
messages: [
  {
    role: "developer",
    content: "Liste três produtos que atendam à necessidade do usuário. Responda em JSON no formato { produtos: string[] }"
  },
  {
    role: "user",
    content: req.body.message
  }
]
```

**Output problemático:**
```
```json
{
  "produtos": [
    "Aveia em flocos",
    "Iogurte natural",
    "Granola sem açúcar"
  ]
}
```​
```

As crases do Markdown (```` ```json ````) tornam impossível fazer `JSON.parse()` direto.

## Exemplo 3: Com JSONMode (solução)

```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "developer",
      content: "Liste três produtos que atendam à necessidade do usuário. Retorne um objeto JSON com a chave 'produtos' contendo um array de strings com os nomes dos produtos."
    },
    {
      role: "user",
      content: req.body.message
    }
  ],
  response_format: { type: "json_object" }
})

// Agora é seguro fazer parse
const data = JSON.parse(completion.choices[0].message.content)
console.log(data.produtos) // ["Aveia em flocos", "Iogurte natural", "Granola sem açúcar"]
```

## Exemplo 4: Integração completa com banco de dados

Cenário que o instrutor descreve como objetivo final — buscar produtos recomendados no banco e adicionar ao carrinho:

```typescript
app.post("/generate", async (req, res) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "developer",
        content: "Liste 3 produtos que atendam à necessidade do usuário. Retorne { produtos: string[] }"
      },
      { role: "user", content: req.body.message }
    ],
    response_format: { type: "json_object" }
  })

  const { produtos } = JSON.parse(completion.choices[0].message.content)

  // Buscar no banco de dados
  const foundProducts = await prisma.product.findMany({
    where: {
      name: { in: produtos }
    }
  })

  // Adicionar ao carrinho do usuário
  await prisma.cartItem.createMany({
    data: foundProducts.map(product => ({
      userId: req.user.id,
      productId: product.id,
      quantity: 1
    }))
  })

  res.json({ 
    recommended: produtos,
    addedToCart: foundProducts.length 
  })
})
```

## Variação: tratamento de erro no parse

```typescript
try {
  const data = JSON.parse(completion.choices[0].message.content)
  if (!Array.isArray(data.produtos)) {
    throw new Error("Campo 'produtos' não é um array")
  }
  // prosseguir com data.produtos
} catch (error) {
  // Se JSONMode falhar (raro), retornar erro graceful
  res.status(500).json({ error: "Falha ao estruturar resposta da IA" })
}
```