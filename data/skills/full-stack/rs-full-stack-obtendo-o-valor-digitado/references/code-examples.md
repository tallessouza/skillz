# Code Examples: Capturando Valor de Input com JavaScript

## Exemplo original da aula

### HTML
```html
<input type="text" name="amount" id="amount" placeholder="0,00" required />
```

### JavaScript
```javascript
// Capturando o input amount para receber somente números
const amount = document.getElementById("amount")

amount.addEventListener("input", () => {
  console.log(amount.value)
})
```

**Comportamento:** Ao digitar "Rodrigo", o console exibe progressivamente: "R", "Ro", "Rod", "Rodr", "Rodri", "Rodrig", "Rodrigo". Ao digitar "350": "3", "35", "350".

## Variações

### Usando querySelector (alternativa mencionada pelo instrutor)
```javascript
const amount = document.querySelector("#amount")

amount.addEventListener("input", () => {
  console.log(amount.value)
})
```

### Capturando múltiplos inputs
```javascript
const amount = document.getElementById("amount")
const currency = document.getElementById("currency")

amount.addEventListener("input", () => {
  console.log("Valor:", amount.value)
})

currency.addEventListener("input", () => {
  console.log("Moeda:", currency.value)
})
```

### Usando o parâmetro event
```javascript
const amount = document.getElementById("amount")

amount.addEventListener("input", (event) => {
  // event.target.value é equivalente a amount.value neste contexto
  console.log(event.target.value)
})
```

### Diferença entre `input` e `change`
```javascript
const amount = document.getElementById("amount")

// Dispara a cada caractere
amount.addEventListener("input", () => {
  console.log("input event:", amount.value)
})

// Dispara só ao sair do campo
amount.addEventListener("change", () => {
  console.log("change event:", amount.value)
})
```

### Armazenando o valor para uso posterior
```javascript
const amount = document.getElementById("amount")
let currentValue = ""

amount.addEventListener("input", () => {
  currentValue = amount.value
  console.log(currentValue)
})
```

### Padrão completo com múltiplas referências no topo
```javascript
// Elementos do formulário
const amount = document.getElementById("amount")
const currencyFrom = document.getElementById("currency-from")
const currencyTo = document.getElementById("currency-to")
const submitButton = document.getElementById("submit")

// Observando interações
amount.addEventListener("input", () => {
  console.log(amount.value)
})
```