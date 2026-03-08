# Code Examples: Instalando e Configurando Axios

## Instalacao

```bash
# Com npm
npm i axios

# Com yarn
yarn add axios

# Com pnpm
pnpm add axios
```

## Configuracao basica (da aula)

```typescript
// src/services/api.ts
import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:3333",
})
```

## Consumo de recursos

O ponto central e que a baseURL permanece fixa e so o recurso muda:

```typescript
import { api } from "../services/api"

// Criar usuario — POST /users
await api.post("/users", {
  name: "João",
  email: "joao@email.com",
})

// Listar reembolsos — GET /refunds
const response = await api.get("/refunds")

// Buscar reembolso especifico — GET /refunds/123
const refund = await api.get("/refunds/123")
```

## Variacao: baseURL via variavel de ambiente

```typescript
// src/services/api.ts
import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
})
```

```env
# .env.local (desenvolvimento)
VITE_API_URL=http://localhost:3333

# .env.production
VITE_API_URL=https://api.meusite.com
```

## Variacao: multiplas instancias para APIs diferentes

```typescript
// src/services/api.ts
import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:3333",
})

// src/services/authApi.ts
import axios from "axios"

export const authApi = axios.create({
  baseURL: "http://localhost:3334",
})
```

## Variacao: adicionando headers padrao

```typescript
// src/services/api.ts
import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:3333",
  headers: {
    "Content-Type": "application/json",
  },
})
```

## Estrutura de pastas completa

```
src/
├── services/
│   └── api.ts          # Instancia centralizada do Axios
├── components/
│   └── UserForm.tsx    # Consome via import { api }
├── pages/
│   └── Dashboard.tsx   # Consome via import { api }
└── App.tsx
```

## Exemplo completo: componente consumindo a API

```typescript
// src/components/UserList.tsx
import { useEffect, useState } from "react"
import { api } from "../services/api"

interface User {
  id: string
  name: string
  email: string
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    api.get("/users").then((response) => {
      setUsers(response.data)
    })
  }, [])

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```