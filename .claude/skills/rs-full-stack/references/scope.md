---
name: rs-full-stack-scope
description: "Enforces correct JavaScript variable scoping when writing code with var, let, or const. Use when user asks to 'declare a variable', 'fix scope issue', 'refactor var to let', 'debug undefined variable', or any JS/TS code generation. Applies rules: prefer let/const over var, respect block scope, avoid hoisting traps, never rely on var global scope. Make sure to use this skill whenever generating JavaScript or TypeScript code that declares variables. Not for CSS variables, environment variables, or shell scripting."
---

# Escopo de Variáveis em JavaScript

> Sempre declarar variáveis com let ou const, nunca var, porque let respeita o escopo de bloco e impede uso antes da declaração.

## Rules

1. **Use let/const, nunca var** — porque var tem escopo global (function-scoped) e sofre hoisting, levando a bugs silenciosos com `undefined` ao invés de erros
2. **Respeite escopo de bloco** — variáveis declaradas com let/const dentro de `{}` só existem ali, porque isso dá controle sobre visibilidade e ciclo de vida
3. **Declare antes de usar** — let/const lançam ReferenceError se acessadas antes da declaração (temporal dead zone), porque isso previne bugs que var esconde retornando `undefined`
4. **Escopo pai é visível nos filhos** — variável declarada num escopo acima é acessível nos escopos internos, porque JavaScript resolve nomes subindo a cadeia de escopos
5. **Não dependa de hoisting** — mesmo que var "funcione" antes da declaração, o valor será `undefined`, porque só a declaração sobe, não a atribuição

## How to write

### Declaração correta no escopo

```typescript
// let respeita o bloco onde foi criada
{
  let email = "joao@email.com"
  console.log(email) // "joao@email.com" — visível aqui
}
// console.log(email) — ReferenceError: email is not defined
```

### Hierarquia de escopo

```typescript
let address = "rua X"

{
  // escopo filho acessa variável do escopo pai
  console.log(address) // "rua X"
  address = "rua Y"    // pode modificar referência do escopo pai
}

console.log(address) // "rua Y" — modificação persiste
```

## Example

**Before (var com hoisting — bug silencioso):**
```typescript
console.log(user) // undefined (sem erro!)
var user = "Rodrigo"

{
  var age = 18
}
console.log(age) // 18 — vazou do bloco!
```

**After (let com escopo correto):**
```typescript
// console.log(user) — ReferenceError (erro explícito, bom!)
let user = "Rodrigo"
console.log(user) // "Rodrigo"

{
  let age = 18
}
// console.log(age) — ReferenceError (contido no bloco)
```

## Heuristics

| Situação | Faça |
|----------|------|
| Variável que nunca muda | `const` |
| Variável que será reatribuída | `let` |
| Código legado com `var` | Refatore para `let`/`const` |
| Variável retornando `undefined` inesperado | Verifique se é `var` sofrendo hoisting |
| Variável "vazando" de um if/for/bloco | Troque `var` por `let` |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `var user = "Rodrigo"` | `let user = "Rodrigo"` ou `const user = "Rodrigo"` |
| Usar variável antes de declarar | Declarar no topo do escopo onde será usada |
| `var` dentro de `if`/`for` esperando escopo de bloco | `let` dentro de `if`/`for` |
| Confiar que `var` dentro de `{}` fica contida | Usar `let` que garante escopo de bloco |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre hoisting, temporal dead zone e hierarquia de escopos
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-scope/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-scope/references/code-examples.md)
