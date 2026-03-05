# Code Examples: Filtragem de Input para Somente Números

## Exemplo original da aula (passo a passo)

O instrutor constrói incrementalmente:

### Passo 1: Capturar o valor
```javascript
// Dentro do event listener do input
const value = amalt.value
console.log(value) // Mostra tudo que o usuário digitou, incluindo letras
```

### Passo 2: Aplicar replace com regex
```javascript
const value = amalt.value.replace(/\D/g, "")
console.log(value) // Agora só mostra números — letras foram removidas
```

### Passo 3: Devolver ao input
```javascript
amalt.value = amalt.value.replace(/\D/g, "")
// Agora o input visualmente só aceita números
```

## Variações práticas

### Input de valor monetário (somente inteiros)
```javascript
const amountInput = document.getElementById("amount")

amountInput.addEventListener("input", () => {
  amountInput.value = amountInput.value.replace(/\D/g, "")
})
```

### Input que aceita decimais
```javascript
priceInput.addEventListener("input", () => {
  // Remove tudo que não é dígito ou ponto
  let value = priceInput.value.replace(/[^0-9.]/g, "")

  // Garante apenas um ponto decimal
  const parts = value.split(".")
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("")
  }

  priceInput.value = value
})
```

### Input de CEP (números com máscara)
```javascript
cepInput.addEventListener("input", () => {
  let value = cepInput.value.replace(/\D/g, "")

  // Aplica máscara: 12345-678
  if (value.length > 5) {
    value = value.slice(0, 5) + "-" + value.slice(5, 8)
  }

  cepInput.value = value
})
```

### Input de CPF (números com máscara)
```javascript
cpfInput.addEventListener("input", () => {
  let value = cpfInput.value.replace(/\D/g, "")

  // Aplica máscara: 123.456.789-00
  if (value.length > 3) value = value.slice(0, 3) + "." + value.slice(3)
  if (value.length > 7) value = value.slice(0, 7) + "." + value.slice(7)
  if (value.length > 11) value = value.slice(0, 11) + "-" + value.slice(11, 13)

  cpfInput.value = value
})
```

### Reutilizável como função
```javascript
function allowOnlyNumbers(inputElement) {
  inputElement.addEventListener("input", () => {
    inputElement.value = inputElement.value.replace(/\D/g, "")
  })
}

// Uso
allowOnlyNumbers(document.getElementById("amount"))
allowOnlyNumbers(document.getElementById("quantity"))
```

### Com limite de caracteres
```javascript
function allowOnlyNumbers(inputElement, maxLength) {
  inputElement.addEventListener("input", () => {
    let value = inputElement.value.replace(/\D/g, "")

    if (maxLength) {
      value = value.slice(0, maxLength)
    }

    inputElement.value = value
  })
}

// CEP: máximo 8 dígitos
allowOnlyNumbers(document.getElementById("cep"), 8)
```