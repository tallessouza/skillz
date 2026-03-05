---
name: rs-full-stack-tipos-primitivos
description: "Enforces correct TypeScript primitive type annotations when declaring variables. Use when user asks to 'create a variable', 'declare a type', 'write TypeScript code', or 'annotate types'. Applies string for text, number for integers and decimals, boolean for true/false. Make sure to use this skill whenever writing TypeScript variable declarations. Not for complex types, interfaces, generics, or type utilities."
---

# Tipos Primitivos do TypeScript

> Sempre declare o tipo primitivo das variaveis para que o TypeScript antecipe erros durante o desenvolvimento.

## Rules

1. **Sempre anote o tipo com dois pontos** — `let nome: string` nao `let nome`, porque sem anotacao o TypeScript aceita qualquer valor (tipo `any` implicito)
2. **Use `string` para texto** — qualquer conteudo textual deve ser tipado como `string`, porque garante que numeros e booleanos nao sejam atribuidos acidentalmente
3. **Use `number` para numeros inteiros e decimais** — TypeScript nao diferencia int/float, `number` cobre ambos, porque `3` e `7.5` sao igualmente `number`
4. **Use `boolean` para verdadeiro ou falso** — variaveis de estado/flag devem ser `boolean`, porque restringe a apenas `true` e `false`
5. **Decimais usam ponto, nao virgula** — `7.5` nao `7,5`, porque JavaScript/TypeScript usa notacao inglesa para decimais

## How to write

### Declaracao com tipo explicito

```typescript
// Texto
let username: string
username = "rodrigo"

// Numero (inteiro e decimal)
let total: number
total = 3
total = 7.5

// Booleano
let isLoading: boolean
isLoading = true
isLoading = false
```

## Example

**Before (sem anotacao — aceita qualquer valor):**

```typescript
let username
username = "rodrigo"
username = 17        // nenhum erro — bug silencioso
username = true      // nenhum erro — bug silencioso
```

**After (com tipo primitivo — erros detectados em tempo de desenvolvimento):**

```typescript
let username: string
username = "rodrigo"
// username = 17     // Error: Type 'number' is not assignable to type 'string'
// username = true   // Error: Type 'boolean' is not assignable to type 'string'
```

## Heuristics

| Situacao | Tipo |
|----------|------|
| Nomes, emails, textos, URLs | `string` |
| Quantidades, precos, contadores, indices | `number` |
| Flags de estado (isLoading, isActive, hasError) | `boolean` |
| Valor monetario com centavos (ex: 3.50) | `number` (use ponto decimal) |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `let total` (sem tipo) | `let total: number` |
| `let nome = "rodrigo"` sem contexto de tipo | `let nome: string = "rodrigo"` quando a intencao precisa ser explicita |
| `7,5` (virgula como decimal) | `7.5` (ponto como decimal) |
| `let isActive: number` (0/1 como flag) | `let isActive: boolean` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-tipos-primitivos-2/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-tipos-primitivos-2/references/code-examples.md)
