---
name: rs-full-stack-break-1
description: "Applies correct break statement usage in JavaScript/TypeScript loops and switch cases. Use when user asks to 'write a switch', 'create a loop', 'implement a for loop', 'add switch case', or any code with loops/switch. Ensures break placement prevents fall-through bugs in switch and controls loop termination. Make sure to use this skill whenever generating switch/case or loop code with early exit conditions. Not for continue statements, return-based flow control, or async/iterator patterns."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript
  tags: [javascript, break, switch, loops, control-flow]
---

# Break — Controle de Fluxo em Repetições e Switch

> Use `break` para encerrar explicitamente a execução de um `switch case` ou interromper um loop quando uma condição é atingida.

## Rules

1. **Sempre use `break` em cada `case` do `switch`** — sem ele, a execução "cai" para os próximos cases (fall-through), executando código que não deveria rodar
2. **Coloque `break` antes do código que não deve executar** — a posição importa: qualquer instrução após o `break` no mesmo bloco nunca será alcançada
3. **Use `break` em loops para saída antecipada** — quando encontrar o resultado desejado, interrompa o loop em vez de continuar iterações desnecessárias
4. **`break` encerra apenas o loop/switch mais interno** — em loops aninhados, o `break` afeta somente a estrutura onde está diretamente contido

## How to write

### Switch case com break

```typescript
switch (option) {
  case 1:
    console.log("Cadastrar")
    break
  case 2:
    console.log("Atualizar")
    break
  case 3:
    console.log("Remover")
    break
  default:
    console.log("Opção inválida")
}
```

### Loop com saída antecipada

```typescript
for (let i = 0; i < 10; i++) {
  if (i === 5) {
    break
  }
  console.log(i) // Exibe 0, 1, 2, 3, 4
}
```

## Example

**Before (switch sem break — fall-through acidental):**

```typescript
switch (option) {
  case 1:
    console.log("Cadastrar")
  case 2:
    console.log("Atualizar")
  case 3:
    console.log("Remover")
  default:
    console.log("Opção inválida")
}
// Se option = 1, exibe: Cadastrar, Atualizar, Remover, Opção inválida
```

**After (com break correto):**

```typescript
switch (option) {
  case 1:
    console.log("Cadastrar")
    break
  case 2:
    console.log("Atualizar")
    break
  case 3:
    console.log("Remover")
    break
  default:
    console.log("Opção inválida")
}
// Se option = 1, exibe apenas: Cadastrar
```

## Heuristics

| Situação | Ação |
|----------|------|
| Switch case com múltiplos casos | Sempre adicionar `break` em cada case |
| Fall-through intencional entre cases | Documentar com comentário `// fall-through` |
| Loop buscando um item específico | Usar `break` ao encontrar para evitar iterações extras |
| Posição do `break` no bloco | Colocar antes de qualquer código que não deve executar naquela condição |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|-----------------|
| `case` sem `break` (acidental) | `case X: ... break` em cada caso |
| Loop completo quando só precisa do primeiro match | `if (found) break` dentro do loop |
| `break` após `console.log` quando quer ocultar a saída | `break` antes do `console.log` |


## Troubleshooting

| Problema | Solução |
|----------|---------|
| **Switch case executes multiple blocks** | Missing `break` causes fall-through — add `break` at the end of each `case` block. |
| **Loop does not stop when condition is met** | Ensure `break` is inside the correct loop scope — in nested loops, `break` only exits the innermost one. |
| **Code after break is unreachable** | Move any logic that should execute before the `break` statement, not after it. |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre fall-through e posicionamento do break
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações