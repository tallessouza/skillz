---
name: rs-full-stack-estritamente-igual-diferente
description: "Enforces strict equality (===) and inequality (!==) operators in JavaScript/TypeScript code. Use when user asks to 'compare values', 'check equality', 'write conditionals', 'fix comparison bug', or any code with == or != operators. Applies rule: always use === and !== instead of == and !=, because loose comparison ignores type and causes silent bugs like concatenation instead of addition. Make sure to use this skill whenever generating conditionals or comparisons. Not for mathematical operations, assignment, or string formatting."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-fundamentals
  tags: [javascript, comparison, operators, equality, conditionals]
---

# Operadores de Comparação Estrita (=== e !==)

> Sempre use comparação estrita (=== e !==) para garantir que tanto o tipo quanto o valor sejam verificados.

## Rules

1. **Sempre use `===` em vez de `==`** — porque `==` ignora o tipo e pode considerar `1 == "1"` como verdadeiro, causando bugs silenciosos
2. **Sempre use `!==` em vez de `!=`** — pelo mesmo motivo: `!=` não verifica tipo, então `2 != "2"` retorna `false` quando deveria ser `true`
3. **Comparação estrita previne bugs de concatenação** — se um valor é string quando deveria ser número, `===` detecta o problema antes de uma soma virar concatenação (`"1" + 2 = "12"` em vez de `3`)

## How to write

### Comparações de igualdade
```typescript
// Estritamente igual: verifica tipo E valor
if (status === "active") { ... }
if (count === 0) { ... }
if (userId === selectedId) { ... }
```

### Comparações de diferença
```typescript
// Estritamente diferente: retorna true se tipo OU valor forem diferentes
if (role !== "admin") { ... }
if (result !== undefined) { ... }
if (input !== null) { ... }
```

## Example

**Before (comparação solta — bugs silenciosos):**
```typescript
const quantity = getInput() // retorna "5" (string)
if (quantity == 5) {
  // entra aqui mesmo sendo string!
  const total = quantity + 10 // "510" em vez de 15
}
```

**After (comparação estrita — bug detectado):**
```typescript
const quantity = getInput() // retorna "5" (string)
if (quantity === 5) {
  // NÃO entra — tipo diferente, força o dev a converter
  const total = quantity + 10
}
// Solução correta:
const parsedQuantity = Number(quantity)
if (parsedQuantity === 5) {
  const total = parsedQuantity + 10 // 15 ✓
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Qualquer comparação de igualdade | Use `===` |
| Qualquer comparação de diferença | Use `!==` |
| Comparando com `null` ou `undefined` | Use `===` (evita que `null == undefined` seja `true`) |
| Recebendo input de usuário/API | Compare com `===` após converter o tipo explicitamente |
| Revisando código existente com `==` | Substitua por `===` e verifique se os tipos estão corretos |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `if (x == y)` | `if (x === y)` |
| `if (x != y)` | `if (x !== y)` |
| `if (value == null)` | `if (value === null \|\| value === undefined)` |
| `if (count == "0")` | `if (count === 0)` (converta o tipo antes) |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `1 == "1"` retorna `true` inesperadamente | Comparacao solta ignora tipo | Trocar para `===` |
| Soma retorna string concatenada (`"12"` em vez de `3`) | Variavel e string, comparacao com `==` nao detectou | Usar `===` e converter tipo com `Number()` antes |
| `null == undefined` retorna `true` | Comparacao solta trata ambos como equivalentes | Usar `=== null` e `=== undefined` separadamente |
| Linter reporta erro em `==` | ESLint regra `eqeqeq` ativada | Substituir por `===` em todo o codigo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre coerção de tipos e por que comparação estrita é preferível
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações