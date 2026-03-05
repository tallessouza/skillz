---
name: rs-node-js-2023-testando-classes-de-erro
description: "Enforces Either pattern testing and TypeScript type narrowing when writing error handling with Left/Right classes. Use when user asks to 'test either', 'test error handling', 'write tests for use case', 'type narrow either', or 'isRight isLeft'. Applies rules: test both success and error paths, use isRight/isLeft for type guards, leverage TypeScript this-is narrowing for value inference. Make sure to use this skill whenever testing functional error handling or implementing Either type guards. Not for general unit testing, try/catch patterns, or exception-based error handling."
---

# Testando Classes de Erro (Either Pattern)

> Teste ambos os caminhos (sucesso e erro) do Either e use type guards `isRight`/`isLeft` para narrowing automatico do TypeScript.

## Rules

1. **Teste sempre os dois caminhos** — crie um teste para `Right` (sucesso) e outro para `Left` (erro), porque o Either so tem valor se ambos os caminhos estao cobertos
2. **Use `isRight`/`isLeft` como type guards** — nunca use `instanceof Right` diretamente, porque os metodos auxiliares sao mais legíveis e habilitam TypeScript narrowing
3. **Implemente `this is` nos metodos** — `isRight(): this is Right<L, R>` permite que o TypeScript infira o tipo correto do `.value` apos o check, porque sem isso o tipo sera uma union
4. **Ambas as classes recebem ambos os generics** — `Left<L, R>` e `Right<L, R>` precisam de ambos os tipos para que o narrowing funcione corretamente
5. **Teste com funcoes que retornam Either** — nao teste apenas `right()` e `left()` isolados, teste funcoes reais que decidem qual caminho retornar, porque isso simula o uso real em use cases

## How to write

### Type guards com `this is`

```typescript
class Left<L, R> {
  readonly value: L

  isLeft(): this is Left<L, R> {
    return true
  }

  isRight(): this is Right<L, R> {
    return false
  }
}

class Right<L, R> {
  readonly value: R

  isRight(): this is Right<L, R> {
    return true
  }

  isLeft(): this is Left<L, R> {
    return false
  }
}
```

### Testes para Either

```typescript
function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10)
  }

  return left('error')
}

it('success result', () => {
  const result = doSomething(true)

  expect(result.isRight()).toBe(true)
  expect(result.isLeft()).toBe(false)
  expect(result.value).toEqual(10)
})

it('error result', () => {
  const result = doSomething(false)

  expect(result.isLeft()).toBe(true)
  expect(result.isRight()).toBe(false)
  expect(result.value).toEqual('error')
})
```

## Example

**Before (instanceof direto, sem narrowing):**
```typescript
const result = doSomething(true)

if (result instanceof Right) {
  // verbose e sem narrowing automatico
  console.log(result.value) // tipo: string | number
}
```

**After (com isRight e narrowing):**
```typescript
const result = doSomething(true)

if (result.isRight()) {
  console.log(result.value) // tipo: number (inferido automaticamente)
  result.value.toFixed(2)   // metodos de number disponiveis
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Testando use case que retorna Either | Teste ambos os caminhos com `isRight()` e `isLeft()` |
| Acessando `.value` apos check | Use `if (result.isRight())` para narrowing automatico |
| Classe Left/Right sem narrowing | Adicione `this is Left<L, R>` / `this is Right<L, R>` nos metodos |
| Either com tipos diferentes para L e R | Ambas as classes devem receber `<L, R>` como generics |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `result instanceof Right` | `result.isRight()` |
| `(result.value as number).toFixed()` | `if (result.isRight()) { result.value.toFixed() }` |
| `class Right<R>` (um generic so) | `class Right<L, R>` (ambos os generics) |
| Testar so o caminho de sucesso | Testar sucesso E erro em testes separados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-testando-classes-de-erro/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-testando-classes-de-erro/references/code-examples.md)
