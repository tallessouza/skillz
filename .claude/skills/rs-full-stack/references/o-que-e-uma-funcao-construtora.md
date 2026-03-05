---
name: rs-full-stack-funcao-construtora
description: "Enforces correct constructor function patterns when writing JavaScript/TypeScript code. Use when user asks to 'create a constructor', 'instantiate objects', 'use new keyword', 'create factory functions', or 'build object templates'. Applies rules: explicit object construction with return, this-based property assignment, proper use of new operator for instantiation. Make sure to use this skill whenever generating constructor functions or object factories. Not for ES6 class syntax, prototype chain manipulation, or design patterns like Singleton."
---

# Funções Construtoras em JavaScript

> Funções construtoras criam e retornam objetos com estrutura consistente — use `new` para instanciar copias independentes na memoria.

## Rules

1. **Nomeie construtoras com PascalCase ou verbo+substantivo** — `createProduct`, `Person`, porque distingue visualmente de funcoes comuns
2. **Cada instancia e um objeto independente** — `new` cria uma copia separada na memoria, `product1 === product2` sera `false` mesmo com mesma estrutura, porque sao referencias diferentes
3. **Use `this` para referenciar propriedades do proprio objeto** — dentro de metodos, `this.name` acessa a propriedade do contexto atual, porque o JavaScript resolve `this` para o objeto que contem o metodo
4. **Retorne o objeto explicitamente na abordagem classica** — crie o objeto vazio, defina propriedades, retorne-o, porque torna a construcao visivel e debugavel
5. **Na abordagem com `this` direto, nao retorne nada** — `this.prop = value` dentro da funcao + `new` ja cria o objeto implicitamente, porque o `new` cuida do retorno
6. **Prefira classes quando o JavaScript recomendar** — a abordagem `this.prop` dentro de funcao e valida mas o JS moderno recomenda `class`, porque classes sao sintaticamente mais claras

## How to write

### Abordagem classica (objeto explicito)

```javascript
function createProduct(name) {
  const product = {}
  product.name = name
  product.details = function () {
    console.log(`O nome do produto é ${this.name}`)
  }
  return product
}

const keyboard = new createProduct("Teclado")
const mouse = new createProduct("Mouse")
```

### Abordagem com this (objeto implicito)

```javascript
function Person(name) {
  this.name = name
  this.message = function () {
    console.log(`Olá, ${this.name}`)
  }
}

const person1 = new Person("Rodrigo")
const person2 = new Person("João")
```

## Example

**Before (repetindo objetos manualmente):**
```javascript
const product1 = { name: "Teclado", details() { console.log(this.name) } }
const product2 = { name: "Mouse", details() { console.log(this.name) } }
const product3 = { name: "Monitor", details() { console.log(this.name) } }
```

**After (com funcao construtora):**
```javascript
function createProduct(name) {
  const product = {}
  product.name = name
  product.details = function () {
    console.log(`O nome do produto é ${this.name}`)
  }
  return product
}

const product1 = new createProduct("Teclado")
const product2 = new createProduct("Mouse")
const product3 = new createProduct("Monitor")
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa criar multiplos objetos com mesma estrutura | Use funcao construtora |
| Objeto unico, sem reuso | Objeto literal `{}` basta |
| JavaScript sugere converter para class | Migre para `class` syntax |
| Precisa de metodos que acessam propriedades do objeto | Use `this.prop` dentro do metodo |
| Quer usar construtoras nativas | `new String()`, `new Date()` ja sao funcoes construtoras do JS |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Copiar/colar objetos com mesma estrutura | Funcao construtora + `new` |
| Esquecer `new` ao chamar construtora | Sempre usar `new` para instanciar |
| Retornar objeto na abordagem `this` | Nao retorne nada — `new` cuida disso |
| Esquecer `return` na abordagem classica | Sempre retorne o objeto criado |
| Usar `this` sem entender o contexto | `this` referencia o objeto onde o metodo esta |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre instancias, memoria, e this
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-o-que-e-uma-funcao-construtora/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-o-que-e-uma-funcao-construtora/references/code-examples.md)
