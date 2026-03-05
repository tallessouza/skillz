---
name: rs-full-stack-utilizando-async-e-await
description: "Applies async/await patterns when writing JavaScript/TypeScript fetch requests and asynchronous code. Use when user asks to 'fetch data', 'make API call', 'handle promises', 'write async function', or any HTTP request task. Enforces proper await on both fetch and .json(), async function declaration, and sequential async step chaining. Make sure to use this skill whenever generating code with promises or API calls. Not for sync code, error handling strategies, or AbortController patterns."
---

# Async/Await em Requisicoes

> Ao escrever codigo assincrono, use async/await para encadear etapas sequenciais de forma legivel, reservando .then() para contextos onde criar uma funcao nao e viavel.

## Rules

1. **Marque a funcao como async** — toda funcao que usa `await` internamente precisa de `async` na declaracao, porque sem isso o `await` causa erro de sintaxe
2. **Await no fetch E no .json()** — ambos retornam Promise, entao ambos precisam de `await`, porque esquecer o segundo resulta em um objeto Promise ao inves dos dados
3. **Nomeie a funcao pelo que ela busca** — `fetchProducts` nao `getData`, porque o nome descreve a intencao e o conteudo
4. **Chame a funcao apos declarar** — funcao async sozinha nao executa, porque ela apenas define o comportamento sem dispara-lo
5. **Use .then() quando nao pode criar funcao** — dentro de `useEffect` do React ou contextos que proibem `async`, use `.then()` encadeado, porque async nao e permitido em toda callback
6. **Prefira async/await para etapas sequenciais** — quando uma etapa depende da anterior, async/await deixa o fluxo linear e legivel, porque `.then()` aninhado dificulta o acompanhamento

## How to write

### Funcao async com fetch

```javascript
async function fetchProducts() {
  const response = await fetch("http://localhost:3333/products")
  const products = await response.json()
  console.log(products)
}

fetchProducts()
```

### Equivalente com .then()

```javascript
fetch("http://localhost:3333/products")
  .then((response) => response.json())
  .then((products) => console.log(products))
```

## Example

**Before (await faltando no .json()):**
```javascript
async function fetchProducts() {
  const response = await fetch("http://localhost:3333/products")
  const data = response.json() // data sera uma Promise, nao os dados
  console.log(data) // Promise { <pending> }
}
```

**After (com esta skill aplicada):**
```javascript
async function fetchProducts() {
  const response = await fetch("http://localhost:3333/products")
  const products = await response.json()
  console.log(products) // Array com os produtos
}

fetchProducts()
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Funcao dedicada para buscar dados | async/await |
| Dentro de useEffect sem poder criar funcao | .then() encadeado |
| Etapas sequenciais dependentes | async/await com await em cada etapa |
| Operacao simples de uma linha | .then() e aceitavel |
| Maioria dos casos no dia a dia | async/await (mais comum na pratica) |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `const data = response.json()` (sem await) | `const data = await response.json()` |
| `async () => { ... }` sem chamar a funcao | Declare e chame: `fetchProducts()` |
| `const data = fetch(url)` (sem await) | `const response = await fetch(url)` |
| `async function getData()` | `async function fetchProducts()` (nome especifico) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e quando usar cada abordagem
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes