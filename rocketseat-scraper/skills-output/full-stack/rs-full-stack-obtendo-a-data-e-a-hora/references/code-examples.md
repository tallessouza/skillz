# Code Examples: Obtendo a Data e a Hora em JavaScript

## Exemplo 1: Data e hora atual

```javascript
// Exibe a data e hora atual
console.log(new Date())
// Saida: Wed Dec 13 2023 14:30:00 GMT-0300 (Horario Padrao de Brasilia)
// O formato inclui: dia da semana, mes, dia, ano, horario, fuso
```

## Exemplo 2: Timestamp com getTime()

```javascript
// Exibe o numero de milissegundos desde epoch
console.log(new Date().getTime())
// Saida: 1702488600000
// Esse numero representa os milissegundos decorridos desde 01/jan/1970 UTC
```

## Exemplo 3: Data de referencia (epoch)

```javascript
// Exibe a data e hora de referencia (considera o fuso)
console.log(new Date(0))
// Saida: Wed Dec 31 1969 21:00:00 GMT-0300 (Horario Padrao de Brasilia)
// Em UTC seria: Thu Jan 01 1970 00:00:00 UTC
```

## Variacoes adicionais

### Criando datas com diferentes overloads

```javascript
// A partir de string ISO
const fromString = new Date("2023-12-13T14:30:00")
console.log(fromString)

// A partir de componentes (ATENCAO: mes e 0-indexed!)
const fromComponents = new Date(2023, 11, 13, 14, 30, 0)
// mes 11 = dezembro (janeiro = 0)
console.log(fromComponents)

// A partir de timestamp
const fromTimestamp = new Date(1702488600000)
console.log(fromTimestamp)
```

### Comparando datas via getTime()

```javascript
const date1 = new Date("2023-12-13")
const date2 = new Date("2023-12-14")

// Comparacao numerica — confiavel
if (date1.getTime() < date2.getTime()) {
  console.log("date1 e anterior a date2")
}
```

### Verificando o deslocamento de fuso

```javascript
const now = new Date()
const offsetInMinutes = now.getTimezoneOffset()
// BRT: 180 (3 horas * 60 minutos)
console.log(`Deslocamento: ${offsetInMinutes} minutos`)
```