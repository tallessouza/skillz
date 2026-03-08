---
name: rs-full-stack-classes-excecoes
description: "Enforces proper exception handling with JavaScript error classes when writing try/catch blocks, custom errors, or validation logic. Use when user asks to 'handle errors', 'throw exceptions', 'create custom errors', 'validate input', or 'add error handling'. Applies instanceof checks, specific-to-generic exception chaining, and user-friendly error messages. Make sure to use this skill whenever generating error handling code in JavaScript/TypeScript. Not for HTTP status codes, logging frameworks, or error monitoring setup."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [javascript, exceptions, try-catch, instanceof, error-classes, validation]
---

# Classes para Lidar com Exceções

> Trate exceções do específico para o genérico, usando classes de erro do JavaScript e instanceof para identificar e responder a cada tipo.

## Rules

1. **Use classes de erro específicas** — `TypeError`, `RangeError`, `SyntaxError` em vez de `Error` genérico, porque permite tratamento diferenciado no catch
2. **Encadeie instanceof do específico para o genérico** — `if (error instanceof RangeError)` antes de `else if (error instanceof TypeError)` antes de `else`, porque o primeiro match vence e o genérico captura o resto
3. **Acesse `error.message` para mensagens amigáveis** — `console.log(error)` mostra classe + mensagem, `error.message` mostra só a mensagem limpa para o usuário
4. **throw interrompe a execução como return** — código após `throw` no mesmo bloco nunca executa, porque throw salta direto para o catch
5. **Passe mensagem descritiva no construtor** — `new RangeError("Número fora do intervalo, escolha de 0 a 99")`, porque essa mensagem é o que o usuário final verá
6. **Termine com else genérico** — sempre tenha um fallback `else { console.log("Não foi possível realizar a ação") }` para exceções não previstas

## How to write

### Lançar exceção específica
```javascript
if (index > 99) {
  throw new RangeError("Número fora do intervalo, escolha de 0 a 99")
}

if (!items.includes(value)) {
  throw new Error(`O valor ${value} não está disponível`)
}
```

### Tratar com encadeamento instanceof
```javascript
try {
  // operação que pode falhar
} catch (error) {
  if (error instanceof RangeError) {
    console.log(error.message) // mensagem amigável específica
  } else if (error instanceof TypeError) {
    console.log("Método indisponível")
  } else {
    console.log("Não foi possível realizar a ação")
  }
}
```

## Example

**Before (tratamento genérico):**
```javascript
try {
  obj.execute()
} catch (error) {
  console.log(error) // TypeError: obj.execute is not a function
}
```

**After (tratamento específico com instanceof):**
```javascript
try {
  obj.execute()
} catch (error) {
  if (error instanceof TypeError) {
    console.log("Método indisponível")
  } else {
    console.log("Não foi possível realizar a ação")
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Validação de range numérico | `throw new RangeError(mensagem)` |
| Método/propriedade inexistente | Catch com `instanceof TypeError` |
| Validação de negócio genérica | `throw new Error(mensagem)` |
| Mostrar erro para usuário | Use `error.message`, não `error` direto |
| Múltiplos tipos de erro possíveis | Encadeie if/else if com instanceof, específico primeiro |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `catch (e) { console.log(e) }` sem distinção | Encadeie `instanceof` para cada tipo esperado |
| `throw "algo deu errado"` (string) | `throw new Error("algo deu errado")` |
| `catch` vazio que engole o erro | No mínimo um `console.log(error.message)` no else |
| Todos os throws com `new Error()` genérico | Use `RangeError`, `TypeError`, `SyntaxError` quando aplicável |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `throw "string"` não tem stack trace | Lançando string em vez de objeto Error | Use `throw new Error("mensagem")` ou classe de erro |
| Catch vazio engole erros silenciosamente | Bloco catch sem tratamento | Adicione pelo menos `console.error(error.message)` no catch |
| `instanceof RangeError` não funciona | Erro lançado como `Error` genérico, não `RangeError` | Use `throw new RangeError(msg)` para tipo correto |
| Código após throw executa | throw dentro de condicional, não cobre todos os caminhos | Verifique que o throw está no caminho correto do fluxo |
| Mensagem de erro expõe detalhes internos ao usuário | Mensagem técnica passada direto | Use mensagem amigável no catch e log técnico separado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre throw como return, classes nativas de erro e encadeamento
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código da aula expandidos com variações