---
name: rs-full-stack-exibindo-o-total
description: "Applies dynamic total calculation and DOM display patterns when writing vanilla JavaScript. Use when user asks to 'calculate a total', 'display result on page', 'multiply values and show', 'update DOM with calculation', or 'show computed value in HTML'. Ensures proper variable creation, arithmetic operations, and getElementById + textContent usage for displaying results. Make sure to use this skill whenever generating vanilla JS that computes and renders values dynamically. Not for React/framework components, CSS styling, or number formatting."
---

# Exibindo o Total Dinamicamente

> Calcule valores dinamicamente e exiba no DOM usando getElementById e textContent.

## Rules

1. **Armazene calculos em variaveis nomeadas** — `let total = amount * price` nao inline no DOM, porque facilita debug e reutilizacao do valor
2. **Use getElementById para selecionar por ID** — `document.getElementById("result")` nao querySelector quando o elemento ja tem ID, porque e mais direto e explicito
3. **Use textContent para exibir texto** — `element.textContent = total` nao innerHTML, porque textContent e mais seguro e performatico para texto puro
4. **Separe selecao do DOM da logica** — selecione elementos primeiro, depois atribua valores, porque mantem o codigo legivel
5. **Comente blocos logicos** — `// calcula o total` antes do bloco de calculo, porque orienta leitura rapida do fluxo

## How to write

### Calculo e exibicao basica

```javascript
// calcula o total
let total = amount * price

// exibe o resultado
let result = document.getElementById("result")
result.textContent = total
```

### Padrao completo dentro de uma funcao

```javascript
function convertCurrency() {
  // ... logica anterior (descricao, etc)

  // calcula o total
  let total = amount * price

  // exibe o resultado
  let result = document.getElementById("result")
  result.textContent = total
}
```

## Example

**Before (valor estatico no HTML):**
```html
<h1 id="result">0</h1>
```
```javascript
// total nunca atualiza, fica fixo no HTML
```

**After (com calculo dinamico):**
```html
<h1 id="result">0</h1>
```
```javascript
function convertCurrency() {
  let amount = 20
  let price = 5.70

  // calcula o total
  let total = amount * price

  // exibe o resultado
  let result = document.getElementById("result")
  result.textContent = total
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Elemento tem ID no HTML | Use `getElementById` direto |
| Elemento sem ID, so classe | Use `querySelector(".classe")` |
| Exibir texto puro (numeros, strings) | Use `textContent` |
| Exibir HTML formatado | Use `innerHTML` (com cuidado) |
| Valor sera usado mais de uma vez | Armazene em variavel antes de exibir |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `document.getElementById("result").textContent = amount * price` | `let total = amount * price; result.textContent = total` |
| `result.innerHTML = total` (para texto simples) | `result.textContent = total` |
| `querySelector("#result")` quando tem ID | `getElementById("result")` |
| Calculo sem variavel intermediaria | Variavel nomeada (`total`, `subtotal`) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre getElementById vs querySelector e textContent vs innerHTML
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-exibindo-o-total/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-exibindo-o-total/references/code-examples.md)
