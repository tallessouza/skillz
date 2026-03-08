---
name: rs-full-stack-if
description: "Enforces correct usage of JavaScript IF conditional structure when writing conditional logic. Use when user asks to 'write an if statement', 'add a condition', 'check a value', or any conditional branching task in JavaScript. Applies rules: always use braces even for single-line blocks, clear condition expressions, proper scoping. Make sure to use this skill whenever generating conditional code in JavaScript. Not for ternary operators, switch statements, or advanced control flow patterns."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-fundamentals
  tags: [javascript, conditionals, if, control-flow, braces]
---

# Estrutura de Condicao IF

> Sempre use chaves no IF, mesmo para uma unica instrucao, porque clareza de escopo previne bugs silenciosos.

## Rules

1. **Sempre use chaves** — `if (condition) { action }` nao `if (condition) action`, porque sem chaves apenas a proxima linha pertence ao IF, causando bugs quando alguem adiciona uma segunda instrucao
2. **Condicao dentro dos parenteses** — a expressao booleana vai dentro de `()`, os comandos dentro de `{}`, porque o JavaScript usa parenteses para a condicao e chaves para o escopo
3. **Nomeie a variavel pela causa** — `isBeforeNoon` nao `check`, porque a condicao fica legivel como frase

## How to write

### IF com chaves (padrao correto)

```javascript
const hour = 11

if (hour <= 12) {
  console.log("Bom dia")
  console.log("Seja bem-vindo")
}
```

### Condicao simples (ainda assim com chaves)

```javascript
if (hour <= 12) {
  console.log("Bom dia")
}
```

## Example

**Before (armadilha sem chaves):**

```javascript
const hour = 13

if (hour <= 12)
  console.log("Bom dia")
  console.log("Seja bem-vindo") // EXECUTA SEMPRE — nao pertence ao IF!
```

**After (com chaves, comportamento correto):**

```javascript
const hour = 13

if (hour <= 12) {
  console.log("Bom dia")
  console.log("Seja bem-vindo") // So executa se a condicao for verdadeira
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| IF com uma unica instrucao | Use chaves mesmo assim — clareza > economia de linha |
| IF com multiplas instrucoes | Chaves obrigatorias — sem elas, so a primeira linha pertence ao IF |
| Condicao complexa | Extraia para variavel booleana nomeada antes do IF |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `if (x) action()` (sem chaves) | `if (x) { action() }` |
| `if (hour <= 12) console.log("Bom dia")` em multiplas linhas sem chaves | `if (hour <= 12) { console.log("Bom dia") }` |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Segunda instrucao executa sempre, independente da condicao | IF sem chaves — apenas a primeira linha pertence ao bloco | Adicione `{}` em torno de todas as instrucoes do IF |
| Condicao sempre avalia como true | Usando atribuicao (`=`) em vez de comparacao (`===`) | Troque `if (x = 5)` por `if (x === 5)` |
| IF nao entra no bloco esperado | Tipo do valor e diferente do esperado (string vs number) | Use `console.log(typeof variavel)` para verificar o tipo antes da condicao |
| Erro de sintaxe "Unexpected token" | Falta de parenteses na condicao ou chave de abertura | Verifique a sintaxe: `if (condicao) { ... }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
