---
name: rs-full-stack-arrow-function-2
description: "Enforces arrow function syntax when writing JavaScript/TypeScript functions. Use when user asks to 'write a function', 'create a callback', 'refactor to arrow function', or 'convert function expression'. Applies concise arrow syntax, stores in const, uses template literals over concatenation. Make sure to use this skill whenever generating anonymous functions or function expressions. Not for function declarations, class methods, or generator functions."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [javascript, arrow-functions, es6, callbacks, template-literals]
---

# Arrow Function

> Ao criar funcoes anonimas ou expressoes de funcao, use arrow function syntax por ser mais concisa e legivel.

## Rules

1. **Use arrow function para funcoes anonimas** — `const fn = () => {}` nao `const fn = function() {}`, porque elimina a palavra-chave `function` e reduz ruido visual
2. **Armazene em `const`** — arrow functions nao devem ser reatribuidas, porque `const` comunica intencao de valor imutavel
3. **Use template literals para interpolacao** — `` `Ola, ${name}` `` nao `"Ola, " + name`, porque template literals sao mais legiveis quando ha multiplas variaveis
4. **Separe parametros por virgula** — `(username, email) => {}`, porque cada parametro tem seu lugar explicito na assinatura
5. **Omita parenteses para parametro unico** — `name => {}` ao inves de `(name) => {}`, porque reduz ruido quando ha apenas um parametro

## How to write

### Arrow function sem parametros

```javascript
const showMessage = () => {
  console.log("Ola")
}
```

### Arrow function com parametros e template literal

```javascript
const showMessage = (username, email) => {
  console.log(`Ola, ${username}. Seu e-mail e ${email}`)
}
```

### Arrow function com retorno implicito

```javascript
const double = n => n * 2
```

## Example

**Before (function expression):**
```javascript
const showMessage = function(username, email) {
  console.log("Ola, " + username + ". Seu e-mail e " + email)
}
```

**After (arrow function com template literal):**
```javascript
const showMessage = (username, email) => {
  console.log(`Ola, ${username}. Seu e-mail e ${email}`)
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Callback inline (map, filter, etc.) | Arrow function com retorno implicito |
| Funcao armazenada em variavel | Arrow function com `const` |
| Precisa de `this` do contexto pai | Arrow function (herda `this` lexico) |
| Metodo de objeto/classe | **Nao use arrow** — use method shorthand |
| Funcao precisa de `arguments` | **Nao use arrow** — arrow nao tem `arguments` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const fn = function() {}` | `const fn = () => {}` |
| `let fn = () => {}` | `const fn = () => {}` |
| `` `Ola, ` + name `` | `` `Ola, ${name}` `` |
| `"Ola, " + name + ". Email: " + email` | `` `Ola, ${name}. Email: ${email}` `` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `this` retorna `undefined` na arrow function | Arrow functions nao possuem `this` proprio, herdam do escopo lexico | Use arrow function quando quiser herdar `this`, method shorthand quando precisar do `this` do objeto |
| `arguments` nao existe na arrow function | Arrow functions nao tem objeto `arguments` | Use rest parameters `(...args)` em vez de `arguments` |
| Retorno implicito retorna `undefined` | Corpo com chaves `{}` requer `return` explicito | Remova as chaves para retorno implicito ou adicione `return` |
| Arrow function como metodo de objeto nao acessa propriedades | `this` na arrow aponta para o escopo externo, nao para o objeto | Use method shorthand `metodo() {}` para metodos de objeto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes