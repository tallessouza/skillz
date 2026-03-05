# Code Examples: OpenAI Responses API

## Exemplo 1: Funcao wrapper generateResponse

Funcao generica que encapsula a chamada a Responses API, recebendo params tipados:

```typescript
import OpenAI from "openai";
import type { ResponseCreateParams } from "openai/resources/responses";

const client = new OpenAI();

async function generateResponse(params: ResponseCreateParams) {
  const response = await client.responses.create(params);
  return response.outputText ?? null;
}
```

**Pontos-chave:**
- Recebe `ResponseCreateParams` inteiro — flexivel para qualquer configuracao
- Retorna `outputText` diretamente — acesso simplificado vs ChatCompletions
- Fallback para `null` se nao houver texto — tratamento seguro

## Exemplo 2: generateCart com structured output

Funcao de dominio que gera um carrinho de compras com base na entrada do usuario:

```typescript
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const ProductSchema = z.object({
  name: z.string(),
  quantity: z.number(),
});

const CartSchema = z.object({
  products: z.array(ProductSchema),
});

type Cart = z.infer<typeof CartSchema>;

async function generateCart(input: string, products: string[]): Promise<Cart | null> {
  const response = await client.responses.parse({
    model: "gpt-4.1-nano",
    instructions: `Retorne uma lista de ate cinco produtos que satisfacam a necessidade do usuario. Utilize apenas os produtos permitidos. Os produtos disponiveis sao os seguintes: ${JSON.stringify(products)}`,
    input,
    text: {
      format: zodTextFormat(CartSchema, "cart"),
    },
  });

  return response.outputParsed;
}
```

**Pontos-chave:**
- `client.responses.parse` em vez de `client.responses.create` — habilita parsing automatico
- `zodTextFormat(CartSchema, "cart")` — define o schema e o nome do formato
- `response.outputParsed` em vez de `response.outputText` — ja vem parseado e tipado
- `instructions` separado de `input` — system prompt vs user message

## Exemplo 3: Endpoint Express integrando generateCart

```typescript
app.post("/response", async (req, res) => {
  const { input } = req.body;
  const cart = await generateCart(input, availableProducts);
  res.json(cart);
});
```

**Uso:** POST com `{ "input": "feijoada" }` retorna lista de produtos relacionados a feijoada.

## Exemplo 4: Comparacao lado a lado

### ChatCompletions (antes)
```typescript
const completion = await client.chat.completions.create({
  model: "gpt-4.1-nano",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userInput },
    // Para historico: adicionar todas as mensagens anteriores manualmente
  ],
});

const text = completion.choices[0].message.content;
// Para structured output:
const parsed = JSON.parse(text); // pode falhar, sem validacao
```

### Responses API (depois)
```typescript
const response = await client.responses.create({
  model: "gpt-4.1-nano",
  instructions: systemPrompt,
  input: userInput,
  // Para historico: previous_response_id: lastResponseId
});

const text = response.outputText;
// Para structured output: use client.responses.parse + Zod
```

## Exemplo 5: Conversa com estado (stateful)

```typescript
// Turno 1
const turn1 = await client.responses.create({
  model: "gpt-4.1-nano",
  instructions: "Voce e um assistente de marketplace.",
  input: "Quero fazer feijoada",
});
console.log(turn1.outputText);

// Turno 2 — automaticamente tem contexto do turno 1
const turn2 = await client.responses.create({
  model: "gpt-4.1-nano",
  input: "Adicione produtos para sobremesa tambem",
  previous_response_id: turn1.id,
});
console.log(turn2.outputText);

// Turno 3 — tem contexto de ambos os turnos anteriores
const turn3 = await client.responses.create({
  model: "gpt-4.1-nano",
  input: "Remova itens duplicados",
  previous_response_id: turn2.id,
});
console.log(turn3.outputText);
```

**Vantagem:** Zero gerenciamento manual de historico. A API cuida de tudo internamente via `previous_response_id`.