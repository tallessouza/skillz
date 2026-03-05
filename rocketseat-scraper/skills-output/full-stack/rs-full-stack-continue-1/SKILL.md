---
name: rs-full-stack-continue-1
description: "Applies the continue keyword correctly in JavaScript/TypeScript loops to skip iterations. Use when user asks to 'skip iteration', 'filter inside loop', 'continue to next', 'ignore certain values in loop', or writes for/while loops with conditional skipping. Make sure to use this skill whenever generating loop code that needs to bypass specific iterations without breaking the entire loop. Not for break statements, loop termination, or array filter/map operations."
---

# Continue em Estruturas de Repetição

> Use `continue` para pular a iteração atual e ir direto para a próxima, sem encerrar o loop.

## Rules

1. **`continue` pula, `break` encerra** — `continue` volta ao início do loop para a próxima iteração, porque confundir os dois causa bugs silenciosos onde o loop para quando deveria apenas pular
2. **Coloque `continue` no início do corpo do loop** — use como guard clause para pular iterações indesejadas antes da lógica principal, porque isso reduz aninhamento e melhora legibilidade
3. **Prefira `continue` a else profundo** — em vez de `if (condicao) { /* lógica longa */ }`, use `if (!condicao) continue;` seguido da lógica no nível raiz, porque evita pirâmide de ifs

## How to write

### Guard clause com continue

```typescript
for (const user of users) {
  if (!user.isActive) continue

  // Toda a lógica aqui, sem aninhamento extra
  sendNotification(user)
  updateLastContact(user)
}
```

### Pular valor específico em iteração numérica

```typescript
for (let i = 0; i < 10; i++) {
  if (i === 5) continue

  console.log(i) // 0,1,2,3,4,6,7,8,9 — pula o 5
}
```

## Example

**Before (aninhamento desnecessário):**
```typescript
for (const order of orders) {
  if (order.status !== 'cancelled') {
    if (order.total > 0) {
      processOrder(order)
      sendReceipt(order)
    }
  }
}
```

**After (com continue como guard clause):**
```typescript
for (const order of orders) {
  if (order.status === 'cancelled') continue
  if (order.total <= 0) continue

  processOrder(order)
  sendReceipt(order)
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Pular itens inválidos num loop | `if (invalido) continue` no topo |
| Filtrar antes de processar | `continue` como guard clause |
| Pular índice específico | `if (i === valor) continue` |
| Lógica condicional complexa no loop | Múltiplos `continue` guards > if/else aninhados |
| Precisa parar o loop inteiro | Use `break`, não `continue` |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `if (cond) { /* 20 linhas */ }` dentro de loop | `if (!cond) continue` + lógica flat |
| `continue` após `break` no mesmo bloco | Escolha um — são mutuamente exclusivos |
| `continue` fora de loop | Erro de sintaxe — só funciona dentro de for/while/do-while |
| `continue` quando deveria usar `.filter()` | `items.filter(item => item.isValid)` para transformações funcionais |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações