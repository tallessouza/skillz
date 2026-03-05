---
name: rs-full-stack-array-elementos
description: "Enforces correct usage of mixed-type JavaScript arrays when writing or reviewing code. Use when user asks to 'create an array', 'store different types', 'mix data in array', or 'access array elements'. Applies rules: arrays accept any JS type (string, number, boolean, function, object), access functions with invocation syntax, access nested object properties via dot notation. Make sure to use this skill whenever generating arrays with heterogeneous data. Not for TypeScript tuple typing, array methods like map/filter, or array iteration patterns."
---

# Elementos que um Array Aceita em JavaScript

> Arrays em JavaScript aceitam qualquer tipo de dado como elemento — strings, numbers, booleans, functions e objects podem coexistir no mesmo array.

## Rules

1. **Arrays aceitam qualquer tipo** — string, number, boolean, function, object, null, undefined, porque JavaScript arrays sao estruturas heterogeneas por natureza
2. **Acesse funcoes no array com invocacao** — `myArray[3]()` nao `myArray[3]`, porque sem parenteses voce obtem a referencia da funcao, nao sua execucao
3. **Acesse propriedades de objetos no array com dot notation** — `myArray[4].name` nao `myArray[4][name]`, porque dot notation e o acesso padrao para propriedades conhecidas
4. **Lembre que indices comecam em 0** — o primeiro elemento e `[0]`, porque arrays JavaScript sao zero-indexed

## How to write

### Array com tipos mistos

```javascript
const myArray = [
  "um texto",
  42,
  true,
  function () { console.log("funcao dentro do array") },
  { name: "Rodrigo", email: "rodrigo@email.com" }
]
```

### Acessando cada tipo

```javascript
// String — indice 0
console.log(myArray[0]) // "um texto"

// Number — indice 1
console.log(myArray[1]) // 42

// Boolean — indice 2
console.log(myArray[2]) // true

// Function — indice 3 (com invocacao)
myArray[3]() // "funcao dentro do array"

// Object — indice 4 (propriedades via dot notation)
console.log(myArray[4].name)  // "Rodrigo"
console.log(myArray[4].email) // "rodrigo@email.com"
```

## Example

**Before (erro comum — funcao sem invocar):**
```javascript
const items = [10, function() { return "hello" }, { id: 1 }]

// Erro: retorna a referencia da funcao, nao o resultado
console.log(items[1])        // [Function]
```

**After (com esta skill aplicada):**
```javascript
const items = [10, function() { return "hello" }, { id: 1 }]

// Correto: invoca a funcao e acessa propriedade do objeto
console.log(items[1]())      // "hello"
console.log(items[2].id)     // 1
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa armazenar tipos diferentes juntos | Use um array com tipos mistos |
| Elemento e uma funcao | Acesse com `array[i]()` para executar |
| Elemento e um objeto | Acesse propriedades com `array[i].prop` |
| Array so tem um tipo de dado | Funciona igual, mas considere tipar em TS |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `myArray[3]` (querendo executar funcao) | `myArray[3]()` |
| `myArray[4][name]` (sem aspas) | `myArray[4].name` ou `myArray[4]["name"]` |
| Assumir que arrays so aceitam um tipo | Arrays aceitam qualquer tipo de dado JS |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações