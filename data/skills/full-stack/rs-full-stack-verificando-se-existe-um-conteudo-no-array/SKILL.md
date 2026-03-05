---
name: rs-full-stack-verificando-conteudo-array
description: "Applies Array.includes() for checking item existence in arrays when writing JavaScript/TypeScript. Use when user asks to 'check if array contains', 'verify item in list', 'find if value exists in array', or 'search array for element'. Enforces includes() over indexOf and highlights case-sensitivity. Make sure to use this skill whenever generating code that checks array membership. Not for searching objects by property, filtering arrays, or finding index positions."
---

# Verificando Conteúdo no Array com includes()

> Use `includes()` para verificar existência de um item no array — retorna `true` ou `false`, sem ambiguidade.

## Rules

1. **Use `includes()` para verificação de existência** — `fruits.includes("apple")` não `fruits.indexOf("apple") !== -1`, porque includes() expressa intenção diretamente e retorna booleano
2. **Lembre que `includes()` é case-sensitive** — `"Apple" !== "apple"`, porque JavaScript compara strings exatamente como são
3. **Use o retorno booleano diretamente** — `if (fruits.includes("apple"))` não `if (fruits.includes("apple") === true)`, porque o método já retorna booleano

## How to write

### Verificação simples

```typescript
const fruits = ["apple", "orange", "banana"]

// Verifica se o item existe
const hasApple = fruits.includes("apple") // true
const hasLemon = fruits.includes("lemon") // false
```

### Em condicionais

```typescript
if (allowedRoles.includes(userRole)) {
  grantAccess()
}
```

## Example

**Before (indexOf antipattern):**
```typescript
if (fruits.indexOf("apple") !== -1) {
  console.log("Found")
}
if (fruits.indexOf("apple") >= 0) {
  console.log("Found")
}
```

**After (with this skill applied):**
```typescript
if (fruits.includes("apple")) {
  console.log("Found")
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa saber se existe (sim/não) | `array.includes(value)` |
| Precisa da posição do item | `array.indexOf(value)` |
| Precisa do item em si (objeto) | `array.find(predicate)` |
| Precisa de vários itens filtrados | `array.filter(predicate)` |
| Comparação case-insensitive | Normalize antes: `array.map(s => s.toLowerCase()).includes(value.toLowerCase())` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `arr.indexOf(x) !== -1` | `arr.includes(x)` |
| `arr.indexOf(x) >= 0` | `arr.includes(x)` |
| `arr.includes(x) === true` | `arr.includes(x)` |
| `arr.includes("Apple")` (quando o array tem `"apple"`) | Normalize case antes de comparar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre includes vs indexOf, case-sensitivity e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações