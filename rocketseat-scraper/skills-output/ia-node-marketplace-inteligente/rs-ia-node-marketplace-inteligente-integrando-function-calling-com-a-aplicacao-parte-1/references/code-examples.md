# Code Examples: Integrando Function Calling com OpenAI

## Estrutura de arquivos do projeto

```
src/
├── routes/products.ts    # Route handler (simplificado)
├── modules/openai.ts     # Interacao com OpenAI + tools
└── database/products.ts  # Simulacao do banco de dados
```

## Simulacao do banco de dados

```typescript
// database/products.ts
interface Product {
  nome: string;
  estoque: number;
}

const products: Product[] = [
  { nome: "Granola Integral", estoque: 15 },
  { nome: "Iogurte Grego", estoque: 0 },
  { nome: "Pao Integral", estoque: 23 },
  { nome: "Mel Organico", estoque: 8 },
  { nome: "Aveia em Flocos", estoque: 0 },
  { nome: "Frutas Secas Mix", estoque: 12 },
  { nome: "Cereal Acucarado", estoque: 30 },
  { nome: "Pao Branco", estoque: 45 },
];

export function produtosEmEstoque(): Product[] {
  return products.filter((p) => p.estoque > 0);
}

export function produtosEmFalta(): Product[] {
  return products.filter((p) => p.estoque === 0);
}
```

## Route handler simplificado

```typescript
// routes/products.ts
import { generateProducts } from "../modules/openai";

app.post("/generate", async (req, res) => {
  try {
    const { input } = req.body;
    const products = await generateProducts(input);
    return res.json(products);
  } catch {
    return res.status(500).json({ error: "Erro ao gerar produtos" });
  }
});
```

## Modulo OpenAI completo (parte 1)

```typescript
// modules/openai.ts
import OpenAI from "openai";
import {
  ChatCompletionTool,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions";
import { produtosEmEstoque, produtosEmFalta } from "../database/products";

const client = new OpenAI();

// Definicao das tools (fora da funcao para reutilizar)
const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "produtos_em_estoque",
      description: "Lista os produtos que estao em estoque",
      strict: true,
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "produtos_em_falta",
      description: "Lista os produtos que estao em falta no estoque",
      strict: true,
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
    },
  },
];

// Mapa de funcoes para dispatch dinamico
const toolsMap: Record<string, () => Product[]> = {
  produtos_em_estoque: produtosEmEstoque,
  produtos_em_falta: produtosEmFalta,
};

export async function generateProducts(input: string) {
  // Mensagens declaradas dentro da funcao (resetam a cada chamada)
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "user",
      content: `Liste 3 produtos que atendam a necessidade do usuario.
Considere apenas os produtos em estoque.
Necessidade: ${input}`,
    },
  ];

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    tools,
  });

  const { tool_calls } = completion.choices[0].message;

  if (tool_calls) {
    const toolCall = tool_calls[0];

    console.log("Tool call recebida:", toolCall.function.name);

    const functionToCall = toolsMap[toolCall.function.name];

    if (!functionToCall) {
      throw new Error(`Funcao nao encontrada: ${toolCall.function.name}`);
    }

    const result = functionToCall();
    console.log("Resultado da funcao:", result);

    // Parte 2: devolver result para a OpenAI e obter resposta final
    // (sera implementado na proxima aula)
  }

  return completion.choices[0].message.content;
}
```

## Exemplo de resposta da API com tool_calls

```json
{
  "choices": [
    {
      "message": {
        "content": null,
        "tool_calls": [
          {
            "id": "call_abc123",
            "type": "function",
            "function": {
              "name": "produtos_em_estoque",
              "arguments": "{}"
            }
          }
        ]
      }
    }
  ]
}
```

## Se tools tivessem parametros (exemplo hipotetico)

```typescript
{
  type: "function",
  function: {
    name: "produtos_por_categoria",
    description: "Lista produtos em estoque filtrados por categoria",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        categoria: {
          type: "string",
          description: "Categoria do produto (ex: saudavel, doces, bebidas)",
        },
        limite: {
          type: "number",
          description: "Numero maximo de produtos a retornar",
        },
      },
      required: ["categoria"],
      additionalProperties: false,
    },
  },
}

// Dispatch com argumentos:
const args = JSON.parse(toolCall.function.arguments);
// ou toolCall.function.parsedArguments (se disponivel)
const result = functionToCall(args.categoria, args.limite);
```