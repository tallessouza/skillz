# Code Examples: Formatando Moeda BRL

## Exemplo completo da aula

### HTML (input com placeholder)
```html
<input type="text" id="amount" placeholder="R$ 0,00" />
```

### JavaScript completo
```javascript
const inputAmount = document.getElementById("amount")

// Funcao reutilizavel de formatacao BRL
function formatCurrencyBRL(value) {
  // Transforma o valor em centavos (ex: 150 / 100 = 1.50)
  value = Number(value) / 100

  // Formata o valor no padrao BRL (Real Brasileiro)
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  // Retorna o valor formatado
  return value
}

// Captura o evento de input para formatar o valor
inputAmount.addEventListener("input", (event) => {
  // Obtem o valor atual do input e remove caracteres nao-numericos
  let value = event.target.value.replace(/\D/g, "")

  // Atualiza o valor do input com formatacao BRL
  event.target.value = formatCurrencyBRL(value)
})
```

## Variacoes

### Com valor maximo
```javascript
function formatCurrencyBRL(value) {
  value = Number(value) / 100

  // Limita valor maximo (ex: R$ 99.999,99)
  if (value > 99999.99) {
    value = 99999.99
  }

  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  return value
}
```

### Extraindo valor numerico de volta
```javascript
// Quando precisar enviar para API, extraia o numero
function parseBRLToNumber(formattedValue) {
  // Remove "R$", pontos de milhar, e troca virgula por ponto
  const cleaned = formattedValue
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim()

  return parseFloat(cleaned)
}

// Uso:
// parseBRLToNumber("R$ 1.500,00") → 1500.00
```

### Para outros locales (referencia)
```javascript
// Dolar americano
value.toLocaleString("en-US", { style: "currency", currency: "USD" })
// → "$1,500.00"

// Euro
value.toLocaleString("de-DE", { style: "currency", currency: "EUR" })
// → "1.500,00 €"

// Yen japones
value.toLocaleString("ja-JP", { style: "currency", currency: "JPY" })
// → "¥1,500"
```

### Demonstracao da conversao centavos passo a passo
```javascript
// Conforme usuario digita cada digito:
// Digita "1"     → Number("1") / 100     → 0.01   → "R$ 0,01"
// Digita "15"    → Number("15") / 100    → 0.15   → "R$ 0,15"
// Digita "150"   → Number("150") / 100   → 1.50   → "R$ 1,50"
// Digita "1500"  → Number("1500") / 100  → 15.00  → "R$ 15,00"
// Digita "15000" → Number("15000") / 100 → 150.00 → "R$ 150,00"
```