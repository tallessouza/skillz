# Code Examples: Formatar Moeda em Real Brasileiro

## Exemplo principal da aula

```javascript
// Formata a moeda em real brasileiro
// Converte para numero para utilizar o toLocaleString para formatar no padrao BRL
function formatCurrencyBRL(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}
```

### Uso no contexto da aula (conversor de moedas)

```javascript
// Exibindo a cotacao da moeda selecionada
descriptionElement.textContent =
  `1 ${selectedCurrency} = ${formatCurrencyBRL(price)}`
```

### Resultado visual

| Input | Output |
|-------|--------|
| `30` | `R$ 30,00` |
| `"183.45"` | `R$ 183,45` |
| `1000` | `R$ 1.000,00` |
| `"1234567.89"` | `R$ 1.234.567,89` |

## Variacoes

### Formatador generico (multiplas moedas)

```javascript
function formatCurrency(value, locale, currencyCode) {
  return Number(value).toLocaleString(locale, {
    style: "currency",
    currency: currencyCode,
  })
}

// Uso
formatCurrency(100, "pt-BR", "BRL")  // R$ 100,00
formatCurrency(100, "en-US", "USD")  // $100.00
formatCurrency(100, "de-DE", "EUR")  // 100,00 €
```

### Sem simbolo da moeda (apenas formatacao numerica)

```javascript
function formatNumberBR(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

formatNumberBR(1234.5) // "1.234,50"
```

### Com tratamento de valores invalidos

```javascript
function formatCurrencyBRL(value) {
  const numericValue = Number(value)

  if (isNaN(numericValue)) {
    return "R$ 0,00"
  }

  return numericValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}
```

### Em TypeScript

```typescript
function formatCurrencyBRL(value: string | number): string {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}
```