---
name: rs-full-stack-conhecendo-async-e-await
description: "Applies async/await patterns when writing asynchronous JavaScript/TypeScript code. Use when user asks to 'fetch data', 'call an API', 'handle promises', 'write async function', or any asynchronous operation. Enforces async keyword placement, await usage, and try/catch/finally error handling over .then() chains. Make sure to use this skill whenever generating code that deals with promises or asynchronous operations. Not for synchronous code, event listeners setup, or promise constructor implementation."
---

# Async e Await

> Utilize async/await como sintaxe padrao para lidar com promises, sempre com tratamento de erros via try/catch/finally.

## Rules

1. **Sempre declare `async` antes da funcao** — sem `async`, o `await` causa erro de sintaxe, porque o JavaScript precisa saber que aquela funcao lida com operacoes assincronas
2. **Use `await` antes de toda promise** — `const response = await minhaPromise()` em vez de atribuir a promise crua, porque sem `await` voce recebe um objeto Promise pendente, nao o valor resolvido
3. **Envolva operacoes async em try/catch/finally** — porque `await` lanca excecao quando a promise e rejeitada, e sem `catch` o erro propaga sem tratamento
4. **Use `finally` para limpeza independente do resultado** — loading states, fechar conexoes, logs de fim de execucao, porque `finally` executa tanto no sucesso quanto no erro
5. **Posicione `async` corretamente por tipo de funcao** — `async function nome()` para funcoes normais, `const nome = async () =>` para arrow functions, porque a posicao muda conforme a sintaxe

## How to write

### Funcao async padrao

```typescript
async function fetchUsers() {
  try {
    const users = await getUsers()
    console.log("Sucesso:", users)
  } catch (error) {
    console.error("Erro:", error)
  } finally {
    console.log("Fim da execucao")
  }
}
```

### Arrow function async

```typescript
const fetchUsers = async () => {
  try {
    const users = await getUsers()
    console.log("Sucesso:", users)
  } catch (error) {
    console.error("Erro:", error)
  } finally {
    console.log("Fim da execucao")
  }
}
```

## Example

**Before (promise crua sem await):**

```typescript
function fetchData() {
  const response = getUserData()
  console.log(response) // Promise { <pending> }
}
```

**After (com async/await e tratamento de erro):**

```typescript
async function fetchData() {
  try {
    const response = await getUserData()
    console.log("Sucesso:", response)
  } catch (error) {
    console.error("Erro:", error)
  } finally {
    console.log("Fim da execucao")
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Chamada a API ou banco de dados | `await` + try/catch/finally |
| Multiplas promises independentes | `await Promise.all([...])` |
| Funcao que retorna promise | Declare como `async` e use `await` internamente |
| Arrow function assincrona | `async` antes dos parenteses: `async () =>` |
| Precisa executar codigo apos sucesso ou erro | Use bloco `finally` |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `const res = minhaPromise()` (sem await) | `const res = await minhaPromise()` |
| `await` fora de funcao `async` | Declare a funcao como `async` primeiro |
| `await` sem try/catch | Envolva em try/catch/finally |
| `.then().catch()` dentro de funcao async | Use try/catch com await |
| `async` na arrow function no lugar errado | `const fn = async () =>` (antes dos parenteses) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre quando usar async/await vs .then(), como o JavaScript lida com promises internamente
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes e cenarios reais

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-conhecendo-async-e-await/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-conhecendo-async-e-await/references/code-examples.md)
