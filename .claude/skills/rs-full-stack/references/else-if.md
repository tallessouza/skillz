---
name: rs-full-stack-else-if
description: "Enforces correct if/else-if/else chaining in JavaScript when writing conditional logic. Use when user asks to 'write conditions', 'check multiple cases', 'add if else', 'handle different scenarios', or any branching logic task. Applies rules: chain with else-if when only one branch should execute, use separate ifs only when multiple branches can fire independently, always end chains with else for exhaustive coverage. Make sure to use this skill whenever generating conditional branching code. Not for ternary operators, switch statements, or pattern matching."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript
  tags: [javascript, condicionais, if-else, controle-de-fluxo, branching]
---

# If Encadeado (else if / else)

> Ao escrever condicionais, escolha entre ifs separados e if encadeado com base em quantas branches devem executar: uma unica ou potencialmente varias.

## Rules

1. **Use `else if` quando apenas uma branch deve executar** — porque o JavaScript para de verificar as condicoes restantes assim que uma e satisfeita, evitando execucoes indesejadas
2. **Use ifs separados quando multiplas condicoes podem ser verdadeiras simultaneamente** — porque cada if independente e verificado separadamente, permitindo que mais de um bloco execute
3. **Finalize cadeias com `else` para cobrir o caso residual** — porque se nenhuma condicao anterior foi verdadeira, o else captura tudo que sobrou sem precisar de verificacao adicional
4. **Ordene condicoes da mais especifica para a mais generica** — porque a primeira condicao verdadeira encerra a cadeia, entao condicoes genericas primeiro engolem as especificas
5. **Combine condicoes com `&&` quando um range preciso e necessario** — `hour > 12 && hour <= 18` em vez de apenas `hour > 12`, porque condicoes amplas geram sobreposicao

## How to write

### If encadeado (uma unica branch executa)

```javascript
if (hour <= 12) {
  console.log("Bom dia")
} else if (hour > 12 && hour <= 18) {
  console.log("Boa tarde")
} else {
  console.log("Boa noite")
}
```

### Ifs separados (multiplas branches podem executar)

```javascript
if (hasPermissionA) {
  enableFeatureA()
}
if (hasPermissionB) {
  enableFeatureB()
}
if (hasPermissionC) {
  enableFeatureC()
}
```

## Example

**Before (bug — ifs separados onde deveria ser encadeado):**
```javascript
const hour = 19

if (hour <= 12) {
  console.log("Bom dia")
}
if (hour > 18) {
  console.log("Boa noite")
}
if (hour > 12) {
  console.log("Boa tarde")
}
// Output: "Boa noite" E "Boa tarde" — ambos executam!
```

**After (corrigido com else if):**
```javascript
const hour = 19

if (hour <= 12) {
  console.log("Bom dia")
} else if (hour > 18) {
  console.log("Boa noite")
} else {
  console.log("Boa tarde")
}
// Output: apenas "Boa noite"
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Saudacao por horario, status por faixa | `if / else if / else` encadeado |
| Ativar features independentes por flag | Ifs separados |
| Ultimo caso e "tudo que sobrou" | Use `else` sem condicao |
| Faixas numericas (ranges) | Combine com `&&` para delimitar inicio e fim |
| Muitas branches (5+) | Considere `switch` ou lookup object |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Ifs separados para faixas mutuamente exclusivas | `if / else if / else` encadeado |
| `else if (hour > 18)` sem delimitar o range inferior | `else if (hour > 12 && hour <= 18)` com range completo |
| Cadeia sem `else` final quando os casos sao exaustivos | Adicione `else` para capturar o residual |
| `if (x) {} else { if (y) {} }` aninhado | `if (x) {} else if (y) {}` na mesma linha |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Duas branches executam quando so uma deveria | Ifs separados em vez de if/else-if encadeado | Use else if para branches mutuamente exclusivas |
| Nenhuma branch executa | Condicoes nao cobrem o valor atual | Adicione else final para capturar o caso residual |
| Branch errada executa primeiro | Ordem das condicoes — generica antes da especifica | Ordene da mais especifica para a mais generica |
| Ranges sobrepostos causam bug | Condicao sem delimitacao completa do range | Use && para delimitar inicio e fim: hour > 12 && hour <= 18 |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre verificacao sequencial vs independente
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes