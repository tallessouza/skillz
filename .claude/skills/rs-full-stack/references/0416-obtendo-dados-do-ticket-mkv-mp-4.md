---
name: rs-full-stack-obtendo-dados-ticket
description: "Enforces correct request parameter extraction patterns in Node.js HTTP servers. Use when user asks to 'get route params', 'extract request body', 'parse URL parameters', 'handle PUT/POST data', or 'return status codes'. Applies destructuring for params and body, correct status codes (200, 201, 204). Make sure to use this skill whenever building Node.js HTTP route handlers that need to read input data. Not for Express.js middleware, query string parsing libraries, or frontend fetch calls."
---

# Obtendo Dados da Requisicao em Node.js

> Extraia parametros de rota e corpo da requisicao usando destructuring, e retorne status codes semanticamente corretos.

## Rules

1. **Desestruture params e body separadamente** — `const { id } = request.params` e `const { equipment } = request.body`, porque mantem claro a origem de cada dado
2. **Route params sao extraidos do path** — `/tickets/:id` gera `request.params.id` automaticamente, porque o router ja faz o parse do pattern matching
3. **Body params vem do corpo da requisicao** — dados enviados como JSON no body ficam em `request.body`, porque sao dados mutaveis enviados pelo cliente
4. **Use status code semantico** — 200 para sucesso generico, 201 para criado, 204 para sem conteudo, porque comunica a intencao da resposta ao cliente
5. **200 e o padrao** — se nao definir status code, a resposta ja retorna 200, entao so defina explicitamente quando for diferente
6. **Resposta vazia usa return com end()** — quando nao ha corpo na resposta, use `return response.writeHead(204).end()`, porque evita enviar dados desnecessarios

## How to write

### Extraindo route params

```javascript
// Desestruture direto de request.params
const { id } = request.params

// NAO faca parse manual da URL para extrair o id
```

### Extraindo body params

```javascript
// Desestruture os campos necessarios do body
const { equipment, description } = request.body
```

### Retornando resposta vazia com status code

```javascript
// 204 No Content — sem corpo na resposta
return response.writeHead(204).end()

// 200 OK — padrao, nao precisa definir explicitamente
return response.end('OK')
```

## Example

**Before (acesso manual, sem destructuring):**

```javascript
server.put('/tickets/:id', (request, response) => {
  const id = request.params.id
  const equipment = request.body.equipment
  const description = request.body.description

  // ... update logic

  response.writeHead(200)
  response.end()
})
```

**After (com destructuring e status code correto):**

```javascript
server.put('/tickets/:id', (request, response) => {
  const { id } = request.params
  const { equipment, description } = request.body

  // ... update logic

  return response.writeHead(204).end()
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Rota com `:param` no path | Extraia de `request.params` via destructuring |
| Dados enviados no body (POST/PUT) | Extraia de `request.body` via destructuring |
| Update sem retorno de dados | Status 204 No Content |
| Create com retorno de dados | Status 201 Created |
| Sucesso generico com dados | Status 200 OK (padrao) |
| Nao lembra o status code | 200 e o padrao seguro para sucesso |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const id = request.params.id` | `const { id } = request.params` |
| `const eq = request.body.equipment` | `const { equipment } = request.body` |
| `response.writeHead(200).end()` sem corpo | `response.writeHead(204).end()` |
| Parse manual da URL para extrair params | Use o router que ja popula `request.params` |
| `JSON.stringify(request.params)` em producao | Destructure e use os campos diretamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre route params vs query params vs body, e logica do status code
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-0416-obtendo-dados-do-ticket-mkv-mp-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-0416-obtendo-dados-do-ticket-mkv-mp-4/references/code-examples.md)
