---
name: rs-full-stack-0207-requisicao-de-sign-in
description: "Enforces authentication request patterns when implementing sign-in flows with Axios in React/frontend applications. Use when user asks to 'implement login', 'create sign-in request', 'authenticate user', 'handle login errors', or 'call auth API'. Applies patterns: typed Axios error handling with AxiosError, response.data extraction, POST to sessions endpoint, forwarding validated form data to API. Make sure to use this skill whenever building authentication request logic or handling API error responses. Not for backend session controllers, JWT token storage, or route protection."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [axios, authentication, sign-in, error-handling, rest-api]
---

# Requisição de SignIn

> Ao implementar requisições de autenticação, envie dados validados via POST, extraia response.data para o retorno, e trate erros da API com AxiosError tipado.

## Rules

1. **Envie dados já validados** — a requisição acontece DEPOIS da validação do formulário, porque a API não deve receber dados inválidos
2. **Use POST para /sessions** — autenticação é criação de sessão, recurso REST `/sessions` com método POST, porque segue convenção RESTful
3. **Extraia response.data** — o conteúdo útil da resposta Axios está sempre em `response.data`, porque Axios encapsula a resposta HTTP
4. **Trate erros com AxiosError** — importe `AxiosError` do Axios e use `instanceof` para verificar, porque permite acessar `error.response.data.message` com segurança
5. **Use optional chaining no erro** — `error.response?.data?.message`, porque a resposta pode não existir (erro de rede)
6. **Passe o objeto data direto** — o segundo argumento do `api.post()` é o body, passe o objeto validado diretamente, porque a API espera os mesmos campos (email, password)

## How to write

### Requisição de autenticação

```typescript
import { api } from "../service/api"
import { AxiosError } from "axios"

async function handleSignIn(data: SignInFormData) {
  try {
    const response = await api.post("/sessions", data)
    console.log(response.data) // { token, user: { id, name, email, role, created_at } }
  } catch (error) {
    if (error instanceof AxiosError) {
      alert(error.response?.data?.message)
    }
  }
}
```

### Estrutura da resposta

```typescript
// response.data retornado pela API:
{
  token: "jwt-token-string",
  user: {
    id: "uuid",
    name: "Rodrigo",
    email: "rodrigo@email.com",
    role: "employee",  // ou "manager"
    created_at: "2024-01-01T00:00:00.000Z"
    // senha NUNCA é retornada
  }
}
```

## Example

**Before (sem tratamento de erro da API):**
```typescript
async function handleSignIn(data) {
  try {
    const response = await api.post("/sessions", data)
  } catch (error) {
    alert("Erro ao fazer login")  // mensagem genérica, não usa o erro da API
  }
}
```

**After (com AxiosError tipado):**
```typescript
import { AxiosError } from "axios"

async function handleSignIn(data: SignInFormData) {
  try {
    const response = await api.post("/sessions", data)
    const { token, user } = response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      alert(error.response?.data?.message)  // "E-mail ou senha inválida"
    }
  }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Dados do formulário já validados | Envie direto para `api.post("/sessions", data)` |
| Erro retornado pela API | Use `instanceof AxiosError` e extraia `.response?.data?.message` |
| Precisa do token e user | Desestruture de `response.data` |
| Erro de rede (sem response) | Optional chaining garante que não quebra |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `alert("Erro genérico")` no catch | `alert(error.response?.data?.message)` |
| `catch (error: any)` | `if (error instanceof AxiosError)` |
| `response.user` (sem .data) | `response.data.user` |
| `api.post("/login", data)` | `api.post("/sessions", data)` (REST) |
| Enviar requisição sem validar antes | Validar com schema, depois enviar |

## Troubleshooting

### Problem: `error.response.data.message` throws "Cannot read properties of undefined"
- **Cause**: The error is a network error (no response from server), so `error.response` is undefined
- **Fix**: Use optional chaining: `error.response?.data?.message` and check `instanceof AxiosError` first

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre fluxo de autenticação, AxiosError e convenções REST
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações