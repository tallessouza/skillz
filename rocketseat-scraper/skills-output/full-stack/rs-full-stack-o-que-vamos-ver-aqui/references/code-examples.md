# Code Examples: Imutabilidade no JavaScript para React

## 1. Adicionar item

```typescript
// Array
const [todos, setTodos] = useState<Todo[]>([])

const addTodo = (text: string) => {
  const newTodo: Todo = { id: crypto.randomUUID(), text, done: false }
  setTodos(prev => [...prev, newTodo])
}

// Adicionar no inicio
setTodos(prev => [newTodo, ...prev])

// Adicionar em posicao especifica
setTodos(prev => [
  ...prev.slice(0, index),
  newTodo,
  ...prev.slice(index)
])
```

## 2. Remover item

```typescript
// Por id
setTodos(prev => prev.filter(todo => todo.id !== idToRemove))

// Por index
setTodos(prev => prev.filter((_, i) => i !== indexToRemove))

// Remover multiplos
const idsToRemove = new Set(['id1', 'id2'])
setTodos(prev => prev.filter(todo => !idsToRemove.has(todo.id)))
```

## 3. Atualizar item em array

```typescript
// Atualizar um campo
setTodos(prev =>
  prev.map(todo =>
    todo.id === targetId
      ? { ...todo, done: !todo.done }
      : todo
  )
)

// Atualizar multiplos campos
setTodos(prev =>
  prev.map(todo =>
    todo.id === targetId
      ? { ...todo, text: newText, updatedAt: new Date() }
      : todo
  )
)
```

## 4. Objetos aninhados

```typescript
interface User {
  name: string
  address: {
    city: string
    zip: string
  }
}

// Atualizar propriedade aninhada
setUser(prev => ({
  ...prev,
  address: {
    ...prev.address,
    city: 'Sao Paulo'
  }
}))
```

## 5. Ordenar sem mutar

```typescript
// ERRADO: sort muta o array
const sorted = items.sort((a, b) => a.name.localeCompare(b.name))

// CORRETO: cria copia antes de ordenar
const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name))

// ES2023: toSorted nao muta
const sorted = items.toSorted((a, b) => a.name.localeCompare(b.name))
```

## 6. Substituir item por index

```typescript
// Com map
setItems(prev => prev.map((item, i) => i === index ? newItem : item))

// Com toSpliced (ES2023)
setItems(prev => prev.toSpliced(index, 1, newItem))
```

## 7. Remover propriedade de objeto

```typescript
// Desestruturacao com rest
setConfig(prev => {
  const { deprecatedProp, ...rest } = prev
  return rest
})
```

## 8. Combinar arrays de state

```typescript
// Merge de dois arrays sem duplicatas (por id)
const mergeById = (existing: Item[], incoming: Item[]) => {
  const map = new Map(existing.map(item => [item.id, item]))
  incoming.forEach(item => map.set(item.id, item))
  return Array.from(map.values())
}

setItems(prev => mergeById(prev, newItems))
```