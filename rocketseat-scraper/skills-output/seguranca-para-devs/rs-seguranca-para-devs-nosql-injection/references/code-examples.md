# Code Examples: NoSQL Injection

## Setup completo do exemplo

### Arquivo de conexao (con.js)

```javascript
const { MongoClient } = require('mongodb')

const uri = 'mongodb://root:password@localhost:27017'

async function createConnection() {
  const client = new MongoClient(uri)
  const con = await client.connect()
  return con
}

module.exports = createConnection
```

### Setup do banco (setup.js)

```javascript
const createConnection = require('./con')

async function setupDb() {
  const con = await createConnection()
  const db = con.db('nosql_injection_demo')
  const users = db.collection('users')

  await users.drop().catch(() => {}) // ignora se nao existe
  await users.insertMany([
    { email: 'alice@example.com', password: 'alice' },
    { email: 'bob@example.com', password: 'bob' },
    { email: 'charlie@example.com', password: 'charlie' }
  ])

  console.log('Setup completo')
  process.exit(0)
}

setupDb()
```

## Codigo vulneravel (demonstracao do ataque)

```javascript
const createConnection = require('./con')

async function login(email, password) {
  const con = await createConnection()
  const db = con.db('nosql_injection_demo')
  const users = db.collection('users')

  const user = await users.findOne({ email, password })
  return user
}

// Teste 1: Login legitimo
async function test() {
  // Funciona normalmente
  const result1 = await login('alice@example.com', 'alice')
  console.log('Login valido:', result1)
  // → { _id: ObjectId(...), email: 'alice@example.com', password: 'alice' }

  // Senha errada — login falha (correto)
  const result2 = await login('alice@example.com', 'wrong')
  console.log('Login invalido:', result2)
  // → null

  // ATAQUE: NoSQL Injection via $regex
  const result3 = await login('alice@example.com', { $regex: '.' })
  console.log('Injection:', result3)
  // → { _id: ObjectId(...), email: 'alice@example.com', password: 'alice' }
  // LOGIN BEM-SUCEDIDO SEM SABER A SENHA!
}

test()
```

## Correcao 1: Validacao com typeof

```javascript
async function login(email, password) {
  if (typeof email !== 'string' || typeof password !== 'string') {
    return null
  }

  const con = await createConnection()
  const db = con.db('nosql_injection_demo')
  const users = db.collection('users')

  const user = await users.findOne({ email, password })
  return user
}

// Agora o ataque falha:
login('alice@example.com', { $regex: '.' })
// typeof { $regex: '.' } === 'object' !== 'string' → retorna null
```

## Correcao 2: Conversao forcada com String()

```javascript
async function login(email, password) {
  const safeEmail = String(email)
  const safePassword = String(password)

  const con = await createConnection()
  const db = con.db('nosql_injection_demo')
  const users = db.collection('users')

  const user = await users.findOne({
    email: safeEmail,
    password: safePassword
  })
  return user
}

// String({ $regex: '.' }) === '[object Object]'
// Nao vai encontrar nenhum usuario com essa "senha"
```

## Correcao 3: TypeScript com validacao runtime

```typescript
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

async function login(input: unknown) {
  const { email, password } = loginSchema.parse(input)

  const user = await users.findOne({ email, password })
  return user
}

// Se input.password for um objeto, Zod lanca erro antes da query
```

## Outros vetores de ataque NoSQL

```javascript
// Ataque com $ne (not equal)
login('alice@example.com', { $ne: '' })
// Encontra usuario cuja senha e diferente de '' (qualquer senha)

// Ataque com $gt (greater than)
login('alice@example.com', { $gt: '' })
// Encontra usuario cuja senha e maior que '' (qualquer string)

// Ataque em ambos os campos
login({ $regex: '.*' }, { $regex: '.*' })
// Retorna o PRIMEIRO usuario do banco inteiro
```

## Validacao em camada de API (Express)

```javascript
app.post('/login', (req, res) => {
  const { email, password } = req.body

  // Validacao na camada de API
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid input types' })
  }

  // Passa para a camada de dados (que tambem valida)
  const user = await login(email, password)

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  res.json({ user })
})
```