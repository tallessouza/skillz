# Code Examples: Funcoes e Eventos no React

## Exemplo 1: Todo App (do transcript)

### Componente Header (filho)

```tsx
interface HeaderProps {
  onCreateNewTodo: (title: string) => void
}

function Header({ onCreateNewTodo }: HeaderProps) {
  const [title, setTitle] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onCreateNewTodo(title)
    setTitle('')
  }

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={handleTitleChange} />
      <button type="submit">Add</button>
    </form>
  )
}
```

### Componente App (pai)

```tsx
function App() {
  const [todos, setTodos] = useState<Todo[]>([])

  function handleCreateNewTodo(title: string) {
    setTodos(prev => [...prev, { id: crypto.randomUUID(), title }])
  }

  return <Header onCreateNewTodo={handleCreateNewTodo} />
}
```

## Exemplo 2: Multiplos eventos no mesmo componente

```tsx
interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  function handleToggle() {
    onToggle(todo.id)
  }

  function handleDelete() {
    onDelete(todo.id)
  }

  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
      />
      <span>{todo.title}</span>
      <button onClick={handleDelete}>Remove</button>
    </li>
  )
}
```

## Exemplo 3: Distinguindo handle de funcoes auxiliares

```tsx
function OrderSummary({ items, onConfirmOrder }: OrderSummaryProps) {
  // Funcao auxiliar — sem prefixo (nao e evento)
  function calculateTotal(items: Item[]) {
    return items.reduce((sum, item) => sum + item.priceInCents, 0)
  }

  // Funcao auxiliar — sem prefixo
  function formatCurrency(valueInCents: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valueInCents / 100)
  }

  // Funcao de evento — com handle
  function handleConfirmClick() {
    const total = calculateTotal(items)
    onConfirmOrder({ items, totalInCents: total })
  }

  return (
    <div>
      <p>Total: {formatCurrency(calculateTotal(items))}</p>
      <button onClick={handleConfirmClick}>Confirm</button>
    </div>
  )
}
```

## Exemplo 4: Componente com varios niveis

```tsx
// Nivel 3 — Input
interface SearchInputProps {
  onSearch: (query: string) => void
}

function SearchInput({ onSearch }: SearchInputProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onSearch(event.target.value)
  }

  return <input onChange={handleChange} placeholder="Search..." />
}

// Nivel 2 — Toolbar
interface ToolbarProps {
  onSearch: (query: string) => void
  onFilter: (filter: string) => void
}

function Toolbar({ onSearch, onFilter }: ToolbarProps) {
  function handleFilterSelect(event: ChangeEvent<HTMLSelectElement>) {
    onFilter(event.target.value)
  }

  return (
    <div>
      <SearchInput onSearch={onSearch} />
      <select onChange={handleFilterSelect}>
        <option value="all">All</option>
        <option value="active">Active</option>
      </select>
    </div>
  )
}

// Nivel 1 — Page
function UsersPage() {
  function handleSearch(query: string) {
    // filtra usuarios
  }

  function handleFilter(filter: string) {
    // aplica filtro
  }

  return <Toolbar onSearch={handleSearch} onFilter={handleFilter} />
}
```