---
name: rs-full-stack-0203-overview-de-sign-up
description: "Enforces sign-up form submission patterns when building user registration flows with React, Zod validation, and Axios API calls. Use when user asks to 'create a signup form', 'implement user registration', 'handle form submission', 'validate form with Zod', or 'handle API errors in forms'. Applies preventDefault, loading state, Zod schema validation, Axios POST, and tiered error handling (Zod → Axios → generic). Make sure to use this skill whenever building authentication forms or form submission handlers with validation. Not for login/session management, backend user creation, or OAuth flows."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [signup, forms, zod, axios, validation, react, error-handling]
---

# Overview de Sign Up — Fluxo Completo de Cadastro

> Implemente formulários de cadastro com validação Zod antes da requisição, tratamento de erros em camadas (Zod → Axios → genérico), e feedback claro ao usuário em cada etapa.

## Rules

1. **Sempre use `preventDefault`** — chame `e.preventDefault()` no início do handler, porque o comportamento padrão do form recarrega a página e perde os dados
2. **Ative loading antes de qualquer operação assíncrona** — `setIsLoading(true)` antes de validar/requisitar, porque bloqueia o botão e previne submissões duplas
3. **Valide com Zod ANTES da requisição** — parse os dados com o schema antes de chamar a API, porque erros de validação não devem gerar tráfego de rede
4. **Envie os dados validados diretamente** — passe o objeto retornado pelo Zod parse como body, porque já contém todos os campos validados
5. **Trate erros em camadas com early return** — Zod primeiro, depois Axios, depois genérico, porque cada camada tem mensagens diferentes para o usuário
6. **Confirme sucesso e redirecione** — exiba confirmação e navegue para a página anterior só após sucesso completo

## Steps

### Step 1: Capturar o evento do formulário

```typescript
async function handleSubmit(e: FormEvent) {
  e.preventDefault()
  setIsLoading(true)
```

### Step 2: Validar com Zod

```typescript
  try {
    const data = signUpSchema.parse({ name, email, password, passwordConfirm })
```

### Step 3: Enviar para a API

```typescript
    await api.post("/users", data)
```

### Step 4: Tratar erros em camadas

```typescript
  } catch (error) {
    console.error(error)

    if (error instanceof ZodError) {
      return alert(error.issues[0].message)
    }

    if (axios.isAxiosError(error)) {
      return alert(error.response?.data?.message)
    }

    return alert("Não foi possível cadastrar.")
  }
```

### Step 5: Confirmar sucesso e redirecionar

```typescript
  if (window.confirm("Cadastro realizado com sucesso!")) {
    navigate(-1)
  }

  setIsLoading(false)
}
```

## Error Handling

| Camada | Condição | Ação |
|--------|----------|------|
| Validação (Zod) | `error instanceof ZodError` | Exibir `error.issues[0].message` e retornar |
| API (Axios) | `axios.isAxiosError(error)` | Exibir `error.response?.data?.message` e retornar |
| Genérico | Nenhuma das anteriores | Exibir mensagem genérica e retornar |

## Example

**Before (sem tratamento adequado):**
```typescript
async function handleSubmit() {
  const res = await api.post("/users", { name, email, password })
  alert("Cadastrado!")
}
```

**After (com esta skill aplicada):**
```typescript
async function handleSubmit(e: FormEvent) {
  e.preventDefault()
  setIsLoading(true)

  try {
    const data = signUpSchema.parse({ name, email, password, passwordConfirm })
    await api.post("/users", data)
  } catch (error) {
    console.error(error)

    if (error instanceof ZodError) {
      return alert(error.issues[0].message)
    }

    if (axios.isAxiosError(error)) {
      return alert(error.response?.data?.message)
    }

    return alert("Não foi possível cadastrar.")
  } finally {
    setIsLoading(false)
  }

  if (window.confirm("Cadastro realizado com sucesso!")) {
    navigate(-1)
  }
}
```

## Anti-patterns

| Nunca faça | Faça assim |
|------------|-----------|
| Submeter form sem `preventDefault` | `e.preventDefault()` como primeira linha |
| Chamar API sem validar dados | `schema.parse(data)` antes do `api.post` |
| Tratar todos os erros igual | Verificar `instanceof ZodError`, depois `isAxiosError`, depois genérico |
| Enviar campos separados quando Zod já validou | Passar o objeto retornado pelo `parse` diretamente |
| Esquecer de desativar loading no erro | Usar `finally` ou `setIsLoading(false)` em todos os caminhos |

## Troubleshooting

### Problem: Form page reloads when clicking submit, losing all input data
- **Cause**: Missing `e.preventDefault()` at the beginning of the submit handler
- **Fix**: Add `e.preventDefault()` as the first line inside the handler function to prevent the default form submission behavior

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre cada camada de erro, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações