---
name: rs-full-stack-conhecendo-funcoes-assincronas
description: "Enforces correct async/await patterns when writing JavaScript/TypeScript asynchronous code. Use when user asks to 'fetch data', 'call an API', 'query database', 'write async function', or any code involving promises. Applies rules: always await async calls when result is needed, handle both resolve and reject paths, use async/await over raw promises. Make sure to use this skill whenever generating code that calls external services, databases, or any non-immediate operation. Not for synchronous logic, pure calculations, or UI-only component styling."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-async
  tags: [async-await, promises, error-handling, try-catch, promise-all, fire-and-forget]
---

# Funções Assíncronas e Async/Await

> Toda funcao que depende de recurso externo (banco, API, filesystem) é assincrona — trate-a como promessa, nunca como valor imediato.

## Rules

1. **Sempre use `await` quando precisar do retorno** — sem `await`, o JavaScript segue para a proxima linha e voce recebe uma Promise pendente ao inves do valor, porque a execucao assincrona nao bloqueia por padrao
2. **Toda funcao `async` retorna uma Promise** — mesmo que voce retorne um valor direto, ele sera encapsulado em `Promise.resolve(valor)`, porque esse e o contrato do runtime
3. **Trate sempre os dois caminhos: resolve e reject** — use `try/catch` com `await` ou `.then/.catch` com promises, porque operacoes externas falham (banco indisponivel, rede instavel, timeout)
4. **Marque a funcao como `async` quando usar `await` dentro dela** — `await` so e valido dentro de funcoes `async`, porque e uma restricao sintatica do JavaScript
5. **Nao use `await` quando nao precisa do resultado** — fire-and-forget e valido para logs, analytics, side-effects nao criticos, porque esperar sem necessidade desperdiça tempo de execucao
6. **Prefira `async/await` sobre `.then()` encadeado** — codigo sequencial e mais legivel que callbacks aninhados, porque reduz complexidade cognitiva e facilita debug

## How to write

### Funcao assincrona basica

```typescript
// Funcao que busca dados externos — SEMPRE async + await
async function getProducts() {
  const products = await database.query("SELECT * FROM products")
  return products
}
```

### Tratando sucesso e erro

```typescript
async function getProducts() {
  try {
    const products = await database.query("SELECT * FROM products")
    return products
  } catch (error) {
    // Promise rejeitada — banco indisponivel, query invalida, etc.
    throw new Error(`Failed to fetch products: ${error.message}`)
  }
}
```

### Consumindo funcao assincrona

```typescript
// Com await — espera o resultado antes de continuar
async function displayProducts() {
  const products = await getProducts()
  renderList(products) // so executa DEPOIS de receber os produtos
}
```

## Example

**Before (sem await — bug silencioso):**

```typescript
async function loadUserData() {
  const user = fetchUser(userId) // esqueceu await!
  console.log(user.name) // ERROR: user e uma Promise, nao tem .name
}
```

**After (com await — correto):**

```typescript
async function loadUserData() {
  const user = await fetchUser(userId)
  console.log(user.name) // funciona: user agora e o valor resolvido
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Chamando funcao que acessa banco/API | Sempre `await` + `try/catch` |
| Resultado nao sera usado (fire-and-forget) | Chamar sem `await`, mas tratar erro com `.catch()` |
| Multiplas chamadas independentes | `Promise.all([a(), b()])` para paralelizar |
| Multiplas chamadas dependentes entre si | `await` sequencial, uma apos a outra |
| Funcao sincrona pura (calculo, formatacao) | Nao marcar como `async` — desnecessario |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const data = fetchFromDB()` (sem await) | `const data = await fetchFromDB()` |
| `async function add(a, b) { return a + b }` | `function add(a, b) { return a + b }` (nao precisa ser async) |
| `.then().then().then().catch()` encadeado | `async/await` com `try/catch` |
| `await` sem `try/catch` em operacao externa | `try { await op() } catch (e) { handle(e) }` |
| Ignorar Promise rejeitada | Sempre tratar com `catch` ou `try/catch` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Variavel contem `Promise { <pending> }` em vez do valor | `await` ausente na chamada | Adicionar `await` antes da funcao assincrona |
| Erro `TypeError: user.name is not a property` | Tentando acessar propriedade de uma Promise nao resolvida | Usar `await` para resolver a Promise primeiro |
| Erro silencioso sem mensagem | Promise rejeitada sem tratamento | Envolver em `try/catch` ou adicionar `.catch()` |
| Chamadas paralelas executando em sequencia | Usando `await` sequencial para operacoes independentes | Usar `Promise.all([a(), b()])` para paralelizar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre promises, analogias do instrutor e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes