# Code Examples: Exibindo o Total Dinamicamente

## Exemplo 1: Codigo exato da aula

```javascript
function convertCurrency() {
  // ... codigo anterior que define amount, price, descricao

  // calcula o total
  let total = amount * price

  // exibe o resultado
  let result = document.getElementById("result")
  result.textContent = total
}
```

HTML correspondente:
```html
<h1 id="result">0</h1>
```

## Exemplo 2: Variacao com querySelector (alternativa mencionada)

```javascript
// O instrutor mencionou que poderia usar querySelector
let result = document.querySelector("#result")
result.textContent = total
```

## Exemplo 3: Fluxo completo do conversor ate este ponto

```javascript
function convertCurrency() {
  // pega o valor digitado pelo usuario
  let amount = document.getElementById("amount").value

  // define o preco da moeda selecionada
  let price = 5.70 // exemplo: dolar

  // monta a descricao
  let description = document.getElementById("description")
  description.textContent = `${amount} Dolar americano`

  // calcula o total
  let total = amount * price

  // exibe o resultado
  let result = document.getElementById("result")
  result.textContent = total
}
```

## Exemplo 4: Anti-pattern — calculo inline

```javascript
// EVITE: calculo direto no textContent
document.getElementById("result").textContent = amount * price

// PREFIRA: variavel intermediaria
let total = amount * price
let result = document.getElementById("result")
result.textContent = total
```

## Exemplo 5: Multiplas exibicoes do mesmo valor

```javascript
// Quando o total e usado em mais de um lugar,
// a variavel intermediaria se paga
let total = amount * price

document.getElementById("result").textContent = total
document.getElementById("summary").textContent = `Total: ${total}`
console.log("Total calculado:", total)
```

## Exemplo 6: Padrao para diferentes operacoes

```javascript
// Soma
let subtotal = price1 + price2
document.getElementById("subtotal").textContent = subtotal

// Multiplicacao (caso da aula)
let total = amount * price
document.getElementById("result").textContent = total

// Divisao
let unitPrice = total / quantity
document.getElementById("unit-price").textContent = unitPrice
```

## Exemplo 7: Testando a dinamicidade

O instrutor demonstrou na aula:

```javascript
// Teste 1: amount = 20, price = 5.70
// total = 114

// Teste 2: amount = 30, price = 5.70
// total = 171

// Cada vez que convertCurrency() e chamada,
// o valor no H1 atualiza automaticamente
```