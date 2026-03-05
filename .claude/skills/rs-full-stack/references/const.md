---
name: rs-full-stack-const
description: "Enforces correct usage of const declarations in JavaScript/TypeScript code. Use when user asks to 'declare a variable', 'create a constant', 'store a value', or any code that involves variable declarations. Applies rules: use const by default, only use let when reassignment is needed, never use var. Make sure to use this skill whenever generating variable declarations, even if the user doesn't mention const. Not for variable naming conventions, scoping rules, or hoisting behavior."
---

# Const — Declarações com Valor Fixo

> Use `const` por padrão para toda declaração de variável; só use `let` quando reatribuição for necessária.

## Rules

1. **`const` é o padrão** — declare com `const` sempre que o valor não precisa ser reatribuído, porque isso comunica intenção e previne bugs de reatribuição acidental
2. **`let` apenas quando reatribuir** — use `let` somente quando a variável precisa mudar de valor ao longo do bloco, porque isso sinaliza explicitamente que mutação é intencional
3. **Nunca use `var`** — `var` tem escopo de função e hoisting problemático; `const`/`let` têm escopo de bloco previsível
4. **`const` não significa imutável** — objetos e arrays declarados com `const` podem ter propriedades/elementos alterados; o que é fixo é a referência, não o conteúdo
5. **Inicialize sempre na declaração** — `const` exige valor na declaração; isso é uma vantagem porque força código mais claro

## How to write

### Valores fixos (maioria dos casos)

```typescript
const maxRetries = 3
const apiUrl = "https://api.example.com"
const users = await fetchUsers()
```

### Reatribuição necessária (usar let)

```typescript
let count = 0
for (const item of items) {
  if (item.isActive) {
    count++
  }
}
```

### Objetos e arrays (const protege a referência)

```typescript
const user = { name: "Ana", age: 25 }
user.age = 26          // OK — propriedade pode mudar
// user = { name: "B" } // ERRO — referência não pode mudar

const numbers = [1, 2, 3]
numbers.push(4)        // OK — conteúdo pode mudar
// numbers = [5, 6]    // ERRO — referência não pode mudar
```

## Example

**Before (declarações fracas):**

```typescript
var data = fetchData()
var maxItems = 10
var i = 0
```

**After (com esta skill aplicada):**

```typescript
const data = fetchData()
const maxItems = 10
let i = 0
```

## Heuristics

| Situação | Faça |
|----------|------|
| Valor nunca reatribuído | `const` |
| Contador, acumulador, flag que muda | `let` |
| Resultado de função/API | `const` (quase sempre) |
| Iterador de for...of/for...in | `const` (a variável é recriada a cada iteração) |
| Iterador de for clássico (i++) | `let` |
| Objeto/array que recebe push/spread | `const` (referência não muda) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `var x = 10` | `const x = 10` |
| `let x = getValue()` (sem reatribuição depois) | `const x = getValue()` |
| `let items = []` seguido apenas de `.push()` | `const items = []` seguido de `.push()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre const vs let vs var, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-const/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-const/references/code-examples.md)
