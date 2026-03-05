---
name: rs-full-stack-do-while-1
description: "Applies do-while loop pattern when writing JavaScript/TypeScript repetition logic. Use when user asks to 'create a loop', 'repeat until', 'execute at least once', 'iterate with condition check at end', or needs guaranteed first execution. Ensures correct do-while structure with condition at end. Make sure to use this skill whenever a loop must run at least once before checking its condition. Not for for-loops, while-loops, or array iteration methods like map/filter/forEach."
---

# Loop Do While

> Use do-while quando o bloco precisa executar pelo menos uma vez antes de verificar a condicao.

## Rules

1. **Use do-while quando execucao minima de 1 vez e necessaria** — `do { } while (condition)`, porque a condicao so e verificada no final do bloco
2. **Coloque a condicao no while ao final** — a verificacao acontece DEPOIS da execucao do bloco, garantindo pelo menos uma iteracao
3. **Prefira while quando execucao zero e valida** — se o bloco pode nao executar nenhuma vez, do-while e a estrutura errada
4. **Cuidado com o estado apos incremento** — variaveis modificadas dentro do bloco ja estao atualizadas quando a condicao e avaliada

## How to write

### Estrutura basica

```javascript
let value = 0

do {
  value++
  console.log(value)
} while (value < 10)
```

### Input do usuario (caso classico)

```javascript
let userInput

do {
  userInput = prompt("Digite algo (ou 'sair' para parar):")
  processInput(userInput)
} while (userInput !== "sair")
```

## Example

**Before (while que deveria ser do-while):**
```javascript
let attempts = 0
let valid = false

// Problema: precisa executar pelo menos uma vez, mas verifica antes
while (!valid && attempts < 3) {
  const input = getInput()
  valid = validate(input)
  attempts++
}
```

**After (do-while quando execucao minima e garantida):**
```javascript
let attempts = 0
let valid = false

do {
  const input = getInput()
  valid = validate(input)
  attempts++
} while (!valid && attempts < 3)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Bloco deve executar pelo menos 1 vez | Use `do-while` |
| Bloco pode nao executar nenhuma vez | Use `while` |
| Iteracao sobre colecao | Use `for`, `for...of`, ou metodos de array |
| Menu interativo / input do usuario | `do-while` e a escolha natural |
| Valor inicial ja pode ser invalido para a condicao | `do-while` ainda executa — use quando isso e desejado |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `while(true) { ... if(cond) break; }` para garantir 1 execucao | `do { ... } while (!cond)` |
| Flag artificial para forcar entrada no while | `do-while` que naturalmente executa 1 vez |
| Duplicar codigo antes do while para simular 1a execucao | `do-while` que elimina a duplicacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-do-while-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-do-while-1/references/code-examples.md)
