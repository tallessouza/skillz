# Code Examples: Armazenamento de Dados no Node.js

## Exemplo 1: In-Memory (volatil)

```typescript
// Dados existem apenas durante a execucao
const users: Array<{ id: number; name: string }> = []

// Criar
users.push({ id: 1, name: 'João' })
users.push({ id: 2, name: 'Maria' })

// Ler
console.log(users) // [{ id: 1, name: 'João' }, { id: 2, name: 'Maria' }]

// Se o processo reiniciar, users = [] novamente
```

## Exemplo 2: Arquivo JSON (persistente)

### Estrutura do arquivo db.json

```json
[
  { "id": 1, "name": "João", "email": "joao@email.com" },
  { "id": 2, "name": "Maria", "email": "maria@email.com" }
]
```

### CRUD completo com arquivo

```typescript
import { readFile, writeFile } from 'node:fs/promises'

const DB_PATH = './db.json'

interface User {
  id: number
  name: string
  email: string
}

// Ler todos os usuarios
async function getUsers(): Promise<User[]> {
  try {
    const data = await readFile(DB_PATH, 'utf-8')
    return JSON.parse(data)
  } catch {
    // Se o arquivo nao existe, retorna lista vazia
    return []
  }
}

// Salvar usuarios no arquivo
async function saveUsers(users: User[]): Promise<void> {
  await writeFile(DB_PATH, JSON.stringify(users, null, 2))
}

// Criar usuario
async function createUser(name: string, email: string): Promise<User> {
  const users = await getUsers()
  const newUser: User = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name,
    email,
  }
  users.push(newUser)
  await saveUsers(users)
  return newUser
}

// Buscar por ID
async function getUserById(id: number): Promise<User | undefined> {
  const users = await getUsers()
  return users.find(user => user.id === id)
}

// Atualizar
async function updateUser(id: number, updates: Partial<Omit<User, 'id'>>): Promise<User | null> {
  const users = await getUsers()
  const index = users.findIndex(user => user.id === id)
  if (index === -1) return null
  users[index] = { ...users[index], ...updates }
  await saveUsers(users)
  return users[index]
}

// Deletar
async function deleteUser(id: number): Promise<boolean> {
  const users = await getUsers()
  const filtered = users.filter(user => user.id !== id)
  if (filtered.length === users.length) return false
  await saveUsers(filtered)
  return true
}
```

## Exemplo 3: Usando com um servidor HTTP

```typescript
import { createServer } from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'

const DB_PATH = './db.json'

async function getUsers() {
  try {
    return JSON.parse(await readFile(DB_PATH, 'utf-8'))
  } catch {
    return []
  }
}

const server = createServer(async (request, response) => {
  if (request.method === 'GET' && request.url === '/users') {
    const users = await getUsers()
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(users))
  }

  if (request.method === 'POST' && request.url === '/users') {
    let body = ''
    request.on('data', chunk => { body += chunk })
    request.on('end', async () => {
      const { name, email } = JSON.parse(body)
      const users = await getUsers()
      const newUser = { id: Date.now(), name, email }
      users.push(newUser)
      await writeFile(DB_PATH, JSON.stringify(users, null, 2))
      response.writeHead(201, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify(newUser))
    })
  }
})

server.listen(3333, () => console.log('Server running on port 3333'))
```

## Comparacao visual

```
┌─────────────────────────────────────────────────┐
│  In-Memory          Arquivo JSON     Banco de   │
│                                      Dados      │
│  const users = []   db.json          PostgreSQL  │
│                     [{ ... }]        users table │
│                                                  │
│  Restart →          Restart →        Restart →   │
│  users = [] ✗       dados intactos ✓ dados ✓     │
│                                                  │
│  Velocidade: +++    Velocidade: ++   Velocidade: │
│  Persistencia: ✗    Persistencia: ✓  Persistencia│
│  Concorrencia: ~    Concorrencia: ✗  Concorrencia│
│  Queries: ✗         Queries: ✗       Queries: ✓  │
└─────────────────────────────────────────────────┘
```