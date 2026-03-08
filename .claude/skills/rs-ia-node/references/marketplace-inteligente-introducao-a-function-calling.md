---
name: rs-ia-node-intro-function-calling
description: "Applies Function Calling patterns when integrating OpenAI SDK with dynamic data retrieval. Use when user asks to 'call a function from AI', 'connect AI to database', 'dynamic tool use', 'let AI decide which function to call', or 'structured function calling'. Ensures correct tool definition, parameter schema, and automated execution flow. Make sure to use this skill whenever building AI features that need real-time data or side effects (DB writes, notifications, API calls). Not for prompt engineering, structured outputs, or static AI responses without tool use."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: function-calling
  tags: [openai, ia-node, node-js, function-calling]
---

# Function Calling — Conceito e Aplicação

> Defina ferramentas (funções) no prompt para que o modelo decida automaticamente quando chamá-las, recuperando dados dinâmicos em vez de injetar tudo no contexto.

## Conceito central

Function Calling permite que o desenvolvedor declare funções disponíveis junto ao prompt. O modelo analisa a pergunta do usuário, identifica se alguma função resolve a necessidade, e a chama automaticamente via SDK — o resultado retorna ao modelo, que então gera a resposta final.

## Quando usar Function Calling (não prompt tradicional)

| Cenário | Abordagem |
|---------|-----------|
| Dados estáticos, poucos, conhecidos | Injetar direto no prompt |
| Dados dinâmicos (estoque, clima, preços) | Function Calling — modelo busca sob demanda |
| Side effects (gravar no banco, notificar) | Function Calling — modelo dispara a ação |
| Dados que mudam entre chamadas | Function Calling — evita contexto desatualizado |

## Fluxo de execução

```
1. Desenvolvedor envia prompt + definição de tools (funções disponíveis)
2. Modelo analisa: "preciso de alguma tool para responder?"
   → NÃO: responde direto
   → SIM: chama a função com parâmetros apropriados
3. SDK executa a função no seu código
4. Resultado retorna ao modelo
5. Modelo gera resposta final usando o resultado
```

## Como definir uma tool

```typescript
const tools = [
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
            description: "Nome da cidade, ex: Paris",
          },
        },
        required: ["location"],
      },
    },
  },
]
```

## Exemplo prático: produtos em estoque

```typescript
// Função real no seu código
function getProductsInStock(category: string) {
  return db.products.findMany({
    where: { category, inStock: true },
  })
}

// Definição da tool para o modelo
const tools = [
  {
    type: "function",
    function: {
      name: "getProductsInStock",
      description: "Busca produtos disponíveis em estoque por categoria",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "Categoria do produto, ex: cafe-da-manha",
          },
        },
        required: ["category"],
      },
    },
  },
]

// Usuário: "Quero fazer um café da manhã"
// Modelo decide: chamar getProductsInStock("cafe-da-manha")
// Resultado: [aveia, iogurte, frutas]
// Modelo responde com apenas produtos em estoque
```

## Heuristics

| Situação | Ação |
|----------|------|
| Precisa de dado que muda em tempo real | Function Calling, não hardcode no prompt |
| Precisa registrar algo no banco | Function Calling com side effect |
| Precisa disparar notificação | Function Calling — modelo decide quando |
| Dado já está disponível e é estático | Injete no prompt, sem necessidade de tool |
| Modelo precisa decidir SE e QUANDO buscar | Function Calling — decisão é automática |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Injetar todos os produtos no prompt | Definir tool que busca produtos filtrados |
| Hardcodar dados dinâmicos no system prompt | Criar função que busca sob demanda |
| Chamar a função manualmente antes do prompt | Deixar o modelo decidir quando chamar via tools |
| Definir tool sem description clara | Descrever exatamente o que a função faz e seus parâmetros |

## Troubleshooting

### Modelo nao chama a funcao esperada
**Symptom:** completion retorna content direto em vez de tool_calls
**Cause:** Description da tool muito vaga, ou prompt do usuario nao indica necessidade de dados reais
**Fix:** Melhore a description da tool com casos de uso claros. Adicione no prompt instrucoes explicitas como "considere apenas produtos em estoque" 

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
