---
name: rs-full-stack-metodo-every
description: "Applies Array.every() method correctly when checking if all elements satisfy a condition in JavaScript/TypeScript. Use when user asks to 'check all items', 'validate every element', 'verify all entries match', or 'test if entire array passes condition'. Ensures proper boolean return handling and callback structure. Make sure to use this skill whenever code needs to confirm ALL elements meet a criteria. Not for filtering, finding, or transforming arrays — use filter/find/map skills instead."
---

# Método every()

> Usar `every()` quando a pergunta é "TODOS os elementos atendem à condição?" — retorna `true` somente se nenhum elemento falhar.

## Rules

1. **Use `every()` para validação universal** — quando precisa confirmar que TODOS os itens passam, porque `every()` curto-circuita no primeiro `false` (performance)
2. **Retorne apenas a condição no callback** — `ages.every(age => age >= 18)` não `ages.every(age => { if (age >= 18) return true; else return false; })`, porque a comparação já é booleana
3. **Nomeie a variável auxiliar pelo domínio** — `age`, `user`, `product` não `e`, `item`, `el`, porque descreve o conteúdo da iteração
4. **Guarde o resultado em variável descritiva** — `const allAdults = ages.every(...)` não `const result = ages.every(...)`, porque o nome revela a intenção da verificação
5. **Array vazio retorna `true`** — esteja ciente de que `[].every(fn)` é `true` (vacuous truth), valide o array antes se necessário

## How to write

### Verificação universal simples

```typescript
const ages = [30, 39, 29, 15]
const allEligibleForLicense = ages.every(age => age >= 18)
// false — 15 falha na condição
```

### Com objetos

```typescript
const users = [
  { name: "Ana", age: 25 },
  { name: "Carlos", age: 17 },
]
const allAdults = users.every(user => user.age >= 18)
```

### Guarda contra array vazio

```typescript
const hasAllValid = items.length > 0 && items.every(item => item.isValid)
```

## Example

**Before (comum mas verboso):**
```typescript
const result = ages.every(function(e) {
  if (e >= 18) {
    return true
  } else {
    return false
  }
})
```

**After (com esta skill aplicada):**
```typescript
const allEligibleForLicense = ages.every(age => age >= 18)
```

## Heuristics

| Situação | Faça |
|----------|------|
| "Todos atendem X?" | `array.every(item => condição)` |
| "Algum atende X?" | Use `some()`, não `every()` |
| "Filtrar os que atendem" | Use `filter()`, não `every()` |
| Array pode estar vazio | Valide `.length > 0` antes do `every()` |
| Condição complexa | Extraia para função nomeada: `every(isEligible)` |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `ages.every(e => e >= 18)` | `ages.every(age => age >= 18)` |
| `const result = arr.every(...)` | `const allValid = arr.every(...)` |
| `arr.every(x => { if(x > 0) return true; return false })` | `arr.every(x => x > 0)` |
| `let allOk = true; for(...) { if(!cond) allOk = false }` | `const allOk = arr.every(item => cond)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases do every()
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-metodo-every/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-metodo-every/references/code-examples.md)
