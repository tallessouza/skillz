# Code Examples: Suspense API no React

## Exemplo 1: Componente assincrono extraido

O instrutor cria `components/github-profile.tsx`:

```tsx
// components/github-profile.tsx
export async function GitHubProfile() {
  await new Promise(resolve => setTimeout(resolve, 2000)) // simula latencia

  const response = await fetch('https://api.github.com/users/diego3g')
  const data = await response.json()

  return (
    <div>
      <img src={data.avatar_url} alt="" />
      <p>{data.name}</p>
      <p>{data.bio}</p>
    </div>
  )
}
```

## Exemplo 2: Componente de espera longa (demonstracao)

```tsx
// components/long-wait-component.tsx
export async function LongWaitComponent() {
  await new Promise(resolve => setTimeout(resolve, 5000)) // 5 segundos

  return <p>Carregado</p>
}
```

## Exemplo 3: Pagina SEM Suspense (problema)

```tsx
// app/page.tsx — ANTES (tudo bloqueado)
import { GitHubProfile } from '@/components/github-profile'
import { LongWaitComponent } from '@/components/long-wait-component'

export default async function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>Texto estatico</p>
      <LongWaitComponent />
      <GitHubProfile />
    </div>
  )
}
// Resultado: usuario espera 5 segundos para ver QUALQUER coisa
```

## Exemplo 4: Pagina COM Suspense (solucao)

```tsx
// app/page.tsx — DEPOIS (renderizacao progressiva)
import { Suspense } from 'react'
import { GitHubProfile } from '@/components/github-profile'
import { LongWaitComponent } from '@/components/long-wait-component'

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>Texto estatico</p>

      <Suspense fallback={<p>Carregando long wait component...</p>}>
        <LongWaitComponent />
      </Suspense>

      <Suspense fallback={<p>Carregando GitHub Profile...</p>}>
        <GitHubProfile />
      </Suspense>
    </div>
  )
}
// Resultado:
// 0s  → H1 + P aparecem + dois fallbacks
// 2s  → GitHubProfile substitui seu fallback
// 5s  → LongWaitComponent substitui seu fallback
```

## Exemplo 5: Quando loading.tsx e necessario

```tsx
// app/page.tsx — page async com await direto
export default async function Home() {
  await new Promise(resolve => setTimeout(resolve, 1000))

  return (
    <div>
      <h1>Home</h1>
      <Suspense fallback={<p>Carregando perfil...</p>}>
        <GitHubProfile />
      </Suspense>
    </div>
  )
}

// app/loading.tsx — loading global para a page
export default function Loading() {
  return <p>Carregando...</p>
}
// O loading.tsx cobre o await da page (1s)
// O Suspense cobre o GitHubProfile (2s adicionais)
```

## Variacao: Skeleton Screen como fallback

```tsx
function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-16 w-16 rounded-full bg-gray-200" />
      <div className="h-4 w-32 bg-gray-200 mt-2" />
      <div className="h-3 w-48 bg-gray-200 mt-1" />
    </div>
  )
}

// Uso
<Suspense fallback={<ProfileSkeleton />}>
  <GitHubProfile />
</Suspense>
```

## Variacao: Multiplos fetches agrupados no mesmo boundary

```tsx
// Quando dois componentes SEMPRE aparecem juntos e tem latencia similar,
// um unico Suspense pode fazer sentido:
<Suspense fallback={<UserCardSkeleton />}>
  <UserAvatar userId={id} />
  <UserBio userId={id} />
</Suspense>

// Mas se tem latencias DIFERENTES, separe:
<Suspense fallback={<AvatarSkeleton />}>
  <UserAvatar userId={id} />  {/* 500ms */}
</Suspense>
<Suspense fallback={<BioSkeleton />}>
  <UserBio userId={id} />  {/* 3s */}
</Suspense>
```