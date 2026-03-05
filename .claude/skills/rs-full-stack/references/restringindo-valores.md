---
name: rs-full-stack-restringindo-valores
description: "Enforces TypeScript literal union types to restrict variable values instead of broad string/number types. Use when user asks to 'create a type', 'define allowed values', 'restrict options', 'use union types', or writes variables typed as string that should have limited options. Make sure to use this skill whenever generating TypeScript code with finite sets of values like status, size, role, or category. Not for generic string manipulation, validation logic, or runtime checks."
---

# Restringindo Valores com Type Aliases

> Quando uma variavel aceita um conjunto finito de valores, defina um type literal union — nunca use string aberta.

## Rules

1. **Use `type` com union de literais para conjuntos finitos** — `type Size = "small" | "medium" | "large"` nao `let size: string`, porque string aberta permite qualquer valor incluindo erros de digitacao
2. **Nomeie o type com PascalCase** — `type PaymentStatus = ...` nao `type paymentStatus = ...`, porque types seguem a convencao de tipos do TypeScript
3. **Separe valores com pipe `|`** — cada valor possivel eh um literal separado por `|`, porque isso cria uma union type que o compilador valida
4. **Use o type como anotacao, nao string** — `let size: Size` nao `let size: string`, porque o autocomplete do editor mostra apenas as opcoes validas
5. **Prefira literais string a enums simples** — union types sao mais leves e funcionam naturalmente com inferencia, porque enums adicionam codigo JavaScript extra sem beneficio para conjuntos simples

## How to write

### Definindo um type restritivo

```typescript
type Size = "small" | "medium" | "large"

let size: Size
size = "small" // OK — compilador aceita
```

### Usando em funcoes

```typescript
type Status = "pending" | "approved" | "rejected"

function updateOrder(orderId: string, status: Status) {
  // status so pode ser um dos tres valores
}

updateOrder("123", "approved") // OK
```

### Combinando com condicoes

```typescript
type Plan = "free" | "pro" | "enterprise"

function getPriceInCents(plan: Plan): number {
  switch (plan) {
    case "free": return 0
    case "pro": return 2900
    case "enterprise": return 9900
  }
}
```

## Example

**Before (string aberta — qualquer valor aceito):**

```typescript
let size: string
size = "pequeno"   // aceita — mas inconsistente
size = "sm"        // aceita — abreviacao ambigua
size = "  small "  // aceita — com espacos
```

**After (union type — apenas valores validos):**

```typescript
type Size = "small" | "medium" | "large"

let size: Size
size = "small"     // OK
size = "pequeno"   // ERRO — Type '"pequeno"' is not assignable to type 'Size'
size = "sm"        // ERRO — compilador rejeita
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Variavel com 2-10 valores possiveis | Crie um `type` literal union |
| Valores usados em `switch` ou `if` | Sempre restrinja com type — garante exhaustiveness |
| Valor vem de input externo (API, usuario) | Type union + validacao runtime na fronteira |
| Mais de 10 valores ou valores dinamicos | Considere enum ou array `as const` |
| Valor usado apenas uma vez inline | Union direto na anotacao: `param: "a" \| "b"` |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `let status: string` (para valores finitos) | `type Status = "active" \| "inactive"; let status: Status` |
| `let size: "small" \| "medium" \| "large"` repetido em 5 lugares | `type Size = "small" \| "medium" \| "large"` definido uma vez |
| Comentario `// aceita: small, medium, large` | Type union que o compilador enforce |
| Magic strings espalhadas sem type | Type centralizado + autocomplete |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que string aberta causa bugs e como union types resolvem
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-restringindo-valores/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-restringindo-valores/references/code-examples.md)
