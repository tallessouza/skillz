---
name: rs-full-stack-obtendo-parametros-rotas
description: "Applies query parameter extraction patterns when building Node.js HTTP routes from scratch. Use when user asks to 'parse query params', 'extract route parameters', 'handle URL parameters', 'build HTTP server', or 'create route handler' in vanilla Node.js. Enforces proper query string parsing with slice, split, and reduce. Make sure to use this skill whenever writing raw Node.js HTTP parameter handling without frameworks. Not for Express.js req.query, path params with :id syntax, or framework-based routing."
---

# Obtendo Parâmetros das Rotas

> Extraia query parameters da URL manualmente usando slice, split e reduce para montar um objeto chave-valor limpo.

## Rules

1. **Separe a extração em um módulo utilitário** — crie `extract-query-params.js` em `utils/`, porque mantém o route handler limpo e a lógica reutilizável
2. **Use regex groups para capturar a query string** — `request.url.match(routePath)` retorna `groups` com os parâmetros capturados, porque regex named groups organizam a extração
3. **Remova a `?` com slice(1)** — a query string chega como `?status=open`, o `?` não faz parte dos dados
4. **Divida por `&` para múltiplos parâmetros** — `split('&')` separa `status=open&page=2` em array, porque query strings usam `&` como delimitador
5. **Use reduce para montar o objeto** — transforme o array de `key=value` em `{ key: value }` com reduce, porque é a forma funcional de acumular pares chave-valor
6. **Atribua params em `request.query`** — verifique se existe query string antes de parsear; se não existir, retorne objeto vazio `{}`

## How to write

### Função de extração de query params

```javascript
// utils/extract-query-params.js
export function extractQueryParams(query) {
  return query
    .slice(1)           // remove o '?' inicial
    .split('&')         // separa por '&'
    .reduce((params, param) => {
      const [key, value] = param.split('=')
      params[key] = value
      return params
    }, {})
}
```

### Uso no route handler

```javascript
import { extractQueryParams } from './utils/extract-query-params.js'

// Dentro do route handler, após o match da rota:
const routeParams = request.url.match(route.path)
const { query } = routeParams.groups

request.query = query
  ? extractQueryParams(query)
  : {}
```

### Acesso no controller

```javascript
// No controller da rota
const { status } = request.query
console.log(status) // valor do parâmetro extraído
```

## Example

**Before (query string bruta):**
```javascript
// request.url após match: groups.query = "?status=open&page=2"
// Sem tratamento, é apenas uma string ilegível
console.log(query) // "?status=open&page=2"
```

**After (com extração aplicada):**
```javascript
const params = extractQueryParams("?status=open&page=2")
console.log(params) // { status: "open", page: "2" }
```

## Heuristics

| Situação | Faça |
|----------|------|
| Query string presente na URL | Parse com `extractQueryParams` e atribua a `request.query` |
| Sem query string | Atribua `{}` a `request.query` |
| Regex da rota precisa capturar query | Use named group `(?<query>\\?.+)?` no path pattern |
| Múltiplos parâmetros | `split('&')` já lida com N parâmetros |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Parse manual inline no handler | Módulo separado em `utils/` |
| `query.replace('?', '')` | `query.slice(1)` — mais preciso |
| `for` loop para montar objeto | `reduce` — funcional e conciso |
| Acessar params sem verificar existência | Ternário: `query ? extract(query) : {}` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre regex groups, o pipeline slice→split→reduce e por que separar em módulo
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e walkthrough passo a passo

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-0413-obtendo-parametros-das-rotas-mkv-mp-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-0413-obtendo-parametros-das-rotas-mkv-mp-4/references/code-examples.md)
