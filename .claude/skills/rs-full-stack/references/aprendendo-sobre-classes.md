---
name: rs-full-stack-aprendendo-sobre-classes
description: "Applies JavaScript class patterns when writing OOP code with ES6+ classes. Use when user asks to 'create a class', 'implement inheritance', 'extend a class', 'write a constructor', or any object-oriented JavaScript/TypeScript task. Enforces proper constructor usage, method definitions, and inheritance via extends/super. Make sure to use this skill whenever generating class-based code in JS/TS. Not for functional programming patterns, plain object literals, or prototype manipulation."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [javascript, classes, oop, inheritance, es6, constructor]
---

# Classes em JavaScript

> Ao criar classes, use construtores para inicializacao, metodos para comportamento, e heranca via `extends` para reutilizacao de codigo.

## Rules

1. **Use `class` como modelo para objetos** — classes sao syntax sugar sobre prototipos, mas oferecem sintaxe mais clara e legivel, porque facilitam a leitura e manutencao do codigo
2. **Sempre defina o `constructor`** — o construtor e chamado automaticamente ao instanciar com `new`, porque e ali que as propriedades iniciais sao configuradas
3. **Metodos sao funcoes da classe** — defina metodos diretamente no corpo da classe sem `function`, porque descrevem o comportamento do objeto
4. **Use `extends` para heranca** — uma classe filha herda propriedades e metodos da classe pai, porque permite reutilizacao de codigo sem duplicacao
5. **Sobrescreva metodos quando necessario** — classes filhas podem redefinir metodos herdados para comportamento especifico, porque cada subclasse pode ter sua propria implementacao
6. **Instancie com `new`** — `new` aloca espaco na memoria para o objeto, porque sem ele a classe nao cria a instancia corretamente

## How to write

### Classe basica com construtor e metodo

```typescript
class Animal {
  name: string

  constructor(name: string) {
    this.name = name
  }

  makeSound(): string {
    return `${this.name} makes a sound`
  }
}

const animal = new Animal("Cat")
animal.makeSound() // "Cat makes a sound"
```

### Heranca com extends

```typescript
class Dog extends Animal {
  breed: string

  constructor(name: string, breed: string) {
    super(name) // chama o construtor da classe pai
    this.breed = breed
  }

  // sobrescreve o metodo da classe pai
  makeSound(): string {
    return `${this.name} barks`
  }
}

const dog = new Dog("Rex", "Labrador")
dog.makeSound() // "Rex barks"
```

## Example

**Before (sem classes, usando funcoes construtoras):**
```typescript
function Animal(name) {
  this.name = name
}
Animal.prototype.makeSound = function() {
  return this.name + " makes a sound"
}

function Dog(name, breed) {
  Animal.call(this, name)
  this.breed = breed
}
Dog.prototype = Object.create(Animal.prototype)
Dog.prototype.makeSound = function() {
  return this.name + " barks"
}
```

**After (com classes — syntax sugar):**
```typescript
class Animal {
  constructor(name) {
    this.name = name
  }

  makeSound() {
    return `${this.name} makes a sound`
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name)
    this.breed = breed
  }

  makeSound() {
    return `${this.name} barks`
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa criar multiplos objetos com mesma estrutura | Use uma classe como modelo |
| Objetos compartilham comportamento base | Crie classe pai e use `extends` |
| Subclasse precisa de comportamento diferente | Sobrescreva o metodo na classe filha |
| Construtor da classe pai precisa ser chamado | Use `super()` como primeira linha do construtor filho |
| Metodo nao precisa de `this` | Considere metodo `static` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `function MyClass() { this.x = 1 }` | `class MyClass { constructor() { this.x = 1 } }` |
| `MyClass.prototype.method = function(){}` | `class MyClass { method() {} }` |
| `Child.prototype = Object.create(Parent.prototype)` | `class Child extends Parent {}` |
| `Parent.call(this, args)` | `super(args)` |
| `const obj = new Animal` (sem parenteses) | `const obj = new Animal("name")` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `this` retorna `undefined` dentro de metodo | Metodo definido como arrow function em contexto errado | Use method shorthand `method() {}` em vez de arrow function para metodos de classe |
| Erro `Must call super() before accessing this` | Construtor filho acessa `this` antes de chamar `super()` | Coloque `super()` como primeira linha do construtor filho |
| Propriedades da classe pai nao aparecem no filho | Falta de `super()` no construtor da classe filha | Adicione `super(args)` para chamar o construtor pai |
| `new` esquecido ao instanciar | Chamou a classe como funcao sem `new` | Sempre use `new MinhaClasse()` para criar instancias |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre syntax sugar, prototipos e heranca
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes