# Code Examples: Removendo Agendamentos da API

## Exemplo 1: Arquivo schedule-cancel.js completo

Exatamente como mostrado na aula:

```javascript
import { apiConfig } from "./api-config.js"

export async function scheduleCancel(id) {
  try {
    await fetch(`${apiConfig.baseURL}/schedules/${id}`, {
      method: "DELETE",
    })

    alert("Agendamento cancelado com sucesso!")
  } catch (error) {
    console.log(error)
    alert("Nao foi possivel cancelar o agendamento.")
  }
}
```

## Exemplo 2: Modulo de cancelamento na UI

O codigo que chama o cancel e recarrega a lista:

```javascript
import { scheduleCancel } from "../services/schedule-cancel.js"
import { scheduleFetchByDay } from "../services/schedule-fetch-by-day.js"

// id do agendamento ja foi capturado pelo click no botao X
// isConfirmed vem do confirm() do navegador

async function handleCancel(id) {
  // Verifica se tem ID selecionado
  if (!id) return

  // Confirma com o usuario
  const isConfirmed = confirm("Tem certeza que deseja cancelar o agendamento?")
  if (!isConfirmed) return

  // Cancela na API
  await scheduleCancel(id)

  // Recarrega os agendamentos para refletir a mudanca
  await loadSchedules()
}
```

## Exemplo 3: Variacao — funcao generica de delete para qualquer recurso

Aplicando o mesmo padrao para outros recursos:

```javascript
import { apiConfig } from "./api-config.js"

export async function deleteResource(resource, id, successMessage, errorMessage) {
  try {
    await fetch(`${apiConfig.baseURL}/${resource}/${id}`, {
      method: "DELETE",
    })

    alert(successMessage)
  } catch (error) {
    console.log(error)
    alert(errorMessage)
  }
}

// Uso:
await deleteResource("schedules", id, "Agendamento cancelado!", "Erro ao cancelar.")
await deleteResource("users", userId, "Usuario removido!", "Erro ao remover.")
```

## Exemplo 4: Variacao — com retorno de sucesso/falha

Se o chamador precisa saber se deu certo:

```javascript
export async function scheduleCancel(id) {
  try {
    await fetch(`${apiConfig.baseURL}/schedules/${id}`, {
      method: "DELETE",
    })

    alert("Agendamento cancelado com sucesso!")
    return true
  } catch (error) {
    console.log(error)
    alert("Nao foi possivel cancelar o agendamento.")
    return false
  }
}

// No chamador:
const cancelled = await scheduleCancel(id)
if (cancelled) {
  await loadSchedules()
}
```

## Exemplo 5: Fluxo completo com todos os passos anotados

```javascript
// 1. Captura o ID do agendamento selecionado
const scheduleId = getSelectedScheduleId()

// 2. Verifica se um agendamento foi selecionado
if (!scheduleId) return

// 3. Confirma com o usuario antes de deletar
const isConfirmed = confirm("Tem certeza que deseja cancelar o agendamento?")
if (!isConfirmed) return

// 4. Faz a requisicao DELETE para a API
await scheduleCancel(scheduleId)

// 5. Recarrega a lista de agendamentos (libera horario, remove da lista)
await loadSchedules()
```