# Code Examples: Completando Strings com padStart e padEnd

## Exemplo 1: Mascara de cartao de credito (exemplo principal da aula)

```javascript
// Setup: numero do cartao como string
const creditCard = "1234567812344928"
console.log(creditCard.length) // 16

// Passo 1: pegar os 4 ultimos digitos com slice negativo
const lastDigits = creditCard.slice(-4)
console.log(lastDigits) // "4928"

// Passo 2: preencher do inicio com "x" ate o tamanho original
const maskedNumber = lastDigits.padStart(creditCard.length, "x")
console.log(maskedNumber) // "xxxxxxxxxxxx4928"
```

## Exemplo 2: padEnd basico

```javascript
const number = "123"

// Preencher ate 10 caracteres com "#"
console.log(number.padEnd(10, "#"))
// "123#######"

// Verificar o tamanho
console.log(number.padEnd(10, "#").length)
// 10
```

## Exemplo 3: padEnd com fill string multi-caractere

```javascript
const number = "123"

// Fill string "oculto" e repetida e truncada no limite
console.log(number.padEnd(10, "oculto"))
// "123ocultoo"

// O padEnd para quando atinge o targetLength
// Nao completa a ultima repeticao se ultrapassaria
```

## Variacoes praticas

### Mascara de CPF (mostrar ultimos 3)

```javascript
const cpf = "12345678901"
const masked = cpf.slice(-3).padStart(cpf.length, "*")
// "********901"
```

### Zero-padding para IDs

```javascript
const orderId = "42"
const formatted = orderId.padStart(6, "0")
// "000042"
```

### Alinhamento de texto em colunas

```javascript
const items = [
  { name: "Cafe", price: "5.50" },
  { name: "Almoco", price: "32.00" },
  { name: "Agua", price: "3.00" },
]

items.forEach(item => {
  const line = item.name.padEnd(20, ".") + item.price.padStart(8, " ")
  console.log(line)
})
// "Cafe..............    5.50"
// "Almoco............   32.00"
// "Agua..............    3.00"
```

### Mascara de telefone

```javascript
const phone = "11999887766"
const maskedPhone = phone.slice(-4).padStart(phone.length, "*")
// "*******7766"
```

### Timestamp formatting

```javascript
const hours = "9"
const minutes = "5"
const time = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`
// "09:05"
```

### Binary representation com padding

```javascript
const num = 5
const binary = num.toString(2).padStart(8, "0")
// "00000101"
```