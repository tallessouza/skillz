---
name: rs-full-stack-obtendo-parametros-nomeados
description: "Enforces correct query parameter extraction patterns in Node.js APIs without frameworks. Use when user asks to 'parse query strings', 'extract query parameters', 'handle URL parameters', 'build a router', or 'create API routes with filters'. Applies regex named groups to capture query strings, distinguishes route params from query params. Make sure to use this skill whenever building raw Node.js HTTP servers that need query parameter handling. Not for Express/Fastify/framework-based routing or frontend URL parsing."
---

# Obtendo Parâmetros Nomeados (Query Parameters)

> Parâmetros nomeados (query parameters) são capturados via regex com grupos nomeados, separados dos route params pela interrogação.

## Rules

1. **Distinga route params de query params** — `:id` é route param (não nomeado), `?page=3` é query param (nomeado), porque cada um exige um padrão regex diferente
2. **Capture query strings com grupo nomeado na regex** — use `(?<query>\\?(.*))?$` para capturar tudo após `?`, porque isso permite extrair a string completa para parsing posterior
3. **Escape a interrogação na regex** — use `\\?` para literal, porque `?` sem escape é quantificador regex (zero ou uma ocorrência)
4. **Use template literals para compor regex** — concatene a regex de route params com a de query params via template literal, porque mantém cada parte legível e independente
5. **Capture com `.*` após a interrogação** — `\\?(.*)` pega qualquer caractere após `?`, porque query strings podem conter qualquer combinação de chave=valor separados por `&`

## How to write

### Regex para capturar query parameters

```javascript
// Adicione grupo nomeado "query" à regex existente de route params
const routeRegex = buildRouteRegex(path)
// Compõe: regex de rota + captura opcional de query string
const fullRegex = new RegExp(`${routeRegex.source}(?<query>\\?(.*))?$`)
```

### Template literal para compor expressões

```javascript
// Cada parte da regex é independente e composível
const routePattern = path.replaceAll(/:([a-zA-Z]+)/g, '(?<$1>[a-z0-9\\-_]+)')
const fullPattern = new RegExp(`^${routePattern}(?<query>\\?(.*))?$`)
```

### Extraindo os grupos da match

```javascript
const match = url.match(fullPattern)
if (match) {
  const routeParams = match.groups  // { id: '123', query: '?page=3&category=computer' }
  const queryString = match.groups.query // '?page=3&category=computer'
}
```

## Example

**Before (sem captura de query params):**
```javascript
// Regex só captura route params
const regex = /^\/products\/(?<id>[a-z0-9\-_]+)$/
'/products/123?page=3'.match(regex) // null — falha porque ? não é esperado
```

**After (com captura de query params):**
```javascript
// Regex captura route params E query string
const regex = /^\/products\/(?<id>[a-z0-9\-_]+)(?<query>\?(.*))?$/
const match = '/products/123?page=3&category=computer'.match(regex)
// match.groups = { id: '123', query: '?page=3&category=computer' }
```

## Heuristics

| Situação | Faça |
|----------|------|
| URL tem `?` seguido de chave=valor | Capture com grupo nomeado `query` na regex |
| Query string é opcional na rota | Use `?` quantificador no grupo: `(...)?` |
| Precisa compor regex de rota + query | Use template literal com `${}` |
| `?` aparece na regex como literal | Escape com `\\?` |
| Query string capturada como string única | Parse separado em etapa posterior |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|-----------------|
| `?(.*)` (? como quantificador) | `\\?(.*)` (? escapado como literal) |
| Regex hardcoded sem grupos nomeados | `(?<query>\\?(.*))?$` com nome semântico |
| Ignorar query params na regex da rota | Sempre incluir captura opcional de query |
| Concatenar strings para montar regex | Template literals com `${}` para composição |
| Tratar route params e query params igual | Separar em grupos distintos na regex |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre regex, escape de caracteres e composição de expressões
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações