---
name: rs-full-stack-heranca-com-classes
description: "Applies JavaScript/TypeScript class inheritance patterns using extends keyword when writing OOP code. Use when user asks to 'create a class', 'extend a class', 'implement inheritance', 'reuse methods across classes', or 'build class hierarchy'. Enforces proper extends usage, constructor inheritance, and method reuse. Make sure to use this skill whenever generating class hierarchies or OOP structures. Not for functional programming, composition patterns, or React component inheritance."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [javascript, typescript, classes, inheritance, extends, oop]
---

# Herança com Classes (JavaScript/TypeScript)

> Usar `extends` para herdar propriedades e métodos de uma classe pai, evitando duplicação de código entre classes relacionadas.

## Rules

1. **Use `extends` para herança** — `class Dog extends Animal` herda todas as propriedades e métodos, porque evita duplicar código entre classes do mesmo domínio
2. **Classe filha herda construtor automaticamente** — se não definir construtor na filha, o construtor da classe pai é usado, porque JavaScript resolve a cadeia de protótipos
3. **Classe filha herda métodos automaticamente** — métodos definidos na classe pai ficam disponíveis na filha sem reescrita, porque `extends` configura a prototype chain
4. **Agrupe comportamento compartilhado na classe pai** — propriedades e métodos comuns a todas as filhas vivem na classe pai, porque centraliza manutenção
5. **Use `super()` ao sobrescrever construtor** — ao definir construtor na classe filha, chame `super()` primeiro, porque inicializa o contexto da classe pai

## How to write

### Classe pai com propriedades e métodos compartilhados

```typescript
class Animal {
  constructor(name) {
    this.name = name
  }

  makeNoise() {
    console.log("Som genérico do animal")
  }
}
```

### Classe filha herdando via extends

```typescript
class Dog extends Animal {}
class Cat extends Animal {}

const dog = new Dog("Bilu")
console.log(dog.name) // "Bilu"
dog.makeNoise() // "Som genérico do animal"

const cat = new Cat("Mel")
console.log(cat.name) // "Mel"
cat.makeNoise() // "Som genérico do animal"
```

### Classe filha com comportamento especializado

```typescript
class Dog extends Animal {
  makeNoise() {
    console.log("Au au!")
  }
}
```

## Example

**Before (código duplicado entre classes):**
```typescript
class Dog {
  constructor(name) {
    this.name = name
  }
  makeNoise() {
    console.log("Au au!")
  }
}

class Cat {
  constructor(name) {
    this.name = name
  }
  makeNoise() {
    console.log("Miau!")
  }
}
```

**After (com herança aplicada):**
```typescript
class Animal {
  constructor(name) {
    this.name = name
  }
  makeNoise() {
    console.log("Som genérico")
  }
}

class Dog extends Animal {
  makeNoise() {
    console.log("Au au!")
  }
}

class Cat extends Animal {
  makeNoise() {
    console.log("Miau!")
  }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Duas ou mais classes compartilham propriedades | Extraia para uma classe pai e use `extends` |
| Classe filha sem construtor próprio | Não defina construtor — o da pai é herdado |
| Classe filha precisa de props extras | Defina construtor com `super(parentProps)` + props novas |
| Método da filha difere do pai | Sobrescreva o método na filha (override) |
| Apenas uma classe no domínio | Não crie hierarquia — herança sem necessidade é over-engineering |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| Copiar construtor igual em várias classes | `extends` na classe pai com construtor único |
| Copiar métodos iguais entre classes | Método na classe pai, herdado pelas filhas |
| `extends` sem propriedades/métodos compartilhados | Classes independentes (herança sem motivo) |
| Hierarquia com mais de 2-3 níveis | Composição para hierarquias profundas |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `ReferenceError: Must call super constructor` | Construtor da filha sem `super()` | Adicione `super(args)` como primeira linha do construtor |
| Método da classe pai não disponível na filha | `extends` não declarado ou typo no nome da classe | Verifique `class Child extends Parent` |
| `this` undefined no construtor da filha | `super()` não chamado antes de acessar `this` | Chame `super()` antes de qualquer uso de `this` |
| Hierarquia com 4+ níveis difícil de manter | Over-engineering com herança profunda | Considere composição em vez de herança |
| Override acidental de método do pai | Mesmo nome de método na filha sem intenção | Renomeie o método ou use `super.method()` para chamar o original |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações