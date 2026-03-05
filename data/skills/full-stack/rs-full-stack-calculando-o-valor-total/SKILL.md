---
name: rs-full-stack-calculando-o-valor-total
description: "Enforces safe string-to-number conversion and accumulation patterns when writing JavaScript calculation logic. Use when user asks to 'calculate total', 'sum values', 'parse currency', 'convert string to number', or 'clean input values'. Applies rules: regex cleanup of non-numeric chars, comma-to-dot replacement, parseFloat with isNaN guard, accumulator with += operator. Make sure to use this skill whenever handling user-input numbers or summing displayed values from the DOM. Not for CSS formatting, number display formatting, or Intl.NumberFormat usage."
---

# Calculando o Valor Total

> Antes de somar valores extraidos do DOM, limpe caracteres nao numericos, normalize separadores decimais e valide com isNaN.

## Rules

1. **Limpe caracteres nao numericos com regex** — use `/[^\d.,]/g` para remover texto, simbolos de moeda e espacos, porque textContent do DOM retorna strings com formatacao visual
2. **Substitua virgula por ponto** — use `.replace(",", ".")` apos a limpeza, porque JavaScript usa ponto como separador decimal
3. **Converta com parseFloat** — use `parseFloat(value)` para numeros com casas decimais, porque `parseInt` descarta a parte decimal
4. **Valide com isNaN antes de somar** — faca `if (isNaN(value)) return` com mensagem amigavel, porque dados do DOM podem estar corrompidos
5. **Acumule com +=** — use `total += Number(value)` em vez de `total = total + value`, porque e mais conciso e idiomatico
6. **Declare o acumulador fora do loop** — `let total = 0` antes do `for`, porque o escopo deve sobreviver a cada iteracao

## How to write

### Limpeza e conversao de valor do DOM

```javascript
// 1. Extrair e limpar texto do elemento
let value = itemAmount.textContent
  .replace(/[^\d.,]/g, "")
  .replace(",", ".")

// 2. Converter para float
value = parseFloat(value)

// 3. Validar antes de usar
if (isNaN(value)) {
  return alert("Nao foi possivel calcular o total. O valor nao parece ser um numero.")
}

// 4. Acumular
total += Number(value)
```

### Padrao completo com loop

```javascript
let total = 0

for (let i = 0; i < items.length; i++) {
  const itemAmount = items[i].querySelector(".amount")

  let value = itemAmount.textContent
    .replace(/[^\d.,]/g, "")
    .replace(",", ".")

  value = parseFloat(value)

  if (isNaN(value)) {
    return alert("Valor invalido encontrado.")
  }

  total += Number(value)
}

expensesTotal.textContent = total
```

## Example

**Before (valor direto do DOM sem tratamento):**
```javascript
let total = 0
for (let i = 0; i < items.length; i++) {
  total += items[i].querySelector(".amount").textContent
}
// total = "0R$ 45,60R$ 15,50" (concatenacao de strings)
```

**After (com limpeza, conversao e validacao):**
```javascript
let total = 0
for (let i = 0; i < items.length; i++) {
  let value = items[i].querySelector(".amount").textContent
    .replace(/[^\d.,]/g, "")
    .replace(",", ".")

  value = parseFloat(value)

  if (isNaN(value)) {
    return alert("Valor invalido.")
  }

  total += Number(value)
}
expensesTotal.textContent = total
// total = 61.1 (numero correto)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Valor vem de textContent do DOM | Sempre limpe com regex antes de converter |
| Valor pode ter virgula decimal (pt-BR) | Replace virgula por ponto antes de parseFloat |
| Somando valores em loop | Declare `let total = 0` fora do loop, use `+=` dentro |
| Valor pode ser invalido | Guard com `isNaN()` e retorne mensagem amigavel |
| Precisa de casas decimais | Use `parseFloat`, nunca `parseInt` |
| Quer garantia extra apos parseFloat | Envolva com `Number()` no momento da soma |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `total += element.textContent` | `total += Number(parseFloat(cleaned))` |
| `parseInt(priceString)` para moeda | `parseFloat(priceString)` |
| `value.replace(",", ".")` sem limpar antes | `value.replace(/[^\d.,]/g, "").replace(",", ".")` |
| Somar sem verificar `isNaN` | `if (isNaN(value)) return alert(...)` |
| `total = total + value` | `total += value` |
| `let total` dentro do for | `let total = 0` antes do for |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre regex, parseFloat vs parseInt, e o padrao de acumulador
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes