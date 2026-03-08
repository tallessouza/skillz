# Code Examples: Estados e Renderizações no React

## Estado vs Variável comum

### Variável comum — NÃO atualiza a tela

```tsx
function Counter() {
  let count = 0

  function handleClick() {
    count = count + 1
    console.log(count) // valor muda no console, mas...
  }

  // A tela NUNCA mostra o valor atualizado
  // porque mudar 'let' não aciona re-renderização
  return (
    <div>
      <p>Contagem: {count}</p>
      <button onClick={handleClick}>Incrementar</button>
    </div>
  )
}
```

### Estado — ATUALIZA a tela

```tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1) // aciona o ciclo: trigger → render → commit
  }

  // A tela ATUALIZA porque setCount aciona re-renderização
  return (
    <div>
      <p>Contagem: {count}</p>
      <button onClick={handleClick}>Incrementar</button>
    </div>
  )
}
```

## Ciclo de renderização em ação

### Renderização inicial

```tsx
// Quando o App é montado pela primeira vez:
// 1. TRIGGER: renderização inicial
// 2. RENDER: React chama App() → chama Header() → chama Main() → chama Footer()
// 3. COMMIT: React cria todos os nós na DOM real

function App() {
  return (
    <div>
      <Header />
      <Main />
      <Footer />
    </div>
  )
}
```

### Re-renderização por mudança de estado

```tsx
function ProductCard({ name, basePrice }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)

  // Quando setQuantity é chamado:
  // 1. TRIGGER: estado 'quantity' mudou
  // 2. RENDER: React chama ProductCard() novamente com novo quantity
  //    → Compara DOM virtual nova com a anterior
  // 3. COMMIT: React atualiza APENAS os nós que mudaram
  //    (o <span> com total e o <span> com quantity)

  const total = basePrice * quantity

  return (
    <div>
      <h2>{name}</h2>                          {/* NÃO muda — React não toca */}
      <p>Preço: R$ {basePrice}</p>             {/* NÃO muda — React não toca */}
      <p>Quantidade: <span>{quantity}</span></p> {/* MUDA — React atualiza */}
      <p>Total: <span>R$ {total}</span></p>      {/* MUDA — React atualiza */}
      <button onClick={() => setQuantity(quantity + 1)}>
        Adicionar
      </button>
    </div>
  )
}
```

## Re-renderização recursiva (componentes aninhados)

```tsx
function Parent() {
  const [theme, setTheme] = useState('light')

  // Quando theme muda:
  // 1. Parent re-renderiza
  // 2. Child re-renderiza (recebe nova prop)
  // 3. GrandChild re-renderiza (recursivo)
  // React compara cada nível e só atualiza a DOM onde houve diferença

  return (
    <div className={theme}>
      <Child theme={theme} />
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Trocar tema
      </button>
    </div>
  )
}

function Child({ theme }: { theme: string }) {
  return (
    <div>
      <p>Tema atual: {theme}</p>
      <GrandChild />
    </div>
  )
}

function GrandChild() {
  // Este componente NÃO depende do tema
  // React renderiza (etapa 2) mas na comparação (etapa 3)
  // percebe que nada mudou e NÃO toca na DOM real
  return <p>Eu não mudo</p>
}
```

## DOM Virtual vs DOM Real — visualizando a comparação

```tsx
function UserStatus({ userId }: { userId: string }) {
  const [isOnline, setIsOnline] = useState(false)

  // Estado anterior (DOM virtual antiga):
  // <div>
  //   <span class="status offline">Offline</span>
  //   <span>user-123</span>
  // </div>

  // Após setIsOnline(true), novo render (DOM virtual nova):
  // <div>
  //   <span class="status online">Online</span>    ← MUDOU (class + texto)
  //   <span>user-123</span>                         ← NÃO mudou
  // </div>

  // COMMIT: React só atualiza o primeiro <span>

  return (
    <div>
      <span className={`status ${isOnline ? 'online' : 'offline'}`}>
        {isOnline ? 'Online' : 'Offline'}
      </span>
      <span>{userId}</span>
    </div>
  )
}
```

## Padrão: múltiplos estados no mesmo componente

```tsx
function RegistrationForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Cada setState aciona uma re-renderização independente
  // React pode agrupar (batch) múltiplas atualizações de estado
  // em uma única re-renderização para performance

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsSubmitting(true) // trigger re-render → desabilita botão

    await registerUser({ name, email })

    setIsSubmitting(false) // trigger re-render → habilita botão
    setName('')            // estes 3 setStates podem ser
    setEmail('')           // agrupados em uma única re-renderização
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Cadastrar'}
      </button>
    </form>
  )
}
```