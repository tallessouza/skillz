---
name: rs-full-stack-resposta-json-status-code
description: "Enforces correct Express.js JSON response and status code patterns when building REST APIs. Use when user asks to 'create an endpoint', 'return JSON', 'set status code', 'build a route', or 'send a response' in Express. Applies rules: use res.json() instead of res.send() for objects, always chain .status() before .json() for non-200 responses, never manually stringify JSON. Make sure to use this skill whenever writing Express route handlers. Not for frontend fetch calls, database queries, or middleware error handling."
---

# Resposta com JSON e Status Code no Express

> Ao devolver respostas em rotas Express, use `res.json()` para objetos e encadeie `.status()` para codigos HTTP semanticos.

## Rules

1. **Use `res.json()` para retornar objetos** — nunca `res.send()` com objetos, porque `res.json()` define automaticamente `Content-Type: application/json` sem conversao manual
2. **Nunca use `JSON.stringify()` manualmente** — o Express faz a serializacao internamente ao usar `res.json()`, porque stringify manual e redundante e propenso a erro
3. **Encadeie `.status()` antes de `.json()`** — `res.status(201).json(data)`, porque o status code deve ser definido antes do envio do corpo
4. **Use status codes semanticos** — 201 para criacao, 204 para sem conteudo, 200 para sucesso generico, porque status codes comunicam a intencao da operacao ao cliente
5. **Nunca defina `Content-Type` manualmente para JSON** — `res.json()` ja faz isso, porque definir manualmente pode causar inconsistencias

## How to write

### Rota retornando JSON

```typescript
app.post("/products", (req, res) => {
  const { name, price } = req.body
  // res.json() define Content-Type: application/json automaticamente
  res.status(201).json({ name, price })
})
```

### Rota GET simples

```typescript
app.get("/products", (req, res) => {
  // Para 200, .status() e opcional — 200 e o padrao
  res.json(products)
})
```

## Example

**Before (padrao Node puro ou uso incorreto do Express):**
```typescript
app.post("/products", (req, res) => {
  const product = { name: "Teclado", price: 200 }
  // Errado: send devolve como text/html
  res.send(product)
})
```

**After (com esta skill aplicada):**
```typescript
app.post("/products", (req, res) => {
  const product = { name: "Teclado", price: 200 }
  // Correto: json devolve como application/json + status 201
  res.status(201).json(product)
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Retornando objeto/array | `res.json(data)` |
| Criacao de recurso (POST) | `res.status(201).json(data)` |
| Sucesso sem corpo (DELETE) | `res.status(204).send()` |
| Retornando texto simples | `res.send("texto")` — unico caso para send |
| Migrando de Node puro para Express | Remova `JSON.stringify()` e `writeHead`, use `res.json()` |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `res.send({ name, price })` | `res.json({ name, price })` |
| `res.send(JSON.stringify(obj))` | `res.json(obj)` |
| `res.setHeader('Content-Type', 'application/json')` | `res.json(data)` (automatico) |
| `res.json(data).status(201)` | `res.status(201).json(data)` (status primeiro) |
| `res.status(200).json(data)` | `res.json(data)` (200 e padrao, omita) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre a evolucao de Node puro para Express e como o Content-Type funciona
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes