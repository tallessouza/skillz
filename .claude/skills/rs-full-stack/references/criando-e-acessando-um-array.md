---
name: rs-full-stack-criando-acessando-array
description: "Enforces correct array creation and access patterns in JavaScript. Use when user asks to 'create an array', 'access array elements', 'get last item of array', or 'iterate over a list'. Applies rules: bracket notation over constructor, zero-based indexing awareness, dynamic last element access with length-1. Make sure to use this skill whenever generating code that creates or accesses arrays. Not for array methods like map/filter/reduce or object property access."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-fundamentals
  tags: [javascript, array, indexing, data-structures]
---

# Criando e Acessando Arrays

> Crie arrays com colchetes e acesse elementos pelo indice, sempre lembrando que indices comecam em zero.

## Rules

1. **Use notacao de colchetes para criar arrays** — `const fruits = ["apple", "banana"]` nao `new Array("apple", "banana")`, porque colchetes sao mais legíveis e o padrao da comunidade
2. **Indices comecam em zero** — o primeiro elemento esta em `[0]`, nao `[1]`, porque arrays em JavaScript sao zero-indexed
3. **Nunca acesse o ultimo item com indice fixo** — use `array[array.length - 1]` nao `array[2]`, porque o tamanho do array pode mudar
4. **Trate acessos fora do range** — acessar um indice inexistente retorna `undefined`, nao um erro, porque JavaScript nao lanca excecao para indices invalidos

## How to write

### Criacao de array

```javascript
// Notacao de colchetes com itens iniciais
const fruits = ["apple", "banana", "orange"]
```

### Acesso por indice

```javascript
// Acesso direto pelo indice (zero-based)
const first = fruits[0]  // "apple"
const second = fruits[1] // "banana"
```

### Ultimo item dinamicamente

```javascript
// Sempre subtraia 1 do length, porque length conta a partir de 1 mas indices comecam em 0
const lastItem = fruits[fruits.length - 1]
```

## Example

**Before (indice fixo, fragil):**

```javascript
const fruits = ["apple", "banana", "orange"]
const last = fruits[2] // quebra se adicionar mais itens
```

**After (dinamico, resiliente):**

```javascript
const fruits = ["apple", "banana", "orange", "watermelon"]
const last = fruits[fruits.length - 1] // sempre retorna o ultimo
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa do ultimo elemento | `array[array.length - 1]` ou `array.at(-1)` |
| Precisa verificar se indice existe | Cheque `index < array.length` antes de acessar |
| Precisa do tamanho | `array.length` (conta itens, nao indice maximo) |
| Acessou e recebeu `undefined` | Verifique se o indice esta dentro do range `0` a `length - 1` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `new Array("a", "b")` | `["a", "b"]` |
| `fruits[2]` para pegar o ultimo | `fruits[fruits.length - 1]` |
| `fruits[fruits.length]` | `fruits[fruits.length - 1]` |
| Assumir que indice invalido lanca erro | Tratar `undefined` como retorno possivel |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Acesso retorna `undefined` sem erro | Indice fora do range do array | Verifique que o indice esta entre `0` e `array.length - 1` |
| `array[array.length]` retorna `undefined` | `length` conta itens (1-based) mas indices sao 0-based | Use `array[array.length - 1]` para o ultimo item |
| `new Array(3)` cria array com slots vazios | Construtor com numero cria array esparso | Use `[undefined, undefined, undefined]` ou `Array.from({ length: 3 })` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre zero-indexing e armadilhas de acesso
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes