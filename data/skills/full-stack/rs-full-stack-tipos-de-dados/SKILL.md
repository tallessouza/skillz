---
name: rs-full-stack-tipos-de-dados
description: "Applies JavaScript primitive data types knowledge when writing or reviewing JS/TS code. Use when user asks to 'declare variables', 'check types', 'handle null or undefined', 'work with primitives', or debug type-related issues. Enforces correct usage of String, Number, Boolean, Null, and Undefined. Make sure to use this skill whenever dealing with type coercion, variable initialization, or nullability checks in JavaScript. Not for TypeScript advanced types, generics, or type system design."
---

# Tipos de Dados em JavaScript

> JavaScript e dinamicamente tipada — o tipo da variavel e definido pelo valor atribuido, nao pela declaracao.

## Key concept

JavaScript nao exige declaracao de tipo ao criar variaveis. O tipo e inferido pelo valor atribuido e pode mudar a qualquer momento (tipagem dinamica). Isso da flexibilidade mas exige disciplina para evitar bugs de coercao.

Analogia do instrutor: uma variavel e como um copo — o objetivo e guardar conteudo, mas voce decide se coloca agua ou refrigerante. O copo nao muda, o conteudo sim.

## Tipos primitivos

| Tipo | O que guarda | Exemplo |
|------|-------------|---------|
| `String` | Texto | `"hello"`, `'world'` |
| `Number` | Numeros (inteiros e decimais) | `42`, `3.14` |
| `Boolean` | Verdadeiro ou falso | `true`, `false` |
| `null` | Vazio intencional — "esta variavel existe mas nao tem conteudo" | `let user = null` |
| `undefined` | Sem valor atribuido — JavaScript define automaticamente | `let x; // x é undefined` |

## Decision framework

| Quando encontrar | Aplique |
|-----------------|---------|
| Variavel declarada sem valor | Sera `undefined` automaticamente (hoisting tambem causa isso) |
| Precisa indicar "vazio de proposito" | Use `null`, nunca `undefined` manualmente |
| Operacao matematica | Verifique se o valor e `Number`, nao `String` |
| Variavel mudou de tipo inesperadamente | Tipagem dinamica — rastreie onde o valor foi reatribuido |
| Comparacao de igualdade com null/undefined | Use `===` (strict) para distinguir `null` de `undefined` |

## How to write

### Inicializacao correta de variaveis

```javascript
// Sem valor ainda — JS atribui undefined automaticamente
let userName;
console.log(userName); // undefined

// Vazio intencional — use null
let selectedProduct = null;

// Com valor — tipo inferido pelo conteudo
let price = 29.90;        // Number
let title = "JavaScript"; // String
let isActive = true;      // Boolean
```

### Verificacao de tipos

```javascript
// Use typeof para inspecionar o tipo
typeof "hello"    // "string"
typeof 42         // "number"
typeof true       // "boolean"
typeof undefined  // "undefined"
typeof null       // "object" (bug historico do JS — mas o valor E null)
```

## Example

**Before (bug de tipo dinamico):**
```javascript
let total = 100;
total = "cem"; // reatribuiu com tipo diferente — permitido mas perigoso
console.log(total + 50); // "cem50" (concatenacao, nao soma)
```

**After (com disciplina de tipos):**
```javascript
let totalInCents = 100;
// Mantenha o tipo consistente ao longo do ciclo de vida da variavel
totalInCents = totalInCents + 50; // 150 (soma numerica)
```

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| `null` e `undefined` sao a mesma coisa | `null` e intencional (voce atribui), `undefined` e automatico (JS atribui) |
| `typeof null` retorna `"null"` | Retorna `"object"` — bug historico da linguagem |
| Variavel sem `let/const/var` e `undefined` | Cria variavel global implicita — comportamento diferente e perigoso |
| Tipagem dinamica significa "nao preciso me preocupar com tipos" | Precisa mais ainda — bugs de coercao sao sutis e dificeis de debugar |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|-----------|
| `let x = undefined` (atribuir undefined manualmente) | `let x = null` (use null para vazio intencional) |
| `if (x == null)` (loose equality) | `if (x === null)` ou `if (x === undefined)` (strict) |
| Reatribuir variavel com tipo diferente sem razao | Mantenha tipo consistente ou crie nova variavel |
| Ignorar `typeof` ao receber dados externos | Sempre verifique tipo antes de operar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre tipagem dinamica, analogia do copo, e hoisting com undefined
- [code-examples.md](references/code-examples.md) — Todos os exemplos de tipos primitivos com variacoes e edge cases