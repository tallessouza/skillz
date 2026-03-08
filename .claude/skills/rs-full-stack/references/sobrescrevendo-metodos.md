---
name: rs-full-stack-sobrescrevendo-metodos
description: "Applies JavaScript class method overriding patterns when writing OOP code with inheritance. Use when user asks to 'create a class', 'extend a class', 'override a method', 'customize inherited behavior', or 'implement polymorphism'. Ensures child classes override parent methods correctly and class-specific methods are properly scoped. Make sure to use this skill whenever generating class hierarchies with shared behavior. Not for functional programming, composition patterns, or TypeScript interfaces."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-oop
  tags:
    - javascript
    - classes
    - inheritance
    - method-overriding
    - polymorphism
---

# Sobrescrita de Métodos em Classes JavaScript

> Ao criar hierarquias de classes, sobrescreva métodos herdados para fornecer comportamento específico da classe filha, nunca deixe comportamento genérico quando existe especialização.

## Rules

1. **Sobrescreva métodos genéricos nas classes filhas** — defina o método com o mesmo nome na classe filha, porque comportamento genérico herdado raramente é o desejado em classes especializadas
2. **Mantenha a mesma assinatura do método pai** — mesmos parâmetros e nome, porque a sobrescrita substitui a implementação, não a interface
3. **Métodos na classe base são compartilhados** — coloque na classe pai apenas comportamento que TODAS as filhas devem herdar, porque é o contrato comum
4. **Métodos específicos ficam na classe específica** — se apenas Dog precisa de `fetch()`, defina apenas em Dog, porque outras classes não devem ter acesso a comportamento que não lhes pertence
5. **Sem sobrescrita, o método da classe pai é usado** — JavaScript sobe a cadeia de protótipos até encontrar o método, porque herança funciona por delegação

## How to write

### Sobrescrita básica

```javascript
class Animal {
  constructor(name) {
    this.name = name
  }

  makeNoise() {
    console.log("Som genérico do animal")
  }
}

class Dog extends Animal {
  // Sobrescreve com comportamento específico
  makeNoise() {
    console.log("Woof! Woof!")
  }
}

class Cat extends Animal {
  makeNoise() {
    console.log("Miau! Miau!")
  }
}
```

### Métodos específicos da classe filha

```javascript
class Dog extends Animal {
  makeNoise() {
    console.log("Woof! Woof!")
  }

  // Método que só Dog possui — Cat não terá acesso
  fetch(item) {
    console.log(`${this.name} buscou ${item}`)
  }
}
```

## Example

**Before (comportamento genérico indesejado):**

```javascript
class Dog extends Animal {}
class Cat extends Animal {}

const dog = new Dog("Rex")
const cat = new Cat("Mimi")
dog.makeNoise() // "Som genérico do animal" ← não é útil
cat.makeNoise() // "Som genérico do animal" ← idem
```

**After (com sobrescrita):**

```javascript
class Dog extends Animal {
  makeNoise() {
    console.log("Woof! Woof!")
  }
}

class Cat extends Animal {
  makeNoise() {
    console.log("Miau! Miau!")
  }
}

const dog = new Dog("Rex")
const cat = new Cat("Mimi")
dog.makeNoise() // "Woof! Woof!" ← comportamento específico
cat.makeNoise() // "Miau! Miau!" ← comportamento específico
```

## Heuristics

| Situação | Faça |
|----------|------|
| Classe filha precisa de comportamento diferente do pai | Sobrescreva o método na classe filha |
| Comportamento é comum a TODAS as filhas | Mantenha apenas na classe pai |
| Comportamento pertence a apenas UMA filha | Crie o método apenas naquela classe |
| Classe filha precisa estender (não substituir) o pai | Use `super.metodo()` dentro da sobrescrita |

## Anti-patterns

| Nunca faça | Faça instead |
|------------|-------------|
| Deixar método genérico quando a filha tem comportamento específico | Sobrescrever com implementação adequada |
| Colocar método específico de uma filha na classe pai | Definir o método apenas na classe que o usa |
| Mudar a assinatura do método ao sobrescrever | Manter mesmos parâmetros |
| Criar `if/else` no pai para cada tipo de filha | Sobrescrever em cada filha |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Classe filha usa comportamento generico do pai | Metodo nao foi sobrescrito na classe filha | Defina o metodo com mesmo nome na classe filha |
| Metodo do pai perdido apos sobrescrita | Sobrescrita substitui completamente o metodo | Use `super.metodo()` dentro da sobrescrita para estender |
| Todas as filhas tem acesso a metodo especifico | Metodo definido na classe pai quando deveria ser apenas de uma filha | Mova o metodo para a classe especifica que o utiliza |
| Assinatura do metodo mudou ao sobrescrever | Parametros diferentes do metodo pai | Mantenha mesma assinatura (nome e parametros) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre cadeia de protótipos e delegação
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-sobrescrevendo-metodos/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-sobrescrevendo-metodos/references/code-examples.md)
