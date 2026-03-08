---
name: rs-full-stack-incremento-e-decremento
description: "Enforces correct usage of increment and decrement operators in JavaScript/TypeScript code. Use when user asks to 'increment a variable', 'add to counter', 'loop counter', 'update a value', or writes code with ++ or -- operators. Applies rules: prefix vs postfix awareness, += and -= for values greater than 1, avoid silent postfix bugs in expressions. Make sure to use this skill whenever generating code with counters, loops, or numeric variable mutations. Not for string concatenation, array operations, or mathematical formulas."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-fundamentals
  tags: [javascript, operators, increment, decrement, counters]
---

# Incremento e Decremento

> Ao manipular variaveis numericas, escolha o operador que expressa a intencao exata: prefixo quando o valor atualizado importa agora, sufixo quando importa depois.

## Rules

1. **Use `++` e `--` apenas para incrementar/decrementar em 1** — porque `++` significa exatamente +1, nada mais
2. **Use `+=` e `-=` para valores maiores que 1** — `number += 10` em vez de `number = number + 10`, porque e mais conciso e expressa a intencao de mutacao
3. **Prefira prefixo (`++x`) quando o valor atualizado e usado na mesma expressao** — porque `x++` retorna o valor ANTES do incremento, causando bugs silenciosos
4. **Use sufixo (`x++`) quando o incremento deve ocorrer APOS o uso** — tipicamente em loops `for` onde o incremento acontece no fim da iteracao
5. **Nunca misture `++`/`--` com outras operacoes na mesma linha** — `a = b++ + c` e confuso, separe em duas linhas, porque legibilidade supera economia de linhas

## How to write

### Incremento e decremento simples (+1 / -1)
```typescript
// Prefixo: valor atualizado ANTES de usar
let count = 10
console.log(++count) // 11 — incrementa, depois usa

// Sufixo: valor atualizado DEPOIS de usar
let score = 10
console.log(score++) // 10 — usa, depois incrementa
console.log(score)   // 11 — agora sim reflete
```

### Incremento e decremento maior que 1
```typescript
let balance = 100
balance += 25  // 125 — adiciona 25
balance -= 10  // 115 — remove 10

// Equivalente verbose (evitar):
// balance = balance + 25
// balance = balance - 10
```

## Example

**Before (bug silencioso com postfix):**
```typescript
let items = 10
const displayCount = items++
console.log(displayCount) // 10 — esperava 11!
```

**After (prefixo quando valor imediato importa):**
```typescript
let items = 10
const displayCount = ++items
console.log(displayCount) // 11 — correto
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Loop `for` classico | `i++` no terceiro argumento (convencao universal) |
| Valor atualizado usado na mesma expressao | `++variable` (prefixo) |
| Incremento isolado em linha propria | `variable++` ou `++variable` — ambos funcionam igual |
| Adicionar/remover mais que 1 | `variable += n` ou `variable -= n` |
| Expressao complexa com multiplas operacoes | Separe o incremento em linha propria |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `x = x + 1` | `x++` ou `x += 1` |
| `x = x - 1` | `x--` ou `x -= 1` |
| `x = x + 10` | `x += 10` |
| `x = x - 10` | `x -= 10` |
| `result = a++ + b++` | Separe em linhas: `a++; b++; result = a + b` |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Variavel mostra valor anterior apos `x++` | Postfix retorna valor ANTES do incremento | Use `++x` (prefixo) quando precisar do valor atualizado imediatamente |
| `const` com `++` gera erro | `const` nao permite reatribuicao | Use `let` para variaveis que precisam ser incrementadas |
| Resultado inesperado em expressao com `++` | Mistura de incremento com outras operacoes na mesma linha | Separe o incremento em linha propria para clareza |
| Loop infinito com decremento | Condicao de parada nunca alcancada | Verifique se o decremento direciona para a condicao de parada |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre prefixo vs sufixo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes