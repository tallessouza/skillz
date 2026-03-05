---
name: rs-full-stack-ordem-de-precedencia
description: "Applies JavaScript operator precedence rules when writing or reviewing arithmetic expressions. Use when user asks to 'calculate', 'write an expression', 'fix a calculation', 'debug math', or any task involving multiple operators in JS. Ensures correct evaluation order using parentheses where needed. Make sure to use this skill whenever generating code with compound arithmetic or logical expressions. Not for string operations, array methods, or non-expression code."
---

# Ordem de Precedência em JavaScript

> Ao escrever expressoes com multiplos operadores, controle explicitamente a ordem de avaliacao com parenteses para garantir resultados corretos.

## Rules

1. **Conheca a hierarquia** — exponenciacao (`**`) > multiplicacao/divisao/modulo (`*`, `/`, `%`) > adicao/subtracao (`+`, `-`) > relacionais (`>`, `<`, `>=`, `<=`) > logicos (`&&`, `||`), porque JavaScript avalia nessa ordem independente da posicao na expressao
2. **Use parenteses para explicitar intencao** — `(a + b) * c` em vez de confiar na precedencia implicita, porque parenteses eliminam ambiguidade e previnem bugs silenciosos em calculos
3. **Nunca confie na leitura esquerda-direita** — `2 + 3 * 4` resulta em `14` (nao `20`), porque multiplicacao tem precedencia sobre adicao
4. **Em expressoes financeiras, sempre use parenteses** — erros de precedencia em calculos financeiros geram valores incorretos silenciosamente, porque nao ha erro de runtime para alertar

## How to write

### Expressoes aritmeticas compostas

```javascript
// Errado: confia na precedencia implicita (resultado: 14, nao 20)
const result = 2 + 3 * 4

// Correto: parenteses explicitam a intencao
const result = (2 + 3) * 4 // 20
```

### Calculos financeiros

```javascript
// Parenteses garantem a ordem correta
const totalWithTax = (price + shipping) * (1 + taxRate)
const discount = price * (1 - discountPercent / 100)
```

## Example

**Before (bug silencioso):**
```javascript
const finalPrice = basePrice + basePrice * discountRate + shippingCost * taxRate
// Ambiguo: qual operacao acontece primeiro?
```

**After (com parenteses explícitos):**
```javascript
const finalPrice = (basePrice + (basePrice * discountRate)) + (shippingCost * taxRate)
// Cada grupo de operacao esta explicito
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Expressao com 2+ operadores diferentes | Adicione parenteses para explicitar ordem |
| Expressao so com `+` ou so com `*` | Parenteses opcionais (mesma precedencia, esquerda-direita) |
| Calculo financeiro/monetario | Sempre parenteses, sem excecao |
| Expressao misturando logicos e aritmeticos | Separe em variaveis intermediarias |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `a + b * c` (quando quer somar primeiro) | `(a + b) * c` |
| `price * 1 + tax` | `price * (1 + tax)` |
| `a && b \|\| c` sem parenteses | `(a && b) \|\| c` ou `a && (b \|\| c)` |
| Expressao longa sem agrupamento | Variaveis intermediarias nomeadas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes