# Code Examples: Projeto Conversor de Moedas

## Estrutura esperada do HTML (referencia)

```html
<!-- Input de valor -->
<input type="text" id="amount" placeholder="Digite o valor">

<!-- Select de moedas -->
<select id="currency">
  <option value="USD">Dólar Americano</option>
  <option value="EUR">Euro</option>
  <option value="GBP">Libra Esterlina</option>
</select>

<!-- Botao de conversao -->
<button id="convert">Converter em Reais</button>

<!-- Area de resultado -->
<div id="result">
  <!-- Resultado aparece aqui dinamicamente -->
</div>
```

## Padroes de implementacao esperados

### Taxas de cambio como constantes

```javascript
const exchangeRates = {
  USD: { rate: 4.87, symbol: "$" },
  EUR: { rate: 5.32, symbol: "€" },
  GBP: { rate: 6.08, symbol: "£" },
}
```

### Validacao de input (apenas inteiros)

```javascript
// Abordagem: interceptar evento de tecla e bloquear nao-numericos
amountInput.addEventListener("keypress", (event) => {
  // Permitir apenas digitos 0-9
  if (event.key < "0" || event.key > "9") {
    event.preventDefault()
  }
})
```

### Conversao e exibicao de resultado

```javascript
convertButton.addEventListener("click", () => {
  const amount = parseInt(amountInput.value)
  const selectedCurrency = currencySelect.value
  const { rate, symbol } = exchangeRates[selectedCurrency]

  const convertedValue = (amount * rate).toFixed(2)

  // Exibir: "1 [simbolo] = R$ [taxa]"
  // Exibir: "[quantidade] [simbolo] = R$ [total]"
})
```

### Formatacao de moeda brasileira

```javascript
function formatBRL(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}
```

## Extensibilidade: adicionando novas moedas

Para adicionar uma nova moeda (ex: peso argentino):

```javascript
// 1. Adicionar ao objeto de taxas
const exchangeRates = {
  USD: { rate: 4.87, symbol: "$" },
  EUR: { rate: 5.32, symbol: "€" },
  GBP: { rate: 6.08, symbol: "£" },
  ARS: { rate: 0.005, symbol: "ARS$" }, // nova moeda
}
```

```html
<!-- 2. Adicionar option no select -->
<option value="ARS">Peso Argentino</option>
```