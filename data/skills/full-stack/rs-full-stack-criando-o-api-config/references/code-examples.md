# Code Examples: Configuração Centralizada de API

## Exemplo base da aula

```javascript
// src/services/api.js
export const apiConfig = {
  baseURL: "http://localhost:3333",
}
```

## Consumo com fetch

```javascript
// src/services/schedules.js
import { apiConfig } from "./api"

export async function getSchedules() {
  const response = await fetch(`${apiConfig.baseURL}/schedules`)
  const data = await response.json()
  return data
}

export async function createSchedule(schedule) {
  const response = await fetch(`${apiConfig.baseURL}/schedules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(schedule),
  })
  return response.json()
}
```

## Consumo com múltiplos serviços

```javascript
// src/services/users.js
import { apiConfig } from "./api"

export async function getUsers() {
  const response = await fetch(`${apiConfig.baseURL}/users`)
  return response.json()
}

// src/services/profile.js
import { apiConfig } from "./api"

export async function getProfile(userId) {
  const response = await fetch(`${apiConfig.baseURL}/profile/${userId}`)
  return response.json()
}
```

## Variação: com axios

```javascript
// src/services/api.js
import axios from "axios"

export const apiConfig = {
  baseURL: "http://localhost:3333",
}

export const api = axios.create({
  baseURL: apiConfig.baseURL,
})

// src/services/schedules.js
import { api } from "./api"

export async function getSchedules() {
  const { data } = await api.get("/schedules")
  return data
}
```

## Variação: com ambiente dinâmico

```javascript
// src/services/api.js
const isProduction = process.env.NODE_ENV === "production"

export const apiConfig = {
  baseURL: isProduction
    ? "https://api.meudominio.com"
    : "http://localhost:3333",
}
```

## Demonstração do instrutor: interpolação

O instrutor demonstrou ao vivo como a interpolação funciona:

```javascript
// Exemplo didático mostrado na aula
`${apiConfig.baseURL}/schedules`  // → "http://localhost:3333/schedules"
`${apiConfig.baseURL}/users`      // → "http://localhost:3333/users"
`${apiConfig.baseURL}/profile`    // → "http://localhost:3333/profile"
```

A vantagem: se amanhã a porta muda para 4000, basta alterar o `api.js` e todas as URLs se atualizam automaticamente.