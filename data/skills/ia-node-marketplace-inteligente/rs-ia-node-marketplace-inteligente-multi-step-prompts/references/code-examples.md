# Code Examples: Multi-Step Prompts

## Exemplo completo da aula

O instrutor construiu um pipeline de 2 steps para um marketplace inteligente que sugere produtos baseado em receitas.

### Step 1: Gerar ingredientes

```typescript
const ingredients = await client.responses.create({
  model: "gpt-4.1-mini",
  input: userInput, // ex: "lasanha"
  instructions: `Retorna uma lista de ate 5 ingredientes que satisfacam a necessidade do usuario.
  Divida o prato em componentes, cada componente faz parte de produtos que podem ser usados para preparar o ingrediente.`,
  text: {
    format: zodTextFormat(
      z.object({
        ingredients: z.array(z.string()),
      }).describe("Receita"),
      "receita"
    ),
  },
})
```

**Pontos-chave:**
- O input e APENAS o que o usuario digitou (ex: "lasanha")
- As instrucoes NAO mencionam produtos disponiveis — foco total em ingredientes
- O schema e minimalista: apenas um array de strings
- O termo "ingredientes" e usado deliberadamente para nao limitar ao catalogo

### Step 2: Vincular ingredientes a produtos

```typescript
const cart = await client.responses.create({
  model: "gpt-4.1-mini",
  input: `${userInput}\nIngredientes necessarios: ${ingredients.output_parsed.ingredients}`,
  instructions: `Os produtos disponiveis sao os seguintes: ${availableProducts}.
  Retorne a lista de produtos que satisfaca a necessidade do usuario.`,
  text: {
    format: zodTextFormat(productSchema, "produtos"),
  },
})
```

**Pontos-chave:**
- O input agora inclui os ingredientes do step anterior
- As instrucoes agora incluem os produtos disponiveis
- O modelo so precisa fazer UMA coisa: vincular ingredientes a produtos

## Variacao com 3 steps (proposta do instrutor)

Quando 2 steps nao produzem qualidade suficiente:

```typescript
// Step 1: Identificar componentes da receita
const components = await client.responses.create({
  model: "gpt-4.1-mini",
  input: "lasanha",
  instructions: "Identifique os componentes principais desta receita (ex: massa, molho, recheio, cobertura).",
  text: { format: zodTextFormat(componentsSchema, "componentes") },
})

// Step 2: Ingredientes para cada componente
const ingredients = await client.responses.create({
  model: "gpt-4.1-mini",
  input: `Componentes: ${components.output_parsed.components}`,
  instructions: "Para cada componente, liste os ingredientes necessarios.",
  text: { format: zodTextFormat(ingredientsSchema, "ingredientes") },
})

// Step 3: Vincular ingredientes a produtos do catalogo
const cart = await client.responses.create({
  model: "gpt-4.1-mini",
  input: `Ingredientes: ${ingredients.output_parsed.ingredients}`,
  instructions: `Produtos disponiveis: ${products}. Vincule cada ingrediente ao produto mais adequado.`,
  text: { format: zodTextFormat(productsSchema, "produtos") },
})
```

## Pattern generico reutilizavel

```typescript
type Step<TInput, TOutput> = {
  instructions: string
  schema: z.ZodType<TOutput>
  buildInput: (prev: TInput) => string
}

async function runPipeline<T>(
  client: OpenAI,
  initialInput: string,
  steps: Step<any, any>[]
): Promise<T> {
  let currentInput = initialInput

  for (const step of steps) {
    const result = await client.responses.create({
      model: "gpt-4.1-mini",
      input: step.buildInput(currentInput),
      instructions: step.instructions,
      text: { format: zodTextFormat(step.schema, "step_result") },
    })
    currentInput = result.output_parsed
  }

  return currentInput as T
}
```