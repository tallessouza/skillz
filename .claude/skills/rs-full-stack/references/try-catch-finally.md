---
name: rs-full-stack-try-catch-finally
description: "Enforces proper try/catch/finally error handling patterns when writing JavaScript/TypeScript code. Use when user asks to 'handle errors', 'add error handling', 'catch exceptions', 'throw errors', 'wrap in try catch', or any code that interacts with external resources like APIs, databases, or file systems. Applies structured exception handling with user-friendly messages, custom exceptions via throw, and finally for cleanup. Make sure to use this skill whenever generating code that can fail at runtime. Not for validation logic, type checking, or compile-time error prevention."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-excecoes
  tags: [javascript, try, catch, finally, throw, error-handling, cleanup]
---

# Try / Catch / Finally

> Toda operacao que pode falhar em runtime deve ser envolvida em try/catch, com mensagens amigaveis para o usuario e cleanup garantido no finally.

## Rules

1. **Envolva operacoes falíveis em try/catch** — acesso a banco, APIs, parsing de JSON, file I/O, porque erros nao tratados quebram a aplicacao inteira
2. **Exiba mensagens amigaveis no catch** — nunca exponha stack traces ou mensagens tecnicas ao usuario, porque isso confunde e assusta
3. **Use finally para cleanup** — fechar conexoes, liberar recursos, remover listeners, porque o finally executa independente de sucesso ou falha
4. **Lance excecoes customizadas com throw new Error()** — quando uma condicao de negocio invalida e detectada, porque permite tratamento especifico no catch
5. **Capture o erro com nome semantico** — `error` ou `err`, nunca nomes sem sentido, porque o parametro do catch e uma variavel temporaria que deve comunicar seu proposito
6. **Finally e opcional** — use apenas quando ha recursos para liberar, porque adicionar finally vazio e ruido

## How to write

### Try/catch basico

```javascript
try {
  const result = await fetchUserData(userId)
  displayUser(result)
} catch (error) {
  console.error(error)
  showMessage("Nao foi possivel carregar seus dados. Tente novamente mais tarde.")
}
```

### Com finally para cleanup de conexao

```javascript
let connection
try {
  connection = await openDatabaseConnection()
  await connection.insert(userData)
} catch (error) {
  console.error("Falha ao salvar:", error)
  showMessage("Erro ao salvar seus dados. Tente novamente.")
} finally {
  if (connection) connection.close()
}
```

### Lancando excecoes customizadas

```javascript
function processPayment(amount) {
  if (amount <= 0) {
    throw new Error("O valor do pagamento deve ser maior que zero")
  }
  // processa pagamento...
}

try {
  processPayment(0)
} catch (error) {
  console.error(error.message) // "O valor do pagamento deve ser maior que zero"
}
```

## Example

**Before (erro estourando sem tratamento):**

```javascript
const response = await fetch("/api/users")
const users = await response.json()
console.log(users)
```

**After (com tratamento completo):**

```javascript
try {
  const response = await fetch("/api/users")
  const users = await response.json()
  console.log(users)
} catch (error) {
  console.error("Erro ao buscar usuarios:", error)
  showMessage("Nao foi possivel carregar os usuarios. Tente novamente mais tarde.")
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Chamada a API externa | Sempre try/catch com mensagem amigavel |
| Conexao com banco de dados | try/catch/finally — finally fecha conexao |
| Validacao de input do usuario | throw new Error() com mensagem descritiva |
| Operacao sincrona simples e segura | Nao precisa de try/catch |
| Parse de JSON externo | try/catch porque JSON invalido lanca erro |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `catch (e) {}` (catch vazio) | `catch (error) { console.error(error) }` |
| `catch (batata)` | `catch (error)` — nome semantico |
| Expor `error.stack` ao usuario | Mensagem amigavel: "Tente novamente mais tarde" |
| `finally {}` vazio | Remova o finally se nao ha cleanup |
| `throw "algo deu errado"` (string) | `throw new Error("algo deu errado")` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Finally nao executa | Nunca acontece — finally SEMPRE executa | Verifique se o codigo esta realmente dentro do bloco finally |
| Catch vazio esconde erros silenciosamente | `catch (e) {}` sem tratamento | Sempre logue o erro: `catch (error) { console.error(error) }` |
| `throw "mensagem"` nao tem stack trace | Lancando string em vez de Error | Use `throw new Error("mensagem")` para ter stack trace |
| Conexao nao fecha apos erro | Cleanup fora do finally | Mova fechamento de conexao para o bloco `finally` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-try-catch-finally/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-try-catch-finally/references/code-examples.md)
