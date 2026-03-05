---
name: rs-full-stack-boolean-1
description: "Enforces boolean naming conventions and usage patterns when writing JavaScript/TypeScript code. Use when user asks to 'create a boolean variable', 'add a loading state', 'write a flag', 'check if something is true', or any code with boolean logic. Applies rules: is/has/should prefixes, cause-over-effect naming, no truthy shortcuts for clarity. Make sure to use this skill whenever generating boolean variables or conditions. Not for general variable naming, string/number types, or control flow logic."
---

# Boolean — Tipo e Convenções

> Variáveis booleanas armazenam exclusivamente `true` ou `false` e devem ser nomeadas como perguntas que se respondem com sim ou não.

## Rules

1. **Prefixe booleanos com `is`, `has`, `should`, `can`, `was`** — `isLoading` não `loading`, porque o prefixo transforma o nome numa pergunta legível: "is loading?" → true/false
2. **Use gerúndio (`-ing`) para estados em andamento** — `isProcessing`, `isLoading`, `isFetching`, porque indica ação contínua que vai terminar
3. **Use particípio passado para estados concluídos** — `isLoaded`, `hasFinished`, `wasDeleted`, porque indica que a ação já ocorreu
4. **Nomeie pela CAUSA, não pelo EFEITO** — `isFormSubmitting` não `isButtonDisabled`, porque a causa é reutilizável em múltiplos lugares da UI
5. **Nunca compare booleano com `true`/`false` explicitamente** — `if (isLoading)` não `if (isLoading === true)`, porque o valor já é booleano
6. **Use `typeof` para verificar o tipo** — `typeof isLoading` retorna `"boolean"`, útil para validação em boundaries

## How to write

### Estados de carregamento
```typescript
const isLoading = true
const isProcessing = false
const isFetching = true
```

### Estados de existência
```typescript
const hasPermission = true
const hasChildren = false
const hasError = true
```

### Verificação de tipo
```typescript
console.log(typeof isLoading) // "boolean"
```

## Example

**Before (comum em código iniciante):**
```typescript
const loading = "true"
const disabled = 1
const show = "yes"
if (loading === "true") { /* ... */ }
```

**After (com esta skill aplicada):**
```typescript
const isLoading = true
const isDisabled = false
const isVisible = true
if (isLoading) { /* ... */ }
```

## Heuristics

| Situação | Faça |
|----------|------|
| Ação em andamento | `is` + verbo no gerúndio: `isLoading`, `isProcessing` |
| Ação concluída | `is` + particípio ou `has` + particípio: `isLoaded`, `hasFinished` |
| Presença de algo | `has` + substantivo: `hasPermission`, `hasChildren` |
| Capacidade | `can` + verbo: `canEdit`, `canDelete` |
| Intenção futura | `should` + verbo: `shouldRefresh`, `shouldNotify` |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `const loading = true` | `const isLoading = true` |
| `const active = false` | `const isActive = false` |
| `if (isReady === true)` | `if (isReady)` |
| `if (isReady === false)` | `if (!isReady)` |
| `const loading = "true"` | `const isLoading = true` |
| `const disabled = 1` | `const isDisabled = true` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, origem histórica e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-boolean-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-boolean-1/references/code-examples.md)
