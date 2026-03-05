# Code Examples: Registrando Agendamento via API

## Exemplo 1: Codigo da aula (Hair Day)

### Import do metodo

```javascript
// No topo do modulo form.js, antes de capturar elementos
import { scheduleNew } from '../../services/schedule-new.js'
```

### Handler original com console.log (fase de desenvolvimento)

```javascript
form.onsubmit = (event) => {
  event.preventDefault()

  const data = {
    date: selectedDate,   // ex: "16"
    hour: selectedHour,   // ex: "20"
    name: nameInput.value // ex: "Rodrigo Gonzalez"
  }

  console.log(data)
  // Output: { date: "16", hour: "20", name: "Rodrigo Gonzalez" }
}
```

### Handler final com chamada ao servidor

```javascript
form.onsubmit = async (event) => {
  event.preventDefault()

  const data = {
    date: selectedDate,
    hour: selectedHour,
    name: nameInput.value,
  }

  await scheduleNew(data)
  alert('Agendamento realizado com sucesso!')
}
```

### Verificacao: arquivo server.json apos agendamento

```json
[
  {
    "date": "16",
    "hour": "20",
    "name": "Rodrigo Gonzalez"
  }
]
```

## Exemplo 2: Variacao com try/catch (producao)

```javascript
form.onsubmit = async (event) => {
  event.preventDefault()

  const data = {
    date: selectedDate,
    hour: selectedHour,
    name: nameInput.value,
  }

  try {
    await scheduleNew(data)
    alert('Agendamento realizado com sucesso!')
  } catch (error) {
    alert('Erro ao realizar agendamento. Tente novamente.')
    console.error('Falha no agendamento:', error)
  }
}
```

## Exemplo 3: Variacao com fetch API (mesmo padrao)

```javascript
// services/schedule-new.js
export async function scheduleNew({ date, hour, name }) {
  const response = await fetch('/api/schedules', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, hour, name }),
  })

  if (!response.ok) {
    throw new Error('Falha ao agendar')
  }

  return response.json()
}
```

## Exemplo 4: Mesmo padrao em React

```jsx
function ScheduleForm() {
  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)

    await scheduleNew({
      date: formData.get('date'),
      hour: formData.get('hour'),
      name: formData.get('name'),
    })

    alert('Agendamento realizado com sucesso!')
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

## Padrao geral: console.log → chamada real

```javascript
// PASSO 1: Validar dados (desenvolvimento)
form.onsubmit = (event) => {
  event.preventDefault()
  const data = collectFormData()
  console.log(data) // Verificar no DevTools
}

// PASSO 2: Conectar ao servidor (producao)
form.onsubmit = async (event) => {
  event.preventDefault()
  const data = collectFormData()
  await saveToServer(data) // Substituir console.log
  showSuccessMessage()
}
```