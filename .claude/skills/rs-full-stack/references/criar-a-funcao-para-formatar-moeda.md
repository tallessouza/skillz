---
name: rs-full-stack-formatar-moeda
description: "Applies Brazilian currency formatting (BRL) using toLocaleString when writing JavaScript/TypeScript code. Use when user asks to 'format currency', 'format money', 'display price', 'show BRL value', or any monetary display task. Enforces Number() conversion before toLocaleString, reusable formatter functions, and pt-BR locale with currency style. Make sure to use this skill whenever code involves displaying monetary values in Brazilian Real. Not for date formatting, number formatting without currency, or i18n setup."
---

# Formatar Moeda em Real Brasileiro (BRL)

> Crie funcoes reutilizaveis de formatacao monetaria usando Number() + toLocaleString com locale pt-BR e style currency.

## Rules

1. **Sempre converta para Number antes de formatar** — `Number(value).toLocaleString(...)` nao `value.toLocaleString(...)`, porque valores vindos de inputs/APIs sao strings e toLocaleString nao aparece no IntelliSense sem a conversao
2. **Extraia a formatacao em funcao reutilizavel** — crie `formatCurrencyBRL(value)` ao inves de formatar inline, porque voce vai precisar formatar moeda em multiplos lugares do codigo
3. **Use pt-BR como locale** — primeiro argumento do toLocaleString define o padrao de separadores (ponto para milhar, virgula para decimal)
4. **Use style: "currency" com currency: "BRL"** — isso adiciona automaticamente o prefixo "R$" no formato correto
5. **Retorne o valor direto** — `return Number(value).toLocaleString(...)` sem variaveis intermediarias desnecessarias, porque a funcao tem responsabilidade unica

## How to write

### Funcao formatadora reutilizavel

```javascript
// Converte para numero para acessar toLocaleString, formata no padrao BRL
function formatCurrencyBRL(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}
```

### Uso da funcao

```javascript
// Em qualquer lugar que precise exibir valor monetario
const formattedPrice = formatCurrencyBRL(price)
element.textContent = `${description} ${formatCurrencyBRL(amount)}`
```

## Example

**Before (formatacao inline, sem conversao):**

```javascript
const price = apiResponse.price // string "183.45"
element.textContent = `R$ ${price}` // "R$ 183.45" — sem separador de milhar, formato manual
```

**After (com funcao reutilizavel):**

```javascript
function formatCurrencyBRL(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

const price = apiResponse.price // string "183.45"
element.textContent = formatCurrencyBRL(price) // "R$ 183,45" — formato correto
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Valor vem de input ou API (string) | Sempre envolva com `Number()` antes de formatar |
| Precisa formatar moeda em 2+ lugares | Extraia para funcao `formatCurrencyBRL` |
| Precisa exibir valor sem "R$" | Use `style: "decimal"` ao inves de `currency` |
| Moeda diferente de BRL | Crie funcao separada ou parametrize o currency |
| IntelliSense nao mostra toLocaleString | Valor nao e number — converta com `Number()` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `` `R$ ${price}` `` (concatenacao manual) | `formatCurrencyBRL(price)` |
| `value.toLocaleString(...)` sem Number() | `Number(value).toLocaleString(...)` |
| Formatacao inline repetida em varios lugares | Funcao reutilizavel `formatCurrencyBRL` |
| `parseFloat(value).toFixed(2)` para moeda | `Number(value).toLocaleString("pt-BR", {...})` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre tipagem dinamica, casting e IntelliSense
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-criar-a-funcao-para-formatar-moeda/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-criar-a-funcao-para-formatar-moeda/references/code-examples.md)
