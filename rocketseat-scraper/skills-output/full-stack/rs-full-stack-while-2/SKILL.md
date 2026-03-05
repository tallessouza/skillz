---
name: rs-full-stack-while-2
description: "Applies correct while loop patterns when writing JavaScript/TypeScript repetition structures. Use when user asks to 'create a loop', 'repeat until', 'while loop', 'keep running until', or any iterative control flow task. Enforces proper boolean conditions, control variables, and exit strategies. Make sure to use this skill whenever generating while loops or converting other loops to while. Not for for/for-of/for-in loops, array iteration methods, or recursive patterns."
---

# Loop While — Estrutura de Repeticao

> Use `while` para repetir um bloco de codigo enquanto uma condicao for verdadeira, sempre com estrategia de saida explicita.

## Rules

1. **Declare a condicao como booleano direto** — `while (isRunning)` nao `while (isRunning === true)`, porque JavaScript avalia automaticamente valores booleanos em contextos de condicao
2. **Sempre defina uma estrategia de saida** — toda variavel de controle deve ter um caminho claro para `false`, porque while sem saida causa loop infinito e trava o navegador
3. **Nomeie a variavel de controle pela intencao** — `shouldContinue`, `isProcessing`, nao `flag` ou `x`, porque o nome comunica quando o loop deve parar
4. **Mude a condicao DENTRO do bloco** — a logica que altera a variavel de controle deve estar dentro do while, porque codigo apos o while so executa depois que o loop encerra
5. **Use comparacao estrita para input de usuario** — `response === "2"` nao `response == 2`, porque `prompt()` retorna string e comparacao frouxa causa bugs silenciosos

## How to write

### While com variavel de controle booleana

```javascript
// Forma correta: booleano direto na condicao
let shouldContinue = true

while (shouldContinue) {
  const response = window.prompt("Deseja continuar? (1-Sim / 2-Nao)")

  if (response === "2") {
    shouldContinue = false
  }
}

console.log("Segue o fluxo")
```

### While com condicao numerica

```javascript
let age = 0

while (age < 18) {
  age = Number(window.prompt("Digite sua idade:"))
}

console.log("Maior de idade confirmado")
```

## Example

**Before (problemas comuns):**

```javascript
let execute = true
while (execute === true) {  // redundante
  let r = prompt("1 ou 2?")  // nome generico
  if (r == 2) {  // comparacao frouxa com number vs string
    execute = false
  }
}
```

**After (com esta skill aplicada):**

```javascript
let shouldContinue = true

while (shouldContinue) {
  const response = window.prompt("Deseja continuar? (1-Sim / 2-Nao)")

  if (response === "2") {
    shouldContinue = false
  }
}

console.log("Segue o fluxo")
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Numero de iteracoes conhecido | Prefira `for` em vez de `while` |
| Iteracoes dependem de input externo | Use `while` com variavel de controle |
| Precisa executar ao menos 1 vez | Use `do...while` |
| Iterando array/lista | Prefira `for...of` ou metodos de array |
| Condicao e booleano simples | Passe direto: `while (isActive)` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `while (flag === true)` | `while (flag)` |
| `while (true) { if (...) break }` | `while (condition) { ... }` |
| `while (x)` (nome generico) | `while (shouldContinue)` |
| `if (response == 2)` (prompt retorna string) | `if (response === "2")` |
| While sem nenhum caminho para false | Sempre inclua logica de saida no bloco |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes