---
name: rs-full-stack-heranca-prototipos
description: "Applies JavaScript prototype chain knowledge when writing or reviewing JS/TS code involving inheritance, object creation, or class usage. Use when user asks to 'explain prototypes', 'create a class', 'extend an object', 'understand inheritance', or debug prototype-related issues. Ensures correct mental model of prototype chain, null termination, and sugar syntax awareness. Make sure to use this skill whenever discussing JS inheritance or object hierarchies. Not for CSS, HTML, or non-JS language inheritance."
---

# Herança e Cadeia de Protótipos (Prototype Chain)

> Ao trabalhar com herança em JavaScript, raciocine sempre em termos de cadeia de protótipos — objetos linkados a outros objetos — nunca em termos de classes tradicionais.

## Key concept

JavaScript nao possui classes reais. A keyword `class` (ES2015) e syntax sugar sobre o sistema de prototipos. Cada objeto tem um link interno (`[[Prototype]]`) para outro objeto. Esse objeto-prototype tambem tem seu proprio prototype, formando uma cadeia que termina em `null`.

Quando uma propriedade ou metodo e acessado, o engine percorre a cadeia: objeto → prototype → prototype do prototype → ... → `null`. Se nao encontrar, retorna `undefined`.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| `class extends` | Lembrar que por baixo e prototype chain, nao heranca classica |
| Propriedade nao encontrada no objeto | Engine percorre a cadeia ate `null` |
| `Object.create(proto)` | Cria objeto com `[[Prototype]]` apontando para `proto` |
| Array, Function, Date | Todos herdam de seus prototypes, que herdam de `Object.prototype`, que aponta para `null` |
| Performance de lookup | Cadeias longas impactam busca — manter rasas |

## How to think about it

### Cadeia visual de um Array

```
["Rodrigo", "João", "Ana"]
  └── [[Prototype]] → Array.prototype  (push, map, filter...)
        └── [[Prototype]] → Object.prototype  (toString, hasOwnProperty...)
              └── [[Prototype]] → null  (fim da cadeia)
```

Todo array herda metodos de `Array.prototype`, que por sua vez herda de `Object.prototype`, porque em JavaScript tudo e objeto. O `null` no final significa: acabou a cadeia, nao ha mais de quem herdar.

### Class e apenas syntax sugar

```typescript
// Isso:
class Animal {
  speak() { return "..." }
}
class Dog extends Animal {
  bark() { return "woof" }
}

// Por baixo e equivalente a:
function Animal() {}
Animal.prototype.speak = function() { return "..." }

function Dog() {}
Dog.prototype = Object.create(Animal.prototype)
Dog.prototype.bark = function() { return "woof" }
```

A keyword `class` nao muda o mecanismo — apenas torna a sintaxe mais amigavel.

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| JavaScript tem classes como Java/C# | `class` e syntax sugar sobre prototipos |
| Propriedades herdadas pertencem ao objeto | Estao compartilhadas via prototype, nao copiadas |
| Heranca e por copia | Heranca e por referencia na cadeia |
| Todo objeto herda infinitamente | A cadeia sempre termina em `null` |

## When to apply

- Ao criar hierarquias de objetos com `class` ou `Object.create`
- Ao debugar por que um metodo existe em um objeto (verificar a cadeia)
- Ao decidir entre composicao vs heranca
- Ao usar `instanceof`, `Object.getPrototypeOf()`, ou `hasOwnProperty()`
- Ao otimizar performance de acesso a propriedades

## Limitations

- Prototype chain e unidimensional (heranca simples, nao multipla)
- Cadeias muito profundas degradam performance de lookup
- Modificar prototipos em runtime pode causar bugs dificeis de rastrear
- Para compartilhar comportamento sem hierarquia, preferir composicao (mixins, Object.assign)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes