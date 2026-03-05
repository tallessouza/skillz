---
name: rs-full-stack-acessando-um-objeto
description: "Enforces correct object property and method access patterns in JavaScript. Use when user asks to 'access object properties', 'read nested objects', 'call object methods', 'use dot notation', or 'use bracket notation'. Applies rules: dot notation as default, bracket notation for dynamic keys, chained dots for nested objects, parentheses for method calls. Make sure to use this skill whenever generating code that reads or navigates object properties. Not for object creation, destructuring, or spread operations."
---

# Acessando Propriedades e Métodos de Objetos

> Acesse propriedades com notação de ponto por padrão; use colchetes apenas quando necessário.

## Rules

1. **Notação de ponto como padrão** — `user.email` não `user["email"]`, porque é mais legível e o editor oferece autocomplete
2. **Notação de colchetes para chaves dinâmicas** — `user[variavel]` quando a chave vem de uma variável, porque ponto não aceita expressões
3. **Encadeie pontos para objetos aninhados** — `user.name.firstName` não acesse tudo de uma vez, porque cada ponto navega um nível
4. **Parênteses para executar métodos** — `user.message()` não `user.message`, porque sem parênteses você referencia a função, não a executa
5. **Separe propriedades por vírgula** — trailing comma na última propriedade é opcional mas recomendada, porque facilita adicionar novas propriedades

## How to write

### Acessar propriedade simples (notação de ponto)
```javascript
console.log(user.email)
```

### Acessar propriedade aninhada
```javascript
// Navegue nível por nível com ponto
console.log(user.name.firstName)
console.log(user.address.street.number)
```

### Executar método do objeto
```javascript
// Método = função dentro do objeto — precisa de ()
user.message()
```

### Notação de colchetes (quando necessário)
```javascript
// Chave dinâmica vinda de variável
const key = "email"
console.log(user[key])

// Objeto aninhado com colchetes
console.log(user["name"]["firstName"])
```

## Example

**Before (misturando notações sem necessidade):**
```javascript
const email = user["email"]
const nome = user["name"]["firstName"]
user["message"]()
```

**After (notação de ponto como padrão):**
```javascript
const email = user.email
const nome = user.name.firstName
user.message()
```

## Heuristics

| Situação | Faça |
|----------|------|
| Chave conhecida em tempo de escrita | Notação de ponto: `obj.prop` |
| Chave vem de variável ou parâmetro | Notação de colchetes: `obj[key]` |
| Chave contém caracteres especiais | Notação de colchetes: `obj["content-type"]` |
| Propriedade é uma função | Adicione `()` ao final: `obj.method()` |
| Objeto dentro de objeto | Encadeie pontos: `obj.nivel1.nivel2` |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|-----------------|
| `user["email"]` (chave fixa) | `user.email` |
| `user["name"]["firstName"]` (chaves fixas) | `user.name.firstName` |
| `user.message` (querendo executar) | `user.message()` |
| `console.log(user["message"]())` | `user.message()` (se já tem console.log interno) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre quando usar cada notação e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações