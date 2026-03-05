# Code Examples: Convertendo Data para String

## Exemplo base da aula

```javascript
// Criando uma data com formato ISO
const date = new Date("2024-07-02T14:30:00")

// toString — representacao completa (identica ao console.log padrao)
console.log(date.toString())
// "Tue Jul 02 2024 14:30:00 GMT-0300 (Horario Padrao de Brasilia)"

// toDateString — somente a data
console.log(date.toDateString())
// "Tue Jul 02 2024"

// toTimeString — somente a hora
console.log(date.toTimeString())
// "14:30:00 GMT-0300 (Horario Padrao de Brasilia)"
```

## Variacao: exibindo em elementos HTML

```javascript
const event = new Date("2024-12-25T20:00:00")

// Card de evento mostrando so a data
document.querySelector(".event-date").textContent = event.toDateString()
// "Wed Dec 25 2024"

// Card de evento mostrando so o horario
document.querySelector(".event-time").textContent = event.toTimeString()
// "20:00:00 GMT-0300"
```

## Variacao: comparando os tres metodos lado a lado

```javascript
const now = new Date()

console.log("Completo:", now.toString())
console.log("So data:", now.toDateString())
console.log("So hora:", now.toTimeString())
```

## Variacao: usando com datas diferentes

```javascript
// Data sem horario explicito (meia-noite UTC)
const birthday = new Date("1990-05-15")
console.log(birthday.toDateString()) // "Tue May 15 1990"
console.log(birthday.toTimeString()) // "21:00:00 GMT-0300" (ajustado pela timezone)

// Data atual
const today = new Date()
console.log(today.toDateString()) // ex: "Sat Mar 01 2026"
console.log(today.toTimeString()) // ex: "10:30:45 GMT-0300"
```

## Anti-pattern: parsing manual vs metodo correto

```javascript
const date = new Date("2024-07-02T14:30:00")

// ERRADO: manipulando string manualmente para pegar so a data
const dateManual = date.toString().split(" ").slice(0, 4).join(" ")
// "Tue Jul 02 2024" — funciona, mas fragil e desnecessario

// CORRETO: usar o metodo dedicado
const dateCorrect = date.toDateString()
// "Tue Jul 02 2024" — mesmo resultado, semanticamente correto

// ERRADO: manipulando string manualmente para pegar so a hora
const timeManual = date.toString().split(" ")[4]
// "14:30:00" — perde timezone e e fragil

// CORRETO: usar o metodo dedicado
const timeCorrect = date.toTimeString()
// "14:30:00 GMT-0300 (Horario Padrao de Brasilia)"
```

## Contexto real: lista de tarefas com data e hora separados

```javascript
const tasks = [
  { title: "Reuniao de equipe", datetime: new Date("2024-07-02T14:30:00") },
  { title: "Deploy v2.0", datetime: new Date("2024-07-03T09:00:00") },
  { title: "Code review", datetime: new Date("2024-07-03T16:00:00") },
]

tasks.forEach(task => {
  console.log(`${task.title}`)
  console.log(`  Data: ${task.datetime.toDateString()}`)
  console.log(`  Hora: ${task.datetime.toTimeString()}`)
})
```