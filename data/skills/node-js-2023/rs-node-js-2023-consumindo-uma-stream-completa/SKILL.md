---
name: rs-node-js-2023-consumindo-stream-completa
description: "Applies the for-await pattern to consume complete streams before processing data in Node.js. Use when user asks to 'read request body', 'parse JSON from request', 'consume stream', 'buffer stream data', 'read HTTP body', or 'handle POST request body'. Ensures correct async iteration over readable streams using Buffer.concat. Make sure to use this skill whenever implementing HTTP request body parsing or stream consumption in Node.js. Not for partial stream processing, file streaming, or piping between streams."
---

# Consumindo uma Stream Completa

> Quando os dados precisam estar completos antes do processamento, use `for await` para iterar a stream e `Buffer.concat` para unificar os chunks.

## Rules

1. **Use `for await...of` para consumir streams** — `for await (const chunk of stream)` aguarda cada pedaco antes de continuar, porque garante que nenhum codigo abaixo executa antes da stream finalizar
2. **Acumule chunks em um array** — crie `const buffers = []` antes do loop e faca `buffers.push(chunk)`, porque cada chunk e um pedaco parcial que sozinho nao tem utilidade
3. **Una com `Buffer.concat().toString()`** — depois do loop, `Buffer.concat(buffers).toString()` reconstroi o conteudo completo, porque buffers sao binarios e precisam ser concatenados antes de virar string
4. **Marque a funcao como `async`** — `for await` exige que a funcao contenedora seja `async`, porque e regra do JavaScript — `await` so funciona dentro de `async`
5. **Use consumo completo para JSON** — JSON e impossivel de processar parcialmente (um chunk pode conter `{"name":"Di` que e inutilizavel), porque a estrutura so faz sentido quando completa
6. **Reserve consumo parcial para midia** — videos, musicas e textos grandes podem ser processados em chunks, porque cada pedaco ja tem utilidade independente

## How to write

### Consumo completo de request body

```typescript
// Padrao: acumular chunks e processar depois
async function handleRequest(req, res) {
  const buffers = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  const fullBody = Buffer.concat(buffers).toString()
  // Agora fullBody contem todos os dados — seguro para JSON.parse
}
```

### Parsing JSON do body

```typescript
async function parseJsonBody(req) {
  const buffers = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  const body = Buffer.concat(buffers).toString()
  return JSON.parse(body)
}
```

## Example

**Before (erro comum — processar sem aguardar stream completa):**

```typescript
server.on('request', (req, res) => {
  // ERRADO: tenta ler req sem consumir a stream
  const body = req.read() // null ou parcial
  const data = JSON.parse(body) // crash
  res.end(JSON.stringify(data))
})
```

**After (com for await):**

```typescript
server.on('request', async (req, res) => {
  const buffers = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  const body = Buffer.concat(buffers).toString()
  const data = JSON.parse(body)
  res.end(JSON.stringify(data))
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Recebendo JSON no body de request HTTP | Consumo completo com `for await` |
| Recebendo upload de video/audio | Consumo parcial (pipe para destino) |
| Recebendo texto grande (log, CSV) | Consumo parcial linha a linha |
| Recebendo dados que precisam de parsing completo (XML, JSON) | Consumo completo com `for await` |
| Body pequeno (< 1MB) em API REST | Consumo completo — padrao seguro |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `req.read()` sem aguardar | `for await (const chunk of req)` |
| `req.on('data', cb)` sem acumular | `buffers.push(chunk)` dentro do `for await` |
| `JSON.parse(chunk)` dentro do loop | `JSON.parse(Buffer.concat(buffers).toString())` depois do loop |
| `for await` sem `async` na funcao pai | Adicione `async` na funcao que contem o `for await` |
| `buffers.join('')` para unir | `Buffer.concat(buffers).toString()` — correto para binario |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
