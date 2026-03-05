---
name: rs-full-stack-assercao-de-tipos
description: "Applies TypeScript type assertion patterns when writing code that consumes APIs, handles unknown types, or converts object types. Use when user asks to 'fetch from API', 'consume endpoint', 'type this response', 'assert type', or 'convert object type'. Enforces correct 'as' syntax, requires type definitions before assertion, and guides when assertion is appropriate vs unsafe. Make sure to use this skill whenever handling API responses or unknown typed objects in TypeScript. Not for type guards, type narrowing, generics, or runtime validation."
---

# Asserção de Tipos (Type Assertion)

> Quando o TypeScript nao consegue inferir o tipo de um objeto, use type assertion para declarar explicitamente o tipo esperado.

## Rules

1. **Use `as` para assercao** — `{} as UserResponse` nao `<UserResponse>{}`, porque a sintaxe `as` funciona em todos os contextos incluindo JSX/TSX
2. **Defina o type antes de usar** — crie o `type` ou `interface` com todas as propriedades antes de fazer assertion, porque sem definicao o TypeScript nao pode oferecer autocomplete
3. **Use apenas quando TypeScript nao consegue inferir** — assertion e para casos onde voce SABE o tipo mas o TypeScript nao (ex: resposta de API), nao para forcar tipos incompativeis
4. **Nomeie types com letra maiuscula** — `UserResponse` nao `userResponse`, porque types seguem PascalCase por convencao no TypeScript
5. **Prefira generics quando disponivel** — `fetch<UserResponse>()` e mais seguro que assertion manual, porque o generic propaga o tipo desde a origem
6. **Nunca use assertion para silenciar erros** — se o TypeScript reclama de tipo incompativel, o problema e no codigo, nao no tipo

## How to write

### Assertion basica com objeto vazio

```typescript
type UserResponse = {
  id: number
  name: string
  avatar: string
}

let userResponse = {} as UserResponse
// Agora userResponse.id, userResponse.name, userResponse.avatar estao disponiveis
```

### Assertion em resposta de API

```typescript
type UserResponse = {
  id: number
  name: string
  avatar: string
}

async function fetchUser(userId: string): Promise<UserResponse> {
  const response = await fetch(`/api/users/${userId}`)
  const data = await response.json() as UserResponse
  return data
}
```

## Example

**Before (sem assertion — sem autocomplete, sem seguranca):**
```typescript
let userResponse = {}
// userResponse. → nenhuma sugestao aparece
// TypeScript nao sabe o que tem dentro
```

**After (com assertion — autocomplete funciona):**
```typescript
type UserResponse = {
  id: number
  name: string
  avatar: string
}

let userResponse = {} as UserResponse
// userResponse. → avatar, id, name aparecem como opcoes
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Resposta de API (fetch, axios) | `as TipoEsperado` no resultado do `.json()` |
| Objeto vazio que sera preenchido depois | `{} as Tipo` |
| Biblioteca retorna `any` | Assertion para o tipo correto |
| Voce controla o tipo desde a origem | Use generics em vez de assertion |
| TypeScript reclama de tipo incompativel | Corrija o codigo, nao force com assertion |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `value as any` | `value as TipoEspecifico` |
| `<UserResponse>{}` em TSX | `{} as UserResponse` |
| Assertion sem definir o type antes | Defina `type X = {...}` primeiro |
| `as unknown as OutroTipo` (double assertion) | Corrija a arquitetura de tipos |
| Assertion para mutar tipo existente | Type guard com `if`/`in` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes