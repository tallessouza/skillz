# Code Examples: beforeAll

## Exemplo 1: Setup basico (da aula)

O cenario exato demonstrado pelo instrutor:

```typescript
import { describe, it, expect, beforeAll } from "vitest"
import { sum } from "./sum"

describe("sum", () => {
  let sumResult: number

  beforeAll(() => {
    // Executado antes de todos os testes
    console.log("executado antes dos testes")
    sumResult = 10
  })

  it("should return the sum of two numbers", () => {
    expect(sum(5, 5)).toBe(sumResult)
  })
})
```

**Ponto chave:** `sumResult` declarado no escopo do describe, atribuido no beforeAll, usado no it.

## Exemplo 2: Sem beforeAll (falha demonstrada na aula)

```typescript
describe("sum", () => {
  let sumResult: number
  // beforeAll comentado — sumResult nunca recebe valor

  it("should return the sum", () => {
    console.log(sumResult) // undefined
    expect(sum(5, 5)).toBe(sumResult) // FAIL: expected 10, received undefined
  })
})
```

## Exemplo 3: Setup assincrono com banco de dados

```typescript
import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { createConnection, Connection } from "typeorm"

describe("UserRepository", () => {
  let connection: Connection
  let initialUserCount: number

  beforeAll(async () => {
    connection = await createConnection({
      type: "sqlite",
      database: ":memory:",
      entities: [User],
      synchronize: true,
    })
    initialUserCount = await connection.getRepository(User).count()
  })

  afterAll(async () => {
    await connection.close()
  })

  it("should start with correct user count", () => {
    expect(initialUserCount).toBe(0)
  })
})
```

## Exemplo 4: Carga de arquivo

```typescript
import { readFile } from "fs/promises"

describe("config parser", () => {
  let configContent: string

  beforeAll(async () => {
    configContent = await readFile("./config.json", "utf-8")
  })

  it("should be valid JSON", () => {
    expect(() => JSON.parse(configContent)).not.toThrow()
  })

  it("should have required fields", () => {
    const config = JSON.parse(configContent)
    expect(config).toHaveProperty("port")
    expect(config).toHaveProperty("host")
  })
})
```

## Exemplo 5: Multiplas variaveis compartilhadas

```typescript
describe("math operations", () => {
  let baseValue: number
  let multiplier: number
  let expectedProduct: number

  beforeAll(() => {
    baseValue = 5
    multiplier = 3
    expectedProduct = baseValue * multiplier
  })

  it("should multiply correctly", () => {
    expect(multiply(baseValue, multiplier)).toBe(expectedProduct)
  })

  it("should be commutative", () => {
    expect(multiply(multiplier, baseValue)).toBe(expectedProduct)
  })
})
```

## Exemplo 6: beforeAll em describes aninhados

```typescript
describe("API", () => {
  let server: Server

  beforeAll(async () => {
    server = await createServer()
  })

  describe("GET /users", () => {
    let response: Response

    beforeAll(async () => {
      response = await server.inject({ method: "GET", url: "/users" })
    })

    it("should return 200", () => {
      expect(response.statusCode).toBe(200)
    })

    it("should return array", () => {
      expect(Array.isArray(response.json())).toBe(true)
    })
  })
})
```