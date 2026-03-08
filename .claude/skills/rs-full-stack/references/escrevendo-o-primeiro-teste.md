---
name: rs-full-stack-escrevendo-primeiro-teste
description: "Enforces Jest testing best practices when writing unit tests in TypeScript/JavaScript. Use when user asks to 'write a test', 'create a test', 'add tests', 'test this function', or any test creation task. Applies rules: use expect().toBe() for value assertions, write descriptive test names that explain input and expected output, always verify tests fail before trusting they pass. Make sure to use this skill whenever generating test code. Not for E2E tests, integration tests with databases, or test infrastructure setup."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: testing-jest
  tags: [jest, testing, unit-tests, expect, toBe, assertions, typescript]
---

# Escrevendo Testes com Jest

> Todo teste valida uma expectativa: dado um input conhecido, o output deve ser exatamente o esperado.

## Rules

1. **Use `expect(result).toBe(expected)` para valores primitivos** — porque `toBe` usa igualdade estrita (`===`), garantindo que tipo e valor coincidem
2. **Nomeie testes descrevendo input e output esperado** — `"sum of 3 and 7 must be 10"` nao `"test sum"`, porque quando o teste falha, o nome e a primeira coisa que voce le no terminal
3. **Sempre valide que o teste falha antes de confiar que passa** — mude o valor esperado para algo errado e confirme a falha, porque evita falsos positivos onde o teste passa por motivo errado
4. **Exporte funcoes para testa-las isoladamente** — `export function sum(a: number, b: number)` porque funcoes nao exportadas nao podem ser importadas no arquivo de teste
5. **Um `expect` por comportamento testado** — cada asserção valida uma unica expectativa, porque facilita identificar exatamente o que quebrou
6. **Leia a saida de falha do Jest** — o Jest mostra: nome do teste, valor esperado (Expected), valor recebido (Received), e linha exata da falha

## How to write

### Estrutura basica de um teste

```typescript
import { sum } from './server'

test('sum of 3 and 7 must be 10', () => {
  const result = sum(3, 7)
  expect(result).toBe(10)
})
```

### Nomear testes descritivamente

```typescript
// O nome descreve: funcao + input + output esperado
test('sum of 0 and 0 must be 0', () => {
  expect(sum(0, 0)).toBe(0)
})

test('sum of negative numbers -3 and -7 must be -10', () => {
  expect(sum(-3, -7)).toBe(-10)
})
```

## Example

**Before (teste generico):**
```typescript
test('test sum', () => {
  const result = sum(3, 7)
  expect(result).toBe(10)
})
```

**After (com esta skill aplicada):**
```typescript
test('sum of 3 and 7 must be 10', () => {
  const result = sum(3, 7)
  expect(result).toBe(10)
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Testando retorno de funcao pura | `expect(fn(input)).toBe(expected)` |
| Teste passou de primeira | Mude o expected para valor errado, confirme falha, volte ao correto |
| Nome do teste ficou vago | Reescreva com pattern: `"{funcao} of {input} must be {output}"` |
| Funcao nao acessivel no teste | Adicione `export` na declaracao da funcao |
| Jest mostra Expected vs Received | Compare os dois valores — Expected e o que voce pediu, Received e o que a funcao retornou |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `test('test 1', ...)` | `test('sum of 3 and 7 must be 10', ...)` |
| `test('sum', ...)` | `test('sum of negative numbers must return negative', ...)` |
| Confiar que teste passa sem verificar falha | Simular falha mudando expected, depois corrigir |
| `console.log(result)` para verificar | `expect(result).toBe(expected)` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Funcao nao acessivel no arquivo de teste | Funcao nao exportada do modulo | Adicionar `export` na declaracao da funcao |
| `toBe` falha para objetos iguais | `toBe` usa igualdade estrita de referencia | Usar `toEqual` para comparacao profunda de objetos |
| Teste passa mas nao deveria | Falso positivo — teste nao valida o comportamento correto | Mudar expected para valor errado, confirmar falha, corrigir |
| Jest nao encontra arquivo de teste | Padrao de nome incorreto | Usar `*.test.ts` ou `*.spec.ts` conforme configuracao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre expectativas, falsos positivos e leitura de erros do Jest
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes