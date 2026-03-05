---
name: rs-full-stack-switch-2
description: "Applies correct switch-case structure when writing JavaScript conditional logic. Use when user asks to 'handle multiple cases', 'check different options', 'replace if-else chain', 'menu options', or 'switch statement'. Ensures proper break usage, default block inclusion, and fall-through awareness. Make sure to use this skill whenever generating switch-case code or refactoring multiple if-else into switch. Not for ternary operators, simple if-else, or pattern matching."
---

# Switch Case em JavaScript

> Utilize switch-case para analisar multiplos casos discretos de forma clara, sempre com break explicito e default como fallback.

## Rules

1. **Sempre inclua break apos cada case** — sem break, a execucao "cai" para os cases seguintes (fall-through), porque o switch executa tudo abaixo do caso verdadeiro ate encontrar um break
2. **Sempre inclua um bloco default** — funciona como o else do if, captura qualquer valor nao previsto nos cases, porque e impossivel prever todos os valores possiveis
3. **Use switch para valores discretos, nao ranges** — switch compara igualdade estrita, ideal para opcoes de menu, status, tipos enumerados
4. **Cada case pode ter multiplos comandos** — nao precisa ser uma unica linha antes do break, coloque quantas instrucoes forem necessarias

## How to write

### Estrutura basica com break e default

```javascript
switch (option) {
  case 1:
    console.log("Consultar pedido")
    break
  case 2:
    console.log("Falar com atendente")
    break
  case 3:
    console.log("Cancelar pedido")
    break
  default:
    console.log("Opção inválida")
}
```

### Case com multiplos comandos

```javascript
switch (option) {
  case 1:
    console.log("Consultar pedido")
    console.log("Aguarde...")
    break
  case 2:
    console.log("Falar com atendente")
    break
  default:
    console.log("Opção inválida")
}
```

## Example

**Before (sem break — bug de fall-through):**
```javascript
let option = 2

switch (option) {
  case 1:
    console.log("Consultar pedido")
  case 2:
    console.log("Falar com atendente")
  case 3:
    console.log("Cancelar pedido")
}
// Output: "Falar com atendente" E "Cancelar pedido" (bug!)
```

**After (com break e default):**
```javascript
let option = 2

switch (option) {
  case 1:
    console.log("Consultar pedido")
    break
  case 2:
    console.log("Falar com atendente")
    break
  case 3:
    console.log("Cancelar pedido")
    break
  default:
    console.log("Opção inválida")
}
// Output: apenas "Falar com atendente"
```

## Heuristics

| Situacao | Faca |
|----------|------|
| 3+ valores discretos para comparar | Use switch em vez de if-else chain |
| Apenas 2 condicoes | if-else e mais simples |
| Comparacao com ranges (> 10, < 5) | Use if-else, switch nao suporta ranges |
| Fall-through intencional (2 cases mesma acao) | Omita break apenas nesse case, documente com comentario |
| Valor pode ser qualquer coisa | Sempre inclua default |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| case sem break (sem intencao) | case com break explicito |
| switch sem default | switch com default no final |
| case 4, case 5, case 6... para "invalido" | um unico default |
| switch para comparacoes booleanas | if-else para true/false |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre fall-through, analogia do atendimento automatizado e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes