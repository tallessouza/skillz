---
name: rs-full-stack-number-3
description: "Applies JavaScript Number type rules when writing code that handles numeric values. Use when user asks to 'create a variable with a number', 'handle prices', 'work with decimals', 'fix NaN error', or any numeric operation in JavaScript. Enforces: dot as decimal separator, integer/float awareness, NaN prevention via type checking before arithmetic. Make sure to use this skill whenever generating JS/TS code with numeric operations. Not for string manipulation, date handling, or BigInt operations."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-fundamentals
  tags: [javascript, number, NaN, float, arithmetic]
---

# Tipo Number em JavaScript

> Usar o tipo Number corretamente significa conhecer suas variantes (inteiro, negativo, float), usar ponto como separador decimal, e prevenir NaN verificando tipos antes de operacoes aritmeticas.

## Rules

1. **Use ponto como separador decimal** — `7.5` nao `7,5`, porque virgula em JS separa argumentos/elementos, nao casas decimais
2. **Conheca as tres variantes** — inteiro positivo (`5`), inteiro negativo (`-5`), float (`7.5`) — todos sao tipo `number`
3. **Previna NaN verificando tipos** — antes de operacoes aritmeticas com valores de origem externa, verifique o tipo, porque `12.5 / "texto"` retorna `NaN` (Not a Number)
4. **Use `typeof` para confirmar tipo numerico** — `typeof 5` retorna `"number"`, util para validacao em runtime
5. **Inclua unidade no nome de variaveis numericas** — `priceInCents`, `timeoutInMs`, porque evita erros silenciosos de conversao

## How to write

### Variaveis numericas tipadas corretamente

```javascript
// Inteiro positivo
const quantity = 5

// Inteiro negativo
const temperatureDelta = -5

// Float (numero real com casas decimais)
const totalPrice = 125.70
```

### Prevencao de NaN

```javascript
// Antes de operar, valide o tipo
function safeDivide(numerator, denominator) {
  if (typeof denominator !== 'number' || denominator === 0) {
    throw new Error('Denominador invalido')
  }
  return numerator / denominator
}
```

## Example

**Before (gera NaN silenciosamente):**

```javascript
const price = 12.5
const input = "texto"
const result = price / input // NaN — erro silencioso
```

**After (com verificacao):**

```javascript
const price = 12.5
const input = parseFloat(userInput)

if (Number.isNaN(input)) {
  throw new Error('Entrada nao e um numero valido')
}

const result = price / input
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Valor monetario | Use float com ponto: `125.70` |
| Dado vindo de input/API | `parseFloat()` ou `Number()` + checagem de `NaN` |
| Verificar se e numero | `typeof x === 'number' && !Number.isNaN(x)` |
| Separador decimal | Sempre ponto (`.`), nunca virgula (`,`) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `7,5` (virgula como decimal) | `7.5` (ponto como decimal) |
| `price / userInput` sem checagem | `price / validatedNumber` com checagem de tipo |
| Ignorar `NaN` retornado | Verificar com `Number.isNaN()` antes de usar |
| `isNaN(value)` (global, coerce) | `Number.isNaN(value)` (preciso, sem coercion) |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Resultado de operacao e `NaN` | Operando e string ou undefined | Valide com `Number.isNaN()` antes de operar |
| `7,5` causa erro de sintaxe | Virgula nao e separador decimal em JS | Use ponto: `7.5` |
| `"12" + 8` retorna `"128"` | Operador `+` concatena strings | Converta com `Number()` ou `parseFloat()` antes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre Number, NaN e separadores decimais
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes