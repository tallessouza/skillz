---
name: rs-full-stack-criando-um-objeto
description: "Enforces correct JavaScript object creation patterns including empty objects, nested properties, composed properties, and methods. Use when user asks to 'create an object', 'define properties', 'add methods to object', 'nested object', or any JS object literal task. Applies rules: two-colon assignment inside objects, snake_case for object keys, camelCase for variables, nested objects for composed data. Make sure to use this skill whenever generating JavaScript objects or refactoring object structures. Not for class-based OOP, prototypes, or destructuring."
---

# Criando Objetos em JavaScript

> Objetos sao colecoes de dados e funcionalidades, compostos por propriedades (chave: valor) e metodos (funcoes).

## Rules

1. **Use chaves `{}` para criar objetos** — `const obj = {}` cria um objeto vazio, porque chaves delimitam inicio e fim do objeto
2. **Use dois pontos para atribuicao dentro de objetos** — `email: "x@y.com"` nao `email = "x@y.com"`, porque dentro de objetos a sintaxe e chave: valor, nao chave = valor
3. **Propriedades nao precisam de aspas** — `email:` nao `"email":`, porque JS aceita identificadores sem aspas como chaves
4. **Use snake_case para propriedades de objetos** — `first_name` nao `firstName`, porque e convencao comum em objetos e melhora legibilidade de dados
5. **Use camelCase para variaveis** — `firstName` para variaveis, `first_name` para propriedades de objeto, porque sao convencoes distintas
6. **Aninhe objetos para propriedades compostas** — endereco, nome completo e outros dados compostos por multiplos valores devem ser objetos internos, porque preservam a estrutura semantica dos dados

## How to write

### Objeto vazio
```javascript
const user = {}
console.log(typeof user) // "object"
```

### Objeto com propriedades simples
```javascript
const user = {
  email: "rodrigo@email.com",
  age: 18
}
```

### Propriedades aninhadas (dados compostos)
```javascript
const user = {
  name: {
    first_name: "Rodrigo",
    surname: "Gonçalves"
  },
  address: {
    street: "Rua X",
    number: 23,
    city: "São Paulo",
    postal_code: "12345-123"
  }
}
```

### Metodos no objeto
```javascript
const user = {
  email: "rodrigo@email.com",
  message: () => {
    console.log("Oi Rodrigo")
  }
}
```

## Example

**Before (erros comuns):**
```javascript
const user = {
  firstName = "Rodrigo",   // ERRO: = ao inves de :
  "email": "r@email.com",  // desnecessario: aspas na chave
  age: 18,
  street: "Rua X",         // flat: endereco misturado
  city: "São Paulo"
}
```

**After (com esta skill aplicada):**
```javascript
const user = {
  first_name: "Rodrigo",
  email: "r@email.com",
  age: 18,
  address: {
    street: "Rua X",
    city: "São Paulo"
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Propriedade com multiplos sub-valores (endereco, nome) | Crie objeto aninhado |
| Propriedade com valor unico (email, age) | Valor direto |
| Nomeando propriedade composta | Use snake_case: `postal_code` |
| Nomeando variavel fora do objeto | Use camelCase: `postalCode` |
| Precisa de comportamento no objeto | Adicione metodo (funcao como valor) |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `email = "x@y.com"` (dentro de objeto) | `email: "x@y.com"` |
| `"email": "x@y.com"` | `email: "x@y.com"` |
| `street, city, state` (flat no objeto raiz) | `address: { street, city, state }` |
| `firstName` (propriedade de objeto) | `first_name` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre objetos, analogias e convencoes
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes