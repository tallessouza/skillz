# Code Examples: afterAll

## Exemplo 1: Reset de variável (do transcript)

O exemplo exato usado pelo instrutor:

```typescript
let value = 0

beforeAll(() => {
  value = 10
  console.log('Executado antes dos testes', value) // 10
})

afterAll(() => {
  value = 0
  console.log('Executado depois dos testes', value) // 0
})

test('value is 10', () => {
  expect(value).toBe(10)
})
```

Output no terminal:
```
Executado antes dos testes 10
✓ value is 10
Executado depois dos testes 0
```

## Exemplo 2: Arquivo como banco de dados simulado

```typescript
import fs from 'fs'

let database: Record<string, any>[]

beforeAll(() => {
  const raw = fs.readFileSync('./test-fixtures/users.json', 'utf-8')
  database = JSON.parse(raw)
})

afterAll(() => {
  database = []
})

test('has users', () => {
  expect(database.length).toBeGreaterThan(0)
})

test('users have email', () => {
  database.forEach(user => {
    expect(user.email).toBeDefined()
  })
})
```

## Exemplo 3: Servidor de teste (async)

```typescript
import { createServer, Server } from 'http'

let server: Server
let baseUrl: string

beforeAll(async () => {
  server = createServer((req, res) => {
    res.writeHead(200)
    res.end(JSON.stringify({ ok: true }))
  })

  await new Promise<void>(resolve => {
    server.listen(0, () => {
      const address = server.address() as { port: number }
      baseUrl = `http://localhost:${address.port}`
      resolve()
    })
  })
})

afterAll(async () => {
  await new Promise<void>(resolve => server.close(() => resolve()))
})

test('server responds', async () => {
  const response = await fetch(baseUrl)
  const data = await response.json()
  expect(data.ok).toBe(true)
})
```

## Exemplo 4: Conexão com banco de dados

```typescript
import { Pool } from 'pg'

let pool: Pool

beforeAll(async () => {
  pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL })
  await pool.query('BEGIN')
})

afterAll(async () => {
  await pool.query('ROLLBACK')
  await pool.end()
})

test('inserts a user', async () => {
  const result = await pool.query(
    'INSERT INTO users (name) VALUES ($1) RETURNING *',
    ['Test User']
  )
  expect(result.rows[0].name).toBe('Test User')
})
```

## Exemplo 5: Arquivo temporário

```typescript
import fs from 'fs'
import path from 'path'

const tempFile = path.join(__dirname, 'temp-test-output.txt')

beforeAll(() => {
  fs.writeFileSync(tempFile, 'test data')
})

afterAll(() => {
  if (fs.existsSync(tempFile)) {
    fs.unlinkSync(tempFile)
  }
})

test('temp file exists', () => {
  expect(fs.existsSync(tempFile)).toBe(true)
})

test('temp file has content', () => {
  const content = fs.readFileSync(tempFile, 'utf-8')
  expect(content).toBe('test data')
})
```

## Exemplo 6: Combinando beforeAll/afterAll com beforeEach/afterEach

```typescript
let connection: Connection
let testData: any[]

// Uma vez: conecta ao banco
beforeAll(async () => {
  connection = await createConnection()
})

// Cada teste: insere dados frescos
beforeEach(async () => {
  testData = await connection.seed('./fixtures/base-data.sql')
})

// Cada teste: limpa dados inseridos
afterEach(async () => {
  await connection.query('DELETE FROM test_table')
})

// Uma vez: fecha conexão
afterAll(async () => {
  await connection.close()
})
```