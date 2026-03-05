# Code Examples: Structured Outputs com OpenAI e Zod

## Exemplo 1: Setup basico da aula

```typescript
import { zodResponseFormat } from "openai/helpers/zod"
import { z } from "zod"
import OpenAI from "openai"

const client = new OpenAI()

// Schema definido separadamente
const schema = z.object({
  products: z.array(z.string()),
})

// Chamada usando beta parse
const completion = await client.beta.chat.completions.parse({
  model: "gpt-4o",
  messages: [
    { role: "user", content: "Liste 3 produtos de tecnologia" },
  ],
  response_format: zodResponseFormat(schema, "products-schema"),
})

// Acessar parsed (tipado como { products: string[] })
const products = completion.choices[0].message.parsed
console.log(products)
// { products: ["MacBook Pro", "iPhone 15", "AirPods Pro"] }
```

## Exemplo 2: Error handling completo (como na aula)

```typescript
app.get("/products", async (req, res) => {
  try {
    const completion = await client.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [
        { role: "user", content: req.query.prompt as string },
      ],
      response_format: zodResponseFormat(schema, "products-schema"),
    })

    // Checar refusal primeiro
    if (completion.choices[0].message.refusal) {
      console.log("Modelo recusou:", completion.choices[0].message.refusal)
      return res.status(422).json({
        error: "Model refused to respond",
        refusal: completion.choices[0].message.refusal,
      })
    }

    const data = completion.choices[0].message.parsed
    return res.json(data)
  } catch (error) {
    // Captura erros como token limit insuficiente
    console.error(error)
    return res.status(500).json({ error: "Internal server error" })
  }
})
```

## Exemplo 3: Schema mais complexo (extensao do padrao da aula)

```typescript
const productDetailSchema = z.object({
  products: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      priceInCents: z.number(),
      category: z.string(),
    })
  ),
})

const completion = await client.beta.chat.completions.parse({
  model: "gpt-4o",
  messages,
  response_format: zodResponseFormat(productDetailSchema, "product-details-schema"),
})

const result = completion.choices[0].message.parsed
// result tipado: { products: { name: string, description: string, priceInCents: number, category: string }[] }
```

## Exemplo 4: Comparacao JSON Mode vs Structured Outputs

```typescript
// ANTES: JSON Mode (so garante JSON valido, nao a estrutura)
const oldWay = await client.chat.completions.create({
  model: "gpt-4o",
  messages,
  response_format: { type: "json_object" },
})
const data = JSON.parse(oldWay.choices[0].message.content!) // any, sem tipagem

// DEPOIS: Structured Outputs (garante JSON valido + estrutura + tipagem)
const newWay = await client.beta.chat.completions.parse({
  model: "gpt-4o",
  messages,
  response_format: zodResponseFormat(schema, "my-schema"),
})
const typedData = newWay.choices[0].message.parsed // tipado pelo Zod schema
```

## Erro demonstrado na aula: max_tokens insuficiente

```typescript
// CAUSA O ERRO: max_tokens muito baixo para o JSON
const completion = await client.beta.chat.completions.parse({
  model: "gpt-4o",
  messages,
  max_tokens: 1, // impossivel gerar JSON estruturado em 1 token
  response_format: zodResponseFormat(schema, "products-schema"),
})
// Erro: response size limit reached — o JSON nao cabe no limite
```