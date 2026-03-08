---
name: rs-full-stack-0402-cadastra-nova-solicitacao
description: "Enforces authenticated API request patterns when sending data with JWT tokens via Axios. Use when user asks to 'send data to API', 'make authenticated request', 'add authorization header', 'configure Bearer token', or 'handle 401 errors'. Applies Axios default headers, Bearer token injection on login, and error handling with AxiosError. Make sure to use this skill whenever building authenticated POST requests or configuring API clients with tokens. Not for OAuth flows, refresh token rotation, or server-side authentication middleware."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [axios, jwt, bearer-token, authentication, api-client, error-handling]
---

# Requisições Autenticadas com Token JWT

> Toda requisição autenticada configura o token no cabeçalho padrão do Axios no momento do login, garantindo que todas as chamadas subsequentes carreguem a autorização automaticamente.

## Rules

1. **Configure o token como header padrão no login** — `api.defaults.headers.common["Authorization"]`, porque isso evita passar o token manualmente em cada requisição
2. **Use o prefixo Bearer** — `Bearer ${token}`, porque APIs REST seguem o padrão RFC 6750 para tokens JWT
3. **Trate erros do mais específico ao mais genérico** — primeiro `AxiosError`, depois `Error` genérico, porque erros de API têm `response.data.message` com informações úteis
4. **Restaure o token ao carregar dados do usuário** — no load do contexto de autenticação, reconfigure o header, porque o `defaults` do Axios não persiste entre reloads
5. **Aguarde a requisição antes de navegar** — `await api.post(...)` antes de `navigate()`, porque navegação prematura pode perder a resposta ou erro

## Steps

### Step 1: Importar API e AxiosError

```typescript
import { api } from "../services/api"
import { AxiosError } from "axios"
```

### Step 2: Configurar token no login (auth context)

```typescript
async function signIn({ email, password }: SignInInput) {
  const { data } = await api.post("/sessions", { email, password })

  api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`

  localStorage.setItem("@app:token", data.token)
  localStorage.setItem("@app:user", JSON.stringify(data.user))
}
```

### Step 3: Restaurar token ao carregar usuário

```typescript
function loadUserFromStorage() {
  const token = localStorage.getItem("@app:token")
  const user = localStorage.getItem("@app:user")

  if (token && user) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    // set user state...
  }
}
```

### Step 4: Fazer requisição autenticada com tratamento de erro

```typescript
async function handleSubmit(formData: FormData) {
  try {
    await api.post("/refunds", {
      ...formData,
      filename: "placeholder.png",
    })

    navigate("/")
  } catch (error) {
    if (error instanceof AxiosError) {
      alert(error.response?.data.message)
    } else if (error instanceof Error) {
      alert(error.message)
    }
  }
}
```

## Example

**Before (sem token — erro 401):**
```typescript
// Requisição sem Authorization header
await api.post("/refunds", { name, category, amount })
// ❌ Retorna: "Invalid JWT token" — status 401
```

**After (com token configurado no login):**
```typescript
// No auth context (executado uma vez no login):
api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`

// Agora TODAS as requisições carregam o token:
await api.post("/refunds", { name, category, amount, filename })
// ✅ Requisição autorizada — servidor identifica o usuário pelo token
```

## Error handling

| Erro | Causa | Solução |
|------|-------|---------|
| `Invalid JWT token` | Token ausente no header | Configurar `api.defaults.headers.common["Authorization"]` |
| `JWT token not found` | Header Authorization vazio | Verificar se login salvou o token antes da requisição |
| `Unauthorized (401)` | Token expirado ou inválido | Redirecionar para login, limpar storage |
| `AxiosError` genérico | Erro de rede ou servidor | Exibir `error.response?.data.message` |

## Heuristics

| Situação | Ação |
|----------|------|
| Usuário fez login | Configurar token no `api.defaults` imediatamente |
| App recarregou (F5) | Restaurar token do localStorage para `api.defaults` |
| Requisição retornou 401 | Verificar se token está no header antes de debugar a API |
| Múltiplas requisições autenticadas | Usar `api.defaults` — não passar token em cada chamada |

## Anti-patterns

| Nunca faça | Faça assim |
|------------|------------|
| `api.post("/refunds", data, { headers: { Authorization: token } })` em cada chamada | `api.defaults.headers.common["Authorization"] = Bearer ${token}` uma vez |
| `navigate()` antes do `await api.post()` | `await api.post()` primeiro, depois `navigate()` |
| `catch (error) { alert(error) }` genérico | `if (error instanceof AxiosError)` primeiro, depois `Error` |
| Guardar token só no localStorage sem configurar Axios | Configurar `api.defaults` E salvar no localStorage |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `Invalid JWT token` em todas as requisições | Token não configurado no Axios defaults | Adicionar `api.defaults.headers.common["Authorization"] = Bearer ${token}` no login |
| Token perdido após reload (F5) | `api.defaults` não persiste entre reloads | Restaurar token do localStorage para `api.defaults` no `loadUser` |
| `AxiosError: Network Error` | Servidor não está rodando ou CORS bloqueando | Verificar se o servidor está ativo e CORS configurado |
| Navegação ocorre antes da resposta | `await` não usado antes de `api.post()` | Adicionar `await` antes da chamada da API |
| Mensagem de erro não aparece para o usuário | Catch genérico sem tratamento de AxiosError | Verificar `error instanceof AxiosError` e acessar `error.response?.data.message` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre fluxo de autenticação, middleware de verificação e Bearer tokens
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações