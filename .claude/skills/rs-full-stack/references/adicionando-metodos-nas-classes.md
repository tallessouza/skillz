---
name: rs-full-stack-adicionando-metodos-nas-classes
description: "Enforces correct class method syntax when writing JavaScript/TypeScript classes. Use when user asks to 'create a class', 'add a method', 'write a class method', or any OOP code generation task. Applies rules: no function keyword in class methods, use this to access instance properties, methods defined at class body level. Make sure to use this skill whenever generating class-based code. Not for standalone functions, arrow functions, or functional programming patterns."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [javascript, classes, methods, oop, constructor, this]
---

# Métodos em Classes JavaScript

> Métodos em classes sao funcoes definidas diretamente no corpo da classe, sem a palavra-chave `function`.

## Rules

1. **Nunca use `function` dentro do corpo da classe** — `sendEmail() {}` nao `function sendEmail() {}`, porque o parser do JavaScript rejeita `function` como sintaxe invalida dentro de class bodies
2. **Acesse propriedades da instancia via `this`** — `this.name`, `this.email`, porque metodos operam no contexto do objeto instanciado
3. **Defina propriedades no constructor antes de usar nos metodos** — `this.name = name` no constructor garante que `this.name` estara disponivel em qualquer metodo da classe
4. **Metodos ficam no mesmo nivel do constructor** — nao aninhados dentro dele, porque sao membros da classe, nao variaveis locais do constructor

## How to write

### Classe com constructor e metodo

```javascript
class User {
  constructor(name, email) {
    this.name = name
    this.email = email
  }

  sendEmail() {
    console.log(`E-mail enviado para ${this.name} no endereço ${this.email}`)
  }
}

const user = new User("Rodrigo", "rodrigo@email.com")
user.sendEmail()
```

### Multiplos metodos

```javascript
class Product {
  constructor(name, priceInCents) {
    this.name = name
    this.priceInCents = priceInCents
  }

  formatPrice() {
    return `R$ ${(this.priceInCents / 100).toFixed(2)}`
  }

  describe() {
    return `${this.name} - ${this.formatPrice()}`
  }
}
```

## Example

**Before (erro comum):**
```javascript
class User {
  constructor(name) {
    this.name = name
  }

  function greet() {  // SyntaxError!
    console.log(`Oi, ${this.name}`)
  }
}
```

**After (com esta skill aplicada):**
```javascript
class User {
  constructor(name) {
    this.name = name
  }

  greet() {
    console.log(`Oi, ${this.name}`)
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Funcao que opera sobre dados da instancia | Metodo da classe |
| Funcao utilitaria sem dependencia de `this` | `static` method ou funcao separada |
| Precisa acessar `this.propriedade` no metodo | Garanta que a propriedade foi definida no constructor |
| Metodo chama outro metodo da mesma classe | Use `this.outroMetodo()` |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `function metodo() {}` dentro da classe | `metodo() {}` |
| Metodo definido dentro do constructor | Metodo no corpo da classe, mesmo nivel do constructor |
| `const self = this` dentro de metodo | Use arrow function ou bind se precisar preservar contexto |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `SyntaxError: Unexpected identifier` | Usando `function` dentro do corpo da classe | Remova a palavra-chave `function`: use `metodo() {}` |
| `this.propriedade` retorna `undefined` | Propriedade nao definida no constructor | Adicione `this.propriedade = valor` no constructor |
| Metodo nao aparece na instancia | Metodo definido dentro do constructor como variavel local | Mova o metodo para o corpo da classe, no mesmo nivel do constructor |
| `this` aponta para contexto errado | Metodo extraido do objeto e chamado separadamente | Use `.bind(this)` ou mantenha a chamada como `instancia.metodo()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações