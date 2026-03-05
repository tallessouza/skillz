---
name: rs-full-stack-conhecendo-rest-params
description: "Applies JavaScript rest params pattern when writing functions that accept variable arguments. Use when user asks to 'create a function with multiple params', 'handle dynamic arguments', 'collect remaining parameters', or 'use spread/rest operator'. Ensures correct usage of ...rest syntax to collect indefinite arguments as arrays. Make sure to use this skill whenever generating functions with flexible parameter lists. Not for spread operator in array/object literals, destructuring assignments, or TypeScript overloads."
---

# Rest Params em JavaScript

> Utilize o operador rest (...) para receber um numero indefinido de argumentos como um array, mantendo flexibilidade nos parametros da funcao.

## Rules

1. **Rest params sempre no final** — `function(a, b, ...rest)` nunca `function(...rest, a)`, porque o rest coleta TUDO que sobra apos os parametros nomeados
2. **Nomeie pelo conteudo, nao use `rest` em producao** — `...prices`, `...userIds`, `...args` sao melhores que `...rest`, porque o nome deve descrever o que o array contem
3. **Rest e um array real** — diferente de `arguments`, o rest param e um Array nativo com acesso a `.map()`, `.filter()`, `.length`, porque e coletado como array pelo motor JS
4. **Nomeie parametros conhecidos, rest para o restante** — `function(title, ...options)` quando voce sabe que o primeiro param e titulo mas o resto e dinamico, porque melhora legibilidade
5. **Use spread (...) no console.log para exibir valores espalhados** — `console.log(...items)` mostra valores separados, `console.log(items)` mostra o array, porque spread desestrutura o array

## How to write

### Funcao com rest params basico

```javascript
// Coleta todos os argumentos como array
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0)
}

sum(1, 2, 3, 4) // 10
```

### Parametros nomeados + rest para o restante

```javascript
// Primeiro parametro nomeado, restante coletado no array
function createLog(level, ...messages) {
  console.log(`[${level}]`, ...messages)
}

createLog('ERROR', 'Failed to connect', 'timeout after 30s')
// [ERROR] Failed to connect timeout after 30s
```

### Acessando propriedades do array rest

```javascript
function showInfo(...values) {
  console.log(values.length)  // quantidade de parametros
  console.log(values)          // array completo
  console.log(...values)       // valores espalhados (spread)
}

showInfo(2, 1, 3, 4)
// 4
// [2, 1, 3, 4]
// 2 1 3 4
```

## Example

**Before (parametros fixos, inflexivel):**

```javascript
function values(a, b, c) {
  console.log(a, b, c)
}

values(2, 1, 3, 4) // 2 1 3 — perdeu o 4!
```

**After (com rest params, flexivel):**

```javascript
function values(...args) {
  console.log(...args)
  console.log(args.length)
}

values(2, 1, 3, 4) // 2 1 3 4 — todos capturados
                     // 4
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Quantidade de argumentos desconhecida | Use rest params `...items` |
| Primeiros params tem nome claro, resto e dinamico | `function(title, ...rest)` |
| Precisa iterar sobre todos os argumentos | Rest + `.forEach()` / `.map()` |
| Quer exibir valores sem colchetes de array | `console.log(...rest)` com spread |
| Funcao wrapper que repassa argumentos | `function wrapper(...args) { original(...args) }` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `function(a, b, c, d, e)` para params dinamicos | `function(...values)` |
| Usar `arguments` object | Usar rest params `...args` (array real) |
| `...rest` no inicio dos params | `...rest` sempre como ultimo parametro |
| `console.log(rest)` quando quer valores soltos | `console.log(...rest)` com spread |
| `function(...rest)` em producao | `function(...prices)` com nome descritivo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre rest vs spread vs arguments, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-conhecendo-rest-params/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-conhecendo-rest-params/references/code-examples.md)
