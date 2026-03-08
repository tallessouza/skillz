---
name: rs-full-stack-maior-menor-e-igual
description: "Applies JavaScript comparison operators correctly when writing conditional logic. Use when user asks to 'compare values', 'check if greater', 'write a condition', 'validate balance', or any numeric comparison task. Enforces correct use of greater-than, greater-or-equal, less-than, less-or-equal operators and guides toward or-equal variants when equality matters. Make sure to use this skill whenever generating comparison expressions in JavaScript. Not for equality/identity operators (=== or ==), string comparisons, or sorting algorithms."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-fundamentos
  tags: [javascript, operators, comparison, conditionals, boolean]
---

# Operadores de Comparação: Maior, Menor e Igual

> Use operadores de comparação para verificar relações entre valores numéricos, sempre considerando se a igualdade faz parte da condição.

## Rules

1. **Use `>=` ou `<=` quando a igualdade é válida** — `balance >= payment` não `balance > payment`, porque valores iguais frequentemente satisfazem a condição (ex: saldo exato para pagar uma conta)
2. **Operadores retornam booleanos** — o resultado é sempre `true` ou `false`, use diretamente em condições sem comparar com `=== true`
3. **Nomeie variáveis pelo domínio** — `balance` e `payment` não `a` e `b`, porque o operador só faz sentido quando os operandos têm significado claro

## How to write

### Comparação com margem de igualdade

```javascript
const balance = 500
const payment = 120

// Verificar se tem saldo SUFICIENTE (inclui saldo exato)
const canPay = balance >= payment // true

// Verificar se está no negativo ou zerado
const isInsufficient = balance < payment // false
```

### Armadilha do operador estrito sem igualdade

```javascript
const balance = 120
const payment = 120

balance > payment   // false — mas o saldo É suficiente!
balance >= payment  // true  — correto
```

## Example

**Before (bug sutil):**
```javascript
const balance = 120
const payment = 120
if (balance > payment) {
  processPayment()
}
// Pagamento não é processado mesmo com saldo exato
```

**After (com esta skill aplicada):**
```javascript
const balance = 120
const payment = 120
if (balance >= payment) {
  processPayment()
}
// Pagamento processado corretamente
```

## Heuristics

| Situação | Operador |
|----------|----------|
| "Tem saldo suficiente?" | `>=` (igualdade conta) |
| "Ultrapassou o limite?" | `>` (estritamente acima) |
| "Está abaixo do mínimo?" | `<` (estritamente abaixo) |
| "Está dentro do limite?" | `<=` (igualdade conta) |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|-----------------|
| `if (balance > payment)` quando igualdade é válida | `if (balance >= payment)` |
| `if ((a > b) === true)` | `if (a > b)` |
| `if (a > b) { return true } else { return false }` | `return a > b` |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Condicao falha quando valores sao iguais | Usando `>` em vez de `>=` | Troque para `>=` quando igualdade e valida |
| Comparacao retorna resultado inesperado com strings | Operador compara strings lexicograficamente | Converta para numero com `Number()` antes de comparar |
| `if (a > b) return true else return false` | Padrao verboso desnecessario | Simplifique para `return a > b` |
| Bug sutil em validacao de saldo | `>` exclui valor exato | Use `>=` para incluir saldo exato como suficiente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações