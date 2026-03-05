# Code Examples: Modificando Data e Hora em JavaScript

## Exemplo base da aula

```javascript
// Criar data inicial
const date = new Date("July 3, 2024 14:30")
console.log(date)
// Wed Jul 03 2024 14:30:00

// Modificar ano
date.setFullYear(2030)
console.log(date)
// Wed Jul 03 2030 14:30:00

// Modificar mes (0-indexed: 7 = agosto)
date.setMonth(7)
console.log(date)
// Sat Aug 03 2030 14:30:00

// Modificar dia
date.setDate(10)
console.log(date)
// Sat Aug 10 2030 14:30:00

// Modificar hora
date.setHours(18)
console.log(date)
// Sat Aug 10 2030 18:30:00

// Modificar minuto
date.setMinutes(15)
console.log(date)
// Sat Aug 10 2030 18:15:00

// Modificar segundo
date.setSeconds(30)
console.log(date)
// Sat Aug 10 2030 18:15:30
```

## Demonstracao do 0-index dos meses

```javascript
const date = new Date("July 3, 2024 14:30")

date.setMonth(0)  // Janeiro
console.log(date)  // Wed Jan 03 2024 14:30:00

date.setMonth(1)  // Fevereiro
console.log(date)  // Sat Feb 03 2024 14:30:00

date.setMonth(6)  // Julho
console.log(date)  // Wed Jul 03 2024 14:30:00

date.setMonth(7)  // Agosto
console.log(date)  // Sat Aug 03 2024 14:30:00
```

## Variacoes praticas

### Avancar um mes a partir da data atual

```javascript
const date = new Date()
date.setMonth(date.getMonth() + 1)
// Avanca exatamente 1 mes
```

### Definir para o primeiro dia do mes

```javascript
const date = new Date()
date.setDate(1)
// Agora e dia 1 do mes atual
```

### Zerar horario (meia-noite)

```javascript
const date = new Date()
date.setHours(0)
date.setMinutes(0)
date.setSeconds(0)
// Ou de forma compacta:
date.setHours(0, 0, 0, 0) // setHours aceita min, sec, ms como parametros extras
```

### Definir fim do dia

```javascript
const date = new Date()
date.setHours(23, 59, 59, 999)
// Ultimo milissegundo do dia
```

### Clonando antes de modificar

```javascript
const original = new Date("July 3, 2024 14:30")
const modified = new Date(original.getTime())

modified.setFullYear(2030)
modified.setMonth(0)
modified.setDate(1)

console.log(original) // Jul 03 2024 14:30:00 (intacto)
console.log(modified) // Jan 01 2030 14:30:00 (modificado)
```

### Cuidado com overflow de dias

```javascript
const date = new Date("January 31, 2024")
date.setMonth(1) // Fevereiro
console.log(date)
// Como fevereiro nao tem 31 dias, vai para Marco 02, 2024
// Isso e um bug comum ao manipular meses!
```