# Code Examples: Métodos para Trabalhar com Data e Hora

## Exemplo base do instrutor

```javascript
// Criando uma data com string ISO
const date = new Date("2024-07-02T14:30:10")

console.log(date)
// Tue Jul 02 2024 14:30:10 GMT-0300

// Dia da semana (0 = domingo, 6 = sábado)
console.log(date.getDay())        // 2 (terça-feira)

// Dia do mês (1-31, NÃO começa do zero)
console.log(date.getDate())       // 2

// Mês (0-11, precisa de +1 para exibição)
console.log(date.getMonth())      // 6 (representa julho)
console.log(date.getMonth() + 1)  // 7 (julho corrigido)

// Ano completo
console.log(date.getFullYear())   // 2024

// Hora, minutos, segundos
console.log(date.getHours())      // 14
console.log(date.getMinutes())    // 30
console.log(date.getSeconds())    // 10
```

## Variação: Formatando data completa em português

```javascript
const date = new Date("2024-07-02T14:30:10")

const weekdays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]
const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

const formatted = `${weekdays[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`
// "Terça-feira, 2 de Julho de 2024"

const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
// "14:30:10"
```

## Variação: Formatando com zero à esquerda

```javascript
function padZero(num) {
  return String(num).padStart(2, "0")
}

const date = new Date("2024-07-02T14:30:10")

const dateStr = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`
// "2024-07-02"

const timeStr = `${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`
// "14:30:10"
```

## Variação: Extraindo componentes para um objeto

```javascript
function extractDateParts(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    weekday: date.getDay(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  }
}

const parts = extractDateParts(new Date("2024-07-02T14:30:10"))
// { year: 2024, month: 7, day: 2, weekday: 2, hours: 14, minutes: 30, seconds: 10 }
```

## Variação: Verificando dia da semana

```javascript
function isWeekend(date) {
  const day = date.getDay()
  return day === 0 || day === 6
}

const date = new Date("2024-07-02T14:30:10")
console.log(isWeekend(date)) // false (terça-feira)

const saturday = new Date("2024-07-06T10:00:00")
console.log(isWeekend(saturday)) // true
```