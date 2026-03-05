---
name: rs-full-stack-exibindo-cotacao-moeda
description: "Enforces dynamic DOM content manipulation patterns when writing vanilla JavaScript. Use when user asks to 'update page content', 'display dynamic values', 'manipulate DOM text', 'show data on screen', or 'change element text with JavaScript'. Applies getElementById selection, textContent assignment, and template literal interpolation for combining variables with static text. Make sure to use this skill whenever generating code that updates HTML content dynamically with vanilla JS. Not for React/Vue/Angular components, CSS styling, or server-side rendering."
---

# Exibindo Conteudo Dinamico no DOM

> Selecione elementos pelo ID, manipule com textContent, e use template literals para combinar variaveis com texto estatico.

## Rules

1. **Selecione elementos no topo do script** — agrupe todas as selecoes `getElementById` juntas no inicio, porque manter elementos selecionados organizados facilita manutencao e evita selecoes duplicadas
2. **Use `textContent` para texto puro** — nunca `innerHTML` quando o conteudo e apenas texto, porque evita vulnerabilidades XSS
3. **Use template literals para interpolacao** — backticks com `${variavel}` em vez de concatenacao com `+`, porque e mais legivel e menos propenso a erros de espaco
4. **Manipule valores ANTES de exibir** — calcule e formate primeiro, depois mostre o resultado pronto, porque evita flash de conteudo fixo/placeholder
5. **Mantenha texto estatico separado de dinamico** — `1` fixo no template, variaveis para o que muda, porque facilita identificar o que e dinamico

## How to write

### Selecao e organizacao de elementos

```javascript
// Agrupe selecoes no topo do script
const description = document.getElementById("description")
const amount = document.getElementById("amount")
const result = document.getElementById("result")
```

### Interpolacao com template literals

```javascript
// Combine variaveis com texto estatico usando backticks
description.textContent = `${symbol} 1 = ${price}`
```

### Ordem correta: calcular, depois exibir

```javascript
function convertCurrency(symbol, price) {
  try {
    // 1. Calcule primeiro
    description.textContent = `${symbol} 1 = ${price}`

    // 2. Exiba depois
    footer.classList.add("show")
  } catch (error) {
    console.error(error)
  }
}
```

## Example

**Before (conteudo fixo no HTML, exibido antes de calcular):**

```javascript
footer.classList.add("show")
// Conteudo fixo aparece primeiro, depois tenta atualizar
description.innerHTML = symbol + " 1 = " + price
```

**After (com esta skill aplicada):**

```javascript
function convertCurrency(symbol, price) {
  try {
    // Primeiro manipula os valores
    description.textContent = `${symbol} 1 = ${price}`

    // Depois exibe o footer ja com tudo pronto
    footer.classList.add("show")
  } catch (error) {
    console.error(error)
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Texto puro sem HTML | Use `textContent` |
| Precisa inserir HTML | Use `innerHTML` com sanitizacao |
| Combinar variaveis com texto | Template literals com backticks |
| Multiplos elementos para selecionar | Agrupe selecoes no topo do script |
| Exibir resultado de calculo | Calcule e atribua, so depois torne visivel |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `"R$ " + price + " reais"` | `` `R$ ${price} reais` `` |
| `element.innerHTML = textoSimples` | `element.textContent = textoSimples` |
| Exibir → calcular → atualizar | Calcular → atualizar → exibir |
| `document.getElementById("x")` dentro de funcao chamada repetidamente | Selecionar uma vez no topo, reusar a referencia |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre ordem de operacoes DOM e interpolacao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-exibindo-a-cotacao-da-moeda/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-exibindo-a-cotacao-da-moeda/references/code-examples.md)
