---
name: rs-full-stack-parametros-nomeados
description: "Applies query string parameter conventions when building Node.js APIs or HTTP requests. Use when user asks to 'add filters', 'implement pagination', 'create query parameters', 'parse URL params', or 'build API endpoints with search'. Enforces correct naming, security rules, and URL structure for query strings. Make sure to use this skill whenever designing API routes that accept optional filters or pagination. Not for route params, request body design, or authentication flows."
---

# Parâmetros Nomeados (Query Strings)

> Parâmetros nomeados transmitem filtros opcionais via URL — nunca dados sensíveis, nunca dados obrigatórios.

## Rules

1. **Separe parâmetros nomeados com `?` e `&`** — `?` inicia a query string, `&` separa cada parâmetro seguinte, porque esse é o padrão HTTP que servidores e clientes interpretam automaticamente
2. **Use parâmetros nomeados apenas para dados opcionais** — filtros, paginação, ordenação, porque dados obrigatórios pertencem ao path (`/products/:id`)
3. **Nunca passe dados sensíveis em query strings** — senhas, tokens, cartões ficam expostos na URL, em logs de servidor e no histórico do navegador
4. **Nomeie cada parâmetro explicitamente** — `?category=computer&price=5000` não `?c=computer&p=5000`, porque o nome documenta a intenção

## How to write

### Query string na URL

```
GET /products?category=computer&price=5000
```

### Lendo query params no Node.js

```javascript
// Extrair parâmetros nomeados da requisição
const { category, price } = request.query

// Usar como filtros opcionais
const filters = {}
if (category) filters.category = category
if (price) filters.maxPrice = Number(price)
```

### Paginação com query params

```javascript
// GET /products?page=2&limit=20
const page = Number(request.query.page) || 1
const limit = Number(request.query.limit) || 10
const offset = (page - 1) * limit
```

## Example

**Before (dados sensíveis na query string):**
```
GET /login?email=user@mail.com&password=123456
```

**After (dados sensíveis no body):**
```
POST /login
Body: { "email": "user@mail.com", "password": "123456" }

GET /products?category=computer&price=5000  ← filtros opcionais OK
```

## Heuristics

| Situação | Faça |
|----------|------|
| Filtro opcional (categoria, preço, cor) | Query param: `?category=x` |
| Identificador obrigatório (ID do recurso) | Route param: `/products/:id` |
| Dados sensíveis (senha, token, cartão) | Request body via POST |
| Paginação | Query params: `?page=1&limit=20` |
| Ordenação | Query param: `?sort=price&order=asc` |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `?p=123` (abreviação) | `?price=123` |
| `?password=abc` na URL | Envie no body via POST |
| `?userId=15` para recurso obrigatório | `/users/15` como route param |
| Query params sem nome (posicionais) | Sempre `nome=valor` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre quando usar cada tipo de parâmetro
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com Insomnia, fetch e Node.js

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-0215-parametros-nomeados-mkv-mp-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-0215-parametros-nomeados-mkv-mp-4/references/code-examples.md)
