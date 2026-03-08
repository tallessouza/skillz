---
name: rs-full-stack-criando-array-construtor
description: "Applies Array constructor patterns when writing JavaScript/TypeScript code that creates arrays. Use when user asks to 'create an array', 'initialize a list', 'preallocate array', 'fixed size array', or 'new Array'. Enforces correct usage of Array constructor vs literal syntax, length property, and preallocated arrays. Make sure to use this skill whenever generating code that initializes arrays with specific sizes. Not for array manipulation methods, iteration, or sorting."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-fundamentos
  tags: [javascript, array, constructor, data-structures, initialization]
---

# Criando Arrays com Construtor

> Use a sintaxe literal `[]` por padrao e reserve `new Array(n)` para pre-alocacao intencional de tamanho fixo.

## Rules

1. **Prefira literal para arrays com valores** — `[1, 2, 3]` nao `new Array(1, 2, 3)`, porque a sintaxe literal e mais clara e evita a armadilha de `new Array(3)` criar 3 posicoes vazias ao inves de `[3]`
2. **Use construtor para pre-alocacao** — `new Array(10)` quando precisa de N posicoes vazias reservadas, porque expressa intencao de tamanho fixo (ex: agendamentos, slots)
3. **Colchetes = array, chaves = objeto** — reconheca visualmente `[]` como array e `{}` como objeto, porque `typeof []` retorna `"object"` e pode confundir
4. **Use `.length` como propriedade, nao metodo** — `array.length` sem parenteses, porque e uma propriedade direta, nao uma funcao
5. **Arrays pre-alocados contem `empty`** — `new Array(10)` cria 10 posicoes `empty`, nao `undefined` ou `null`, porque sao slots nao-inicializados

## How to write

### Array vazio (construtor vs literal)

```javascript
// Construtor — funcional mas desnecessario para array vazio
const items = new Array()  // []

// Literal — preferido
const items = []  // []
```

### Array pre-alocado com tamanho fixo

```javascript
// 10 slots vazios para agendamento, grade horaria, etc.
const availableSlots = new Array(10)
// → [empty × 10]
console.log(availableSlots.length) // 10
```

### Verificar tamanho com .length

```javascript
// .length funciona igual em strings e arrays
const name = "Rodrigo"
console.log(name.length)  // 7

const emptyList = new Array()
console.log(emptyList.length)  // 0

const slots = new Array(10)
console.log(slots.length)  // 10
```

## Example

**Before (uso confuso do construtor):**

```javascript
const users = new Array("Ana", "Carlos")  // funciona mas desnecessario
const slots = new Array()  // vazio sem razao para usar construtor
const size = slots.length()  // ERRO: length nao e metodo
```

**After (com esta skill aplicada):**

```javascript
const users = ["Ana", "Carlos"]  // literal para valores conhecidos
const slots = new Array(10)  // construtor para pre-alocacao intencional
const size = slots.length  // propriedade, sem parenteses
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Criar array com valores conhecidos | Use literal `[]` |
| Reservar N posicoes vazias | Use `new Array(n)` |
| Verificar se array esta vazio | `array.length === 0` |
| `typeof` retorna `"object"` para array | Use `Array.isArray()` para verificar tipo |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| `new Array("a", "b", "c")` | `["a", "b", "c"]` |
| `new Array()` sem razao de pre-alocacao | `[]` |
| `array.length()` | `array.length` |
| `typeof myArray === "array"` | `Array.isArray(myArray)` |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `new Array(3)` retorna `[empty x 3]` ao inves de `[3]` | Argumento unico numerico cria array com N posicoes vazias | Use `[3]` para array com o valor 3, ou `new Array(3)` apenas para pre-alocacao |
| `array.length()` lanca TypeError | `length` e propriedade, nao metodo | Use `array.length` sem parenteses |
| `typeof []` retorna `"object"` | Arrays sao objetos em JavaScript | Use `Array.isArray(valor)` para verificar se e array |
| `new Array(3).map(x => 0)` nao preenche | Slots `empty` nao sao iterados por `map` | Use `new Array(3).fill(0)` ou `Array.from({ length: 3 }, () => 0)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes