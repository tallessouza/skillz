# Code Examples: toLocaleString()

## Setup base usado na aula

```javascript
const date = new Date("2024-07-02 09:30:00")
```

## 1. toLocaleString basico

```javascript
console.log(date.toLocaleString())
// Resultado depende do ambiente (ex: "7/2/2024, 9:30:00 AM" em en-US)
```

## 2. Com locale explicito

```javascript
console.log(date.toLocaleString("en-US"))
// "7/2/2024, 9:30:00 AM"

console.log(date.toLocaleString("pt-BR"))
// "02/07/2024, 09:30:00"
```

## 3. dateStyle — todos os niveis

```javascript
// Short — versao resumida
console.log(date.toLocaleString("pt-BR", { dateStyle: "short" }))
// "02/07/2024"

// Medium — mes abreviado
console.log(date.toLocaleString("pt-BR", { dateStyle: "medium" }))
// "2 de jul. de 2024"

// Long — data por extenso
console.log(date.toLocaleString("pt-BR", { dateStyle: "long" }))
// "2 de julho de 2024"

// Full — inclui dia da semana
console.log(date.toLocaleString("pt-BR", { dateStyle: "full" }))
// "terça-feira, 2 de julho de 2024"
```

## 4. Configuracao granular

```javascript
// Apenas dia e mes com dois digitos
console.log(date.toLocaleString("pt-BR", {
  day: "2-digit",
  month: "2-digit",
}))
// "02/07"

// Dia, mes, hora e minuto
console.log(date.toLocaleString("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
}))
// "02/07, 09:30"
```

## 5. Formatacao de moeda

```javascript
const amount = 12.5

console.log(amount.toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL",
}))
// "R$ 12,50"
```

## 6. Variacoes uteis (alem da aula)

### Moeda em outros locales

```javascript
const price = 1499.99

price.toLocaleString("en-US", { style: "currency", currency: "USD" })
// "$1,499.99"

price.toLocaleString("de-DE", { style: "currency", currency: "EUR" })
// "1.499,99 €"

price.toLocaleString("ja-JP", { style: "currency", currency: "JPY" })
// "￥1,500"
```

### Combinando timeStyle com dateStyle

```javascript
date.toLocaleString("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
})
// "2 de julho de 2024, 09:30"
```

### Opcoes granulares completas

```javascript
date.toLocaleString("pt-BR", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
})
// "terça-feira, 2 de julho de 2024, 09:30:00"
```

### Formato de porcentagem

```javascript
const ratio = 0.856
ratio.toLocaleString("pt-BR", { style: "percent" })
// "86%"

ratio.toLocaleString("pt-BR", {
  style: "percent",
  minimumFractionDigits: 1,
})
// "85,6%"
```

### Numeros grandes com separador de milhar

```javascript
const population = 214000000
population.toLocaleString("pt-BR")
// "214.000.000"
```

### Controlando timezone

```javascript
date.toLocaleString("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
})
// "02/07/2024, 09:30"
```