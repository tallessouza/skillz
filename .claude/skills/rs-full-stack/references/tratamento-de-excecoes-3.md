---
name: rs-full-stack-tratamento-de-excecoes
description: "Enforces strategic try-catch exception handling patterns when writing JavaScript/TypeScript code. Use when user asks to 'handle errors', 'add try-catch', 'connect to database', 'fetch data', 'read files', or any code involving external dependencies. Applies rules: try-catch only for external dependencies, user-friendly error messages, never wrap entire codebase. Make sure to use this skill whenever generating code that depends on external resources (APIs, databases, filesystem, network). Not for validation logic, type checking, or lint rules."
---

# Tratamento de Exceções

> Use try-catch estrategicamente em operações que dependem de recursos externos, nunca como substituto para validação ou como wrapper genérico.

## Rules

1. **Try-catch apenas para dependências externas** — conexão com banco de dados, requisições HTTP, leitura de arquivos, porque são operações que podem falhar por fatores fora do controle do código
2. **Nunca envolva o projeto inteiro em try-catch** — cada bloco try deve cobrir uma operação específica, porque try-catch genérico esconde a origem real do erro
3. **Exiba mensagens amigáveis no catch** — `"Não foi possível realizar a operação"` não `stack trace cru`, porque o usuário não entende erros técnicos
4. **Pergunte: "isso depende de algo externo?"** — se a resposta for sim, use try-catch; se depende apenas do próprio código, trate com validação normal
5. **Capture o erro para diagnóstico** — sempre logue o erro original internamente mesmo exibindo mensagem amigável, porque debugging sem logs é impossível
6. **Mantenha a aplicação funcionando** — o catch deve permitir que o fluxo continue ou degrade graciosamente, porque erro não tratado trava a aplicação

## How to write

### Operação com recurso externo

```javascript
try {
  const data = await fetch("https://api.example.com/users")
  const users = await data.json()
  return users
} catch (error) {
  console.error("Falha ao buscar usuários:", error)
  showMessage("Não foi possível carregar os usuários. Tente novamente mais tarde.")
}
```

### Leitura de arquivo

```javascript
try {
  const content = await fs.readFile("config.json", "utf-8")
  const config = JSON.parse(content)
  return config
} catch (error) {
  console.error("Erro ao ler configuração:", error)
  return defaultConfig
}
```

### Conexão com banco de dados

```javascript
try {
  const connection = await database.connect()
  const results = await connection.query("SELECT * FROM users")
  return results
} catch (error) {
  console.error("Falha na conexão com banco de dados:", error)
  throw new Error("Serviço temporariamente indisponível")
}
```

## Example

**Before (erro não tratado — aplicação trava):**
```javascript
const response = await fetch("/api/products")
const products = await response.json()
renderProducts(products)
```

**After (com tratamento de exceção):**
```javascript
try {
  const response = await fetch("/api/products")
  const products = await response.json()
  renderProducts(products)
} catch (error) {
  console.error("Erro ao carregar produtos:", error)
  renderErrorMessage("Não foi possível carregar os produtos. Tente novamente mais tarde.")
}
```

## Heuristics

| Situação | Ação |
|----------|------|
| Fetch/HTTP request | Sempre usar try-catch |
| Leitura/escrita de arquivo | Sempre usar try-catch |
| Conexão com banco de dados | Sempre usar try-catch |
| Cálculo com input do usuário | Try-catch se parsing pode falhar (JSON.parse, parseInt de valor inesperado) |
| Operação puramente interna | Validação normal, sem try-catch |
| Múltiplas operações externas | Try-catch separado para cada uma, para identificar qual falhou |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `try { /* app inteira */ } catch (e) {}` | Try-catch específico por operação externa |
| `catch (error) { }` (catch vazio) | `catch (error) { console.error("Contexto:", error) }` |
| `catch (e) { throw e }` (re-throw sem valor) | `catch (e) { throw new Error("Operação X falhou: " + e.message) }` |
| `catch (e) { alert(e.stack) }` | `catch (e) { showMessage("Mensagem amigável") }` |
| Try-catch em `2 + 2` | Sem try-catch — operação determinística |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-tratamento-de-excecoes-3/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-tratamento-de-excecoes-3/references/code-examples.md)
