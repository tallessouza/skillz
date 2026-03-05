# Code Examples: Formatando o Total

## Exemplo 1: Interpolação básica com template literal

```javascript
// Exibindo total com texto
const total = 97.4
const display = `${total} reais`
// Resultado: "97.4 reais"
```

## Exemplo 2: Replace de ponto por vírgula (com erro)

```javascript
// ERRADO — replace não existe em Number
const total = 97.4
const formatted = total.replace(".", ",")
// TypeError: total.replace is not a function
```

## Exemplo 3: Replace de ponto por vírgula (correto)

```javascript
// CORRETO — converter para String primeiro
const total = 101.5
const formatted = String(total).replace(".", ",")
// Resultado: "101,5"

// Alternativa com toString()
const formatted2 = total.toString().replace(".", ",")
// Resultado: "101,5"
```

## Exemplo 4: Usando interpolação + replace juntos

```javascript
const total = amount * exchangeRate // ex: 493.7
const formatted = `${String(total).replace(".", ",")} reais`
// Resultado: "493,7 reais"
```

## Exemplo 5: Reutilizando formatCurrencyBRL + removendo R$

```javascript
// formatCurrencyBRL retorna algo como "R$ 493,70"
let total = amount * exchangeRate

// Reutiliza a formatação existente, remove só o prefixo
total = formatCurrencyBRL(total).replace("R$", "")
// Resultado: " 493,70" (pode precisar trim)
```

### Variação com trim

```javascript
total = formatCurrencyBRL(total).replace("R$", "").trim()
// Resultado: "493,70"
```

## Exemplo 6: Validação com isNaN + return early

```javascript
function convertCurrency() {
  const amount = document.getElementById("amount").value
  const total = amount * exchangeRate

  // Verifica se o resultado não é um número
  if (isNaN(total)) {
    alert("Por favor digite o valor corretamente para converter")
    return // Para a execução aqui
  }

  // Só chega aqui se total for número válido
  total = formatCurrencyBRL(total).replace("R$", "")
  document.getElementById("result").textContent = `${total} reais`
}
```

## Exemplo 7: Demonstração do isNaN no console

```javascript
const total = 20 * NaN // ou qualquer operação que resulte NaN
console.log(total) // NaN
console.log(isNaN(total)) // true — "not a number" confirma que não é número
```

## Exemplo 8: Fluxo completo da função

```javascript
function convertCurrency() {
  const amount = Number(document.getElementById("amount").value)
  const currency = document.getElementById("currency").value

  let exchangeRate
  if (currency === "USD") exchangeRate = 4.87
  if (currency === "EUR") exchangeRate = 5.32

  let total = amount * exchangeRate

  // Guard clause — valida tipo
  if (isNaN(total)) {
    alert("Por favor digite o valor corretamente para converter")
    return
  }

  // Formata reutilizando função existente
  total = formatCurrencyBRL(total).replace("R$", "").trim()

  // Exibe com interpolação
  document.getElementById("result").textContent = `${total} reais`
}
```

### Variações de formatação

```javascript
// Se não tem formatCurrencyBRL disponível, abordagem manual:
const formatted = String(total).replace(".", ",")
document.getElementById("result").textContent = `${formatted} reais`

// Se quer controlar casas decimais:
const formatted = total.toFixed(2) // "493.70" (ainda string com ponto)
const display = formatted.replace(".", ",") // "493,70"
```