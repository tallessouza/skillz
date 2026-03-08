---
name: rs-full-stack-this-objeto
description: "Enforces correct property access within JavaScript object context using 'this' keyword. Use when user asks to 'create an object', 'access object properties', 'write a method', 'use this keyword', or 'fix this undefined'. Applies rules: prefer this over hardcoded object name, never use arrow functions for object methods that need this, use template literals for interpolation. Make sure to use this skill whenever writing JavaScript/TypeScript object methods. Not for class inheritance, prototype chains, or React component this binding."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [javascript, this, objects, methods, context]
---

# Acessando Propriedades no Contexto do Objeto

> Dentro de metodos de objeto, use `this` para acessar propriedades do proprio objeto — nunca hardcode o nome do objeto.

## Rules

1. **Use `this` em metodos de objeto** — `this.name` nao `user.name`, porque se o objeto for renomeado ou copiado, `this` continua funcionando
2. **Nunca use arrow function como metodo de objeto** — arrow functions nao possuem `this` proprio, herdam do escopo externo, resultando em `undefined`
3. **Use template literals para interpolacao** — `` `Ola ${this.name}` `` nao `"Ola " + this.name`, porque e mais legivel e menos propenso a erro
4. **Acesse propriedades dinamicamente** — nunca hardcode valores que existem como propriedades do objeto, porque mudancas ficam centralizadas

## How to write

### Metodo de objeto com this

```javascript
const user = {
  name: "Rodrigo",
  email: "rodrigo@email.com",
  message: function () {
    console.log(`Ola ${this.name}`)
  },
}

user.message() // Ola Rodrigo
```

### Acessando diferentes propriedades

```javascript
const user = {
  name: "Rodrigo",
  email: "rodrigo@email.com",
  greet: function () {
    console.log(`Contato: ${this.name} - ${this.email}`)
  },
}
```

## Example

**Before (hardcoded e arrow function):**

```javascript
const user = {
  name: "Rodrigo",
  message: () => {
    console.log(`Ola ${user.name}`) // funciona mas fragil
  },
}
```

**After (com this e function):**

```javascript
const user = {
  name: "Rodrigo",
  message: function () {
    console.log(`Ola ${this.name}`) // robusto, contexto correto
  },
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Metodo precisa acessar propriedade do objeto | Use `function()` com `this` |
| Callback dentro de metodo (map, filter) | Arrow function e OK (herda this do metodo) |
| Metodo sera copiado para outro objeto | `this` garante contexto correto |
| Shorthand method em ES6 | `message() { }` funciona com `this` |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `nomeDoObjeto.prop` dentro do proprio metodo | `this.prop` |
| `message: () => { this.name }` | `message: function() { this.name }` |
| `"Ola " + this.name` | `` `Ola ${this.name}` `` |
| Valor hardcoded que existe como propriedade | `this.propriedade` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `this.name` retorna `undefined` | Metodo definido como arrow function | Troque para `function()` ou shorthand `metodo() {}` |
| `this` aponta para `window`/`global` | Funcao chamada fora do contexto do objeto | Verifique se esta chamando como `obj.metodo()`, nao `const fn = obj.metodo; fn()` |
| Template literal nao interpola | Usando aspas simples/duplas em vez de backticks | Use backticks: `` `Ola ${this.name}` `` |
| Metodo funciona mas e fragil | Usando nome do objeto hardcoded em vez de `this` | Substitua `nomeDoObjeto.prop` por `this.prop` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre this, arrow functions e contexto
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes