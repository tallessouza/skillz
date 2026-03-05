# Code Examples: IT vs Test

## Exemplo 1: Comparacao direta (da aula)

### Com `test`:
```typescript
test('testa a soma de 2 mais 2 que deve ser 4', () => {
  expect(2 + 2).toBe(4)
})
```

### Com `it`:
```typescript
it('should return 10 when adding 3 and 7', () => {
  expect(3 + 7).toBe(10)
})
```

Ambos produzem o mesmo resultado no terminal ao executar.

## Exemplo 2: Com `describe` blocks

```typescript
describe('Math operations', () => {
  it('should return 4 when adding 2 and 2', () => {
    expect(2 + 2).toBe(4)
  })

  it('should return 10 when adding 3 and 7', () => {
    expect(3 + 7).toBe(10)
  })

  it('should return 0 when subtracting equal numbers', () => {
    expect(5 - 5).toBe(0)
  })
})
```

Output no terminal:
```
Math operations
  ✓ should return 4 when adding 2 and 2
  ✓ should return 10 when adding 3 and 7
  ✓ should return 0 when subtracting equal numbers
```

## Exemplo 3: Variacoes de descricao

```typescript
// Bom — descreve comportamento
it('should throw an error when dividing by zero', () => {
  expect(() => divide(10, 0)).toThrow()
})

// Bom — descreve retorno
it('should return an empty array when no users are found', () => {
  const result = findUsers({ name: 'nonexistent' })
  expect(result).toEqual([])
})

// Bom — descreve efeito colateral
it('should call the callback after timeout', () => {
  const callback = jest.fn()
  setTimeout(callback, 100)
  jest.advanceTimersByTime(100)
  expect(callback).toHaveBeenCalled()
})
```

## Exemplo 4: Watch mode

Ao rodar com `--watch`:
```bash
npx vitest --watch
# ou
npx jest --watch
```

Qualquer alteracao no arquivo re-executa os testes automaticamente, independente de usar `it` ou `test`.