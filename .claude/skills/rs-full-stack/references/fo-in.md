---
name: rs-full-stack-fo-in
description: "Applies correct for...in loop patterns when iterating over object properties or array indices in JavaScript. Use when user asks to 'loop through object', 'iterate properties', 'traverse object keys', 'use for in', or 'access object properties dynamically'. Enforces bracket notation for dynamic property access and meaningful iterator variable names. Make sure to use this skill whenever generating code that iterates over object properties. Not for array element iteration (prefer for...of), forEach, or map/filter/reduce patterns."
---

# For In — Iteracao sobre Propriedades de Objetos

> Use `for...in` para percorrer propriedades de objetos, sempre com notacao de colchetes para acesso dinamico.

## Rules

1. **Use `for...in` para objetos, nao arrays** — `for...in` itera sobre propriedades enumeraveis; para arrays, prefira `for...of` ou metodos funcionais, porque `for...in` retorna indices como strings e pode incluir propriedades herdadas
2. **Use notacao de colchetes para acesso dinamico** — `object[property]` nao `object.property`, porque a variavel auxiliar contem o nome da propriedade como string e notacao de ponto nao resolve variaveis
3. **Nomeie a variavel auxiliar com intencao** — `property` para objetos, `index` para arrays, porque o nome comunica o que esta sendo iterado
4. **Cada iteracao corresponde a uma propriedade** — o numero de voltas do loop equivale ao numero de propriedades no objeto

## How to write

### Percorrer propriedades de um objeto

```javascript
const person = {
  name: "Rodrigo",
  surname: "Goncalves",
  email: "rodrigo@email.com"
}

for (let property in person) {
  console.log(property)          // nome da propriedade: "name", "surname", "email"
  console.log(person[property])  // valor: "Rodrigo", "Goncalves", "rodrigo@email.com"
}
```

### Com arrays (retorna indices)

```javascript
const students = ["Rodrigo", "Joao", "Amanda"]

for (let index in students) {
  console.log(index)            // "0", "1", "2" (indices como string)
  console.log(students[index])  // "Rodrigo", "Joao", "Amanda"
}
```

## Example

**Before (acesso incorreto com notacao de ponto):**
```javascript
for (let prop in user) {
  console.log(user.prop)  // undefined — "prop" nao e uma propriedade, e uma variavel
}
```

**After (com notacao de colchetes):**
```javascript
for (let property in user) {
  console.log(user[property])  // valor correto da propriedade
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de chaves e valores de um objeto | `for...in` com `object[key]` |
| Precisa apenas dos valores de um array | `for...of` (nao `for...in`) |
| Precisa do indice E valor de um array | `for...in` com `array[index]` ou `.forEach((item, i)` |
| Propriedade acessada via variavel | Sempre notacao de colchetes `[]` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `for (let i in obj) { obj.i }` | `for (let prop in obj) { obj[prop] }` |
| `for (let x in arr)` (nome generico) | `for (let index in arr)` |
| `for (let key in arr)` para iterar valores | `for (let item of arr)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre quando usar for...in vs for...of, notacao de colchetes vs ponto
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-fo-in/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-fo-in/references/code-examples.md)
