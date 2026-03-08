---
name: rs-full-stack-utilizando-o-fetch
description: "Applies fetch API patterns when writing JavaScript HTTP requests. Use when user asks to 'consume an API', 'fetch data', 'make HTTP request', 'call an endpoint', or 'get data from server'. Enforces promise chaining with .then(), proper response.json() conversion, and async data handling. Make sure to use this skill whenever generating code that calls external APIs with vanilla JavaScript. Not for Axios, React Query, SWR, or framework-specific data fetching."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-async
  tags: [javascript, fetch, http-request, promises, api]
---

# Utilizando o Fetch

> Ao consumir APIs com JavaScript, use fetch com encadeamento de promises para requisitar, converter e consumir dados.

## Rules

1. **Use fetch nativo** — nao importe bibliotecas externas quando fetch resolve, porque fetch e a API padrao do JavaScript e nao requer instalacao
2. **Sempre trate a promise** — fetch retorna uma Promise, nunca atribua diretamente a uma variavel esperando dados sincronos, porque a resposta nao chega no mesmo momento da requisicao
3. **Converta com response.json()** — o primeiro .then() retorna metadados da requisicao (status, headers), nao os dados em si. Chame response.json() para extrair o conteudo, porque o response e um objeto com informacoes da requisicao, nao os dados
4. **Encadeie dois .then()** — primeiro para converter (response.json()), segundo para consumir (data), porque response.json() tambem e assincrono e retorna outra Promise
5. **Nomeie callbacks com clareza** — use `response` no primeiro .then() e `data` no segundo, porque e o padrao de mercado e diferencia metadados de conteudo

## How to write

### Fetch basico com promise chain

```javascript
fetch("http://localhost:3333/products")
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
  })
```

### Estrutura da URL

```javascript
// protocolo://host:porta/endpoint
// http  = local development
// https = producao (seguro, com criptografia)
fetch("http://localhost:3333/products")
```

## Example

**Before (erro comum — tratar fetch como sincrono):**

```javascript
const response = fetch("http://localhost:3333/products")
console.log(response) // Promise { <pending> } — NAO sao os dados!
```

**After (com promise chain correto):**

```javascript
fetch("http://localhost:3333/products")
  .then((response) => response.json())
  .then((data) => {
    console.log(data) // Array com os produtos da API
  })
```

## Heuristics

| Situation | Do |
|-----------|-----|
| API local em desenvolvimento | Use `http://localhost:PORTA/endpoint` |
| API remota em producao | Use `https://dominio.com/endpoint` |
| Precisa apenas dos dados | Encadeie `.then(res => res.json()).then(data => ...)` |
| Precisa de info da requisicao (status code) | Inspecione o `response` no primeiro `.then()` antes de converter |
| Corpo do .then() tem uma unica expressao | Use arrow function sem chaves: `.then((response) => response.json())` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const data = fetch(url)` | `fetch(url).then(res => res.json()).then(data => ...)` |
| `fetch(url).then(res => console.log(res))` sem .json() | `fetch(url).then(res => res.json()).then(data => console.log(data))` |
| Um unico .then() tentando acessar dados diretamente | Dois .then() encadeados: converter depois consumir |

## Troubleshooting

| Problema | Causa | Solução |
|----------|-------|---------|
| `Promise { <pending> }` ao logar o resultado do fetch | Fetch retorna Promise, não dados síncronos | Use `.then()` ou `async/await` para acessar os dados |
| Primeiro `.then()` retorna objeto Response, não dados | `response` contém metadados HTTP, não o body | Chame `response.json()` no primeiro `.then()` e consuma dados no segundo |
| `TypeError: Failed to fetch` | Servidor não está rodando ou URL incorreta | Verifique se o servidor está ativo e a URL está correta |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre promises, response object e fluxo assincrono
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-utilizando-o-fetch/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-utilizando-o-fetch/references/code-examples.md)
