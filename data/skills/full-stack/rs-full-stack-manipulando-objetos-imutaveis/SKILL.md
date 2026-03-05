---
name: rs-full-stack-manipulando-objetos-imutaveis
description: "Enforces immutable object manipulation patterns when writing JavaScript/TypeScript code. Use when user asks to 'update an object', 'modify properties', 'remove a field', 'add a property', or any object transformation task. Applies spread operator for updates, rest/destructuring for property removal, never mutates originals. Make sure to use this skill whenever generating code that transforms objects. Not for array manipulation, state management libraries, or deep clone scenarios."
---

# Manipulando Objetos Imutáveis

> Ao transformar objetos, sempre crie um novo objeto preservando o original intacto — nunca mute diretamente.

## Rules

1. **Nunca mute o objeto original** — use spread (`...`) para criar copia com alteracoes, porque mutacao causa bugs silenciosos em qualquer contexto reativo ou compartilhado
2. **Spread primeiro, override depois** — `{ ...original, title: 'novo' }` sobrescreve apenas o que vem depois, porque a ordem das propriedades determina o valor final
3. **Adicione propriedades no mesmo spread** — novas props que nao existem no original sao adicionadas naturalmente no objeto novo, porque spread copia tudo e props extras estendem
4. **Remova propriedades com rest/destructuring** — `const { propToRemove, ...rest } = obj` extrai e descarta, porque delete muta o original
5. **Nomeie o resultado pelo que ele representa** — `updatedBook`, `bookWithoutCategory`, nao `newObj` ou `temp`, porque clareza > brevidade

## How to write

### Atualizar propriedades

```typescript
const updatedBook = {
  ...book,
  title: 'Criando front-end moderno com HTML',
  category: 'HTML',
}
// book original permanece intacto
```

### Adicionar propriedade nova

```typescript
const bookWithType = {
  ...book,
  type: 'programacao', // propriedade que nao existia no original
}
```

### Remover propriedade com rest

```typescript
const { category, ...bookWithoutCategory } = book
// bookWithoutCategory tem tudo exceto category
```

## Example

**Before (mutacao direta):**
```typescript
book.title = 'Novo titulo'
book.category = 'HTML'
delete book.category
```

**After (imutavel):**
```typescript
// Atualizar
const updatedBook = { ...book, title: 'Novo titulo', category: 'HTML' }

// Remover propriedade
const { category, ...bookWithoutCategory } = book
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Atualizar 1+ propriedades | Spread + override: `{ ...obj, key: value }` |
| Adicionar propriedade nova | Mesmo spread: `{ ...obj, newKey: value }` |
| Remover 1 propriedade | Destructuring rest: `const { key, ...rest } = obj` |
| Remover N propriedades | Destructuring rest: `const { a, b, ...rest } = obj` |
| Objeto aninhado | Spread em cada nivel: `{ ...obj, nested: { ...obj.nested, key: value } }` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `obj.prop = value` | `const updated = { ...obj, prop: value }` |
| `delete obj.prop` | `const { prop, ...rest } = obj` |
| `Object.assign(obj, changes)` | `const updated = { ...obj, ...changes }` |
| `obj['newProp'] = value` | `const updated = { ...obj, newProp: value }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes