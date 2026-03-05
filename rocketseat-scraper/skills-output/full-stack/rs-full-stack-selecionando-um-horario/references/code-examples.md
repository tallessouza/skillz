# Code Examples: Preparando Dados do Formulário para Envio à API

## Exemplo completo da aula — submit.js

```javascript
import dayjs from "dayjs"

// selectedDate é importado/acessível de outro módulo
export function handleSubmit() {
  try {
    // Recuperar nome do cliente
    const clientName = document.getElementById("client")
    const name = clientName.value.trim()

    if (!name) {
      alert("Informe o nome do cliente.")
      return
    }

    // Recuperar horário selecionado
    const hourSelected = document.querySelector(".hour-selected")

    if (!hourSelected) {
      alert("Selecione um horário.")
      return
    }

    // Recuperar somente a hora
    const hour = hourSelected.innerText.split(":")[0]

    // Inserir a hora na data selecionada
    const when = dayjs(selectedDate.value).add(hour, "hour")

    // Gerar ID único
    const id = new Date().getTime()

    console.log({ id, name, when })
  } catch (error) {
    alert("Não foi possível realizar o agendamento.")
    console.log(error)
  }
}
```

## Variação: com múltiplos campos obrigatórios

```javascript
function handleSubmit() {
  try {
    const name = document.getElementById("name").value.trim()
    if (!name) { alert("Informe o nome."); return }

    const email = document.getElementById("email").value.trim()
    if (!email) { alert("Informe o email."); return }

    const serviceSelected = document.querySelector(".service-selected")
    if (!serviceSelected) { alert("Selecione um serviço."); return }

    const hourSelected = document.querySelector(".hour-selected")
    if (!hourSelected) { alert("Selecione um horário."); return }

    const service = serviceSelected.dataset.serviceId
    const hour = hourSelected.innerText.split(":")[0]
    const when = dayjs(selectedDate.value).add(hour, "hour")
    const id = new Date().getTime()

    const appointment = { id, name, email, service, when: when.toISOString() }
    console.log(appointment)
  } catch (error) {
    alert("Não foi possível realizar o agendamento.")
    console.log(error)
  }
}
```

## Variação: extraindo hora de formato "19h00"

```javascript
// Se o texto do elemento for "19h00" em vez de "19:00"
const hour = hourSelected.innerText.split("h")[0]
```

## Variação: usando format do dayjs para exibição

```javascript
const when = dayjs(selectedDate.value).add(hour, "hour")

// Para exibir ao usuário
const formatted = when.format("DD/MM/YYYY [às] HH:mm")
console.log(formatted) // "15/01/2024 às 20:00"

// Para enviar à API (ISO 8601)
const isoString = when.toISOString()
console.log(isoString) // "2024-01-15T20:00:00.000Z"
```

## Passo a passo do split para extrair hora

```javascript
// hourSelected.innerText retorna "19:00"
const parts = "19:00".split(":")
// parts = ["19", "00"]

const hour = parts[0]
// hour = "19" (string)

// dayjs.add() aceita string numérica, converte automaticamente
dayjs(date).add("19", "hour") // funciona
dayjs(date).add(19, "hour")   // também funciona
```

## HTML referenciado na aula

```html
<!-- Input do nome do cliente -->
<input type="text" id="client" placeholder="Nome do cliente" required />

<!-- Horários renderizados dinamicamente -->
<ul class="hours">
  <li class="hour-selected">19:00</li>
  <li>20:00</li>
  <li>21:00</li>
</ul>
```