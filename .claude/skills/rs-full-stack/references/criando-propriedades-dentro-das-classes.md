---
name: rs-full-stack-propriedades-classes
description: "Enforces correct use of 'this' keyword and class properties when writing JavaScript/TypeScript classes. Use when user asks to 'create a class', 'define properties', 'use this keyword', 'write a constructor', or any OOP code generation task. Applies rules: always assign constructor params via this, use this to reference class context, create separate instances for separate data. Make sure to use this skill whenever generating class-based code. Not for functional programming, React hooks, or module-level code."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-oop
  tags: [javascript, classes, this-keyword, constructor, oop]
---

# Propriedades em Classes JavaScript

> Ao criar classes, use `this` para declarar propriedades no construtor — toda informacao que a classe precisa expor deve ser atribuida via `this.propriedade`.

## Rules

1. **Atribua parametros do construtor via `this`** — `this.name = name`, porque sem `this` o valor existe apenas como variavel local do construtor e nao fica disponivel na instancia
2. **`this` referencia o contexto da classe** — quando escrever `this.prop` dentro de uma classe, o JavaScript entende que `prop` pertence aquela instancia especifica
3. **Cada `new` cria uma instancia independente** — `product1` e `product2` ocupam lugares diferentes na memoria, porque a classe funciona como uma fabrica de objetos
4. **Use PascalCase para classes, camelCase para instancias** — `Product` vs `product`, porque JavaScript e case-sensitive e a convencao diferencia visualmente classe de instancia
5. **Toda propriedade publica deve ser declarada no construtor** — nao crie propriedades espalhadas em metodos avulsos, porque dificulta entender a forma do objeto

## How to write

### Construtor com propriedades

```javascript
class Product {
  constructor(name) {
    this.name = name  // propriedade disponivel em toda a instancia
  }
}
```

### Multiplas instancias

```javascript
const product1 = new Product("Teclado")
const product2 = new Product("Mouse")

console.log(product1.name) // "Teclado"
console.log(product2.name) // "Mouse"
```

## Example

**Before (propriedade nao atribuida via this):**

```javascript
class Product {
  constructor(name) {
    // name existe apenas como parametro local
    // nao fica acessivel na instancia
  }
}

const product = new Product("Teclado")
console.log(product.name) // undefined
```

**After (com this):**

```javascript
class Product {
  constructor(name) {
    this.name = name
  }
}

const product = new Product("Teclado")
console.log(product.name) // "Teclado"
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Parametro do construtor precisa ser usado fora do construtor | Atribua com `this.param = param` |
| Valor calculado no construtor sera usado em metodos | Atribua com `this.valor = calculo` |
| Precisa de multiplos objetos com mesma estrutura | Crie uma classe e instancie com `new` |
| Classe vs instancia tem nome parecido | PascalCase para classe, camelCase para variavel |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Parametro no construtor sem `this` | `this.name = name` no construtor |
| `var name = name` dentro do construtor | `this.name = name` |
| Propriedade criada fora do construtor | Declare todas as propriedades no construtor |
| `product = Product("Teclado")` (sem new) | `product = new Product("Teclado")` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `product.name` retorna `undefined` | Parametro nao atribuido via `this` no construtor | Adicione `this.name = name` dentro do constructor |
| `TypeError: Product is not a constructor` | Falta `new` na instanciacao | Use `new Product("nome")` em vez de `Product("nome")` |
| Duas instancias compartilham o mesmo valor | Reutilizando a mesma variavel em vez de criar nova instancia | Crie instancias separadas com `new` para cada objeto |
| Propriedade existe dentro do construtor mas nao fora | Atribuida como variavel local sem `this` | Troque `let name = name` por `this.name = name` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre this, contexto e instancias
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes