---
name: rs-full-stack-enums-2
description: "Enforces TypeScript enum usage to eliminate magic numbers when writing code with numeric constants. Use when user asks to 'create user roles', 'define status codes', 'add profile types', 'replace magic numbers', or any task involving numeric identifiers mapped to categories. Applies named enums instead of raw numbers for readability. Make sure to use this skill whenever code contains numeric literals representing categories, states, or roles. Not for string literal unions, runtime validation, or database schema design."
---

# Enums no TypeScript

> Substituir numeros magicos por constantes nomeadas usando enum, porque codigo legivel nao exige investigacao no banco de dados.

## Rules

1. **Use enum quando numeros representam categorias** — `enum Profile { Admin = 1 }` nao `let profile = 1`, porque numeros sozinhos nao comunicam significado
2. **Atribua valores explicitos** — `Admin = 1, Client = 2` nao `Admin, Client`, porque valores implicitos quebram se a ordem mudar e devem corresponder ao banco de dados
3. **Nomeie pelo dominio** — `Profile`, `OrderStatus`, `PaymentMethod` nao `Types` ou `Options`, porque o nome do enum documenta o contexto
4. **Primeira letra maiuscula** — mesma convencao de interface e type, porque enum define um tipo
5. **Use enum no lugar do numero em todo o codigo** — `Profile.Admin` nao `1`, porque um programador novo no time entende `Profile.Admin` sem consultar o banco

## How to write

### Enum com valores numericos explicitos

```typescript
enum Profile {
  Admin = 1,
  Client = 2,
  Seller = 3
}

let profile: number = Profile.Admin
console.log(Profile.Seller) // 3
```

### Uso em condicionais

```typescript
if (user.profile === Profile.Admin) {
  showAdminDashboard()
} else if (user.profile === Profile.Seller) {
  showSellerPanel()
}
```

## Example

**Before (numeros magicos):**
```typescript
let profile = 1
if (profile === 1) { /* admin */ }
if (profile === 3) { /* vendedor */ }
```

**After (com enum):**
```typescript
enum Profile {
  Admin = 1,
  Client = 2,
  Seller = 3
}

let profile = Profile.Admin
if (profile === Profile.Admin) { /* admin */ }
if (profile === Profile.Seller) { /* vendedor */ }
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Coluna no banco armazena inteiro representando categoria | Crie enum com valores correspondentes |
| Poucos valores fixos e conhecidos em tempo de compilacao | Use enum |
| Valores dinamicos que mudam em runtime | Use objeto ou Map, nao enum |
| Precisa apenas de tipos string literais | Prefira union type (`type Role = 'admin' \| 'client'`) |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `if (role === 1)` | `if (role === Profile.Admin)` |
| `const ADMIN = 1; const CLIENT = 2;` | `enum Profile { Admin = 1, Client = 2 }` |
| `enum Types { A, B, C }` (sem valores, nome generico) | `enum Profile { Admin = 1, Client = 2, Seller = 3 }` |
| `profile: any` ao receber valor de enum | `profile: Profile` ou `profile: number` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre numeros magicos, analogias e quando NAO usar enum
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes