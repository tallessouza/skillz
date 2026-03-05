# Code Examples: Utilitários do TypeScript

## Partial — todos os campos opcionais

```typescript
interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
}

// Update parcial — so envia os campos que mudaram
function updateProduct(id: string, changes: Partial<Product>) {
  return db.products.update({ where: { id }, data: changes })
}

// Uso:
updateProduct('abc', { price: 29.90 })  // OK — so atualiza preco
updateProduct('abc', { name: 'Novo Nome', category: 'eletronicos' })  // OK
```

## Required — todos os campos obrigatorios

```typescript
interface FormData {
  name?: string
  email?: string
  phone?: string
}

// Na submissao, todos devem estar preenchidos
function submitForm(data: Required<FormData>) {
  // Aqui name, email e phone sao obrigatorios
  sendToAPI(data)
}
```

## Pick — selecionar campos especificos

```typescript
interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'shipped' | 'delivered'
  createdAt: Date
  updatedAt: Date
  internalNotes: string
}

// Card de listagem — so precisa de alguns campos
type OrderCard = Pick<Order, 'id' | 'total' | 'status' | 'createdAt'>

// Componente React
function OrderCardComponent({ order }: { order: OrderCard }) {
  return (
    <div>
      <span>{order.id}</span>
      <span>R$ {order.total}</span>
      <span>{order.status}</span>
    </div>
  )
}
```

## Omit — remover campos especificos

```typescript
interface User {
  id: string
  name: string
  email: string
  password: string
  salt: string
  loginAttempts: number
}

// API response — sem dados sensiveis
type PublicUser = Omit<User, 'password' | 'salt' | 'loginAttempts'>

// Criacao — sem id (gerado pelo banco)
type CreateUserInput = Omit<User, 'id' | 'salt' | 'loginAttempts'>
```

## Record — mapas tipados

```typescript
// Permissoes por role
type Role = 'admin' | 'editor' | 'viewer'
type Permission = 'read' | 'write' | 'delete'

const rolePermissions: Record<Role, Permission[]> = {
  admin: ['read', 'write', 'delete'],
  editor: ['read', 'write'],
  viewer: ['read'],
}

// Cache tipado
type EntityCache = Record<string, { data: unknown; expiresAt: number }>
```

## Readonly — imutabilidade

```typescript
interface AppConfig {
  port: number
  host: string
  database: {
    url: string
    pool: number
  }
}

const config: Readonly<AppConfig> = {
  port: 3000,
  host: 'localhost',
  database: { url: 'postgres://...', pool: 10 },
}

// config.port = 4000  // Error: Cannot assign to 'port' because it is a read-only property
// Nota: Readonly e shallow — config.database.pool = 20 ainda funciona
// Para deep readonly, use bibliotecas ou type recursivo
```

## ReturnType e Parameters

```typescript
function createOrder(userId: string, items: CartItem[], coupon?: string) {
  const order = { id: generateId(), userId, items, total: calculateTotal(items, coupon) }
  return order
}

type OrderResult = ReturnType<typeof createOrder>
type CreateOrderArgs = Parameters<typeof createOrder>
// CreateOrderArgs = [string, CartItem[], string?]

// Util para wrappers:
function loggedCreateOrder(...args: Parameters<typeof createOrder>) {
  console.log('Creating order for user:', args[0])
  return createOrder(...args)
}
```

## Awaited — desembrulhar Promises

```typescript
async function fetchDashboardData() {
  const [users, orders, revenue] = await Promise.all([
    fetchUsers(),
    fetchOrders(),
    fetchRevenue(),
  ])
  return { users, orders, revenue }
}

type DashboardData = Awaited<ReturnType<typeof fetchDashboardData>>
// { users: User[]; orders: Order[]; revenue: RevenueReport }
```

## Composicao de utility types

```typescript
interface Employee {
  id: string
  name: string
  email: string
  department: string
  salary: number
  ssn: string
  startDate: Date
  managerId: string | null
}

// Perfil publico: sem dados sensiveis, imutavel
type EmployeeProfile = Readonly<Omit<Employee, 'salary' | 'ssn'>>

// Formulario de edicao: so campos editaveis, todos opcionais
type EmployeeEditForm = Partial<Pick<Employee, 'name' | 'email' | 'department'>>

// Transferencia entre departamentos: so os campos relevantes, obrigatorios
type DepartmentTransfer = Required<Pick<Employee, 'id' | 'department' | 'managerId'>>
```

## Extract e Exclude com unions

```typescript
type ApiResponse =
  | { type: 'success'; data: User }
  | { type: 'error'; message: string }
  | { type: 'loading' }

// Extrair so respostas com dados
type SuccessResponse = Extract<ApiResponse, { type: 'success' }>
// { type: 'success'; data: User }

// Excluir o loading
type ResolvedResponse = Exclude<ApiResponse, { type: 'loading' }>
// { type: 'success'; data: User } | { type: 'error'; message: string }
```

## NonNullable

```typescript
type MaybeUser = User | null | undefined

function processUser(user: NonNullable<MaybeUser>) {
  // user e garantidamente User aqui
  console.log(user.name)
}

// Util com arrays:
const users: (User | null)[] = await fetchAllUsers()
const validUsers: User[] = users.filter((u): u is NonNullable<typeof u> => u !== null)
```