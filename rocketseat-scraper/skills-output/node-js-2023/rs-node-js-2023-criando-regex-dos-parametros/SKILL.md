---
name: rs-node-js-2023-regex-route-params
description: "Applies dynamic route parameter extraction using RegEx when building Node.js HTTP servers from scratch. Use when user asks to 'parse route parameters', 'build a router', 'extract params from URL', 'create route matching', or 'implement dynamic routes in Node'. Generates RegEx-based path matching with named capture groups for route params like :id. Make sure to use this skill whenever implementing raw Node.js routing without frameworks. Not for Express/Fastify/Nest route handling or general regex tutorials."
---

# Criando RegEx dos Parâmetros de Rota

> Ao implementar roteamento manual em Node.js, use RegEx com grupos de captura para extrair parâmetros dinâmicos identificados por `:nomeDoPametro` no path.

## Rules

1. **Parâmetros dinâmicos usam prefixo `:`** — `:id`, `:userId`, `:groupId`, porque essa é a convenção universal em Node.js e outros frameworks
2. **RegEx deve ser global** — use flag `g` para capturar múltiplos parâmetros na mesma rota, porque sem `g` o match para no primeiro resultado
3. **Use grupos de captura `()` para extrair o nome** — `/:([a-zA-Z]+)/g` captura o nome sem os dois pontos, porque precisa-se do nome limpo para mapear valores
4. **Converta iterators com `Array.from()`** — `String.matchAll()` retorna um iterator, não um array, porque não é possível inspecionar ou iterar normalmente sem conversão
5. **Separe utilidades em `src/utils/`** — funções como `buildRoutePath` ficam isoladas, porque mantém o código do servidor limpo e testável

## How to write

### RegEx para route params

```javascript
// Captura tudo que começa com : seguido de letras
// Flag g = global, encontra todos os matches
const routeParametersRegex = /:([a-zA-Z]+)/g
```

### Função buildRoutePath

```javascript
// src/utils/build-route-path.js
export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g

  // matchAll retorna iterator — converter para array
  const parameters = Array.from(path.matchAll(routeParametersRegex))

  // parameters[n][0] = match completo (:id)
  // parameters[n][1] = grupo de captura (id)

  return { path, parameters }
}
```

### Uso nas rotas

```javascript
import { buildRoutePath } from './utils/build-route-path.js'

const routes = [
  { method: 'GET', path: buildRoutePath('/users') },
  { method: 'DELETE', path: buildRoutePath('/users/:id') },
  { method: 'PUT', path: buildRoutePath('/users/:id/groups/:groupId') },
]
```

## Example

**Before (path estático, sem parâmetros dinâmicos):**
```javascript
// Não consegue interpretar :id como parâmetro
{ method: 'DELETE', path: '/users/:id' }
// Usuário teria que acessar literalmente /users/:id
```

**After (com buildRoutePath e RegEx):**
```javascript
const result = buildRoutePath('/users/:id/groups/:groupId')
// Array.from(path.matchAll(regex)) retorna:
// [
//   [':id', 'id', index: 7, ...],
//   [':groupId', 'groupId', index: 18, ...]
// ]
// Agora sabemos: rota tem 2 params dinâmicos (id e groupId)
```

## Heuristics

| Situação | Faça |
|----------|------|
| Rota sem parâmetros (`/users`) | matchAll retorna array vazio — rota é estática |
| Rota com 1 param (`/users/:id`) | Extraia nome do grupo de captura (index 1) |
| Rota com N params (`/users/:id/groups/:groupId`) | Flag `g` garante que todos são capturados |
| Precisa inspecionar resultado de matchAll | Sempre `Array.from()` antes de log ou iteração |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `/:([a-zA-Z]+)/` (sem flag g) | `/:([a-zA-Z]+)/g` — global para múltiplos params |
| `console.log(path.matchAll(regex))` | `console.log(Array.from(path.matchAll(regex)))` |
| `/:(.+)/g` (greedy demais) | `/:([a-zA-Z]+)/g` — apenas letras, sem caracteres especiais |
| RegEx sem grupo de captura `:/[a-zA-Z]+/g` | `/:([a-zA-Z]+)/g` — parênteses extraem o nome limpo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
