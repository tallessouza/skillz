---
name: rs-full-stack-expressoes-e-operadores-1
description: "Enforces correct usage of JavaScript expressions and operators when writing arithmetic, logical, or assignment operations. Use when user asks to 'calculate a value', 'write an expression', 'use operators', 'do math in JS', or 'compare values'. Applies mental model: operands are values/variables, operators are symbols, expressions combine both to produce a value. Make sure to use this skill whenever generating JavaScript expressions or explaining operator precedence. Not for DOM manipulation, async code, or framework-specific patterns."
---

# Expressoes e Operadores em JavaScript

> Toda expressao combina operandos (valores ou variaveis) com operadores (simbolos) para produzir um valor — entenda essa composicao e o codigo se torna previsivel.

## Key concept

Operadores sao simbolos que realizam operacoes sobre operandos. Operandos sao os valores ou variaveis usados nessas operacoes. Uma expressao e a combinacao de valores, variaveis, operadores e chamadas de funcao que, quando avaliada, resulta em um unico valor.

Analogia do instrutor: expressoes sao como pecas de LEGO ou um quebra-cabeca — cada peca (operando, operador) se encaixa para formar algo maior (o valor resultante).

## Decision framework

| Quando encontrar | Aplique |
|-----------------|---------|
| Precisa combinar valores numericos | Expressao aritmetica: `5 + 3 + 7` |
| Precisa comparar valores | Expressao logica: `age >= 18` |
| Precisa guardar resultado em variavel | Operador de atribuicao: `const average = sum / count` |
| Expressao ficando longa | Quebre em variaveis intermediarias nomeadas pelo conteudo |

## How to think about it

### Anatomia de uma expressao

```javascript
// Operandos: 5, 3, 7
// Operadores: +, +
// Expressao completa: 5 + 3 + 7
// Resultado: 15
const sum = 5 + 3 + 7
```

### Composicao de expressoes (calculo de media)

```javascript
// Expressao 1: soma dos valores
const sum = 5 + 3 + 7

// Expressao 2: usa resultado da primeira para calcular media
const average = sum / 3
// Resultado: 5
```

## Categories of operators

| Categoria | Exemplos | Proposito |
|-----------|----------|-----------|
| Aritmeticos | `+`, `-`, `*`, `/`, `%` | Contas matematicas |
| Comparacao | `===`, `!==`, `<`, `>`, `>=`, `<=` | Comparar valores (expressoes logicas) |
| Logicos | `&&`, `\|\|`, `!` | Combinar condicoes |
| Atribuicao | `=`, `+=`, `-=` | Atribuir valor a variavel |

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| Operador e expressao sao a mesma coisa | Operador e o simbolo (`+`), expressao e a combinacao completa (`5 + 3`) que produz um valor |
| Expressao precisa ser complexa | `42` sozinho ja e uma expressao (literal) que resulta no valor 42 |
| Operandos sao apenas numeros | Operandos podem ser variaveis, chamadas de funcao, ou qualquer valor |

## Anti-patterns

| Evite | Prefira |
|-------|---------|
| `(5 + 3 + 7) / 3` inline sem contexto | `const sum = 5 + 3 + 7; const average = sum / 3` — nomeie etapas intermediarias |
| Expressoes longas sem quebra | Decomponha em variaveis com nomes descritivos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-expressoes-e-operadores-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-expressoes-e-operadores-1/references/code-examples.md)
