# Code Examples: TypeScript Partial

## Exemplo basico da aula

```typescript
interface User {
  id: number
  name: string
  email: string
}

// Criacao: todos os campos obrigatorios
const newUser: User = { id: 1, name: "Rodrigo", email: "rodrigo@email.com" }

// Update: apenas os campos que mudaram
const updatedUser: Partial<User> = { name: "Rodrigo Gonçalves" }
```

## Funcao de update com spread

```typescript
function updateUser(current: User, changes: Partial<User>): User {
  return { ...current, ...changes }
}

const user: User = { id: 1, name: "Rodrigo", email: "rodrigo@email.com" }

const updated = updateUser(user, { name: "Rodrigo Gonçalves" })
// { id: 1, name: "Rodrigo Gonçalves", email: "rodrigo@email.com" }
```

## Partial com Omit (proteger id)

```typescript
type UserUpdate = Partial<Omit<User, 'id'>>

function updateUser(id: number, fields: UserUpdate): User {
  const existing = findUserById(id)
  return { ...existing, ...fields }
}

// id nao pode ser passado no update
updateUser(1, { name: "Novo" })        // OK
updateUser(1, { id: 2, name: "Novo" }) // ERRO
```

## Partial com Pick (apenas campos editaveis)

```typescript
type EditableUserFields = Partial<Pick<User, 'name' | 'email'>>

function updateUser(id: number, fields: EditableUserFields): User {
  const existing = findUserById(id)
  return { ...existing, ...fields }
}

updateUser(1, { name: "Novo" })  // OK
updateUser(1, { email: "x@y" }) // OK
```

## API handler com Partial

```typescript
interface Product {
  id: number
  title: string
  price: number
  description: string
  stock: number
}

// PATCH /products/:id
async function handleUpdateProduct(
  id: number,
  body: Partial<Omit<Product, 'id'>>
): Promise<Product> {
  const product = await db.products.findById(id)
  const updated = { ...product, ...body }
  return db.products.save(updated)
}
```

## React state update

```typescript
interface FormState {
  name: string
  email: string
  phone: string
}

const [form, setForm] = useState<FormState>({
  name: "",
  email: "",
  phone: ""
})

// Atualizar apenas um campo
function updateField(changes: Partial<FormState>) {
  setForm(prev => ({ ...prev, ...changes }))
}

updateField({ name: "Rodrigo" })
updateField({ email: "r@email.com", phone: "123" })
```

## Comparacao: com e sem Partial

### Sem Partial (duplicacao)

```typescript
interface User {
  id: number
  name: string
  email: string
}

// Tipagem duplicada — se User mudar, UpdateUser pode ficar desatualizada
interface UpdateUser {
  id?: number
  name?: string
  email?: string
}
```

### Com Partial (reaproveitamento)

```typescript
interface User {
  id: number
  name: string
  email: string
}

// Sempre sincronizado com User
type UpdateUser = Partial<User>
```