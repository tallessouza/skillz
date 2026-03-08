---
name: rs-full-stack-criando-objeto-prototype
description: "Applies JavaScript prototype chain knowledge when writing or debugging object inheritance. Use when user asks to 'explain prototype', 'debug inheritance', 'check prototype chain', 'understand __proto__', or works with Object.create/class extends. Ensures correct mental model of prototype chain navigation from specific type up to null. Make sure to use this skill whenever prototype or inheritance questions arise in JavaScript. Not for TypeScript class syntax, design patterns, or React component hierarchy."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-fundamentos
  tags: [javascript, prototype, inheritance, prototype-chain, object]
---

# Prototype Chain em JavaScript

> Todo objeto em JavaScript possui um prototype que forma uma cadeia de heranca ate chegar em null.

## Rules

1. **Todo objeto criado automaticamente recebe um prototype** — mesmo um simples `{ city: "SP" }` ja possui `__proto__` apontando para `Object.prototype`, porque o motor JS adiciona isso automaticamente
2. **A cadeia sempre termina em null** — navegue de prototype em prototype ate `__proto__` === `null`, isso significa fim da cadeia
3. **O prototype depende do tipo** — objetos literais herdam de `Object.prototype`, arrays de `Array.prototype`, strings de `String.prototype`, porque cada tipo tem seu prototype especifico
4. **Tipos primitivos wrappeados tambem tem cadeia** — uma string tem `String.prototype` → `Object.prototype` → `null`, porque JS faz boxing automatico
5. **Use `__proto__` no console para inspecionar** — quando o console nao mostra o prototype diretamente (como em strings), acesse via `.__proto__` para visualizar a cadeia

## How to write

### Inspecionar a cadeia de prototype

```javascript
// Objeto literal: Object.prototype → null
const address = { city: "São Paulo", country: "Brasil" }
console.dir(address)
// address → { city, country, [[Prototype]]: Object }

// Array: Array.prototype → Object.prototype → null
const users = ["Rodrigo", "João", "Maria"]
console.dir(users)
// users → Array(3) → [[Prototype]]: Array → [[Prototype]]: Object

// String: String.prototype → Object.prototype → null
const username = "Rodrigo Gonçalves"
console.dir(username.__proto__)
// String.prototype → [[Prototype]]: Object → null
```

### Navegar a cadeia programaticamente

```javascript
function logPrototypeChain(obj) {
  let current = obj
  while (current !== null) {
    console.log(Object.getPrototypeOf(current))
    current = Object.getPrototypeOf(current)
  }
}
```

## Example

**Before (confusao sobre heranca):**
```javascript
const address = { city: "SP" }
// Dev acha que address so tem city
// Nao entende por que address.hasOwnProperty existe
```

**After (entendendo a cadeia):**
```javascript
const address = { city: "SP" }
// address.hasOwnProperty vem de Object.prototype
// Cadeia: address → Object.prototype → null
console.log(address.__proto__ === Object.prototype) // true
console.log(address.__proto__.__proto__ === null)    // true
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Console nao mostra prototype | Acesse via `.__proto__` ou `Object.getPrototypeOf()` |
| Quer ver o objeto completo | Use `console.dir()` em vez de `console.log()` |
| Quer saber de onde um metodo vem | Navegue a cadeia ate encontrar a propriedade |
| Precisa verificar fim da cadeia | Cheque se `__proto__` === `null` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Assumir que objeto so tem props visiveis | Inspecionar `__proto__` para ver heranca |
| Ignorar a cadeia de prototype | Navegar ate null para entender heranca completa |
| Usar `__proto__` em codigo de producao | Usar `Object.getPrototypeOf()` em producao |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `console.log` nao mostra o prototype | `console.log` serializa apenas propriedades proprias | Use `console.dir(obj)` para ver a cadeia completa |
| `__proto__` nao aparece em strings | Strings sao primitivos, console nao expande automaticamente | Acesse via `"texto".__proto__` ou `Object.getPrototypeOf("texto")` |
| Metodo herdado nao aparece em `Object.keys()` | `Object.keys` retorna apenas propriedades proprias | Use `for...in` para iterar incluindo propriedades herdadas |
| `__proto__` deprecated em producao | `__proto__` e legacy e pode ser removido | Use `Object.getPrototypeOf(obj)` em codigo de producao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre cadeia de heranca, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes