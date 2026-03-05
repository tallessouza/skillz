---
name: rs-full-stack-0217-separando-parametros
description: "Enforces query parameter parsing patterns when building Node.js HTTP servers from scratch. Use when user asks to 'parse query string', 'extract query params', 'handle URL parameters', 'build HTTP router', or 'parse request URL'. Applies manual query string splitting with slice, split, and reduce to build param objects. Make sure to use this skill whenever implementing raw Node.js HTTP request handling without frameworks. Not for Express/Fastify/Hono route params, nor for path parameters or route pattern matching."
---

# Separando Parâmetros de Query String

> Extraia query params da URL manualmente usando slice, split e reduce para construir um objeto chave-valor acessível via `request.query`.

## Rules

1. **Crie uma função utilitária dedicada** — `extractQueryParams` em arquivo separado (`src/utils/extract-query-params.js`), porque separação de responsabilidades facilita testes e reuso
2. **Remova o `?` com slice(1)** — `query.slice(1)` pula o caractere de interrogação, porque slice(0) manteria o `?` grudado no primeiro parâmetro
3. **Separe parâmetros pelo `&`** — `.split('&')` transforma a string em array onde cada item é `chave=valor`
4. **Use reduce para montar o objeto** — reduce com acumulador `{}` é o padrão para transformar array em objeto, porque forEach + mutação é menos expressivo
5. **Separe chave e valor pelo `=`** — `.split('=')` com destructuring `[key, value]` extrai ambos em uma linha
6. **Trate ausência de query** — verifique se a query existe antes de chamar a função, retornando `{}` como fallback, porque rotas com query params são opcionais
7. **Injete no objeto request** — adicione `request.query` no middleware/route handler para acesso uniforme em todas as rotas

## How to write

### Função extractQueryParams

```javascript
// src/utils/extract-query-params.js
export function extractQueryParams(query) {
  return query.slice(1) // remove o '?'
    .split('&')          // separa por '&' → ['categoria=computador', 'preco=500']
    .reduce((queryParams, param) => {
      const [key, value] = param.split('=') // separa por '='
      queryParams[key] = value
      return queryParams
    }, {})
}
```

### Injeção no request (middleware/route handler)

```javascript
import { extractQueryParams } from './utils/extract-query-params.js'

// No middleware ou route handler, antes de despachar para a rota:
request.query = query
  ? extractQueryParams(query)
  : {}
```

### Uso na rota

```javascript
// A rota acessa request.query diretamente
{ method: 'GET', path: '/product', handler: (request, response) => {
  // request.query já está populado: { categoria: 'computador', preco: '500' }
  return response.end(JSON.stringify(request.query))
}}
```

## Example

**Before (query string bruta):**
```javascript
// URL: /product?categoria=computador&preco=500
console.log(query) // '?categoria=computador&preco=500' — string inutilizável
```

**After (com extractQueryParams):**
```javascript
// URL: /product?categoria=computador&preco=500
console.log(request.query) // { categoria: 'computador', preco: '500' }
```

## Heuristics

| Situação | Faça |
|----------|------|
| Rota aceita filtros opcionais | Use query params, não path params |
| Query string pode não existir | Sempre use fallback `{}` |
| Valor precisa ser número | Converta após extração (`Number(value)`) |
| Parâmetro pode ter caracteres especiais | Use `decodeURIComponent(value)` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `query.split('?')[1].split('&')` | `query.slice(1).split('&')` |
| `const params = {}; arr.forEach(...)` | `arr.reduce((acc, item) => ..., {})` |
| `if (url.includes('?')) { parse... }` | `request.query = query ? extractQueryParams(query) : {}` |
| Parsing inline no handler da rota | Função utilitária separada |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre slice vs split, reduce como padrão de transformação, e por que query params são opcionais
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e edge cases