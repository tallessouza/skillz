---
name: rs-full-stack-operadores-atribuicao
description: "Applies JavaScript assignment operator patterns when writing arithmetic operations on variables. Use when user asks to 'update a variable', 'increment a counter', 'calculate in place', or any in-place arithmetic task. Enforces compound assignment operators (+=, -=, *=, /=, %=, **=) instead of verbose reassignment. Make sure to use this skill whenever generating code that modifies numeric variables in place. Not for comparison operators, logical operators, or destructuring assignment."
---

# Operadores de Atribuicao em JavaScript

> Ao modificar variaveis numericas, use operadores compostos de atribuicao para expressar a intencao de forma concisa e legivel.

## Rules

1. **Use atribuicao composta sempre que modificar uma variavel em si mesma** — `value += 2` nao `value = value + 2`, porque reduz ruido visual e deixa a intencao clara
2. **Conheca todos os 7 operadores** — `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `**=`, porque cada um combina uma operacao aritmetica com atribuicao em um unico passo
3. **Declare variaveis com `let` quando o valor sera reatribuido** — `const` impede reatribuicao e causara erro com qualquer operador composto

## How to write

### Atribuicao simples
```javascript
let value = 1
```

### Incremento e decremento
```javascript
value += 2  // value agora e 3
value -= 2  // value volta a 1
```

### Multiplicacao, divisao, resto e potencia
```javascript
value *= 3   // multiplica por 3
value /= 2   // divide por 2
value %= 2   // resto da divisao por 2
value **= 2  // eleva ao quadrado
```

## Example

**Before (verbose):**
```javascript
let total = 10
total = total + 5
total = total * 2
total = total / 3
total = total % 4
total = total ** 2
```

**After (com operadores compostos):**
```javascript
let total = 10
total += 5    // 15
total *= 2    // 30
total /= 3    // 10
total %= 4    // 2
total **= 2   // 4
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Incrementar contador | `count += 1` ou `count++` |
| Acumular soma | `sum += newValue` |
| Aplicar desconto percentual | `price *= 0.9` (10% off) |
| Calcular resto para ciclagem | `index %= array.length` |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `value = value + 2` | `value += 2` |
| `value = value - 1` | `value -= 1` |
| `value = value * 3` | `value *= 3` |
| `value = value / 2` | `value /= 2` |
| `value = value % 2` | `value %= 2` |
| `value = value ** 2` | `value **= 2` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-operadores-de-atribuicao-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-operadores-de-atribuicao-1/references/code-examples.md)
