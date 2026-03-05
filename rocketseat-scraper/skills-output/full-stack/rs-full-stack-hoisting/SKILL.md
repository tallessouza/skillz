---
name: rs-full-stack-hoisting
description: "Enforces correct understanding of JavaScript hoisting when writing or reviewing code with var, let, and const. Use when user asks to 'declare variables', 'fix undefined error', 'refactor var to let/const', 'explain hoisting', or reviews JavaScript scope issues. Applies rules: prefer let/const over var, understand declaration hoisting vs initialization, avoid using variables before declaration. Make sure to use this skill whenever generating JavaScript code that involves variable declarations or scope decisions. Not for TypeScript-specific type declarations, module imports, or function-only topics."
---

# Hoisting em JavaScript

> Declaracoes de variaveis e funcoes sao movidas para o topo do escopo antes da execucao — use let/const para manter controle do escopo.

## Rules

1. **Prefira let e const sobre var** — porque var tem escopo global e pode vazar para fora de blocos, causando comportamentos inesperados
2. **Use const para valores fixos, let para valores que mudam** — porque isso comunica intencao e o escopo de bloco protege contra vazamento
3. **Nunca dependa de hoisting para usar variaveis antes da declaracao** — porque o valor sera `undefined` (var) ou causara ReferenceError (let/const), tornando o codigo imprevisivel
4. **Declare variaveis no topo do escopo onde serao usadas** — porque isso alinha o codigo escrito com o comportamento real do engine JavaScript
5. **Funcoes declaradas com function podem ser chamadas antes da declaracao** — porque hoisting move a declaracao completa (nao apenas o nome), mas prefira organizar o codigo de forma linear para legibilidade

## How to write

### Declaracao correta de variaveis

```javascript
// const para valores que nao mudam
const API_URL = 'https://api.example.com'
const maxRetries = 3

// let para valores que serao reatribuidos
let currentPage = 1
let isLoading = false
```

### Escopo de bloco com let/const

```javascript
if (condition) {
  const result = calculate()  // existe APENAS neste bloco
  let counter = 0             // existe APENAS neste bloco
}
// result e counter nao existem aqui — comportamento correto e previsivel
```

## Example

**Before (var com problemas de escopo):**
```javascript
console.log(userName)  // undefined — hoisting trouxe declaracao mas nao o valor

for (var i = 0; i < 5; i++) {
  // ...
}
console.log(i)  // 5 — var vazou do bloco for para o escopo global

var userName = 'Joao'
```

**After (let/const com escopo controlado):**
```javascript
const userName = 'Joao'
console.log(userName)  // 'Joao' — declarado antes de usar

for (let i = 0; i < 5; i++) {
  // ...
}
// console.log(i) — ReferenceError: i nao existe fora do bloco
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Valor nunca muda apos atribuicao | Use `const` |
| Valor sera reatribuido (contadores, flags) | Use `let` |
| Codigo legado com `var` | Refatore para `let`/`const` avaliando escopo |
| Funcao precisa ser chamada antes no arquivo | `function` declaration permite isso via hoisting |
| Arrow function ou function expression | Declare antes de usar — nao sofrem hoisting completo |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `var nome = 'valor'` | `const nome = 'valor'` ou `let nome = 'valor'` |
| `console.log(x); var x = 5` | `const x = 5; console.log(x)` |
| `var` dentro de `for`/`if`/`while` | `let` ou `const` dentro de blocos |
| `var` no escopo global para "facilitar acesso" | `const`/`let` no escopo mais restrito possivel |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre hoisting, analogia do guindaste, e diferenca entre declaracao e inicializacao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes de var/let/const