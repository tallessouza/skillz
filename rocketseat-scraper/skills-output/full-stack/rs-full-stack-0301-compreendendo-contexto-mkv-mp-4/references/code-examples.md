# Code Examples: Context vs Prop Drilling

## Exemplo 1: Prop Drilling (o anti-pattern)

O cenario do instrutor: Login → Home → Profile, passando dados do usuario.

```tsx
// Prop Drilling — NAO RECOMENDADO

// Login.tsx
function Login() {
  const [userName, setUserName] = useState('')

  async function handleLogin() {
    const response = await api.post('/sessions', { email, password })
    setUserName(response.data.user.name)
  }

  // Passa nome como prop para Home
  return <Home userName={userName} />
}

// Home.tsx — recebe prop so para repassar
function Home({ userName }: { userName: string }) {
  return (
    <div>
      <h1>Ola, {userName}</h1>
      {/* Repassa para Profile — Prop Drilling */}
      <Profile userName={userName} />
    </div>
  )
}

// Profile.tsx — finalmente usa o dado
function Profile({ userName }: { userName: string }) {
  return <input defaultValue={userName} />
}
```

**Problemas visíveis:**
- `Home` recebe `userName` apenas para repassar a `Profile`
- Se adicionarmos mais dados (email, avatar), cada componente intermediario acumula props

## Exemplo 2: Context (a solucao)

```tsx
// contexts/UserContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  name: string
  email: string
}

interface UserContextData {
  user: User | null
  saveUser: (user: User) => void
}

const UserContext = createContext({} as UserContextData)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  function saveUser(userData: User) {
    setUser(userData)
  }

  return (
    <UserContext.Provider value={{ user, saveUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
```

```tsx
// App.tsx — envolve os componentes que precisam de acesso
import { UserProvider } from './contexts/UserContext'

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </UserProvider>
  )
}
```

```tsx
// Login.tsx — salva no contexto
import { useUser } from '../contexts/UserContext'

function Login() {
  const { saveUser } = useUser()

  async function handleLogin() {
    const response = await api.post('/sessions', { email, password })
    saveUser(response.data.user)
  }

  return <button onClick={handleLogin}>Entrar</button>
}
```

```tsx
// Home.tsx — acessa direto do contexto, sem receber props
import { useUser } from '../contexts/UserContext'

function Home() {
  const { user } = useUser()

  return <h1>Ola, {user?.name}</h1>
}
```

```tsx
// Profile.tsx — acessa direto do contexto, sem depender de Home
import { useUser } from '../contexts/UserContext'

function Profile() {
  const { user } = useUser()

  return <input defaultValue={user?.name} />
}
```

**Beneficios visíveis:**
- `Home` nao recebe nem repassa props de usuario
- `Profile` acessa dados independentemente — nao depende de `Home`
- Adicionar `email`, `avatar` nao exige mudancas em componentes intermediarios

## Exemplo 3: Multiplos contextos (separacao por dominio)

```tsx
// App.tsx
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <Routes />
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
```

Cada contexto gerencia seu proprio dominio. Componentes consomem apenas o que precisam:

```tsx
function Header() {
  const { user } = useAuth()       // so auth
  const { theme } = useTheme()     // so tema
  // nao precisa de cart aqui
}

function Checkout() {
  const { items } = useCart()       // so carrinho
  const { user } = useAuth()       // so auth
  // nao precisa de tema aqui
}
```

## Exemplo 4: Padrao completo de criacao de contexto

```tsx
// 1. Criar o contexto com tipagem
const MyContext = createContext({} as MyContextData)

// 2. Criar o Provider com estado
export function MyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialValue)

  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  )
}

// 3. Criar o hook customizado para consumo
export function useMyContext() {
  const context = useContext(MyContext)
  if (!context) {
    throw new Error('useMyContext must be used within MyProvider')
  }
  return context
}

// 4. Envolver componentes no App
<MyProvider>
  <ComponenteA />
  <ComponenteB />
</MyProvider>

// 5. Consumir em qualquer componente filho
function ComponenteB() {
  const { state } = useMyContext()
  return <div>{state}</div>
}
```