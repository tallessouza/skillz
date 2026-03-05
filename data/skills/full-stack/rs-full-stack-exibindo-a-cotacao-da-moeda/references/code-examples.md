# Code Examples: Exibindo Conteudo Dinamico no DOM

## Exemplo completo da aula

### HTML (estrutura relevante)

```html
<footer>
  <span id="description">US$ 1 = R$ 4,86</span>
</footer>
```

### JavaScript — Selecao do elemento

```javascript
// No topo do script, junto com outras selecoes
const description = document.getElementById("description")
```

### JavaScript — Funcao convertCurrency

```javascript
function convertCurrency(symbol, price) {
  try {
    // Primeiro: manipula o conteudo
    description.textContent = `${symbol} 1 = ${price}`

    // Depois: exibe o footer
    footer.classList.add("show")
  } catch (error) {
    console.error(error)
  }
}
```

### Chamada da funcao com diferentes moedas

```javascript
// Dolar
convertCurrency("US$", 4.87)
// Resultado: "US$ 1 = 4.87"

// Euro
convertCurrency("€", 5.32)
// Resultado: "€ 1 = 5.32"

// Libra
convertCurrency("£", 6.15)
// Resultado: "£ 1 = 6.15"
```

## Variacoes e cenarios adicionais

### Variacao: multiplos elementos dinamicos

```javascript
const description = document.getElementById("description")
const totalResult = document.getElementById("total")
const currencyName = document.getElementById("currency-name")

function convertCurrency(symbol, price, name, inputValue) {
  try {
    // Manipula todos os valores primeiro
    description.textContent = `${symbol} 1 = ${price}`
    totalResult.textContent = `${symbol} ${inputValue} = ${price * inputValue}`
    currencyName.textContent = name

    // So depois exibe
    footer.classList.add("show")
  } catch (error) {
    console.error(error)
  }
}
```

### Variacao: textContent vs innerHTML

```javascript
// textContent — seguro, apenas texto
description.textContent = `${symbol} 1 = ${price}`

// innerHTML — permite HTML, cuidado com XSS
description.innerHTML = `<strong>${symbol}</strong> 1 = ${price}`
// So use innerHTML quando PRECISA de tags HTML
// E NUNCA com input do usuario sem sanitizacao
```

### Variacao: template literal multi-linha

```javascript
// Para textos mais longos, template literals permitem quebra de linha
const tooltipText = `
  Moeda: ${currencyName}
  Simbolo: ${symbol}
  Cotacao: ${price}
`
tooltip.textContent = tooltipText.trim()
```

### Anti-pattern: selecao dentro da funcao

```javascript
// ERRADO — seleciona o elemento toda vez que a funcao e chamada
function convertCurrency(symbol, price) {
  const description = document.getElementById("description") // Desnecessario
  description.textContent = `${symbol} 1 = ${price}`
}

// CORRETO — seleciona uma vez, reutiliza
const description = document.getElementById("description")

function convertCurrency(symbol, price) {
  description.textContent = `${symbol} 1 = ${price}`
}
```

### Anti-pattern: exibir antes de preparar

```javascript
// ERRADO — usuario ve conteudo fixo por um instante
function convertCurrency(symbol, price) {
  footer.classList.add("show")        // Mostra com valor antigo
  description.textContent = `${symbol} 1 = ${price}` // Depois atualiza
}

// CORRETO — prepara tudo, depois revela
function convertCurrency(symbol, price) {
  description.textContent = `${symbol} 1 = ${price}` // Prepara
  footer.classList.add("show")        // Revela pronto
}
```