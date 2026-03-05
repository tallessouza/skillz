---
name: rs-full-stack-url-da-requisicao
description: "Applies HTTP request URL routing patterns when building Node.js APIs with native http module. Use when user asks to 'create routes', 'handle requests', 'build an API', 'add endpoints', or 'route URLs' in Node.js without frameworks. Combines method + URL to route requests, returns proper status codes. Make sure to use this skill whenever creating raw Node.js HTTP servers with route handling. Not for Express, Fastify, or any framework-based routing."
---

# URL da Requisição e Roteamento Manual

> Combine método HTTP + URL para rotear requisições manualmente, devolvendo status codes apropriados para cada cenário.

## Rules

1. **Roteie por método + URL combinados** — o mesmo path pode ter comportamentos diferentes por método, porque `/products` em GET lista e em POST cria
2. **Separe Base URL do path** — `localhost:3333` é endereço do servidor, o que importa é o path (`/products`, `/products/7`), porque o path identifica a funcionalidade
3. **Use status codes semânticos** — GET bem-sucedido retorna 200 (padrão), POST que cria retorna 201, rota inexistente retorna 404, porque status codes comunicam o resultado ao cliente
4. **Sempre trate rota não encontrada** — adicione um fallback 404 no final da cadeia de ifs, porque requisições a rotas indefinidas precisam de resposta clara
5. **Mantenha paths no plural** — `/products` não `/product`, porque representa a coleção de recursos

## How to write

### Roteamento básico por método + URL

```javascript
const server = http.createServer((request, response) => {
  const { method, url } = request

  if (method === 'GET' && url === '/products') {
    return response.end('Lista de produtos')
  }

  if (method === 'POST' && url === '/products') {
    response.writeHead(201)
    return response.end('Produto cadastrado')
  }

  response.writeHead(404)
  return response.end('Rota não encontrada')
})
```

### Extraindo método e URL

```javascript
const { method, url } = request
// method: 'GET', 'POST', 'PUT', 'DELETE', etc.
// url: '/products', '/products/7', '/', etc.
```

## Example

**Before (sem roteamento):**
```javascript
const server = http.createServer((request, response) => {
  response.end('Hello')
})
```

**After (com roteamento por método + URL):**
```javascript
const server = http.createServer((request, response) => {
  const { method, url } = request

  if (method === 'GET' && url === '/products') {
    return response.end('Lista de produtos')
  }

  if (method === 'POST' && url === '/products') {
    response.writeHead(201)
    return response.end('Produto cadastrado')
  }

  response.writeHead(404)
  return response.end('Rota não encontrada')
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Mesmo path, operações diferentes | Diferencie pelo método HTTP (GET vs POST vs PUT vs DELETE) |
| Resposta de criação (POST) | Use `writeHead(201)` antes do `end()` |
| Resposta de leitura (GET) com sucesso | Não precisa setar status — 200 é o padrão |
| Nenhuma rota bateu | Retorne 404 com mensagem descritiva |
| Path com ID (`/products/7`) | Extraia da URL — o `url` inclui o path completo |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `if (url === '/products')` sem checar método | `if (method === 'GET' && url === '/products')` |
| Sem fallback para rotas inexistentes | Sempre adicione `response.writeHead(404)` no final |
| `response.writeHead(200)` explícito em GET | Omita — 200 já é o padrão |
| `/product` (singular) | `/products` (plural, representa a coleção) |
| Cadeia de else-if gigante sem return | Use `return response.end()` para sair cedo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre Base URL vs path, analogias e conceito de roteamento manual
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-0207-url-da-requisicao-mkv-mp-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-0207-url-da-requisicao-mkv-mp-4/references/code-examples.md)
