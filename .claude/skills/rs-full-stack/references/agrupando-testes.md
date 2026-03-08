---
name: rs-full-stack-agrupando-testes
description: "Enforces test grouping with describe blocks when writing or reviewing test files. Use when user asks to 'write tests', 'create test file', 'add test cases', 'organize tests', or 'group tests'. Applies suite structure using describe to group related test cases by functionality. Make sure to use this skill whenever generating test files with multiple test cases for the same function or feature. Not for application code, CI/CD configuration, or test runner setup."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [testing, describe, jest, test-organization, suites]
---

# Agrupando Testes com Describe

> Sempre que um arquivo de teste contém multiplos cenarios da mesma funcionalidade, agrupe-os em suites usando `describe`.

## Rules

1. **Use `describe` para agrupar testes relacionados** — cada funcionalidade testada recebe seu proprio bloco `describe`, porque a saida do test runner mostra hierarquia clara (arquivo > suite > teste)
2. **Nomeie o `describe` pela funcionalidade** — `describe('sum', ...)` nao `describe('testes de soma', ...)`, porque o nome identifica O QUE esta sendo testado
3. **Um `describe` por funcionalidade por arquivo** — se o arquivo testa `sum`, um `describe('sum', ...)` agrupa todos os cenarios, porque evita testes soltos sem contexto
4. **Testes nunca ficam soltos quando ha multiplos cenarios** — 2+ testes da mesma funcionalidade exigem `describe`, porque sem agrupamento a saida do runner perde hierarquia e legibilidade

## How to write

### Suite basica

```typescript
import { sum } from './sum'

describe('sum', () => {
  test('sum of 3 plus 7 must be 10', () => {
    expect(sum(3, 7)).toBe(10)
  })

  test('sum of 2 plus 2 must be 4', () => {
    expect(sum(2, 2)).toBe(4)
  })
})
```

### Multiplas suites no mesmo arquivo

```typescript
describe('sum', () => {
  test('positive numbers', () => {
    expect(sum(3, 7)).toBe(10)
  })
})

describe('subtract', () => {
  test('positive numbers', () => {
    expect(subtract(10, 3)).toBe(7)
  })
})
```

## Example

**Before (testes soltos sem agrupamento):**
```typescript
test('sum of 3 plus 7 must be 10', () => {
  expect(sum(3, 7)).toBe(10)
})

test('sum of 2 plus 2 must be 4', () => {
  expect(sum(2, 2)).toBe(4)
})
```

**After (agrupados em suite):**
```typescript
describe('sum', () => {
  test('sum of 3 plus 7 must be 10', () => {
    expect(sum(3, 7)).toBe(10)
  })

  test('sum of 2 plus 2 must be 4', () => {
    expect(sum(2, 2)).toBe(4)
  })
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| 1 unico teste no arquivo | `describe` opcional, pode ficar solto |
| 2+ testes da mesma funcao | Agrupar em `describe` obrigatoriamente |
| Arquivo testa 2+ funcoes | Um `describe` por funcao |
| Cenarios com setup compartilhado | `describe` + `beforeEach` dentro do bloco |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Multiplos `test()` soltos para mesma funcao | `describe('funcao', () => { test()... })` |
| `describe('testes', ...)` generico | `describe('sum', ...)` com nome da funcionalidade |
| `describe` com um unico teste dentro | Teste solto ou aguardar ter mais cenarios |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| Saída do test runner sem hierarquia | Testes estão soltos sem `describe` | Agrupe testes relacionados dentro de `describe('funcionalidade', ...)` |
| `describe` com nome genérico na saída | Nome do describe é "testes" ou "tests" | Use o nome da funcionalidade testada: `describe('sum', ...)` |
| `beforeEach` afeta testes de outra funcionalidade | Setup compartilhado fora do `describe` | Mova `beforeEach` para dentro do `describe` correspondente |
| Teste isolado falha mas passa no grupo | Dependência oculta entre testes | Verifique se testes compartilham estado sem cleanup |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes