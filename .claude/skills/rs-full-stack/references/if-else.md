---
name: rs-full-stack-if-else
description: "Enforces correct if/else control flow patterns when writing JavaScript conditional logic. Use when user asks to 'add a condition', 'check if', 'handle two cases', 'write an if statement', or any branching logic task. Applies rules: else needs no condition, use for mutually exclusive paths, keep blocks focused. Make sure to use this skill whenever generating conditional code in JavaScript. Not for ternary operators, switch statements, or complex nested conditionals."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-fundamentals
  tags: [javascript, conditionals, if-else, control-flow, branching]
---

# If Else — Estrutura Condicional

> Use if/else para executar um bloco OU outro com base em uma condicao — else e o caminho alternativo quando o if nao e verdadeiro.

## Rules

1. **Else nao recebe condicao** — else executa automaticamente quando o teste do if falha, porque ele e o "senao" implicito
2. **Use if/else para caminhos mutuamente exclusivos** — quando voce quer executar uma coisa OU outra, nunca ambas, porque garante que apenas um bloco roda
3. **Mantenha blocos focados** — cada bloco (if e else) deve ter uma unica responsabilidade clara, porque facilita leitura e manutencao

## How to write

### Estrutura basica if/else

```javascript
const age = 17

if (age < 18) {
  console.log("Voce nao pode dirigir")
} else {
  console.log("Voce pode dirigir")
}
```

## Example

**Before (dois ifs independentes — incorreto para logica exclusiva):**

```javascript
const age = 23
if (age < 18) {
  console.log("Voce nao pode dirigir")
}
if (age >= 18) {
  console.log("Voce pode dirigir")
}
```

**After (com if/else — correto):**

```javascript
const age = 23
if (age < 18) {
  console.log("Voce nao pode dirigir")
} else {
  console.log("Voce pode dirigir")
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dois caminhos mutuamente exclusivos | Use if/else |
| Apenas um caminho condicional | Use if sozinho (sem else) |
| Mais de dois caminhos | Use if/else if/else |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `else (condition) {}` | `else {}` — else nao recebe condicao |
| Dois ifs com condicoes opostas | Um if/else unico |
| Else vazio sem acao | Remova o else se nao ha acao alternativa |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Else nunca executa | Condicao do if e sempre verdadeira | Revise a condicao — verifique tipos e valores com `console.log` |
| Ambos os blocos executam | Usando dois `if` separados em vez de `if/else` | Troque o segundo `if` por `else` para logica mutuamente exclusiva |
| Erro de sintaxe no else | Colocando condicao no `else` (`else (x > 5)`) | `else` nao recebe condicao — use `else if` se precisar de condicao adicional |
| Bloco vazio no else sem efeito | Else sem acao util | Remova o else se nao ha acao alternativa |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
