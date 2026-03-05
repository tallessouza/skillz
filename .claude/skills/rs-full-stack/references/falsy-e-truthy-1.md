---
name: rs-full-stack-falsy-e-truthy-1
description: "Enforces correct falsy/truthy evaluation when writing JavaScript/TypeScript conditionals and boolean checks. Use when user asks to 'write a condition', 'check if value exists', 'validate input', 'handle empty state', or any conditional logic. Applies rules: empty objects/arrays are truthy, use explicit checks for them, space-only strings are truthy, -0 and NaN are falsy. Make sure to use this skill whenever writing if/else, ternaries, or boolean coercion. Not for type checking, schema validation, or formal boolean algebra."
---

# Falsy e Truthy em JavaScript

> Ao escrever condicionais, conheça exatamente quais valores JavaScript considera falso e verdadeiro para evitar bugs silenciosos.

## Rules

1. **Memorize os 7 valores falsy** — `false`, `0`, `-0`, `""`, `null`, `undefined`, `NaN` — todos os outros valores sao truthy, porque JavaScript converte implicitamente em contextos booleanos
2. **Objetos e arrays vazios sao truthy** — `{}` e `[]` retornam verdadeiro em condicionais, porque JavaScript avalia a referencia do objeto, nao seu conteudo
3. **Verifique conteudo de objetos explicitamente** — use `Object.keys(obj).length === 0` em vez de `if (obj)`, porque `if (obj)` sempre sera true mesmo com objeto vazio
4. **Strings com espaco sao truthy** — `" "` e truthy porque espaco e um caractere valido, apenas `""` (string completamente vazia) e falsy
5. **Use comparacao explicita quando a intencao importa** — `if (count !== 0)` e mais claro que `if (count)`, porque `if (count)` tambem falha para `null` e `undefined`
6. **Infinity e truthy** — tanto `Infinity` quanto `-Infinity` sao considerados verdadeiros, porque sao numeros validos diferentes de zero

## How to write

### Verificacao de existencia segura

```typescript
// Para valores primitivos, coercao implicita funciona
if (username) {
  greetUser(username)
}

// Para objetos/arrays, verifique o conteudo explicitamente
if (Object.keys(selectedProduct).length > 0) {
  displayProduct(selectedProduct)
}

if (items.length > 0) {
  renderList(items)
}
```

### Ternarios com valores falsy

```typescript
// Cuidado: 0 e "" sao falsy — use nullish coalescing quando apropriado
const displayName = user.name || "Anonimo"        // "" vira "Anonimo" (pode ser bug)
const displayName = user.name ?? "Anonimo"         // "" permanece "" (apenas null/undefined)

const quantity = cart.quantity || 1                 // 0 vira 1 (bug!)
const quantity = cart.quantity ?? 1                 // 0 permanece 0 (correto)
```

## Example

**Before (bugs silenciosos com falsy/truthy):**

```typescript
function processOrder(cart) {
  if (cart) {                          // Bug: {} passa nessa verificacao
    console.log("Carrinho encontrado")
  }
  if (cart.discount) {                 // Bug: desconto 0 e ignorado
    applyDiscount(cart.discount)
  }
  if (cart.notes) {                    // Bug: " " (espaco) passa como truthy
    saveNotes(cart.notes)
  }
}
```

**After (verificacoes explicitas):**

```typescript
function processOrder(cart) {
  if (Object.keys(cart).length > 0) {  // Verifica se objeto tem conteudo
    console.log("Carrinho encontrado")
  }
  if (cart.discount !== undefined) {    // 0 e um desconto valido
    applyDiscount(cart.discount)
  }
  if (cart.notes?.trim()) {            // Remove espacos antes de verificar
    saveNotes(cart.notes)
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Verificar se string tem conteudo util | `str.trim()` em vez de `if (str)` |
| Verificar se numero foi fornecido | `num !== undefined && num !== null` ou `num ?? fallback` |
| Verificar se objeto tem dados | `Object.keys(obj).length > 0` |
| Verificar se array tem itens | `arr.length > 0` |
| Valor pode ser 0 legitimamente | Use `??` (nullish) em vez de `\|\|` (or) |
| Valor pode ser "" legitimamente | Use `??` em vez de `\|\|` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `if (obj)` para verificar conteudo | `if (Object.keys(obj).length > 0)` |
| `if (arr)` para verificar itens | `if (arr.length > 0)` |
| `count \|\| defaultValue` quando 0 e valido | `count ?? defaultValue` |
| `name \|\| "Anonimo"` quando "" e valido | `name ?? "Anonimo"` |
| `if (text)` para conteudo util | `if (text?.trim())` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre coercao booleana, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-falsy-e-truthy-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-falsy-e-truthy-1/references/code-examples.md)
