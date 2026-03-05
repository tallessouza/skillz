---
name: rs-full-stack-operador-coalescencia-nula
description: "Applies nullish coalescing operator (??) patterns when writing JavaScript/TypeScript code. Use when user asks to 'handle null values', 'set default values', 'check if undefined', 'fallback value', or any code dealing with optional properties. Enforces ?? over || for null/undefined checks because ?? only triggers on null/undefined, not on false/0/''. Make sure to use this skill whenever generating code with optional values or default assignments. Not for logical OR operations, ternary expressions, or boolean logic unrelated to nullish checks."
---

# Operador de Coalescência Nula (??)

> Use `??` para fornecer valores padrão quando o lado esquerdo é `null` ou `undefined` — nunca `||` para esse propósito.

## Rules

1. **Use `??` para defaults, não `||`** — `||` trata `false`, `0`, `""` como falsy e substitui incorretamente; `??` só dispara em `null`/`undefined`
2. **Lado esquerdo = valor a testar, lado direito = fallback** — `valor ?? fallback` porque a leitura é "use valor, senão fallback"
3. **Use em propriedades opcionais de objetos** — `user.avatar ?? "default.png"` porque propriedades opcionais podem ser `undefined`
4. **Combine com optional chaining** — `user?.settings?.theme ?? "light"` porque acesso seguro + fallback é o padrão completo

## How to write

### Default para propriedades opcionais

```typescript
const avatar = user.avatar ?? "default.png"
const displayName = user.nickname ?? user.name ?? "Anônimo"
```

### Default para parâmetros de configuração

```typescript
const timeoutInMs = config.timeout ?? 3000
const retries = options.retries ?? 3
```

### Com optional chaining

```typescript
const theme = user?.preferences?.theme ?? "light"
```

## Example

**Before (usando || incorretamente):**
```typescript
const content = value || "conteúdo padrão"
// BUG: se value for false, 0, ou "", substitui incorretamente
```

**After (com ?? correto):**
```typescript
const content = value ?? "conteúdo padrão"
// Só substitui se value for null ou undefined
// false, 0, "" são preservados como valores válidos
```

## Heuristics

| Situação | Ação |
|----------|------|
| Propriedade opcional de objeto | `obj.prop ?? fallback` |
| Valor pode ser `null` de API/DB | `??` para definir default |
| Valor pode ser `false`, `0`, `""` legitimamente | Obrigatório usar `??` em vez de `||` |
| Encadeamento de fallbacks | `a ?? b ?? c` — primeiro não-nullish vence |
| Acesso profundo em objeto | Combine `?.` com `??` |

## Anti-patterns

| Nunca escreva | Escreva em vez |
|---------------|----------------|
| `value \|\| "default"` (quando 0/false/"" são válidos) | `value ?? "default"` |
| `value !== null && value !== undefined ? value : "default"` | `value ?? "default"` |
| `typeof value === "undefined" ? "default" : value` | `value ?? "default"` |
| `if (value) { use(value) } else { use("default") }` | `use(value ?? "default")` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, diferença entre ?? e ||, edge cases com falsy values
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-operador-de-coalescencia-nula/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-operador-de-coalescencia-nula/references/code-examples.md)
