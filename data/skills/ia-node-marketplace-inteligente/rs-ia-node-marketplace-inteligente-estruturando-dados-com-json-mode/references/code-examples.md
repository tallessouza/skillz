# Code Examples: Estruturando Dados com JSON Mode

## Exemplo 1: Configuracao basica do JSON Mode

```typescript
// Requisicao com JSON Mode ativado
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "user",
      content: "Liste 5 produtos de tecnologia em formato JSON com um array chamado produtos"
    }
  ],
  response_format: { type: "json_object" },
})

// message.content sera algo como:
// '{"produtos":["iPhone 15","MacBook Pro","AirPods Pro","iPad Air","Apple Watch"]}'
```

## Exemplo 2: Parse do content com null safety

```typescript
const message = completion.choices[0].message

// content pode ser null — tratar antes do parse
const output = JSON.parse(message.content ?? "")

// output agora e um objeto JavaScript
// Pode usar .produtos, fazer forEach, map, filter etc
console.log(output)
// { produtos: ["iPhone 15", "MacBook Pro", ...] }

output.produtos.forEach((produto: string) => {
  console.log(produto)
})
```

## Exemplo 3: Validacao completa com Zod

```typescript
import { z } from "zod"

// Definir o schema esperado
const schema = z.object({
  produtos: z.array(z.string()),
})

// Parse da resposta da IA
const output = JSON.parse(completion.choices[0].message.content ?? "")

// Validar estrutura com safeParse
const result = schema.safeParse(output)

if (!result.success) {
  // Estrutura nao bateu — erro do servidor, nao do cliente
  return res.status(500).json({
    error: "A IA retornou um formato inesperado",
  })
}

// result.data esta tipado como { produtos: string[] }
return res.json(result.data)
```

## Exemplo 4: Fluxo completo em uma rota Express/Fastify

```typescript
import { z } from "zod"
import OpenAI from "openai"

const openai = new OpenAI()

const productSchema = z.object({
  produtos: z.array(z.string()),
})

app.post("/produtos", async (req, res) => {
  // 1. Validar entrada do usuario
  const { message } = req.body
  if (!message) {
    return res.status(400).json({ error: "message is required" })
  }

  // 2. Chamar OpenAI com JSON Mode
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: message }],
    response_format: { type: "json_object" },
  })

  // 3. Parse da resposta
  const output = JSON.parse(
    completion.choices[0].message.content ?? ""
  )

  // 4. Validar estrutura
  const result = productSchema.safeParse(output)

  if (!result.success) {
    return res.status(500).json({
      error: "Formato inesperado da IA",
    })
  }

  // 5. Retornar dados tipados e validados
  return res.json(result.data)
})
```

## Exemplo 5: Erro por falta de "JSON" no prompt

```typescript
// ISSO CAUSA ERRO na API da OpenAI:
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "user", content: "Liste 5 produtos de tecnologia" }
    // ^ nao contem a palavra "JSON"
  ],
  response_format: { type: "json_object" },
})
// Error: messages must contain the word 'json' in some form

// CORRETO — incluir "JSON" no prompt:
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "user", content: "Liste 5 produtos de tecnologia em formato JSON" }
  ],
  response_format: { type: "json_object" },
})
```

## Exemplo 6: Schema Zod mais complexo

```typescript
// Para estruturas mais elaboradas, o schema Zod acompanha
const marketplaceSchema = z.object({
  produtos: z.array(
    z.object({
      nome: z.string(),
      preco: z.number(),
      categoria: z.string(),
      disponivel: z.boolean(),
    })
  ),
  total: z.number(),
})

// Mesma logica de validacao
const result = marketplaceSchema.safeParse(output)
// Quanto mais complexo o schema, maior a chance do JSON Mode
// retornar algo ligeiramente diferente — validacao e ainda mais importante
```