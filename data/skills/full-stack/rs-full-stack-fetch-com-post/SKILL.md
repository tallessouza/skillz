---
name: rs-full-stack-fetch-com-post
description: "Applies correct fetch POST request patterns when writing JavaScript/TypeScript API calls. Use when user asks to 'send data to API', 'create a resource', 'submit a form', 'POST request', 'fetch with POST', or 'cadastrar via API'. Enforces method, headers, JSON.stringify body, and await sequencing. Make sure to use this skill whenever generating code that sends data to an API endpoint. Not for GET requests, file uploads, or WebSocket communication."
---

# Fetch com POST

> Ao enviar dados para uma API com fetch, configure method, headers com Content-Type, e serialize o body com JSON.stringify.

## Rules

1. **Defina method: "POST" explicitamente** — fetch usa GET por padrao, entao POST deve ser declarado, porque omitir causa envio sem body que a API ignora silenciosamente
2. **Declare Content-Type no headers** — use `"Content-Type": "application/json"` porque a API precisa saber o formato dos dados para interpretar corretamente (poderia ser XML, form-data, etc.)
3. **Serialize o body com JSON.stringify** — nunca passe um objeto literal diretamente no body, porque fetch espera uma string, nao um objeto JavaScript
4. **Use await no fetch POST antes de operacoes dependentes** — sem await, codigo subsequente executa antes da API processar o cadastro, causando dados desatualizados
5. **Use preventDefault em formularios** — sem isso o navegador recarrega a pagina ao submeter, perdendo o controle do fluxo JavaScript
6. **Gere IDs no cliente apenas como fallback** — use `new Date().getTime().toString()` quando a API nao gera IDs automaticamente

## How to write

### Fetch POST completo

```javascript
const response = await fetch("http://localhost:3333/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    id: new Date().getTime().toString(),
    name: productName.value,
    price: productPrice.value,
  }),
});
```

### Form submit com preventDefault

```javascript
const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: nameInput.value }),
  });

  await loadProducts(); // so executa apos POST completar
});
```

## Example

**Before (erros comuns):**
```javascript
form.addEventListener("submit", (event) => {
  fetch("/api/products", {
    body: { name: "Mouse", price: 100 }, // objeto direto — API nao recebe
  });
  loadProducts(); // executa antes do POST completar
});
```

**After (com esta skill aplicada):**
```javascript
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Mouse", price: 100 }),
  });

  await loadProducts();
});
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Enviando dados para API | method: "POST" + headers + JSON.stringify |
| Formulario HTML com submit | addEventListener("submit") + preventDefault |
| Precisa recarregar lista apos cadastro | await no POST, depois await na funcao de listagem |
| API nao gera ID | `new Date().getTime().toString()` como ID temporario |
| Nao precisa da resposta do POST | Pode omitir captura do response, mas mantenha await |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `body: { key: value }` | `body: JSON.stringify({ key: value })` |
| `fetch(url, { body: ... })` sem method | `fetch(url, { method: "POST", body: ... })` |
| `fetch(url, { method: "POST" })` sem headers | Adicione `headers: { "Content-Type": "application/json" }` |
| `form.addEventListener("submit", (e) => { fetch(...) })` | Adicione `e.preventDefault()` e `async` na callback |
| `fetch(...); loadProducts()` sem await | `await fetch(...); await loadProducts()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre serializacao, Content-Type, JSON vs XML, e sequenciamento async
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula expandidos com variacoes