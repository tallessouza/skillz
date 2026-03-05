# Code Examples: Arquitetura de Software no Frontend

## Exemplo 1: Hierarquia de restricao na pratica

A aula nao traz codigo diretamente, mas o instrutor descreve o conceito com o diagrama de circulos concentricos. Aqui esta uma traducao pratica:

```
Decisao arquitetural: usar Next.js (App Router)
    │
    ├── Restringe: componentes devem ser React (funcional)
    ├── Restringe: roteamento segue convencao de pastas
    ├── Restringe: server/client components tem regras especificas
    │
    └── Decisao de design: como organizar dentro do Next
        │
        ├── Organizar por feature ou por tipo?
        ├── Onde colocar logica de negocio?
        ├── Como separar data fetching de apresentacao?
        │
        └── Codigo: implementacao concreta
            ├── Componentes com props tipadas
            ├── Hooks customizados
            └── Services/adapters
```

## Exemplo 2: Dependency Inversion — comparacao

### Sem inversao (alto acoplamento)

```typescript
// UserList.tsx importa diretamente a API
import { fetchUsers, deleteUser } from '@/services/userApi'

function UserList() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers().then(setUsers) // acoplado diretamente
  }, [])

  const handleDelete = (id: string) => {
    deleteUser(id) // acoplado diretamente
  }

  return users.map(user => (
    <button onClick={() => handleDelete(user.id)}>{user.name}</button>
  ))
}
```

**Problema:** Para testar, voce precisa mockar `@/services/userApi`. O componente esta acoplado a uma implementacao especifica.

### Com inversao (baixo acoplamento)

```typescript
// UserList.tsx recebe tudo via props
interface UserListProps {
  users: User[]
  onDelete: (id: string) => Promise<void>
}

function UserList({ users, onDelete }: UserListProps) {
  return users.map(user => (
    <button onClick={() => onDelete(user.id)}>{user.name}</button>
  ))
}
```

```typescript
// Uso em producao — quem chama decide a implementacao
import { fetchUsers, deleteUser } from '@/services/userApi'

function UsersPage() {
  const [users, setUsers] = useState([])
  useEffect(() => { fetchUsers().then(setUsers) }, [])

  return <UserList users={users} onDelete={deleteUser} />
}
```

```typescript
// Uso em teste — sem mock, passa implementacao fake
test('renderiza lista de usuarios', () => {
  const fakeUsers = [{ id: '1', name: 'Ana' }]
  const fakeDelete = vi.fn()

  render(<UserList users={fakeUsers} onDelete={fakeDelete} />)

  expect(screen.getByText('Ana')).toBeInTheDocument()
})
```

## Exemplo 3: Alta coesao — organizacao por feature

### Baixa coesao (organizacao por tipo)

```
src/
  components/
    UserList.tsx
    ProductList.tsx
    OrderCard.tsx
  hooks/
    useUsers.ts
    useProducts.ts
    useOrders.ts
  services/
    userService.ts
    productService.ts
    orderService.ts
```

**Problema:** Para trabalhar no dominio "users", voce precisa navegar tres pastas diferentes. Codigo relacionado esta espalhado.

### Alta coesao (organizacao por dominio)

```
src/
  features/
    users/
      UserList.tsx
      useUsers.ts
      userService.ts
      UserList.test.tsx
    products/
      ProductList.tsx
      useProducts.ts
      productService.ts
    orders/
      OrderCard.tsx
      useOrders.ts
      orderService.ts
```

**Vantagem:** Tudo sobre "users" esta junto. Alta coesao dentro do modulo, baixo acoplamento entre modulos.

## Exemplo 4: Open/Closed Principle em componentes React

### Fechado para extensao (violacao OCP)

```typescript
function Alert({ type }: { type: 'success' | 'error' | 'warning' }) {
  // Toda vez que precisa de um novo tipo, modifica este componente
  if (type === 'success') return <div className="green">...</div>
  if (type === 'error') return <div className="red">...</div>
  if (type === 'warning') return <div className="yellow">...</div>
}
```

### Aberto para extensao (seguindo OCP)

```typescript
interface AlertProps {
  icon: ReactNode
  className: string
  children: ReactNode
}

function Alert({ icon, className, children }: AlertProps) {
  return (
    <div className={className}>
      {icon}
      {children}
    </div>
  )
}

// Extensao sem modificacao do componente base
function SuccessAlert({ children }: { children: ReactNode }) {
  return <Alert icon={<CheckIcon />} className="green">{children}</Alert>
}
```

## Exemplo 5: Single Responsibility — separando responsabilidades

### Multiplas responsabilidades (violacao SRP)

```typescript
function UserDashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(data => { setUsers(data); setLoading(false) })
  }, [])

  const activeUsers = users.filter(u => u.active)
  const csvExport = activeUsers.map(u => `${u.name},${u.email}`).join('\n')

  // Este componente: busca dados, filtra, exporta CSV, e renderiza
  return (...)
}
```

### Responsabilidade unica

```typescript
// Hook: responsavel por buscar dados
function useUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(data => { setUsers(data); setLoading(false) })
  }, [])

  return { users, loading }
}

// Funcao pura: responsavel por filtrar
function getActiveUsers(users: User[]) {
  return users.filter(u => u.active)
}

// Componente: responsavel apenas por renderizar
function UserDashboard() {
  const { users, loading } = useUsers()
  const activeUsers = getActiveUsers(users)

  return (...)
}
```