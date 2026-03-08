---
name: rs-ia-node-marketplace-multi-step-prompts
description: "Applies multi-step prompt technique when building AI-powered features that require breaking complex tasks into separate sequential LLM calls. Use when user asks to 'chain prompts', 'split into steps', 'multi-step AI', 'sequential prompts', or builds features where one LLM output feeds into the next call. Make sure to use this skill whenever designing prompt pipelines or when a single prompt produces poor results due to task complexity. Not for single-prompt optimization, chain-of-thought within one prompt, or non-AI code."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: prompt-engineering
  tags: [prompt-engineering, ia-node, node-js, responses-api]
---

# Multi-Step Prompts

> Divida tarefas complexas em prompts separados e sequenciais, onde cada prompt foca em uma unica responsabilidade e alimenta o proximo.

## Rules

1. **Separe responsabilidades por prompt** — cada chamada ao modelo resolve UMA tarefa especifica, porque foco aumenta precisao e reduz alucinacoes
2. **Injete output anterior como input do proximo** — o resultado do step 1 vira contexto explicito do step 2, porque o modelo nao precisa redescobrir informacao
3. **Comece com poucos steps e aumente se necessario** — 2 steps primeiro, so divida mais se a qualidade cair, porque steps demais adicionam latencia sem ganho
4. **Mantenha cada prompt independente do contexto global** — cada step recebe apenas o que precisa, porque isso reduz ruido e tokens desnecessarios
5. **Teste e compare com abordagem single-prompt** — multi-step nem sempre e melhor, porque a qualidade varia por caso de uso

## How to write

### Estrutura basica de multi-step

```typescript
async function multiStepPipeline(userInput: string) {
  // Step 1: Tarefa especifica e focada
  const step1Result = await client.responses.create({
    model: "gpt-4.1-mini",
    input: userInput,
    instructions: `Retorna uma lista de ate 5 ingredientes que satisfacam a necessidade do usuario.
    Divida o prato em componentes, cada componente faz parte de produtos que podem ser usados para preparar o ingrediente.`,
    text: { format: zodTextFormat(step1Schema, "step1_result") },
  })

  // Step 2: Usa output do step 1 como contexto
  const step2Result = await client.responses.create({
    model: "gpt-4.1-mini",
    input: `${userInput}\nIngredientes necessarios: ${step1Result.output_parsed.ingredients}`,
    instructions: `Os produtos disponiveis sao os seguintes: ${availableProducts}.
    Retorne a lista de produtos que satisfaca a necessidade do usuario.`,
    text: { format: zodTextFormat(step2Schema, "step2_result") },
  })

  return step2Result.output_parsed
}
```

### Schema separado por step

```typescript
// Step 1: schema focado APENAS em ingredientes (sem referencia a produtos)
const ingredientsSchema = z.object({
  ingredients: z.array(z.string()),
}).describe("Receita")

// Step 2: schema focado em vincular ingredientes a produtos
const productsSchema = z.object({
  products: z.array(z.object({
    name: z.string(),
    quantity: z.number(),
  })),
}).describe("Produtos")
```

## Example

**Before (tudo em um prompt so):**
```typescript
const result = await client.responses.create({
  model: "gpt-4.1-mini",
  input: "lasanha",
  instructions: `Identifique os ingredientes, encontre os produtos disponiveis
  que correspondem, e retorne a lista final. Produtos: ${products}`,
})
// Resultado: mistura conceitos, retorna produtos irrelevantes
```

**After (multi-step):**
```typescript
// Step 1: Foco total em ingredientes (sem conhecer produtos)
const ingredients = await client.responses.create({
  model: "gpt-4.1-mini",
  input: "lasanha",
  instructions: "Retorna lista de ingredientes para preparar este prato.",
  text: { format: zodTextFormat(ingredientsSchema, "receita") },
})

// Step 2: Foco total em vincular ingredientes a produtos
const cart = await client.responses.create({
  model: "gpt-4.1-mini",
  input: `Ingredientes: ${ingredients.output_parsed.ingredients}`,
  instructions: `Produtos disponiveis: ${products}. Vincule ingredientes aos produtos.`,
  text: { format: zodTextFormat(productsSchema, "produtos") },
})
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Prompt unico retorna resultados imprecisos | Divida em 2 steps e compare |
| 2 steps ainda com baixa qualidade | Adicione step intermediario (ex: componentes → ingredientes → produtos) |
| Cada step e rapido mas pipeline e lenta | Avalie se steps podem rodar em paralelo |
| Resultado do step 1 e consistente | Considere cachear para reduzir chamadas |
| Tarefa simples com bom resultado em 1 prompt | Nao use multi-step, mantenha simples |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Misturar descoberta e vinculacao no mesmo prompt | Separe: descobrir ingredientes (step 1) e vincular a produtos (step 2) |
| Passar todo o contexto em todos os steps | Passe apenas o output relevante do step anterior |
| Comecar com 5+ steps sem validar com 2 | Comece com 2, aumente incrementalmente |
| Ignorar queda de qualidade entre strategies | Teste multi-step vs chain-of-thought vs single-prompt e compare |
| Hardcodar numero de steps | Ajuste quantidade de steps conforme resultado observado |

## Troubleshooting

### Resultado inesperado do modelo
**Symptom:** Resposta da IA nao corresponde ao formato ou conteudo esperado
**Cause:** Prompt insuficiente, parametros mal configurados, ou modelo sem contexto adequado
**Fix:** Revise o prompt com exemplos concretos (few-shot), ajuste temperature, e verifique se os dados necessarios foram fornecidos ao modelo

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
