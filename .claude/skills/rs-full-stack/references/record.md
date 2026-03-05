---
name: rs-full-stack-record
description: "Enforces correct usage of TypeScript Record utility type when mapping object types. Use when user asks to 'type an object', 'map keys to values', 'restrict object keys', 'create a dictionary type', or 'define object structure with Record'. Applies rules: key-value type mapping, union types as keys for restriction, custom interfaces as values. Make sure to use this skill whenever generating TypeScript objects that need structured key-value typing. Not for array typing, tuple types, or generic utility types like Partial/Pick/Omit."
---

# TypeScript Record Utility Type

> Use Record<Keys, Values> para definir a estrutura exata que um objeto deve seguir, mapeando tipos de chaves para tipos de valores.

## Rules

1. **Defina sempre chave e valor no Record** — `Record<KeyType, ValueType>`, porque o Record mapeia explicitamente o tipo da chave ao tipo do valor
2. **Use union types como chave para restringir opcoes** — `Record<"admin" | "user", number>` obriga todas as chaves a existirem, porque o TypeScript exige que todas as opcoes do union estejam presentes
3. **Use interfaces como valor para objetos complexos** — `Record<string, User>` garante que cada valor respeite a interface, porque evita objetos malformados
4. **Nunca omita chaves quando usar union type** — o TypeScript acusa erro se uma chave do union estiver ausente, porque o Record exige completude
5. **Nunca adicione chaves extras ao union** — chaves fora do union sao rejeitadas, porque o Record restringe tanto a presenca quanto a ausencia

## How to write

### Record basico (chave primitiva, valor primitivo)

```typescript
// Todas as chaves string, valores numericos
const scores: Record<string, number> = {
  "Rodrigo": 10,
  "Mayk": 15
}
```

### Record com union type (chaves restritas)

```typescript
// Limita as chaves disponiveis — TODAS devem estar presentes
type Profile = "admin" | "user" | "guest"

const permissions: Record<Profile, number> = {
  admin: 1,
  user: 2,
  guest: 3
}
```

### Record com interface customizada (valores complexos)

```typescript
interface User {
  name: string
  email: string
}

const users: Record<number, User> = {
  1: { name: "Rodrigo", email: "rodrigo@email.com" },
  2: { name: "Mayk", email: "mayk@email.com" },
}
```

## Example

**Before (objeto sem tipagem estruturada):**

```typescript
const config = {
  timeout: 3000,
  retries: "cinco",  // deveria ser number, ninguem reclamou
  debug: true         // tipo inconsistente, ninguem reclamou
}
```

**After (com Record garantindo conformidade):**

```typescript
const config: Record<string, number> = {
  timeout: 3000,
  retries: 5,
  // debug: true  // ERRO: boolean nao e number
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Objeto com chaves dinamicas e valores do mesmo tipo | `Record<string, ValueType>` |
| Conjunto fixo de chaves obrigatorias | `Record<UnionType, ValueType>` |
| Dicionario/mapa de entidades por ID | `Record<number, Interface>` |
| Objeto com chaves e valores de tipos variados | Use `interface` em vez de Record |
| Precisa de apenas algumas chaves opcionais | `Partial<Record<UnionType, ValueType>>` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `const obj: any = {}` | `const obj: Record<string, number> = {}` |
| `const obj: {[key: string]: number}` | `const obj: Record<string, number>` (mais legivel) |
| `Record<Profile, number>` com chaves faltando | Inclua todas as chaves do union ou use `Partial<Record<Profile, number>>` |
| `Record<Profile, number>` com chaves extras | Remova chaves que nao existem no union |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases do Record
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-record/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-record/references/code-examples.md)
