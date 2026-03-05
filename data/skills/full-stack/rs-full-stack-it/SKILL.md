---
name: rs-full-stack-it
description: "Enforces using 'it' instead of 'test' when writing automated tests in JavaScript/TypeScript. Use when user asks to 'write a test', 'create test cases', 'add unit tests', 'implement tests', or any test creation task. Applies semantic 'it' syntax for readable test descriptions. Make sure to use this skill whenever generating test code. Not for test configuration, CI/CD setup, or test runner selection."
---

# IT vs Test — Sintaxe Semantica para Testes

> Ao criar testes, use `it` em vez de `test` porque produz descricoes mais semanticas e legiveis.

## Rules

1. **Use `it` em vez de `test`** — `it('should sum correctly')` nao `test('testa a soma')`, porque `it` produz frases naturais em ingles que descrevem comportamento
2. **Descreva comportamento, nao acao** — `it('should return 4 when adding 2 + 2')` nao `it('testa soma')`, porque o titulo do teste deve ler como uma frase completa
3. **Comece com "should"** — `it('should ...')` cria o padrao "it should [behavior]", que e o mais semantico e adotado pela comunidade

## How to write

### Teste com `it` (preferido)

```typescript
it('should return 10 when adding 3 and 7', () => {
  expect(3 + 7).toBe(10)
})
```

### Agrupando com `describe` + `it`

```typescript
describe('Calculator', () => {
  it('should return 4 when adding 2 and 2', () => {
    expect(2 + 2).toBe(4)
  })

  it('should return 0 when subtracting equal numbers', () => {
    expect(5 - 5).toBe(0)
  })
})
```

## Example

**Before (usando `test`):**
```typescript
test('testa a soma de 2 mais 2 que deve ser 4', () => {
  expect(2 + 2).toBe(4)
})
```

**After (com `it` semantico):**
```typescript
it('should return 4 when adding 2 and 2', () => {
  expect(2 + 2).toBe(4)
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Criando qualquer teste novo | Use `it` |
| Lendo teste existente com `test` | Mantenha (nao refatore sem pedir) |
| Titulo do teste | Comece com "should" para leitura natural |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `test('testa a soma')` | `it('should sum correctly')` |
| `test('funcao X funciona')` | `it('should return expected value from X')` |
| `it('test sum')` | `it('should return 4 when adding 2 and 2')` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre semantica de testes
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes