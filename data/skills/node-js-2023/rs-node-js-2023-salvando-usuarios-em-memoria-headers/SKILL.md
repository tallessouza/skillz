---
name: rs-node-js-2023-salvando-usuarios-memoria-headers
description: "Applies stateful in-memory data patterns and HTTP headers when building Node.js HTTP servers from scratch. Use when user asks to 'create a node server', 'save data in memory', 'return JSON from server', 'set response headers', or 'build a REST API without framework'. Ensures correct JSON serialization with JSON.stringify, proper Content-Type headers, and understanding of stateful vs stateless trade-offs. Make sure to use this skill whenever writing raw Node.js HTTP server code without Express or Fastify. Not for Express/Fastify apps, database persistence, or frontend HTTP clients."
---

# Salvando Dados em Memoria e Headers HTTP (Node.js puro)

> Ao construir servidores HTTP em Node.js puro, serialize dados com JSON.stringify e informe o formato via Content-Type header antes de enviar a resposta.

## Rules

1. **Respostas HTTP so aceitam string ou Buffer** — `res.end(users)` com array causa erro `chunk argument must be of type string or instance of Buffer`, porque o protocolo HTTP transmite bytes, nao estruturas de dados JavaScript
2. **Sempre serialize com JSON.stringify** — `res.end(JSON.stringify(data))` converte arrays/objetos para string transportavel entre front e back
3. **Sempre defina Content-Type antes de res.end** — `res.setHeader('Content-Type', 'application/json')` permite que o cliente interprete a resposta corretamente, sem isso o front-end recebe texto puro sem saber o formato
4. **Dados em memoria sao perdidos no restart** — aplicacao stateful perde tudo ao reiniciar, use apenas para prototipagem ou desenvolvimento, nunca em producao sem persistencia externa
5. **Headers sao metadados, nao dados** — informam COMO interpretar o conteudo, nao SAO o conteudo; tanto requisicao (req.headers) quanto resposta (res.setHeader) carregam metadados

## How to write

### Armazenamento stateful em memoria

```javascript
// Declare o array FORA do handler — persiste enquanto o processo vive
const users = []

// Dentro da rota POST: adicione ao array
users.push({ id: 1, name: 'John Doe', email: 'johndoe@example.com' })
```

### Resposta JSON com header correto

```javascript
// Sempre nesta ordem: setHeader ANTES de end
res.setHeader('Content-Type', 'application/json')
res.end(JSON.stringify(users))
```

### Leitura de headers da requisicao

```javascript
// Acesse metadados enviados pelo cliente
const headers = req.headers
// headers['content-type'], headers['authorization'], etc.
```

## Example

**Before (erro comum — enviar array direto):**
```javascript
const users = []

// Rota GET
res.end(users) // TypeError: chunk argument must be of type string or Buffer
```

**After (com this skill applied):**
```javascript
const users = []

// Rota GET
res.setHeader('Content-Type', 'application/json')
res.end(JSON.stringify(users))
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Retornando objeto/array do servidor | `JSON.stringify()` + Content-Type `application/json` |
| Retornando texto simples | `res.end('texto')` + Content-Type `text/plain` |
| Dados precisam sobreviver ao restart | Use banco de dados ou arquivo, nao memoria |
| Precisa ler info do cliente (auth, formato) | `req.headers` |
| Precisa informar formato ao cliente | `res.setHeader('Content-Type', ...)` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `res.end(arrayOrObject)` | `res.end(JSON.stringify(arrayOrObject))` |
| `res.end(JSON.stringify(data))` sem header | `res.setHeader('Content-Type', 'application/json')` antes de `res.end()` |
| Dados de producao em array na memoria | Banco de dados externo (stateless) |
| Headers como parte do body | Headers via `res.setHeader()`, dados via `res.end()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
