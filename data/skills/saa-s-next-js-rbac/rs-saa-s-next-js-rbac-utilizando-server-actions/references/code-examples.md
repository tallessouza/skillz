# Code Examples: Server Actions no Next.js

## Exemplo 1: Estrutura basica de arquivo de actions

```typescript
// app/auth/sign-in/actions.tsx
'use server'

export async function signInWithEmailAndPassword(data: FormData) {
  // Object.fromEntries converte FormData de:
  // [['email', 'diego@example.com'], ['password', 'Diego123']]
  // para:
  // { email: 'diego@example.com', password: 'Diego123' }
  console.log(Object.fromEntries(data))
}
```

**Nota:** O `console.log` aparece no terminal do servidor Node, nao no console do browser.

## Exemplo 2: Conectando action ao formulario

```tsx
// app/auth/sign-in/page.tsx
import { signInWithEmailAndPassword } from './actions'

export default function SignInPage() {
  return (
    <form action={signInWithEmailAndPassword}>
      <input type="email" name="email" placeholder="E-mail" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">Sign In with E-mail</button>
    </form>
  )
}
```

## Exemplo 3: Multiplas actions no mesmo arquivo

```typescript
// app/auth/sign-in/actions.tsx
'use server'

export async function signInWithEmailAndPassword(data: FormData) {
  const { email, password } = Object.fromEntries(data)
  // Logica de autenticacao com email/senha
}

export async function signInWithGitHub() {
  // Logica de autenticacao com GitHub OAuth
}
```

Cada funcao exportada recebe um `_actionId` unico gerado pelo React, garantindo que nao ha conflito mesmo com nomes iguais em arquivos diferentes.

## Exemplo 4: FormData — entries vs objeto plano

```typescript
// FormData internamente armazena como entries:
// [
//   ['email', 'diego@example.com'],
//   ['password', 'Diego123']
// ]

// Object.fromEntries converte para objeto plano:
// {
//   email: 'diego@example.com',
//   password: 'Diego123'
// }

export async function handleSubmit(data: FormData) {
  // NAO faca isso para cada campo:
  // const email = data.get('email')
  // const password = data.get('password')

  // Faca isso:
  const fields = Object.fromEntries(data)
  // fields.email, fields.password
}
```

## Exemplo 5: O que acontece no Network tab

Quando o formulario e submetido com JavaScript habilitado:

```
POST /auth/sign-in
Content-Type: multipart/form-data

Payload:
  _actionId: "abc123xyz..." (ID unico gerado pelo React)
  email: "diego@example.com"
  password: "Diego123"
```

Quando JavaScript esta desabilitado:

```
POST /auth/sign-in
Content-Type: application/x-www-form-urlencoded

Payload:
  email: "diego@example.com"
  password: "Diego123"
  (sem _actionId)
```

## Exemplo 6: Monorepo com Turborepo

```bash
# Na raiz do projeto (nao dentro de api/ ou web/)
pnpm run dev

# Turborepo executa o comando dev de todos os pacotes:
# - api: inicia o backend
# - web: inicia o Next.js na porta 3000
```