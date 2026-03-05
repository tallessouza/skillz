---
name: rs-full-stack-o-que-vamos-ver-aqui
description: "Enforces immutability principles when writing JavaScript/TypeScript code for React applications. Use when user asks to 'update state', 'modify an array', 'change object properties', 'manage React state', or any state manipulation task. Applies rules: never mutate original data, always create new references, use spread/map/filter instead of push/splice. Make sure to use this skill whenever generating React state logic or transforming data structures. Not for backend-only code, database operations, or non-React vanilla JS where mutation is acceptable."
---

# Imutabilidade no JavaScript para React

> Nunca modifique dados originais — sempre crie novas referencias com os valores atualizados.

## Conceito central

Imutabilidade significa que, uma vez criado, um valor nao deve ser alterado diretamente. Em vez de modificar o objeto/array original, crie uma copia com as mudancas aplicadas. React depende disso para detectar mudancas de estado e re-renderizar componentes.

## Rules

1. **Nunca mute state diretamente** — use `setState` ou `setX` com novo valor, porque React compara referencias para decidir re-render
2. **Nunca use metodos mutaveis em state** — proibido `push`, `splice`, `sort` (in-place), `pop`, `shift` no state, porque alteram o array original sem criar nova referencia
3. **Sempre crie nova referencia** — use spread `[...arr]`, `{...obj}`, `map`, `filter`, porque React so detecta mudanca quando a referencia muda
4. **Trate dados como somente-leitura** — ao receber props ou state, nunca modifique o valor recebido, porque pode causar bugs silenciosos em outros componentes

## How to write

### Adicionar item a array no state

```typescript
// Cria novo array com spread + novo item
setUsers(prevUsers => [...prevUsers, newUser])
```

### Remover item de array no state

```typescript
// Cria novo array filtrando o item removido
setUsers(prevUsers => prevUsers.filter(user => user.id !== userIdToRemove))
```

### Atualizar propriedade de objeto no state

```typescript
// Cria novo objeto com spread + propriedade sobrescrita
setUser(prevUser => ({ ...prevUser, name: 'Novo Nome' }))
```

## Example

**Before (mutavel — bug no React):**
```typescript
const [items, setItems] = useState(['a', 'b'])

function addItem(newItem) {
  items.push(newItem) // Muta o array original
  setItems(items)     // Mesma referencia — React ignora
}
```

**After (imutavel — correto):**
```typescript
const [items, setItems] = useState(['a', 'b'])

function addItem(newItem) {
  setItems(prevItems => [...prevItems, newItem]) // Nova referencia
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Adicionar ao array | `[...array, novoItem]` |
| Remover do array | `array.filter(item => item.id !== id)` |
| Atualizar item no array | `array.map(item => item.id === id ? { ...item, changes } : item)` |
| Atualizar propriedade de objeto | `{ ...objeto, prop: novoValor }` |
| Ordenar array | `[...array].sort(compareFn)` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `state.push(item)` | `setState(prev => [...prev, item])` |
| `state[0] = newVal` | `setState(prev => prev.map((v, i) => i === 0 ? newVal : v))` |
| `state.splice(i, 1)` | `setState(prev => prev.filter((_, idx) => idx !== i))` |
| `state.sort()` | `setState(prev => [...prev].sort())` |
| `state.name = 'x'` | `setState(prev => ({ ...prev, name: 'x' }))` |
| `delete state.prop` | `setState(({ prop, ...rest }) => rest)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que React exige imutabilidade
- [code-examples.md](references/code-examples.md) — Todos os padroes de imutabilidade expandidos com variacoes