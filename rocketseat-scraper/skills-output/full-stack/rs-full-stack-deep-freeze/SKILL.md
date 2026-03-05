---
name: rs-full-stack-deep-freeze
description: "Enforces deep freeze (immutabilidade profunda) pattern when writing JavaScript/TypeScript code that needs truly immutable objects. Use when user asks to 'freeze an object', 'make object immutable', 'prevent object mutation', 'deep immutability', or 'recursive freeze'. Applies recursive Object.freeze to all nested properties. Make sure to use this skill whenever user needs immutable objects with nested properties, even if they only mention Object.freeze. Not for shallow freezing simple flat objects, Immer/Immutable.js libraries, or Object.seal/Object.preventExtensions."
---

# Deep Freeze — Congelamento Profundo de Objetos

> Ao congelar objetos, percorra recursivamente todas as propriedades para garantir imutabilidade em todos os níveis.

## Rules

1. **Object.freeze é raso** — congela apenas o primeiro nível de propriedades primitivas, porque objetos aninhados são referências e o freeze não segue referências
2. **Use recursão para congelar profundamente** — uma função que chama a si mesma para cada propriedade que seja objeto ou função, porque é a única forma de garantir imutabilidade total
3. **Use Reflect.ownKeys para listar propriedades** — `Reflect.ownKeys(obj)` retorna um array com todas as propriedades próprias do objeto, incluindo Symbols
4. **Verifique tipo antes de recursão** — só chame deepFreeze recursivamente se o valor existir E for `typeof === 'object'` ou `typeof === 'function'`, porque primitivos não precisam de freeze
5. **Retorne o objeto congelado** — `return Object.freeze(obj)` no final da função, porque permite uso encadeado e expressivo

## How to write

### Função deepFreeze

```typescript
function deepFreeze<T extends Record<string, unknown>>(object: T): Readonly<T> {
  // Obtém array com todas as propriedades do objeto
  const props = Reflect.ownKeys(object)

  // Itera sobre todas as propriedades do objeto
  for (const prop of props) {
    const value = object[prop as keyof T]

    // Verifica se o valor é objeto ou função para aplicar deepFreeze recursivamente
    if (value && (typeof value === "object" || typeof value === "function")) {
      deepFreeze(value as Record<string, unknown>)
    }
  }

  // Retorna o objeto congelado
  return Object.freeze(object)
}
```

## Example

**Before (congelamento raso — bug silencioso):**
```typescript
const book = {
  title: "Objetos Imutáveis",
  category: "javascript",
  author: { name: "Rodrigo", email: "rodrigo@email.com" }
}

Object.freeze(book)

book.category = "CSS"        // Bloqueado — primeiro nível protegido
book.author.name = "João"    // PASSA! — objeto aninhado NÃO foi congelado
console.log(book.author.name) // "João" — mutação silenciosa
```

**After (congelamento profundo):**
```typescript
const book = {
  title: "Objetos Imutáveis",
  category: "javascript",
  author: { name: "Rodrigo", email: "rodrigo@email.com" }
}

deepFreeze(book)

book.category = "HTML"       // Bloqueado
book.author.name = "João"    // Bloqueado — objeto aninhado também congelado
console.log(book.author.name) // "Rodrigo" — imutabilidade garantida
```

## Heuristics

| Situação | Ação |
|----------|------|
| Objeto plano sem aninhamento | `Object.freeze()` simples é suficiente |
| Objeto com propriedades aninhadas | Usar `deepFreeze` sempre |
| Configurações/constantes da app | `deepFreeze` para evitar mutação acidental |
| Objeto vindo de API que será compartilhado | `deepFreeze` antes de distribuir |
| Performance crítica com objetos enormes | Considerar alternativas (Immer, spread) pois freeze tem custo |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `Object.freeze(objComAninhados)` achando que está seguro | `deepFreeze(objComAninhados)` |
| Loop manual com `Object.keys()` (ignora Symbols) | `Reflect.ownKeys(obj)` |
| `deepFreeze` sem verificar se valor existe | `if (value && typeof value === "object")` |
| Mutar objeto e depois congelar | Congelar ANTES de expor para consumidores |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre imutabilidade rasa vs profunda, recursão e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações