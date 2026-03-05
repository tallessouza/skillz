# Code Examples: Obtendo a Moeda Selecionada

## Exemplo completo da aula

### HTML (estrutura do formulário)
```html
<form>
  <input type="number" id="amount" placeholder="Digite o valor" required />

  <select id="currency">
    <option value="USD">Dólar Americano</option>
    <option value="GBP">Libra Esterlina</option>
    <option value="EUR">Euro</option>
  </select>

  <button>Converter em reais</button>
</form>
```

### JavaScript (código da aula)
```javascript
// Obtendo os elementos do formulário
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const currency = document.getElementById("currency")

// Capturando o evento de submit (enviar) do formulário
form.onSubmit = (event) => {
  event.preventDefault()
  console.log(currency.value) // "USD", "GBP" ou "EUR"
}
```

## Variação: usando addEventListener

```javascript
const form = document.querySelector("form")
const currency = document.getElementById("currency")

form.addEventListener("submit", (event) => {
  event.preventDefault()
  console.log(currency.value)
})
```

## Variação: capturando múltiplos valores

```javascript
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const currency = document.getElementById("currency")

form.onSubmit = (event) => {
  event.preventDefault()

  const selectedCurrency = currency.value  // "USD"
  const enteredAmount = amount.value        // "10"

  console.log(`Converter ${enteredAmount} ${selectedCurrency} para BRL`)
  // "Converter 10 USD para BRL"
}
```

## Variação: validação antes de processar

```javascript
form.onSubmit = (event) => {
  event.preventDefault()

  const selectedCurrency = currency.value
  const enteredAmount = Number(amount.value)

  if (enteredAmount <= 0) {
    alert("Digite um valor maior que zero")
    return
  }

  // Processar conversão...
  console.log(selectedCurrency, enteredAmount)
}
```

## Variação: extraindo texto da option selecionada

```javascript
form.onSubmit = (event) => {
  event.preventDefault()

  const currencyCode = currency.value // "USD"
  const currencyName = currency.options[currency.selectedIndex].text // "Dólar Americano"

  console.log(`${currencyCode} - ${currencyName}`)
}
```

## Sem preventDefault (problema)

```javascript
// Comportamento: página recarrega ao clicar no botão
form.onSubmit = (event) => {
  // Sem preventDefault, a página "pisca" e recarrega
  console.log(currency.value) // Executa mas é perdido pelo reload
}
```

## Padrão completo para formulários de conversão

```javascript
// 1. Selecionar elementos
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const currency = document.getElementById("currency")

// 2. Escutar submit
form.onSubmit = (event) => {
  // 3. Prevenir reload
  event.preventDefault()

  // 4. Capturar valores no momento do submit
  const currencyCode = currency.value
  const amountValue = Number(amount.value)

  // 5. Usar os valores capturados
  convertToReal(amountValue, currencyCode)
}

function convertToReal(amount, currencyCode) {
  // Lógica de conversão virá nas próximas aulas
  console.log(`Convertendo ${amount} ${currencyCode} para BRL`)
}
```