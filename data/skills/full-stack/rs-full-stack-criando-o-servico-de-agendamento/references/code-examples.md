# Code Examples: Criando Servicos de Requisicao POST

## Exemplo completo da aula

```javascript
import { apiConfig } from "./api-config.js"

export async function scheduleNew({ id, name, when }) {
  try {
    await fetch(`${apiConfig.baseUrl}/schedules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name, when }),
    })

    alert("Agendamento realizado com sucesso!")
  } catch (error) {
    console.log(error)
    alert("Nao foi possivel agendar. Tente novamente mais tarde.")
  }
}
```

## Variacao: servico generico de POST

```javascript
import { apiConfig } from "./api-config.js"

export async function postToApi(resource, data) {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/${resource}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    return await response.json()
  } catch (error) {
    console.log(error)
    throw error
  }
}
```

## Variacao: com validacao de resposta

```javascript
import { apiConfig } from "./api-config.js"

export async function scheduleNew({ id, name, when }) {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/schedules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name, when }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    alert("Agendamento realizado com sucesso!")
  } catch (error) {
    console.log(error)
    alert("Nao foi possivel agendar. Tente novamente mais tarde.")
  }
}
```

## Demonstracao: flexibilidade do objeto desestruturado

```javascript
// Todas estas chamadas funcionam identicamente:
scheduleNew({ id: "1", name: "Maria", when: "2024-03-15T10:00" })
scheduleNew({ name: "Maria", when: "2024-03-15T10:00", id: "1" })
scheduleNew({ when: "2024-03-15T10:00", id: "1", name: "Maria" })

// Se fosse com argumentos posicionais, so a primeira ordem funcionaria
```

## Arquivo api-config.js (referencia)

```javascript
export const apiConfig = {
  baseUrl: "http://localhost:3000",
}
```

## Estrutura de pastas do projeto

```
src/
├── services/          (ou servers/)
│   ├── api-config.js  # Config centralizada da API
│   └── schedule-new.js # Servico de criar agendamento
└── ...
```