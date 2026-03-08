# Code Examples: useEffect e useState

## Exemplo 1: Estrutura basica do useEffect (da aula)

```tsx
useEffect(() => {
  searchByName(name)
}, [name])
```

**Explicacao passo a passo:**
- `useEffect(callback, deps)` — recebe uma funcao e um array de dependencias
- `searchByName(name)` — logica executada quando `name` muda
- `[name]` — o useEffect re-executa sempre que `name` mudar

## Exemplo 2: useState basico (da aula)

```tsx
const [name, setName] = useState("")
```

**Explicacao:**
- `""` — valor inicial (string vazia)
- `name` — o estado atual (somente leitura)
- `setName` — funcao para atualizar o estado

## Exemplo 3: Filtro de produtos por categoria (cenario da aula)

```tsx
function ProductList() {
  const [category, setCategory] = useState("tenis")
  const [products, setProducts] = useState([])

  useEffect(() => {
    async function loadProducts() {
      const response = await fetch(`/api/products?category=${category}`)
      const filteredProducts = await response.json()
      setProducts(filteredProducts)
    }
    loadProducts()
  }, [category])

  return (
    <div>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="tenis">Tênis</option>
        <option value="camisetas">Camisetas</option>
        <option value="calcas">Calças</option>
      </select>

      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

**Fluxo completo:**
1. Componente monta com `category = "tenis"`
2. useEffect dispara, carrega produtos de tenis
3. Usuario seleciona "camisetas"
4. `setCategory("camisetas")` atualiza o estado
5. useEffect detecta mudanca em `category`, re-executa
6. Nova lista de produtos e carregada e exibida

## Exemplo 4: useEffect executando apenas na montagem

```tsx
function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    async function loadStats() {
      const response = await fetch("/api/stats")
      const dashboardStats = await response.json()
      setStats(dashboardStats)
    }
    loadStats()
  }, []) // Array vazio = executa uma vez

  if (!stats) return <p>Carregando...</p>

  return <div>{stats.totalUsers} usuarios</div>
}
```

## Exemplo 5: Multiplos estados + useEffect combinados

```tsx
function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (query.length < 3) {
      setResults([])
      return
    }

    async function search() {
      setIsLoading(true)
      const response = await fetch(`/api/search?q=${query}`)
      const searchResults = await response.json()
      setResults(searchResults)
      setIsLoading(false)
    }
    search()
  }, [query])

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar..."
      />
      {isLoading && <p>Buscando...</p>}
      <ul>
        {results.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Exemplo 6: ERRADO — async direto no useEffect

```tsx
// NAO faca isso:
useEffect(async () => {
  const data = await fetchData()
  setData(data)
}, [])
// React espera void ou cleanup function, nao Promise
```

```tsx
// Faca isso:
useEffect(() => {
  async function loadData() {
    const data = await fetchData()
    setData(data)
  }
  loadData()
}, [])
```

## Exemplo 7: ERRADO — mutar estado diretamente

```tsx
const [items, setItems] = useState(["a", "b"])

// NAO faca isso:
items.push("c") // Mutacao direta, React nao detecta mudanca

// Faca isso:
setItems([...items, "c"]) // Novo array, React detecta e re-renderiza
```

## Exemplo 8: useEffect com multiplas dependencias

```tsx
function FilteredList() {
  const [category, setCategory] = useState("all")
  const [sortOrder, setSortOrder] = useState("asc")
  const [items, setItems] = useState([])

  useEffect(() => {
    async function loadItems() {
      const response = await fetch(
        `/api/items?category=${category}&sort=${sortOrder}`
      )
      const filteredItems = await response.json()
      setItems(filteredItems)
    }
    loadItems()
  }, [category, sortOrder]) // Dispara quando QUALQUER um dos dois muda

  return (
    <div>
      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="all">Todas</option>
        <option value="eletronicos">Eletrônicos</option>
      </select>
      <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
        Ordenar: {sortOrder}
      </button>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  )
}
```