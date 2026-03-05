---
name: rs-full-stack-conhecendo-sobre-imutabilidade
description: "Enforces immutability patterns when writing JavaScript/TypeScript code that manipulates objects or arrays. Use when user asks to 'update an object', 'modify state', 'change a property', 'copy an object', or 'work with React state'. Applies rules: never mutate originals directly, use spread operator for copies, understand reference vs value assignment. Make sure to use this skill whenever generating code that modifies objects, arrays, or state — especially in React contexts. Not for primitive value assignments, database mutations, or API request construction."
---

# Imutabilidade em JavaScript

> Nunca modifique um objeto diretamente — crie uma copia modificada e mantenha o original intacto.

## Rules

1. **Nunca atribua um objeto a outra variavel diretamente** — `const b = a` cria uma referencia, nao uma copia, porque ambas variaveis apontam para o mesmo espaco na memoria
2. **Use spread operator para copiar objetos** — `const b = { ...a }` cria um novo objeto na memoria, porque isso garante que manipulacoes em `b` nao afetam `a`
3. **Substitua ao inves de mutar** — crie uma nova copia com as alteracoes desejadas ao inves de modificar propriedades diretamente, porque deteccao de mudancas em objetos imutaveis e trivial (referencia diferente = mudou)
4. **Arrays seguem a mesma regra** — use `[...arr]`, `.map()`, `.filter()` ao inves de `.push()`, `.splice()`, `arr[i] = x`, porque arrays tambem sao objetos por referencia
5. **Em React, estado e sempre imutavel** — nunca mute state diretamente, sempre use o setter com um novo objeto, porque React compara referencias para decidir re-renders

## How to write

### Copiar e modificar objetos

```typescript
// CORRETO: spread cria novo objeto na memoria
const address1 = { street: "Avenida Brasil", number: 20 }
const address2 = { ...address1, number: 30 }
// address1.number continua 20, address2.number e 30
```

### Copiar e modificar arrays

```typescript
const original = [1, 2, 3]
const withNewItem = [...original, 4]
const withoutSecond = original.filter((_, i) => i !== 1)
const doubled = original.map(n => n * 2)
```

### Estado em React

```typescript
const [user, setUser] = useState({ name: "Ana", age: 25 })

// CORRETO: novo objeto via spread
setUser({ ...user, age: 26 })
```

## Example

**Before (mutacao direta — bug silencioso):**
```typescript
const address1 = { street: "Avenida Brasil", number: 20 }
const address2 = address1 // referencia, NAO copia!
address2.number = 30
// address1.number agora tambem e 30 — ambos apontam para o mesmo objeto
```

**After (imutavel — objetos independentes):**
```typescript
const address1 = { street: "Avenida Brasil", number: 20 }
const address2 = { ...address1, number: 30 } // copia real
// address1.number continua 20, address2.number e 30
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa modificar uma propriedade de objeto | Spread + override: `{ ...obj, prop: newValue }` |
| Precisa adicionar item a array | `[...arr, newItem]` |
| Precisa remover item de array | `.filter()` |
| Precisa modificar item de array | `.map()` com condicional |
| React state com objeto | Sempre `setState({ ...prev, changes })` |
| Objetos aninhados (nested) | Spread em cada nivel: `{ ...obj, nested: { ...obj.nested, prop: val } }` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const copy = original` (objetos) | `const copy = { ...original }` |
| `obj.prop = newValue` (quando imutabilidade importa) | `const updated = { ...obj, prop: newValue }` |
| `arr.push(item)` (em contexto imutavel) | `const updated = [...arr, item]` |
| `arr[i] = newValue` | `const updated = arr.map((v, idx) => idx === i ? newValue : v)` |
| `state.name = "novo"` (React) | `setState({ ...state, name: "novo" })` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre referencias em memoria, comparacao rasa vs profunda, e beneficios de performance
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes e cenarios reais