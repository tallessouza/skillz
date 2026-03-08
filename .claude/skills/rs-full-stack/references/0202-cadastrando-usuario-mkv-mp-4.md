---
name: rs-full-stack-cadastrando-usuario
description: "Enforces frontend-to-API integration patterns when making HTTP POST requests with Axios, handling async form submissions, implementing user registration flows, or managing API error responses. Use when user asks to 'connect frontend to API', 'submit form data', 'register user', 'handle API errors', or 'post data with Axios'. Applies Axios POST with baseURL, AxiosError instanceof checks, confirm-then-navigate pattern, and structured error feedback. Make sure to use this skill whenever integrating React forms with REST APIs. Not for backend route creation, database operations, or authentication token management."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [axios, react, form-submit, api-integration, error-handling, registration]
---

# Cadastrando Usuário — Integração Frontend com API

> Ao integrar formulários com a API, envie dados via Axios POST, trate erros com AxiosError instanceof, e navegue o usuário após sucesso.

## Rules

1. **Importe a instância configurada do Axios** — use a instância com `baseURL` já definida, nunca repita a URL base nas chamadas, porque o Axios concatena automaticamente
2. **Torne o handler assíncrono** — use `async/await` no submit handler, porque chamadas à API são assíncronas e precisam de controle de fluxo
3. **Envie o objeto de dados diretamente** — passe o objeto completo como segundo argumento do `api.post()`, porque desestruturar campo a campo é redundante quando o objeto já tem a forma correta
4. **Use `confirm()` para feedback antes de navegar** — peça confirmação ao usuário antes de redirecionar, porque evita navegação acidental e comunica sucesso
5. **Trate erros com `instanceof AxiosError`** — verifique o tipo antes de acessar `error.response?.data.message`, porque nem todo erro é de rede e o response pode ser undefined
6. **Separe erros de API de erros genéricos** — mostre `alert()` com mensagem da API para erros Axios, e `console.log(error)` para erros inesperados, porque o usuário precisa de feedback específico

## How to write

### POST request com Axios

```typescript
import { api } from "../service/api"

// Envie dados para a API usando a instância configurada
await api.post("/users", { name, email, password })
```

### Handler assíncrono com navegação

```typescript
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import { api } from "../service/api"

const navigate = useNavigate()

async function handleSubmit(data: FormData) {
  try {
    await api.post("/users", data)

    if (confirm("Cadastrado com sucesso! Ir para a tela de entrar?")) {
      navigate("/")
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      alert(error.response?.data.message)
    } else {
      console.log(error)
    }
  }
}
```

## Example

**Before (erros não tratados, URL hardcoded):**
```typescript
async function handleRegister(data) {
  const response = await fetch("http://localhost:3333/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  alert("Cadastrado!")
  window.location.href = "/"
}
```

**After (com esta skill aplicada):**
```typescript
async function handleRegister(data: CreateUserInput) {
  try {
    await api.post("/users", data)

    if (confirm("Cadastrado com sucesso! Ir para a tela de entrar?")) {
      navigate("/")
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      alert(error.response?.data.message)
    } else {
      console.log(error)
    }
  }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Instância Axios com baseURL configurada | Use apenas o path relativo: `api.post("/users", data)` |
| Objeto de formulário já tem a forma correta | Passe direto: `api.post("/users", data)` sem desestruturar |
| Sucesso com redirecionamento | Use `confirm()` + `navigate()` para dar controle ao usuário |
| Erro de API (status 4xx/5xx) | `instanceof AxiosError` → `error.response?.data.message` |
| Erro inesperado (rede, runtime) | `console.log(error)` como fallback |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `fetch("http://localhost:3333/users", ...)` | `api.post("/users", data)` |
| `api.post("/users", { name: data.name, email: data.email })` | `api.post("/users", data)` |
| `catch (error) { alert(error) }` | `catch (error) { if (error instanceof AxiosError) ... }` |
| `error.response.data.message` (sem optional chaining) | `error.response?.data.message` |
| `window.location.href = "/"` após POST | `navigate("/")` com useNavigate |

## Troubleshooting

### Problem: `error.response.data.message` throws "Cannot read properties of undefined"
- **Cause**: Accessing `response` directly without optional chaining — network errors may not have a `response` object
- **Fix**: Use optional chaining: `error.response?.data?.message` and check `error instanceof AxiosError` first

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre integração frontend-API, fluxo de erros Axios e padrão confirm-navigate
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e anotações