# Code Examples: Componentes Puros

## Exemplo 1: Todo List (do transcript)

### Versao acoplada (ERRADA para desacoplamento)

```typescript
// App.tsx
function App() {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    // carrega todos do backend
    api.get('/todos').then(res => setTodos(res.data))
  }, [])

  return (
    <div>
      <Header /> {/* Header tem createTodo embutido */}
      <TodoList todos={todos} />
    </div>
  )
}

// Header.tsx — IMPURO: depende de contexto externo
function Header() {
  async function createTodo() {
    const response = await api.post('/todos', { title: 'Novo' })
    // Como atualizar o estado do App daqui?
    // Precisa de context, prop drilling, ou estado global
    // = acoplamento
  }

  return (
    <header>
      <button onClick={createTodo}>Adicionar Todo</button>
    </header>
  )
}
```

### Versao pura (CORRETA)

```typescript
// App.tsx
function App() {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    api.get('/todos').then(res => setTodos(res.data))
  }, [])

  async function createTodo() {
    const response = await api.post('/todos', { title: 'Novo' })
    setTodos(prev => [...prev, response.data])
  }

  return (
    <div>
      <Header onCreateNewTodo={createTodo} />
      <TodoList todos={todos} />
    </div>
  )
}

// Header.tsx — PURO: so depende das props
interface HeaderProps {
  onCreateNewTodo: () => void
}

function Header({ onCreateNewTodo }: HeaderProps) {
  return (
    <header>
      <button onClick={onCreateNewTodo}>Adicionar Todo</button>
    </header>
  )
}
```

## Exemplo 2: Formulario de busca

### Impuro

```typescript
function SearchBar() {
  const [results, setResults] = useState([])

  async function handleSearch(query: string) {
    const response = await api.get(`/search?q=${query}`)
    setResults(response.data)
    // results fica preso aqui dentro
  }

  return <input onChange={e => handleSearch(e.target.value)} />
}
```

### Puro

```typescript
interface SearchBarProps {
  onSearch: (query: string) => void
}

function SearchBar({ onSearch }: SearchBarProps) {
  return <input onChange={e => onSearch(e.target.value)} />
}
```

## Exemplo 3: Modal de confirmacao

### Impuro

```typescript
function DeleteModal({ itemId }: { itemId: string }) {
  async function handleConfirm() {
    await api.delete(`/items/${itemId}`)
    window.location.reload() // side effect pesado
  }

  return (
    <div>
      <p>Tem certeza?</p>
      <button onClick={handleConfirm}>Deletar</button>
    </div>
  )
}
```

### Puro

```typescript
interface DeleteModalProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

function DeleteModal({ message, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div>
      <p>{message}</p>
      <button onClick={onConfirm}>Confirmar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  )
}
```

## Exemplo 4: Card com acao

### Impuro

```typescript
function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCartContext() // depende de contexto

  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => addToCart(product)}>Comprar</button>
    </div>
  )
}
```

### Puro

```typescript
interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => onAddToCart(product)}>Comprar</button>
    </div>
  )
}
```

## Padrao: como identificar se precisa purificar

```
Checklist rapido:
1. O componente importa useContext? → Candidato a purificacao
2. O componente faz fetch/chamada API? → Mova para o pai
3. O componente muta estado que nao e dele? → Receba callback via prop
4. O componente pode ser movido para outra pagina? → Se nao, purifique
```