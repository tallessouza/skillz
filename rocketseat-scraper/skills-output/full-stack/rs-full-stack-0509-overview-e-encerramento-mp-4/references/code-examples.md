# Code Examples: Conectando React com API Node.js

## 1. Configuracao centralizada da API

```typescript
// src/services/api.ts
import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3333",
})

// Interceptor para enviar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@app:token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { api }
```

## 2. Cadastro com validacoes

```typescript
// src/pages/sign-up.tsx
async function handleSignUp(event: FormEvent) {
  event.preventDefault()

  if (!name || !email || !password) {
    alert("Preencha todos os campos")
    return
  }

  if (password.length < 6) {
    alert("Senha deve ter pelo menos 6 digitos")
    return
  }

  if (password !== confirmPassword) {
    alert("Senhas nao conferem")
    return
  }

  try {
    await api.post("/users", { name, email, password })
    alert("Conta criada com sucesso!")
    navigate("/sign-in")
  } catch (error) {
    alert("Erro ao criar conta")
  }
}
```

## 3. Login e armazenamento de token

```typescript
// src/pages/sign-in.tsx
async function handleSignIn(event: FormEvent) {
  event.preventDefault()

  try {
    const response = await api.post("/sessions", { email, password })
    const { token, user } = response.data

    localStorage.setItem("@app:token", token)
    setUser(user) // Context API
    navigate("/dashboard")
  } catch (error) {
    alert("Email ou senha incorretos")
  }
}
```

## 4. Context de autenticacao

```typescript
// src/contexts/auth-context.tsx
interface AuthContextData {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  function signOut() {
    localStorage.removeItem("@app:token")
    setUser(null)
    // Redireciona automaticamente para login
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
```

## 5. Rotas separadas por perfil

```typescript
// src/routes/index.tsx
export function Routes() {
  const { user } = useAuth()

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    )
  }

  // Rota baseada no perfil do usuario
  if (user.role === "manager") {
    return <ManagerRoutes />
  }

  return <EmployeeRoutes />
}
```

## 6. Listagem com paginacao e busca

```typescript
// src/pages/dashboard/index.tsx
const PER_PAGE = 3

export function Dashboard() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [refunds, setRefunds] = useState<Refund[]>([])
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    async function loadRefunds() {
      const response = await api.get("/refunds", {
        params: { page, perPage: PER_PAGE, search },
      })
      setRefunds(response.data.refunds)
      setTotalPages(response.data.totalPages)
    }
    loadRefunds()
  }, [page, search])

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1) // Volta para primeira pagina ao buscar
  }

  function handleNextPage() {
    if (page < totalPages) setPage(page + 1)
  }

  function handlePreviousPage() {
    if (page > 1) setPage(page - 1)
  }

  return (
    <>
      <input
        type="text"
        placeholder="Pesquisar"
        onChange={(e) => handleSearch(e.target.value)}
      />
      {refunds.map((refund) => (
        <RefundItem key={refund.id} data={refund} />
      ))}
      <Pagination
        page={page}
        totalPages={totalPages}
        onNext={handleNextPage}
        onPrevious={handlePreviousPage}
      />
    </>
  )
}
```

## 7. Criacao de solicitacao com upload

```typescript
// src/pages/employee/new-refund.tsx
async function handleSubmit(event: FormEvent) {
  event.preventDefault()

  const formData = new FormData()
  formData.append("category", category)
  formData.append("description", description)
  formData.append("amount", String(amountInCents))

  if (file) {
    formData.append("receipt", file)
  }

  try {
    await api.post("/refunds", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    alert("Solicitacao enviada!")
  } catch (error) {
    alert("Erro ao enviar solicitacao")
  }
}
```

## 8. Detalhes recuperando ID da URL

```typescript
// src/pages/dashboard/refund-details.tsx
import { useParams } from "react-router-dom"

export function RefundDetails() {
  const { id } = useParams<{ id: string }>()
  const [refund, setRefund] = useState<Refund | null>(null)

  useEffect(() => {
    async function loadRefund() {
      const response = await api.get(`/refunds/${id}`)
      setRefund(response.data)
    }
    loadRefund()
  }, [id])

  function handleOpenReceipt() {
    if (refund?.receiptUrl) {
      window.open(refund.receiptUrl, "_blank")
    }
  }

  return (
    <>
      <h1>Detalhes da solicitacao</h1>
      {refund && (
        <>
          <p>Categoria: {refund.category}</p>
          <p>Valor: {formatCurrency(refund.amount)}</p>
          <button onClick={handleOpenReceipt}>Abrir comprovante</button>
        </>
      )}
      <button onClick={() => navigate(-1)}>Voltar</button>
    </>
  )
}
```

## 9. Testando API no navegador (dica do instrutor)

```
# O navegador executa GET por padrao
# Cole diretamente na barra de endereco:

https://api.github.com/repos/rodrigo/helpdesk

# Retorna JSON com informacoes do repositorio
# Util para testar endpoints GET rapidamente sem ferramentas extras
```

## Variacoes

### Usando fetch nativo ao inves de axios

```typescript
const response = await fetch("http://localhost:3333/refunds?page=1&perPage=3")
const data = await response.json()
```

### Usando SWR ou React Query para cache

```typescript
import useSWR from "swr"

const fetcher = (url: string) => api.get(url).then((res) => res.data)

function Dashboard() {
  const { data, error } = useSWR(`/refunds?page=${page}`, fetcher)
}
```