---
name: rs-ia-node-marketplace-chain-of-thought
description: "Applies Chain of Thought prompting technique when building LLM prompts for multi-step tasks. Use when user asks to 'write a prompt', 'create a system prompt', 'build an AI prompt', 'improve prompt quality', or 'get better LLM results'. Breaks complex tasks into numbered reasoning steps with examples. Make sure to use this skill whenever designing prompts that require the model to perform analysis, decomposition, or multi-step reasoning. Not for simple single-step prompts, UI code, or non-LLM tasks."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: prompt-engineering
  tags: [prompt-engineering, ia-node, node-js]
---

# Chain of Thought — Encadeamento de Prompts

> Quando uma tarefa e complexa, descreva as etapas de raciocinio no prompt para que o modelo nao pule passos e entregue resultados com maior qualidade.

## Rules

1. **Nunca deixe o modelo adivinhar as etapas** — se a tarefa tem mais de um passo logico, liste os passos explicitamente no prompt, porque o modelo tende a pular direto pro resultado final e perder detalhes importantes
2. **Divida em etapas numeradas** — cada etapa deve ser uma instrucao clara (1. Divida X em componentes, 2. Para cada componente liste Y, 3. Consolide), porque isso forca o modelo a processar cada fase antes de avancar
3. **Inclua um exemplo completo (few-shot)** — mostre input, etapas intermediarias e output esperado, porque modelos respondem significativamente melhor com exemplos concretos
4. **Separe visualmente dados de instrucoes** — use delimitadores claros entre "produtos disponiveis", "necessidade do usuario" e "etapas", porque reduz confusao no contexto
5. **Cada etapa deve produzir um resultado intermediario** — nao pule do input pro output final, porque os resultados intermediarios sao o que garante qualidade

## How to write

### Prompt com Chain of Thought

```typescript
const prompt = `
Etapas:
1. Divida o prato em componentes principais (massa, molho, recheio, etc.)
2. Para cada componente, forneca uma lista de produtos que podem ser usados para prepara-lo.
3. Liste todos os produtos necessarios para todos os componentes.

Exemplo:
---
Produtos disponiveis: farinha de trigo, acucar, manteiga, sal, limao, ovos, creme de leite, morango
Necessidade do usuario: torta de limao

1. Componentes: massa, recheio, cobertura
2. Produtos por componente:
   - Massa: farinha de trigo, manteiga, sal
   - Recheio: limao, acucar, ovos
   - Cobertura: creme de leite, acucar
3. Produtos necessarios: farinha de trigo, acucar, manteiga, sal, limao, ovos, creme de leite
---

Produtos disponiveis: ${availableProducts}
Necessidade do usuario: ${userInput}
`
```

## Example

**Before (prompt direto, sem chain of thought):**
```typescript
const prompt = `Retorna uma lista com 5 produtos que satisfacam a necessidade do usuario.
Produtos: ${products}
Necessidade: ${userNeed}`
// Resultado para "lasanha de frango com molho branco":
// frango, molho de soja, queijo, manteiga, creme dental ❌
```

**After (com chain of thought):**
```typescript
const prompt = `
Etapas:
1. Divida o prato em componentes principais.
2. Para cada componente, forneca uma lista de produtos necessarios.
3. Liste todos os produtos necessarios.

[exemplo few-shot aqui]

Produtos disponiveis: ${products}
Necessidade: ${userNeed}`
// Resultado para "lasanha de frango com molho branco":
// leite, cebola, alho, sal, pimenta, frango, mussarela ✓
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Tarefa com um unico passo logico | Prompt direto, sem chain of thought |
| Tarefa com decomposicao (partes de um todo) | Liste etapas: dividir → detalhar → consolidar |
| Modelo pula detalhes ou vai direto ao final | Adicione etapas intermediarias explicitas |
| Resultados inconsistentes entre execucoes | Adicione exemplo few-shot com etapas preenchidas |
| Combina com chunking/RAG | Chain of thought funciona bem junto — use chunk adequado ao volume de dados |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `Retorne os produtos necessarios` (direto) | `1. Divida em componentes 2. Liste produtos por componente 3. Consolide` |
| Prompt sem exemplo quando tarefa e complexa | Prompt com exemplo completo mostrando cada etapa |
| Etapas vagas: "analise e retorne" | Etapas especificas: "divida X em Y, para cada Y liste Z" |
| Todas as instrucoes em um paragrafo corrido | Etapas numeradas com separacao visual clara |

## Troubleshooting

### Resultado inesperado do modelo
**Symptom:** Resposta da IA nao corresponde ao formato ou conteudo esperado
**Cause:** Prompt insuficiente, parametros mal configurados, ou modelo sem contexto adequado
**Fix:** Revise o prompt com exemplos concretos (few-shot), ajuste temperature, e verifique se os dados necessarios foram fornecidos ao modelo

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
