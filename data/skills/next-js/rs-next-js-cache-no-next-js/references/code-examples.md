# Code Examples: Cache no Next.js

## Habilitando cache no next.config

```typescript
// next.config.ts
const nextConfig = {
  cacheComponents: true, // Necessario enquanto API e experimental
}
export default nextConfig
```

Apos mudar, reiniciar o servidor (`npm run dev`) para garantir que nao ha problemas.

## useCache basico em listagem

```typescript
// Funcao que busca issues do board
async function listIssues() {
  'use cache'

  const response = await fetch('https://api.example.com/issues')
  const issues = await response.json()
  return issues
}
```

Sem configuracao adicional, cache dura 15 minutos (default).

## useCache com cacheLife

```typescript
import { cacheLife } from 'next/cache'

async function listIssues() {
  'use cache'
  cacheLife('minutes') // Atualiza a cada minuto

  const response = await fetch('https://api.example.com/issues')
  const issues = await response.json()
  return issues
}
```

Opcoes disponiveis: `'seconds'`, `'minutes'`, `'hours'`, `'days'`, `'weeks'`, `'max'`.

## useCache com cacheTag para invalidacao

```typescript
import { cacheLife, cacheTag } from 'next/cache'

async function listIssueComments(issueId: string) {
  'use cache'
  cacheLife('minutes')
  cacheTag(`issue-comments-${issueId}`)

  const response = await fetch(`https://api.example.com/issues/${issueId}/comments`)
  const comments = await response.json()
  return comments
}
```

A tag usa template literal com o `issueId` para criar uma chave unica por issue.

## Invalidacao com updateTag em server action

```typescript
import { updateTag } from 'next/cache'

async function createComment(issueId: string, content: string) {
  'use server'

  // Cria o comentario no banco/API
  await api.createComment({ issueId, content })

  // Invalida o cache da listagem de comentarios dessa issue
  updateTag(`issue-comments-${issueId}`)
}
```

A chave passada para `updateTag` deve ser identica a usada em `cacheTag`.

## Suspense obrigatorio com cache habilitado

```tsx
// Antes: SearchInput sem Suspense (causa erro com cacheComponents)
import { SearchInput } from './search-input'

export function Header() {
  return (
    <header>
      <SearchInput />  {/* Erro: use client sem Suspense */}
    </header>
  )
}

// Depois: envolvido com Suspense
import { Suspense } from 'react'
import { SearchInput } from './search-input'

export function Header() {
  return (
    <header>
      <Suspense>
        <SearchInput />
      </Suspense>
    </header>
  )
}
```

## loading.tsx obrigatorio por pagina

```tsx
// app/board/loading.tsx
export default function BoardLoading() {
  return <div>Carregando...</div>
  // Ideal: skeleton screen com a estrutura visual da pagina
}
```

Toda pagina que carrega dados asincronos deve ter um `loading.tsx` para feedback visual.

## Reset de formulario apos mutacao

```tsx
'use client'

import { useRef } from 'react'

export function CommentForm({ issueId }: { issueId: string }) {
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    await createComment(issueId, formData.get('content') as string)
    formRef.current?.reset() // Limpa o formulario apos criar
  }

  return (
    <form ref={formRef} action={handleSubmit}>
      <input name="content" />
      <button type="submit">Enviar</button>
    </form>
  )
}
```

## Separacao arquitetural: cacheavel vs nao-cacheavel

```typescript
// CACHEAVEL: dados identicos para todos os usuarios
async function getBoardCards() {
  'use cache'
  cacheLife('minutes')
  cacheTag('board-cards')
  return await api.listCards() // Nao usa headers/cookies
}

// NAO CACHEAVEL: dados especificos do usuario logado
async function getUserInteractions(userId: string) {
  // Sem useCache — depende do usuario autenticado
  const session = await cookies()
  return await api.getInteractions(userId, session)
}
```

## O que NAO funciona com useCache

```typescript
// ERRO: Next.js bloqueia isso
async function getUserData() {
  'use cache' // ❌ Vai dar erro

  const session = await cookies() // Nao pode acessar cookies em funcao cacheada
  const headersList = await headers() // Nao pode acessar headers tambem

  return await api.getUser(session.userId)
}
```

O Next.js retorna erro explicito: "Em uma funcao que tem useCache, voce nao pode carregar informacao de headers ou cookies."