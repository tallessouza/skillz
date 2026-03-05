---
name: rs-full-stack-identificando-a-moeda
description: "Applies currency conversion patterns using switch-case and named constants in JavaScript. Use when user asks to 'convert currency', 'use switch case', 'create constants for values', 'handle multiple options', or 'build a converter'. Enforces uppercase constants for reusable values, switch-case for multi-option branching, and parameterized functions. Make sure to use this skill whenever generating code that selects between multiple fixed options or uses repeated magic values. Not for API integration, real-time exchange rates, or internationalization (i18n)."
---

# Conversao de Moedas com Switch-Case e Constantes

> Valores reutilizaveis vivem em constantes nomeadas no topo do arquivo; selecao entre opcoes fixas usa switch-case.

## Rules

1. **Constantes para valores reutilizaveis em UPPER_CASE** — `const USD = 4.87` nao `const usd = 4.87`, porque a convencao UPPER_CASE sinaliza que e uma referencia fixa reutilizada em varios lugares
2. **Nunca use valores magicos repetidos** — defina uma constante e referencie-a, porque se o valor muda voce atualiza em um unico lugar
3. **Use switch-case para selecao entre opcoes conhecidas** — quando ha 3+ opcoes fixas (moedas, tipos, categorias), switch-case e mais legivel que if-else encadeado
4. **Sempre inclua break em cada case** — porque sem break o JavaScript executa todos os cases seguintes (fall-through)
5. **Funcoes recebem parametros explicitos** — `convertCurrency(amount, price, symbol)` nao valores globais, porque parametros tornam a funcao testavel e reutilizavel
6. **Teste incrementalmente** — nao espere o projeto inteiro ficar pronto; teste cada etapa com console.log antes de seguir

## How to write

### Constantes no topo do arquivo

```javascript
// Cotacao de moedas — altere aqui e todos os usos atualizam
const USD = 4.87
const EUR = 5.32
const GBP = 6.08
```

### Funcao parametrizada

```javascript
function convertCurrency(amount, price, symbol) {
  // amount: valor que o usuario quer converter
  // price: cotacao da moeda
  // symbol: simbolo para exibicao (US$, €, £)
  console.log(amount, price, symbol)
}
```

### Switch-case para selecao de moeda

```javascript
switch (currency.value) {
  case "USD":
    convertCurrency(amount.value, USD, "US$")
    break
  case "EUR":
    convertCurrency(amount.value, EUR, "€")
    break
  case "GBP":
    convertCurrency(amount.value, GBP, "£")
    break
}
```

## Example

**Before (valores magicos espalhados):**
```javascript
if (moeda === "USD") {
  converter(valor, 4.87, "$")
} else if (moeda === "EUR") {
  converter(valor, 5.32, "€")
} else if (moeda === "GBP") {
  converter(valor, 6.08, "£")
}
// Se o dolar muda, precisa achar todos os 4.87 no codigo
```

**After (constantes + switch):**
```javascript
const USD = 4.87
const EUR = 5.32
const GBP = 6.08

switch (moeda) {
  case "USD":
    converter(valor, USD, "US$")
    break
  case "EUR":
    converter(valor, EUR, "€")
    break
  case "GBP":
    converter(valor, GBP, "£")
    break
}
// Dolar mudou? Altera so a constante USD
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Valor usado em 2+ lugares | Extraia para constante UPPER_CASE |
| 3+ opcoes fixas a selecionar | Use switch-case com break |
| Funcao precisa de 3+ dados | Receba como parametros, nao acesse globais |
| Desenvolvendo feature nova | Teste cada etapa com console.log antes de seguir |
| Simbolo especial (€, £) | Copie do Google, nao tente adivinhar o atalho |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `converter(valor, 4.87, "$")` repetido | `const USD = 4.87; converter(valor, USD, "US$")` |
| `if/else if/else if` para 3+ opcoes fixas | `switch-case` com `break` |
| `switch` sem `break` | Cada `case` termina com `break` |
| Valores de cotacao inline em 5 arquivos | Uma constante no topo, importada onde necessario |
| Testar tudo no final | Testar incrementalmente a cada etapa |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre constantes vs valores fixos, convencoes e switch-case
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-identificando-a-moeda/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-identificando-a-moeda/references/code-examples.md)
