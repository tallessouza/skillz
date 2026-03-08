---
name: rs-full-stack-0502-definindo-tipagem-de-refund
description: "Enforces TypeScript typing for API responses using DTOs, enums, and generics. Use when user asks to 'type an API response', 'create a DTO', 'define response types', 'add typings to fetch/axios calls', or 'create an enum for categories'. Applies patterns: separate DTO files, enum for finite sets, generic typing on API calls, composed types for paginated responses. Make sure to use this skill whenever consuming APIs in TypeScript without proper response typing. Not for backend route definitions, database schemas, or Zod validation."
---

# Definindo Tipagem de Retorno de API

> Toda requisição API deve ter seu retorno tipado em arquivos DTO separados, porque sem tipagem o código fica "no escuro" — sem autocomplete, sem segurança, sem clareza.

## Rules

1. **Crie arquivos `.d.ts` separados para DTOs** — um arquivo por entidade de resposta na pasta `DTOs/`, porque mantém tipagens organizadas e reutilizáveis
2. **Use `enum` para valores finitos** — categorias, status, roles devem ser enums, porque restringem os valores possíveis e melhoram legibilidade
3. **Separe o tipo unitário do tipo paginado** — crie `RefoundAPIResponse` (um item) e `RefoundsPaginationAPIResponse` (lista + paginação), porque facilita reutilização individual ou em conjunto
4. **Use generics no cliente HTTP** — `api.get<RefoundsPaginationAPIResponse>(...)` para tipar a resposta automaticamente, porque habilita autocomplete e checagem de tipos
5. **Extraia sub-objetos inline quando só precisa de parte** — `user: { name: string }` ao invés de importar o tipo completo do usuário, porque evita dependências desnecessárias
6. **Nomeie DTOs com sufixo `APIResponse`** — `RefoundAPIResponse`, não `Refound` ou `RefoundType`, porque deixa claro que é o shape da API

## How to write

### Arquivo DTO para entidade

```typescript
// DTOs/refound.d.ts
type RefoundAPIResponse = {
  id: string
  userId: string
  name: string
  category: CategoriesAPI
  amount: number
  filename: string
  user: {
    name: string
  }
}
```

### Enum para valores finitos

```typescript
// DTOs/categories.d.ts
enum CategoriesAPI {
  Food = "food",
  Others = "others",
  Services = "services",
  Transport = "transport",
  Accommodation = "accommodation",
}
```

### Tipo composto com paginação

```typescript
// DTOs/refound.d.ts
type RefoundsPaginationAPIResponse = {
  refounds: RefoundAPIResponse[]
  pagination: {
    page: number
    perPage: number
    totalRecords: number
    totalPages: number
  }
}
```

### Usando generic no cliente HTTP

```typescript
const { data } = await api.get<RefoundsPaginationAPIResponse>("/refounds")

// Agora tem autocomplete:
data.refounds[0].id    // string
data.refounds[0].name  // string
data.pagination.page   // number
```

## Example

**Before (sem tipagem — "no escuro"):**
```typescript
const { data } = await api.get("/refounds")
data.  // ❌ nenhum autocomplete, nenhuma segurança
```

**After (com tipagem via DTO):**
```typescript
const { data } = await api.get<RefoundsPaginationAPIResponse>("/refounds")
data.refounds[0].name       // ✅ autocomplete funciona
data.refounds[0].category   // ✅ CategoriesAPI enum
data.pagination.totalPages  // ✅ number
```

## Heuristics

| Situação | Faça |
|----------|------|
| API retorna objeto com campos conhecidos | Crie um type `{Entity}APIResponse` em `DTOs/` |
| Campo tem valores limitados (categoria, status) | Crie uma `enum` separada |
| Resposta inclui lista + metadados de paginação | Compose: `{ items: Entity[], pagination: {...} }` |
| Só precisa de parte de um sub-objeto | Inline o subset: `user: { name: string }` |
| Tipo será usado em um lugar só | Mesmo assim crie DTO separado — reutilização futura |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `api.get("/refounds")` sem generic | `api.get<RefoundsPaginationAPIResponse>(...)` |
| `category: string` para valores finitos | `category: CategoriesAPI` (enum) |
| Tipagem inline gigante no componente | Arquivo `.d.ts` separado em `DTOs/` |
| `type Refound` (nome genérico) | `type RefoundAPIResponse` (com sufixo) |
| Um type monolítico com lista + paginação + item | Tipos separados: unitário + composto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre por que tipar retornos de API e como enums melhoram consistência
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações para diferentes entidades