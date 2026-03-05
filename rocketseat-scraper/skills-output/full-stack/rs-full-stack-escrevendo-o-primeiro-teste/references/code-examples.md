# Code Examples: Escrevendo o Primeiro Teste

## Exemplo 1: Funcao sum (do transcript)

### A funcao sendo testada (`server.ts`)

```typescript
export function sum(a: number, b: number) {
  return a + b
}
```

### O teste (`server.test.ts`)

```typescript
import { sum } from './server'

test('sum of 3 and 7 must be 10', () => {
  const result = sum(3, 7)
  expect(result).toBe(10)
})
```

### Execução

```bash
npm test
```

## Exemplo 2: Simulando falha (tecnica do falso positivo)

```typescript
test('sum of 3 and 7 must be 10', () => {
  const result = sum(3, 7)
  // Passo 1: mude para valor errado para confirmar que teste realmente valida
  expect(result).toBe(17) // VAI FALHAR — Expected: 17, Received: 10
  // Passo 2: volte ao valor correto apos confirmar a falha
  // expect(result).toBe(10)
})
```

## Exemplo 3: Variacoes de testes para a mesma funcao

```typescript
import { sum } from './server'

test('sum of 3 and 7 must be 10', () => {
  expect(sum(3, 7)).toBe(10)
})

test('sum of 0 and 0 must be 0', () => {
  expect(sum(0, 0)).toBe(0)
})

test('sum of -5 and 5 must be 0', () => {
  expect(sum(-5, 5)).toBe(0)
})

test('sum of -3 and -7 must be -10', () => {
  expect(sum(-3, -7)).toBe(-10)
})

test('sum of 1.5 and 2.5 must be 4', () => {
  expect(sum(1.5, 2.5)).toBe(4)
})
```

## Exemplo 4: Evolucao do nome do teste

```typescript
// Ruim — nao diz nada
test('test sum', () => { ... })

// Medio — diz a funcao mas nao o cenario
test('sum works', () => { ... })

// Bom — descreve input e output esperado
test('sum of 3 and 7 must be 10', () => { ... })

// Tambem bom — descreve o cenario edge case
test('sum of negative numbers -3 and -7 must be -10', () => { ... })
```

## Exemplo 5: Pattern de estrutura de teste

```typescript
// 1. Import da funcao
import { minhaFuncao } from './meu-arquivo'

// 2. Test com nome descritivo
test('descricao do cenario com input e output esperado', () => {
  // 3. Arrange — preparar o input
  const input = valorConhecido

  // 4. Act — executar a funcao
  const result = minhaFuncao(input)

  // 5. Assert — verificar a expectativa
  expect(result).toBe(valorEsperado)
})
```