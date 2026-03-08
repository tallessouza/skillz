---
name: rs-full-stack-erros-customizados-classes
description: "Enforces custom error class patterns when writing JavaScript/TypeScript error handling. Use when user asks to 'create custom errors', 'handle errors', 'throw exceptions', 'build error classes', or any error handling task. Applies rules: extend Error or use structured classes, instanceof checks in catch blocks, descriptive error messages with context prefix. Make sure to use this skill whenever generating error handling code or creating domain-specific errors. Not for logging configuration, HTTP status codes, or try/catch syntax basics."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [javascript, typescript, error-handling, custom-errors, classes, instanceof]
---

# Erros Customizados com Classes

> Crie classes de erro específicas do domínio para distinguir tipos de falha no catch e reagir de forma diferente a cada uma.

## Rules

1. **Sempre herde de Error** — `class MyError extends Error`, porque isso preserva stack trace e permite `instanceof` funcionar corretamente na cadeia de protótipos
2. **Defina name no construtor** — `this.name = 'MyError'`, porque stack traces mostram o nome da classe e sem isso aparece "Error" genérico
3. **Prefixe mensagens com contexto** — `"[PaymentError]: valor inválido"` não `"valor inválido"`, porque no log você precisa saber a origem sem ler o stack trace
4. **Use instanceof no catch** — verifique o tipo do erro antes de decidir o que fazer, porque erros diferentes exigem tratamentos diferentes
5. **Crie erros por domínio** — `ValidationError`, `AuthError`, `NotFoundError`, não uma classe genérica para tudo, porque granularidade permite recovery específico
6. **Inclua propriedades extras quando necessário** — `statusCode`, `field`, `code`, porque o consumidor do erro precisa de dados estruturados, não apenas texto

## How to write

### Classe de erro customizada

```typescript
class AppError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AppError'
  }
}

class ValidationError extends AppError {
  field: string
  constructor(field: string, message: string) {
    super(`[ValidationError]: ${message}`)
    this.name = 'ValidationError'
    this.field = field
  }
}
```

### Verificação com instanceof no catch

```typescript
try {
  throw new ValidationError('email', 'formato inválido')
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`Campo ${error.field}: ${error.message}`)
  } else {
    console.log('Erro inesperado ao executar operação')
  }
}
```

## Example

**Before (erro genérico sem distinção):**

```typescript
try {
  throw new Error('deu ruim')
} catch (error) {
  console.log(error.message)
}
```

**After (erro customizado com instanceof):**

```typescript
class PaymentError extends Error {
  constructor(message: string) {
    super(`[PaymentError]: ${message}`)
    this.name = 'PaymentError'
  }
}

try {
  throw new PaymentError('cartão recusado')
} catch (error) {
  if (error instanceof PaymentError) {
    console.log(error.message) // [PaymentError]: cartão recusado
  } else {
    console.log('Não foi possível processar pagamento')
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Múltiplos tipos de falha num mesmo try | Crie uma classe por tipo, use instanceof em cadeia |
| Erro precisa de dados além da mensagem | Adicione propriedades (`statusCode`, `field`, `code`) |
| Erro vai cruzar camadas (service → controller) | Herde de uma base `AppError` comum |
| Catch genérico no topo da aplicação | Use else final com log do erro original |
| Biblioteca externa lança erro desconhecido | Wrape num erro do seu domínio no catch |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `throw new Error('not found')` em todo lugar | `throw new NotFoundError(resource)` |
| `catch (e) { console.log(e) }` sem distinção | `if (e instanceof X)` com tratamento específico |
| Classe sem `extends Error` | `class X extends Error` para manter stack trace |
| `error.message === 'not found'` (comparar string) | `error instanceof NotFoundError` |
| Catch vazio `catch {}` | Pelo menos log ou rethrow |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `instanceof` retorna false para erro customizado | Classe não herda de `Error` | Adicione `extends Error` na declaração da classe |
| Stack trace não mostra o nome correto | `this.name` não definido no construtor | Adicione `this.name = 'NomeDaClasse'` no construtor |
| Catch não diferencia tipos de erro | Usando catch genérico sem instanceof | Adicione verificações `if (error instanceof X)` encadeadas |
| Propriedades extras undefined no catch | TypeScript não infere o tipo no catch | Use type guard com `instanceof` antes de acessar propriedades |
| Erro customizado perde stack trace | `super(message)` não chamado no construtor | Sempre chame `super(message)` como primeira instrução |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre herança de Error, prototype chain e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações