# Code Examples: Agrupando Testes com Describe

## Exemplo 1: Testes soltos (antes)

Direto da aula — dois testes sem agrupamento:

```typescript
import { sum } from './sum'

test('sum of 3 plus 7 must be 10', () => {
  const result = sum(3, 7)
  expect(result).toBe(10)
})

test('sum of 2 plus 2 must be 4', () => {
  const result = sum(2, 2)
  expect(result).toBe(4)
})
```

Saida no runner:
```
 ✓ sum of 3 plus 7 must be 10
 ✓ sum of 2 plus 2 must be 4
```

## Exemplo 2: Com describe (depois)

```typescript
import { sum } from './sum'

describe('sum', () => {
  test('sum of 3 plus 7 must be 10', () => {
    const result = sum(3, 7)
    expect(result).toBe(10)
  })

  test('sum of 2 plus 2 must be 4', () => {
    const result = sum(2, 2)
    expect(result).toBe(4)
  })
})
```

Saida no runner:
```
 sum
   ✓ sum of 3 plus 7 must be 10
   ✓ sum of 2 plus 2 must be 4
```

## Exemplo 3: Multiplas suites

Demonstrado na aula para mostrar hierarquia com dois describes:

```typescript
describe('sum', () => {
  test('sum of 3 plus 7 must be 10', () => {
    expect(sum(3, 7)).toBe(10)
  })

  test('sum of 2 plus 2 must be 4', () => {
    expect(sum(2, 2)).toBe(4)
  })
})

describe('sum2', () => {
  test('sum of 2 plus 2 must be 4', () => {
    expect(sum(2, 2)).toBe(4)
  })
})
```

Saida:
```
 sum
   ✓ sum of 3 plus 7 must be 10
   ✓ sum of 2 plus 2 must be 4
 sum2
   ✓ sum of 2 plus 2 must be 4
```

## Variacao: Login com multiplos cenarios

Exemplo mencionado pelo instrutor como motivacao:

```typescript
describe('login', () => {
  test('should login successfully with valid credentials', () => {
    const result = login('user@email.com', 'correct-password')
    expect(result.success).toBe(true)
  })

  test('should fail with incorrect password', () => {
    const result = login('user@email.com', 'wrong-password')
    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid credentials')
  })

  test('should fail when user does not exist', () => {
    const result = login('nonexistent@email.com', 'any-password')
    expect(result.success).toBe(false)
    expect(result.error).toBe('User not found')
  })
})
```

## Variacao: Describe com beforeEach (extensao natural)

```typescript
describe('sum', () => {
  let calculator: Calculator

  beforeEach(() => {
    calculator = new Calculator()
  })

  test('adds positive numbers', () => {
    expect(calculator.sum(3, 7)).toBe(10)
  })

  test('adds negative numbers', () => {
    expect(calculator.sum(-3, -7)).toBe(-10)
  })
})
```

## Comando para executar

```bash
# Modo watch (usado na aula)
npm run test:dev

# Execucao unica
npm test
```