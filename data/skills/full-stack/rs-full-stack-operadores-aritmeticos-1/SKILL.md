---
name: rs-full-stack-operadores-aritmeticos-1
description: "Applies JavaScript arithmetic operator conventions when writing calculations or numeric logic. Use when user asks to 'calculate', 'do math', 'check even odd', 'divide', 'multiply', or any numeric operation in JavaScript. Enforces correct operator usage, warns about string concatenation traps with +, and applies modulo for parity checks. Make sure to use this skill whenever generating JavaScript code with numeric operations. Not for comparison operators, logical operators, or assignment operators."
---

# Operadores Aritméticos em JavaScript

> Ao escrever operacoes matematicas em JavaScript, garanta que os operandos sao numericos e use o operador correto para cada operacao.

## Rules

1. **Sempre use tipos numericos para contas** — `12 + 8` nao `"12" + "8"`, porque o operador `+` com strings faz concatenacao, nao soma
2. **Use `%` para verificar paridade** — `number % 2 === 0` para par, `number % 2 !== 0` para impar, porque e o padrao classico e legivel
3. **Use `**` para exponenciacao** — `3 ** 3` nao `Math.pow(3, 3)`, porque `**` e mais legivel e moderno (ES2016+)
4. **Cuidado com coercao de tipo no `+`** — se UM operando for string, JavaScript converte tudo para string e concatena, mesmo que o outro seja numero

## How to write

### Operacoes basicas

```javascript
const soma = 12 + 8           // 20
const subtracao = 12 - 8       // 4
const multiplicacao = 3 * 5.5  // 16.5
const divisao = 12 / 2         // 6
const resto = 13 % 2           // 1
const potencia = 3 ** 3        // 27
```

### Verificar par ou impar

```javascript
function isEven(number) {
  return number % 2 === 0
}
```

## Example

**Before (bug silencioso com concatenacao):**
```javascript
const price = "12"
const quantity = 8
const total = price + quantity // "128" — concatenou, nao somou!
```

**After (tipos corretos):**
```javascript
const price = 12
const quantity = 8
const total = price + quantity // 20 — soma correta
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Somar valores de input/formulario | Converta com `Number()` antes de somar |
| Verificar se numero e par | `n % 2 === 0` |
| Calcular potencia | Use `**` em vez de `Math.pow()` |
| Divisao que pode ter resto | Use `%` para capturar o resto |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `"12" + "8"` (querendo somar) | `12 + 8` |
| `Math.pow(base, exp)` | `base ** exp` |
| `if (n / 2 === Math.floor(n/2))` | `if (n % 2 === 0)` |
| `Number(a) + Number(b)` sem necessidade | Use tipos numericos desde o inicio |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre coercao de tipo e armadilhas do operador +
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes