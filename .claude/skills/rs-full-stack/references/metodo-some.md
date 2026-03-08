---
name: rs-full-stack-metodo-some
description: "Applies Array.some() method correctly when checking if at least one element meets a condition. Use when user asks to 'check if any element', 'verify if at least one', 'test array condition', 'validate any item', or uses some() in code. Ensures proper boolean return handling and callback structure. Make sure to use this skill whenever generating code that needs to test partial array conditions. Not for filtering arrays, transforming data, or checking ALL elements (use every() instead)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-array-methods
  tags: [javascript, array, some, boolean, validation]
---

# Método some()

> Usar `some()` para verificar se **pelo menos um** elemento do array atende a uma condição, retornando um booleano.

## Rules

1. **Use `some()` para verificação parcial** — quando precisa saber se *algum* elemento passa na condição, porque `some()` para na primeira match (short-circuit), sendo mais eficiente que `filter().length > 0`
2. **Retorno é sempre booleano** — `true` se pelo menos um elemento atende, `false` se nenhum atende, porque o resultado vai direto para condicionais sem conversão
3. **Nomeie o resultado pela pergunta que responde** — `hasMinor` não `result`, porque o nome deve refletir a verificação feita
4. **Não confunda com `every()`** — `some()` = pelo menos um, `every()` = todos, porque a troca silenciosa causa bugs lógicos difíceis de rastrear

## How to write

### Verificação básica com some()

```typescript
const ages = [15, 30, 39, 29]
const hasMinor = ages.some((age) => age < 18)
// true — pelo menos um elemento (15) atende a condição
```

### some() em condicionais

```typescript
const permissions = ["read", "write", "admin"]
const hasAdminAccess = permissions.some((perm) => perm === "admin")

if (hasAdminAccess) {
  showAdminPanel()
}
```

## Example

**Before (ineficiente e verboso):**

```typescript
const ages = [15, 30, 39, 29]
const filtered = ages.filter((age) => age < 18)
const result = filtered.length > 0
console.log(result)
```

**After (com some()):**

```typescript
const ages = [15, 30, 39, 29]
const hasMinor = ages.some((age) => age < 18)
console.log(hasMinor)
```

## Heuristics

| Situação | Faça |
|----------|------|
| Precisa saber se ALGUM atende | `some()` |
| Precisa saber se TODOS atendem | `every()` |
| Precisa dos elementos que atendem | `filter()` |
| Precisa de apenas UM elemento que atende | `find()` |
| Resultado vai para `if/else` | Nomeie como pergunta: `hasX`, `isY` |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `array.filter(fn).length > 0` | `array.some(fn)` |
| `const result = arr.some(...)` | `const hasMinor = arr.some(...)` |
| `some()` quando precisa de todos | `every()` |
| `some()` quando precisa do elemento | `find()` |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `some()` retorna `false` quando deveria ser `true` | Condicao do callback esta incorreta | Teste o callback isoladamente com um elemento que deveria passar |
| Confusao entre `some()` e `every()` | `some()` = pelo menos um, `every()` = todos | Releia a intencao: "algum" → `some()`, "todos" → `every()` |
| Usou `some()` mas precisa do elemento | `some()` retorna boolean, nao o elemento | Use `find()` para obter o elemento ou `filter()` para multiplos |
| Performance ruim em arrays grandes | `some()` ja faz short-circuit no primeiro match | Verifique se nao esta encadeando com `filter().length > 0` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações