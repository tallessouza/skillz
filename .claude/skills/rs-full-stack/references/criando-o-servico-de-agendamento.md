---
name: rs-full-stack-criando-servico-agendamento
description: "Applies POST request service pattern when creating API communication modules in JavaScript. Use when user asks to 'create a service', 'send data to API', 'make a POST request', 'create scheduling function', or 'build fetch wrapper'. Enforces: async/await with try-catch, object destructuring for parameters, proper headers, JSON.stringify body, user-friendly error alerts. Make sure to use this skill whenever creating service functions that send data to a REST API. Not for GET requests, server-side API routes, or database operations."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-api-integration
  tags: [javascript, fetch, post-request, async-await, services]
---

# Criando Servicos de Requisicao POST

> Servicos que enviam dados para uma API usam funcoes assincronas exportadas com parametros desestruturados, try-catch para erros, e feedback claro ao usuario.

## Rules

1. **Exporte a funcao como async** — `export async function nomeDaFuncao()`, porque permite usar `await` e facilita reuso em outros modulos
2. **Desestruture parametros como objeto** — `{ id, name, when }` em vez de argumentos posicionais, porque a ordem nao importa e ganha flexibilidade
3. **Sempre use try-catch** — envolva a requisicao inteira, porque erros de rede sao imprevisíveis e o usuario precisa de feedback
4. **Defina method e headers explicitamente** — `method: "POST"` e `Content-Type: application/json`, porque o fetch usa GET por padrao e a API precisa saber o formato
5. **Use JSON.stringify no body** — o fetch envia texto, mas com o header correto a API interpreta como JSON
6. **Importe a config da API de um modulo centralizado** — `apiConfig.baseUrl` dinamico, nunca hardcode URLs

## How to write

### Servico POST completo

```javascript
import { apiConfig } from "./api-config.js"

export async function scheduleNew({ id, name, when }) {
  try {
    await fetch(`${apiConfig.baseUrl}/schedules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name, when }),
    })

    alert("Agendamento realizado com sucesso!")
  } catch (error) {
    console.log(error)
    alert("Nao foi possivel agendar. Tente novamente mais tarde.")
  }
}
```

### Estrutura do parametro como objeto

```javascript
// Quem chama nao precisa se preocupar com ordem
scheduleNew({ when: "2024-01-15", name: "João", id: "123" })
scheduleNew({ id: "123", name: "João", when: "2024-01-15" })
// Ambas funcionam identicamente
```

## Example

**Before (problemas comuns):**

```javascript
async function schedule(id, name, when) {
  const res = await fetch("http://localhost:3000/schedules", {
    method: "POST",
    body: JSON.stringify({ id, name, when }),
  })
}
```

**After (com este skill aplicado):**

```javascript
import { apiConfig } from "./api-config.js"

export async function scheduleNew({ id, name, when }) {
  try {
    await fetch(`${apiConfig.baseUrl}/schedules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name, when }),
    })

    alert("Agendamento realizado com sucesso!")
  } catch (error) {
    console.log(error)
    alert("Nao foi possivel agendar. Tente novamente mais tarde.")
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Enviando dados para API | POST com Content-Type JSON e body stringify |
| Funcao usada em varios lugares | `export async function` |
| Multiplos parametros relacionados | Desestruture de um objeto |
| Requisicao pode falhar | try-catch com alert para usuario |
| URL da API | Use config centralizada com template literal |
| Extensao de import local | Sempre inclua `.js` no import |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `fetch("http://localhost:3000/...")` | `fetch(\`${apiConfig.baseUrl}/...\`)` |
| `function schedule(id, name, when)` | `function scheduleNew({ id, name, when })` |
| POST sem Content-Type header | `headers: { "Content-Type": "application/json" }` |
| `body: { id, name }` (objeto direto) | `body: JSON.stringify({ id, name })` |
| fetch sem try-catch | Sempre envolva em try-catch |
| Erro silencioso no catch | `console.log(error)` + `alert()` para o usuario |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `Failed to fetch` ou erro de rede | API nao esta rodando ou URL incorreta | Verifique se o servidor esta ativo e `apiConfig.baseUrl` esta correto |
| API recebe body vazio | Falta `Content-Type: application/json` no header | Adicione `headers: { "Content-Type": "application/json" }` |
| Dados chegam como string na API | Body nao foi serializado | Use `JSON.stringify()` no body do fetch |
| CORS bloqueando a requisicao | Frontend e API em dominios/portas diferentes | Configure CORS no servidor da API |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre async/await, desestruturacao e flexibilidade de objetos
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes