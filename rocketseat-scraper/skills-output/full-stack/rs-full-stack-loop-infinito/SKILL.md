---
name: rs-full-stack-loop-infinito
description: "Guards against infinite loops when writing JavaScript/TypeScript repetition structures. Use when user asks to 'write a while loop', 'create a loop', 'implement polling', 'repeat until condition', or any code with while/do-while/for loops. Ensures every loop has a clear termination condition and warns about missing exit paths. Make sure to use this skill whenever generating loop structures, even simple ones. Not for array methods like map/filter/forEach or recursion."
---

# Loop Infinito — Proteção contra Loops sem Fim

> Toda estrutura de repetição deve ter uma condição de saída garantida; loop infinito só existe de forma intencional e documentada.

## Rules

1. **Toda variável de controle deve ser modificada dentro do loop** — se `while (value)` existe, `value` deve mudar dentro do bloco, porque sem modificação a condição nunca muda e o loop nunca termina
2. **Nunca use `while (true)` sem `break` explícito** — todo loop infinito intencional precisa de uma saída clara com `break`, `return` ou `throw`, porque o navegador/runtime trava sem saída
3. **Prefira `for` quando o número de iterações é conhecido** — `for (let i = 0; i < n; i++)` é mais seguro que `while` porque a mutação do contador está embutida na estrutura
4. **Loop infinito intencional exige comentário justificando** — `// Intentional: polling every 2s until server responds` porque sem contexto outro dev vai achar que é bug
5. **Adicione guard clause com limite máximo** — mesmo em loops intencionais, defina um `maxIterations` como safety net, porque previne travamento em edge cases

## How to write

### Loop com condição de saída clara

```typescript
let attempts = 0
const maxAttempts = 10

while (attempts < maxAttempts) {
  const result = tryOperation()
  if (result.success) break
  attempts++ // Variável de controle SEMPRE muda
}
```

### Loop infinito intencional (com proteção)

```typescript
// Intentional: retry until connection established
let connected = false
let retries = 0
const maxRetries = 50

while (!connected && retries < maxRetries) {
  connected = await attemptConnection()
  retries++
  await delay(2000)
}
```

## Example

**Before (loop infinito acidental):**
```javascript
let value = true

while (value) {
  console.log("executando while")
  // value nunca muda → loop infinito → trava o navegador
}
```

**After (com saída garantida):**
```javascript
let value = true
let iterations = 0

while (value) {
  console.log("executando while")
  iterations++
  if (iterations >= 100) {
    value = false // Condição de saída garantida
  }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| `while` com booleano | Verifique se o booleano é alterado dentro do loop |
| Polling/retry | Use `while` com contador + `maxRetries` |
| Iteração sobre coleção | Prefira `for...of` ou métodos de array |
| Game loop / event loop | `while (true)` com `break` + comentário explicando |
| Condição sempre verdadeira (`while (true)`, `while (1)`) | Exija `break`/`return` explícito no corpo |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|-----------------|
| `while (true) { doWork() }` | `while (true) { doWork(); if (done) break }` |
| `while (flag) { /* flag nunca muda */ }` | `while (flag) { /* ... */ flag = checkCondition() }` |
| `for (;;) { process() }` | `for (let i = 0; i < max; i++) { process() }` |
| `while (x > 0) { /* x nunca decrementa */ }` | `while (x > 0) { /* ... */ x-- }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre por que loops infinitos travam navegadores e como a memória é afetada
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e cenários reais