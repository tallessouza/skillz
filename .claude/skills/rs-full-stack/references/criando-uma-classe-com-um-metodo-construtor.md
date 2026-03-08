---
name: rs-full-stack-classe-metodo-construtor
description: "Enforces correct JavaScript class creation with constructor methods when writing OOP code. Use when user asks to 'create a class', 'define a constructor', 'instantiate an object', 'write OOP JavaScript', or any class-based code generation. Applies rules: PascalCase for class names, constructor for initialization logic, new keyword for instantiation, parameter passing via constructor. Make sure to use this skill whenever generating JavaScript/TypeScript classes. Not for functional programming patterns, factory functions, or prototype-based inheritance."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-oop
  tags: [javascript, classes, constructor, oop, pascalcase, instantiation]
---

# Criando Classes com Método Construtor

> Ao criar classes em JavaScript, use PascalCase para o nome, defina o constructor para inicializacao, e instancie com `new`.

## Rules

1. **Use PascalCase para nomes de classe** — `Person` nao `person` ou `my_class`, porque e a convencao de mercado que diferencia classes de variaveis e funcoes
2. **Defina o corpo com chaves** — `class Person { }` com abertura e fechamento explicitos, porque o corpo da classe contem todos os metodos e propriedades
3. **Use `constructor` para inicializacao** — o constructor executa automaticamente ao instanciar com `new`, porque e a funcao especial que recebe parametros iniciais
4. **Instancie com `new`** — `const person = new Person()`, porque sem `new` a classe nao e instanciada corretamente
5. **Passe parametros pelo constructor** — `new Person('Rodrigo')` para inicializar com dados, porque o constructor e o ponto de entrada de dados da instancia

## How to write

### Classe basica com constructor

```javascript
class Person {
  constructor(name) {
    this.name = name
  }
}

const person = new Person('Rodrigo')
```

### Constructor com multiplos parametros

```javascript
class Product {
  constructor(name, priceInCents) {
    this.name = name
    this.priceInCents = priceInCents
  }
}

const product = new Product('Notebook', 250000)
```

## Example

**Before (convencoes erradas):**
```javascript
class my_class {
  constructor(n) {
    console.log(n)
  }
}

var data = my_class('teste')
```

**After (com esta skill aplicada):**
```javascript
class Person {
  constructor(name) {
    this.name = name
    console.log('Ola', name)
  }
}

const person = new Person('Rodrigo')
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nomeando uma classe | PascalCase sempre: `MyClass`, `UserProfile` |
| Nomeando variavel/funcao | camelCase: `myVariable`, `getUserName` |
| Nomeando chave de config | snake_case: `max_retries`, `api_key` |
| Precisa executar logica na criacao | Coloque no `constructor` |
| Precisa criar instancia | Use `new ClassName()` |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `class myClass` | `class MyClass` |
| `class my_class` | `class MyClass` |
| `var x = MyClass()` | `const instance = new MyClass()` |
| `constructor(n, a)` | `constructor(name, age)` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `TypeError: MyClass is not a constructor` | Chamou sem `new` ou nao e uma classe | Use `new MyClass()` para instanciar |
| `constructor` nao executa | Erro de digitacao no nome do metodo | Verifique que e exatamente `constructor` (sem maiusculas) |
| Propriedade retorna `undefined` apos instanciar | Parametro nao atribuido via `this` | Adicione `this.name = name` dentro do constructor |
| Classe com nome minusculo nao da erro mas confunde | Convencao PascalCase nao seguida | Renomeie para PascalCase: `Person`, `Product` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre convencoes de nomenclatura e comportamento do constructor
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes