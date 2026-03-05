---
name: rs-full-stack-undefined-e-null
description: "Enforces correct usage of undefined and null in JavaScript/TypeScript code. Use when user asks to 'initialize variables', 'declare variables', 'set default values', 'handle empty states', or 'check for null'. Applies rules: never assign undefined explicitly, use null for intentional emptiness, distinguish automatic vs intentional absence. Make sure to use this skill whenever generating variable declarations or handling empty/missing values. Not for error handling, type checking, or control flow logic."
---

# Undefined e Null

> Undefined é ausência automática de valor; null é ausência intencional. Nunca confunda os dois.

## Rules

1. **Nunca atribua undefined explicitamente** — `let x = undefined` é redundante, porque o JavaScript já faz isso automaticamente quando uma variável é declarada sem valor
2. **Use null para indicar vazio intencional** — `let user = null` comunica que a variável existe mas deliberadamente não tem valor ainda
3. **Declare sem valor quando o valor virá depois** — `let result` é suficiente, porque undefined é o estado padrão até atribuição
4. **Distinga verificações** — `=== undefined` para "nunca foi atribuído", `=== null` para "intencionalmente vazio", porque a semântica importa para quem lê o código

## How to write

### Variável aguardando valor futuro

```javascript
// Correto: deixe undefined implícito
let currentUser

// Depois, quando o valor chegar:
currentUser = fetchedUser
```

### Variável intencionalmente vazia

```javascript
// Correto: null indica "sei que está vazio"
let selectedProduct = null

// Depois, quando o usuário selecionar:
selectedProduct = product
```

### Verificação de estado

```javascript
if (currentUser === undefined) {
  // Nunca foi definido — talvez o fetch ainda não rodou
}

if (selectedProduct === null) {
  // Foi definido como vazio intencionalmente — nenhum produto selecionado
}
```

## Example

**Before (uso incorreto):**

```javascript
let emptiness = undefined
let empathy = undefined

console.log("O valor é:", emptiness) // undefined — redundante
console.log("O valor é:", empathy)   // undefined — sem intenção clara
```

**After (com esta skill aplicada):**

```javascript
let emptiness              // undefined automático — aguardando valor
let empathy = null         // null intencional — explicitamente vazio

console.log("O valor é:", emptiness) // undefined
console.log("O valor é:", empathy)   // null
```

## Heuristics

| Situação | Faça |
|----------|------|
| Variável declarada que receberá valor depois | `let x` (sem atribuição) |
| Variável que representa "nenhum valor selecionado" | `let x = null` |
| Resetar variável para estado vazio | `x = null` |
| Verificar se variável foi inicializada | `x === undefined` |
| Verificar se variável foi esvaziada intencionalmente | `x === null` |
| Verificar ambos os casos | `x == null` (loose equality captura ambos) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `let x = undefined` | `let x` |
| `if (x == undefined)` quando precisa distinguir | `if (x === undefined)` ou `if (x === null)` |
| `x = undefined` para "limpar" variável | `x = null` |
| `return undefined` explicitamente | `return` (sem valor) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre a semântica de undefined vs null
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-undefined-e-null/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-undefined-e-null/references/code-examples.md)
