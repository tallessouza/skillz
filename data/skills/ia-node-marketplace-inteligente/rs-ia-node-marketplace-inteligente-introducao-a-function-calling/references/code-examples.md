# Code Examples: Introdução a Function Calling

## Exemplo 1: Temperatura em uma cidade (do instrutor)

Este é o exemplo conceitual usado pelo instrutor para explicar o fluxo:

```typescript
import OpenAI from "openai"

const openai = new OpenAI()

// Função real que seria executada no seu código
function getWeather(location: string): number {
  // Em produção: chamaria uma API de clima
  const temperatures: Record<string, number> = {
    Paris: 14,
    "São Paulo": 28,
    Tokyo: 10,
  }
  return temperatures[location] ?? 20
}

// Definição da tool para o modelo
const tools: OpenAI.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "getWeather",
      description: "Busca a temperatura atual de uma cidade",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "Nome da cidade",
          },
        },
        required: ["location"],
      },
    },
  },
]

// Envio do prompt com tools disponíveis
const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Qual a temperatura em Paris?" }],
  tools,
})

// O modelo retorna tool_calls indicando qual função chamar
// O SDK pode executar automaticamente
```

## Exemplo 2: Produtos em estoque por necessidade (cenário do módulo)

```typescript
import OpenAI from "openai"

const openai = new OpenAI()

// Função que busca produtos em estoque
function getProductsInStock(category: string) {
  // Em produção: consultaria banco de dados
  const products = [
    { name: "Aveia", category: "cafe-da-manha", inStock: true },
    { name: "Iogurte", category: "cafe-da-manha", inStock: true },
    { name: "Granola", category: "cafe-da-manha", inStock: false },
    { name: "Frutas", category: "cafe-da-manha", inStock: true },
    { name: "Pão integral", category: "cafe-da-manha", inStock: true },
  ]

  return products.filter((p) => p.category === category && p.inStock)
}

const tools: OpenAI.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "getProductsInStock",
      description:
        "Busca produtos disponíveis em estoque filtrados por categoria de necessidade",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description:
              "Categoria da necessidade do usuário, ex: cafe-da-manha, almoco, lanche",
          },
        },
        required: ["category"],
      },
    },
  },
]

const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "user",
      content: "Eu quero fazer um café da manhã, o que vocês têm?",
    },
  ],
  tools,
})

// Modelo identifica necessidade → chama getProductsInStock("cafe-da-manha")
// Retorno: [Aveia, Iogurte, Frutas, Pão integral] (apenas em estoque)
// Modelo gera resposta: "Para o café da manhã, temos disponível: Aveia, Iogurte, Frutas e Pão integral"
```

## Exemplo 3: Side effect — registrar no banco

```typescript
// Function Calling não serve apenas para buscar dados
// Também pode disparar ações (side effects)

function registerNotification(userId: string, message: string) {
  // Grava notificação no banco
  db.notifications.create({
    data: { userId, message, sentAt: new Date() },
  })
  return { success: true }
}

const tools: OpenAI.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "registerNotification",
      description: "Registra uma notificação para um usuário específico",
      parameters: {
        type: "object",
        properties: {
          userId: {
            type: "string",
            description: "ID do usuário que receberá a notificação",
          },
          message: {
            type: "string",
            description: "Conteúdo da notificação",
          },
        },
        required: ["userId", "message"],
      },
    },
  },
]
```

## Estrutura mínima de uma tool definition

```typescript
{
  type: "function",          // Sempre "function"
  function: {
    name: "nomeDaFuncao",    // Nome que o modelo vai chamar
    description: "O que a função faz — seja claro e específico",
    parameters: {
      type: "object",        // Sempre "object"
      properties: {
        parametro1: {
          type: "string",    // string, number, boolean, array, object
          description: "Descrição clara do parâmetro",
        },
      },
      required: ["parametro1"],  // Quais são obrigatórios
    },
  },
}
```