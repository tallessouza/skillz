---
name: rs-full-stack-shallow-e-deep-copy
description: "Enforces correct shallow and deep copy patterns when cloning or spreading objects in JavaScript/TypeScript. Use when user asks to 'copy an object', 'clone an array', 'spread operator', 'duplicate state', or works with nested objects/arrays. Prevents reference-sharing bugs by applying deep copy for nested structures. Make sure to use this skill whenever code spreads objects containing arrays or nested objects. Not for immutable library usage (Immer, Immutable.js) or structuredClone API patterns."
---

# Shallow e Deep Copy

> Ao copiar objetos, identifique se ha estruturas aninhadas — se houver, faca deep copy para evitar compartilhamento de referencia.

## Rules

1. **Spread so copia o primeiro nivel** — `{...obj}` copia propriedades primitivas mas mantem referencia para arrays e objetos aninhados, porque o spread faz shallow copy por definicao
2. **Valores primitivos permitem shallow copy** — string, number, boolean sao copiados por valor, entao spread e suficiente quando todas as propriedades sao primitivas
3. **Arrays e objetos aninhados exigem deep copy** — sempre crie um novo array/objeto para propriedades aninhadas, porque caso contrario mutacoes afetam o original
4. **Prefira spread no nivel aninhado** — `students: [...original.students]` cria um novo array com os mesmos elementos, quebrando a referencia do array
5. **Nunca assuma que spread resolve tudo** — o erro mais comum e usar spread e achar que o objeto inteiro foi copiado independentemente

## How to write

### Shallow copy (suficiente para primitivos)

```typescript
const original = { name: "HTML", level: 1 }
const copy = { ...original, name: "JavaScript" }
// OK: todas as propriedades sao primitivas
```

### Deep copy manual com spread aninhado

```typescript
const htmlCourse = {
  course: "HTML",
  students: [{ name: "Rodrigo", email: "rodrigo@email.com" }]
}

const jsCourse = {
  ...htmlCourse,
  course: "JavaScript",
  students: [...htmlCourse.students, { name: "João", email: "joao@email.com" }]
}
// htmlCourse.students continua com 1 item
// jsCourse.students tem 2 itens, array independente
```

### Atribuicao separada (alternativa)

```typescript
const jsCourse = { ...htmlCourse, course: "JavaScript" }
jsCourse.students = [...htmlCourse.students]
jsCourse.students.push({ name: "João", email: "joao@email.com" })
```

## Example

**Before (bug de referencia compartilhada):**

```typescript
const htmlCourse = {
  course: "HTML",
  students: [{ name: "Rodrigo", email: "rodrigo@email.com" }]
}

const jsCourse = { ...htmlCourse, course: "JavaScript" }
jsCourse.students.push({ name: "João", email: "joao@email.com" })

// BUG: htmlCourse.students agora tambem tem João!
// Ambos apontam para o MESMO array
```

**After (deep copy correto):**

```typescript
const htmlCourse = {
  course: "HTML",
  students: [{ name: "Rodrigo", email: "rodrigo@email.com" }]
}

const jsCourse = {
  ...htmlCourse,
  course: "JavaScript",
  students: [...htmlCourse.students, { name: "João", email: "joao@email.com" }]
}

// htmlCourse.students tem 1 aluno (Rodrigo)
// jsCourse.students tem 2 alunos (Rodrigo + João) — arrays independentes
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Objeto so com primitivos (string, number, boolean) | Shallow copy com spread e suficiente |
| Objeto com arrays ou objetos aninhados | Deep copy: spread cada nivel aninhado |
| Estado de React/Vue com arrays internos | Sempre deep copy antes de setState |
| Precisa clonar profundamente (3+ niveis) | Considere `structuredClone()` ou biblioteca |
| Array simples de primitivos | `[...array]` e suficiente |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `const copy = { ...obj }` quando obj tem arrays | `const copy = { ...obj, items: [...obj.items] }` |
| `copy.list.push(item)` apos shallow copy | Crie novo array: `copy.list = [...copy.list, item]` |
| `Object.assign({}, obj)` para objetos complexos | Spread aninhado ou `structuredClone(obj)` |
| Mutar array de objeto copiado com spread | Sempre recriar arrays aninhados com spread |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre referencia vs copia, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-shallow-e-deep-copy/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-shallow-e-deep-copy/references/code-examples.md)
