# Code Examples: Setup do Cliente HTTP (Ky)

## 1. Instalacao do Ky

```bash
# Dentro do projeto web (apps/web)
npm install ky
```

## 2. Criando a instancia do API Client

```typescript
// src/http/api-client.ts
import ky from 'ky'

export const api = ky.create({
  prefixUrl: 'http://localhost:3333',
})
```

O `prefixUrl` funciona como o `baseURL` do Axios. Todas as chamadas feitas com `api` ja partem desse endereco.

## 3. Requisicao inline (antes da organizacao)

Este foi o primeiro passo mostrado na aula — chamada direta na Server Action:

```typescript
'use server'

import { api } from '@/http/api-client'

export async function signInAction(data: FormData) {
  const email = data.get('email')
  const password = data.get('password')

  const result = await api
    .post('sessions/password', {
      json: { email, password },
    })
    .json()

  console.log(result) // unknown — sem tipagem
}
```

Problemas deste approach:
- `result` e `unknown` — sem autocomplete nem type safety
- `json: {}` aceita qualquer campo — nao valida o que esta enviando
- Logica HTTP misturada com logica da Action

## 4. Funcao tipada separada (solucao final)

```typescript
// src/http/sign-in-with-password.ts
import { api } from './api-client'

interface SignInWithPasswordRequest {
  email: string
  password: string
}

interface SignInWithPasswordResponse {
  token: string
}

export async function signInWithPassword({
  email,
  password,
}: SignInWithPasswordRequest) {
  const result = await api
    .post('sessions/password', {
      json: { email, password },
    })
    .json<SignInWithPasswordResponse>()

  return result
}
```

Pontos-chave:
- `.json<SignInWithPasswordResponse>()` — generic que tipa o retorno
- Interfaces separadas para Request e Response
- A tipagem da Response vem da rota na API (verificar manualmente)

## 5. Uso final na Server Action

```typescript
'use server'

import { signInWithPassword } from '@/http/sign-in-with-password'

export async function signInAction(data: FormData) {
  const { token } = await signInWithPassword({
    email: String(data.get('email')),
    password: String(data.get('password')),
  })

  console.log(token) // string — tipado!
}
```

## 6. Estrutura de pastas resultante

```
apps/web/src/
├── http/
│   ├── api-client.ts              # Instancia Ky centralizada
│   └── sign-in-with-password.ts   # Uma funcao por rota
├── app/
│   └── auth/
│       └── sign-in/
│           └── actions.ts         # Server Action usa funcao tipada
```

## 7. Como descobrir o tipo da Response

O instrutor mostrou que para definir a interface Response, voce vai na rota da API e verifica o retorno:

```typescript
// Na API: src/http/routes/auth/authenticate-with-password.ts
// O retorno e: { token: string }

// Entao na interface:
interface SignInWithPasswordResponse {
  token: string
}
```

## 8. Padrao para novas rotas

Para cada nova rota, crie um arquivo seguindo este template:

```typescript
// src/http/{nome-da-rota}.ts
import { api } from './api-client'

interface {NomeDaRota}Request {
  // campos que a rota recebe
}

interface {NomeDaRota}Response {
  // campos que a rota retorna
}

export async function {nomeDaRota}({
  /* desestruturacao dos campos */
}: {NomeDaRota}Request) {
  const result = await api
    .post('rota/da/api', {  // ou .get, .put, .delete, .patch
      json: { /* campos */ },
    })
    .json<{NomeDaRota}Response>()

  return result
}
```