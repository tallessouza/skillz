---
name: rs-full-stack-conhecendo-promises-1
description: "Enforces correct Promise creation and consumption patterns in JavaScript/TypeScript. Use when user asks to 'create a promise', 'handle async', 'use then/catch', 'write async function', or any asynchronous code task. Applies rules: always return new Promise with resolve/reject, chain .then/.catch/.finally, never use raw promise result without awaiting or chaining. Make sure to use this skill whenever writing or reviewing asynchronous JavaScript code. Not for async/await syntax (separate skill), Node.js streams, or event emitters."
---

# Conhecendo Promises

> Toda Promise deve ser consumida com .then/.catch/.finally ou await — nunca use o retorno direto de uma funcao assincrona sem esperar sua resolucao.

## Rules

1. **Sempre retorne `new Promise`** — `return new Promise((resolve, reject) => { ... })`, porque a funcao precisa comunicar ao chamador que o resultado sera assincrono
2. **Use resolve para sucesso, reject para erro** — nunca inverta, porque .then captura resolve e .catch captura reject
3. **Sempre encadeie .catch** — toda cadeia .then precisa de .catch, porque erros nao capturados geram UnhandledPromiseRejection
4. **Use .finally para limpeza** — executa independente de sucesso ou erro, porque garante que recursos sejam liberados (loading states, connections)
5. **Nunca use o retorno direto** — `const res = minhaFuncao()` retorna Promise pendente, nao o valor, porque o JavaScript nao bloqueia execucao por padrao
6. **Nomeie o parametro do .then pelo conteudo** — `response`, `users`, `data` descritivo, nunca `x` ou `r`, porque facilita leitura da cadeia

## How to write

### Criando uma Promise

```typescript
function asyncOperation(): Promise<string> {
  return new Promise((resolve, reject) => {
    const success = true

    setTimeout(() => {
      if (success) {
        resolve("Operacao concluida com sucesso")
      } else {
        reject("Algo deu errado")
      }
    }, 3000)
  })
}
```

### Consumindo uma Promise

```typescript
asyncOperation()
  .then((response) => {
    console.log("Sucesso:", response)
  })
  .catch((error) => {
    console.log("Erro:", error)
  })
  .finally(() => {
    console.log("Fim da execucao")
  })
```

## Example

**Before (erro comum — usar retorno direto):**
```typescript
const result = asyncOperation()
console.log(result) // Promise { <pending> } — NAO e o valor!
```

**After (com consumo correto):**
```typescript
asyncOperation()
  .then((result) => {
    console.log(result) // "Operacao concluida com sucesso"
  })
  .catch((error) => {
    console.error(error)
  })
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Funcao faz I/O ou tem delay | Retorne new Promise |
| Precisa do valor da Promise | Use .then() ou await |
| Pode dar erro | Sempre encadeie .catch |
| Limpeza necessaria (loading, spinners) | Use .finally |
| console.log de Promise mostra "pending" | Voce esqueceu de esperar — use .then ou await |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const res = asyncFn()` sem .then | `asyncFn().then(res => ...)` |
| `.then(...)` sem `.catch(...)` | `.then(...).catch(...)` |
| `reject()` sem mensagem | `reject("descricao do erro")` |
| `new Promise` sem resolve nem reject | Sempre chame pelo menos um dos dois |
| `.then(x => console.log(x))` | `.then(response => console.log(response))` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre Promise lifecycle, estados e non-blocking
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-conhecendo-promises-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-conhecendo-promises-1/references/code-examples.md)
