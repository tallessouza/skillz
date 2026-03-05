# Code Examples: Desacoplando Componentes React

## Exemplo completo da aula: Homepage de Todo App

### Antes (tudo em um componente)

```tsx
function App() {
  // Logica do footer — usada SOMENTE la embaixo
  const currentYear = new Date().getFullYear()

  // Logica da todo list
  const [todos, setTodos] = useState<string[]>([])
  const [newTodo, setNewTodo] = useState('')

  function handleAddTodo() {
    setTodos(prev => [...prev, newTodo])
    setNewTodo('')
  }

  return (
    <>
      <header>
        <h1>My New Innovative Revolutionary Todo List App</h1>
      </header>

      <main>
        <section>
          <h2>Advantages</h2>
          <div>
            <h3>Blazing Fast</h3>
            <p>Very fast</p>
          </div>
          <div>
            <h3>Clean and Flat Design</h3>
            <p>With no CSS</p>
          </div>
        </section>

        <section>
          <h2>Todo List</h2>
          <input
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
          />
          <button onClick={handleAddTodo}>Add</button>
          <ul>
            {todos.map(todo => <li key={todo}>{todo}</li>)}
          </ul>
        </section>
      </main>

      <footer>
        <p>© {currentYear} My Todo App</p>
      </footer>
    </>
  )
}
```

### Depois (logica isolada em componentes proprios)

```tsx
// Footer.tsx
function Footer() {
  const currentYear = new Date().getFullYear() // logica movida para ca
  return (
    <footer>
      <p>© {currentYear} My Todo App</p>
    </footer>
  )
}

// Header.tsx
function Header() {
  return (
    <header>
      <h1>My New Innovative Revolutionary Todo List App</h1>
    </header>
  )
}

// App.tsx — mantem apenas logica que pertence ao componente inteiro
function App() {
  const [todos, setTodos] = useState<string[]>([])
  const [newTodo, setNewTodo] = useState('')

  function handleAddTodo() {
    setTodos(prev => [...prev, newTodo])
    setNewTodo('')
  }

  return (
    <>
      <Header />
      <main>
        <section>
          <h2>Advantages</h2>
          {/* HTML repetido sem logica — OK manter inline */}
          <div>
            <h3>Blazing Fast</h3>
            <p>Very fast</p>
          </div>
          <div>
            <h3>Clean and Flat Design</h3>
            <p>With no CSS</p>
          </div>
        </section>

        <section>
          <h2>Todo List</h2>
          <input
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
          />
          <button onClick={handleAddTodo}>Add</button>
          <ul>
            {todos.map(todo => <li key={todo}>{todo}</li>)}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  )
}
```

## Checklist rapido para decidir

```
Para cada variavel/funcao/hook antes do return, pergunte:
  → Essa logica e usada por TODO o componente? → Mantenha aqui
  → Essa logica e usada por UMA PARTE da interface? → Extraia para subcomponente

Para HTML repetido:
  → Tem logica (estado, handlers, hooks) associada? → Extraia
  → E puramente visual, sem logica? → Pode manter inline
```