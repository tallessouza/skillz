---
name: rs-full-stack-o-que-e-metodo-estatico
description: "Enforces correct usage of static methods in JavaScript/TypeScript classes. Use when user asks to 'create a class', 'add a static method', 'call a method without instantiating', or 'use utility functions in a class'. Applies rules: static methods receive all data via parameters (never via constructor/this), call via ClassName.method() without new. Make sure to use this skill whenever generating classes with utility or helper methods. Not for instance methods, inheritance patterns, or decorator usage."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: poo-javascript
  tags: [javascript, classes, static, metodo-estatico, oop]
---

# Métodos Estáticos

> Métodos estáticos existem na classe, não na instância — recebem tudo por parâmetro, nunca por `this`.

## Rules

1. **Use `static` para métodos que não dependem de instância** — `static showMessage()` não `showMessage()`, porque permite acesso direto via `ClassName.method()` sem `new`
2. **Nunca use `this` dentro de método estático** — `this` referencia a instância, que não existe quando o método é chamado diretamente na classe
3. **Passe dados por parâmetro, não pelo constructor** — o constructor só executa com `new`, então `static greet(name)` não `constructor(name)` + `static greet()`, porque o constructor nunca será chamado
4. **Chame via nome da classe** — `User.showMessage()` não `new User().showMessage()`, porque métodos estáticos não aparecem na instância
5. **Omita o constructor se não usar** — não declare constructor vazio, porque a classe funciona sem ele quando só tem métodos estáticos

## How to write

### Método estático correto

```javascript
class MathUtils {
  static sum(a, b) {
    return a + b
  }
}

// Chamada direta, sem instanciar
const result = MathUtils.sum(10, 20)
```

### Classe mista (estático + instância)

```javascript
class User {
  constructor(name) {
    this.name = name
  }

  // Método de instância — precisa de new
  greet() {
    return `Olá, ${this.name}`
  }

  // Método estático — dados por parâmetro
  static createFromEmail(email) {
    const name = email.split('@')[0]
    return new User(name)
  }
}

const user = User.createFromEmail('joao@email.com')
user.greet() // "Olá, joao"
```

## Example

**Before (erro comum — usar this em método estático):**

```javascript
class User {
  constructor(message) {
    this.message = message
  }

  static showMessage() {
    console.log(this.message) // undefined — constructor nunca executou
  }
}

User.showMessage() // undefined
```

**After (com esta skill aplicada):**

```javascript
class User {
  static showMessage(message) {
    console.log(message)
  }
}

User.showMessage('essa é uma mensagem') // "essa é uma mensagem"
```

## Heuristics

| Situação | Faça |
|----------|------|
| Método não usa `this` nem dados da instância | Torne `static` |
| Método é utilitário/helper puro | Torne `static` |
| Método precisa de dados do constructor | Mantenha como método de instância |
| Factory method que retorna nova instância | Use `static` + `return new ClassName()` |
| Classe só tem métodos estáticos | Omita o constructor |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `new User().staticMethod()` | `User.staticMethod()` |
| `static method() { this.prop }` | `static method(prop) { prop }` |
| `constructor(x) { this.x = x }` + `static use() { this.x }` | `static use(x) { x }` |
| `constructor() {}` (vazio, sem uso) | Omita o constructor |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `this.prop` retorna `undefined` em metodo estatico | `this` nao referencia instancia em contexto estatico | Passe dados por parametro ao inves de usar `this` |
| `new User().staticMethod()` nao funciona | Metodos estaticos nao estao na instancia | Chame via `User.staticMethod()` sem `new` |
| Constructor nunca executa | Metodo estatico chamado sem `new` | Remova o constructor se so usa metodos estaticos |
| Metodo nao aparece no autocomplete da instancia | Metodos estaticos pertencem a classe, nao a instancia | Acesse via nome da classe diretamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações