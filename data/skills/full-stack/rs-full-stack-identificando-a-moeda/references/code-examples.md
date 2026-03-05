# Code Examples: Identificando a Moeda

## Exemplo completo da aula

### Constantes de cotacao no topo do arquivo

```javascript
const USD = 4.87
const EUR = 5.32
const GBP = 6.08
```

### Funcao de conversao

```javascript
function convertCurrency(amount, price, symbol) {
  console.log(amount, price, symbol)
}
```

### Switch-case conectando tudo

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

### Teste no console

Com input de 300 e dolar selecionado:
```
300 4.87 US$
```

Com euro:
```
300 5.32 €
```

Com libra:
```
300 6.08 £
```

## Variacoes

### Variacao 1: Com default no switch

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
  default:
    alert("Selecione uma moeda valida")
}
```

### Variacao 2: Usando objeto em vez de switch (alternativa moderna)

```javascript
const CURRENCIES = {
  USD: { rate: 4.87, symbol: "US$" },
  EUR: { rate: 5.32, symbol: "€" },
  GBP: { rate: 6.08, symbol: "£" },
}

const selected = CURRENCIES[currency.value]
if (selected) {
  convertCurrency(amount.value, selected.rate, selected.symbol)
}
```

### Variacao 3: Constantes agrupadas em objeto

```javascript
const EXCHANGE_RATES = {
  USD: 4.87,
  EUR: 5.32,
  GBP: 6.08,
}

const CURRENCY_SYMBOLS = {
  USD: "US$",
  EUR: "€",
  GBP: "£",
}
```

### Evolucao: funcao completa com calculo

```javascript
function convertCurrency(amount, price, symbol) {
  const result = amount * price
  return `${symbol} ${amount} = R$ ${result.toFixed(2)}`
}

// Uso:
// convertCurrency(100, 4.87, "US$")
// => "US$ 100 = R$ 487.00"
```