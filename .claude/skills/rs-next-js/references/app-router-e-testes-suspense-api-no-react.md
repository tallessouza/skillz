---
name: rs-nextjs-app-router-suspense-api
description: "Applies React Suspense API patterns when building Next.js pages with multiple async components. Use when user asks to 'add loading states', 'show skeleton while loading', 'load components independently', 'avoid blocking the whole page', or 'use Suspense'. Wraps slow async Server Components in Suspense boundaries with fallback UI instead of blocking entire page render. Make sure to use this skill whenever a Next.js page contains multiple async components or fetch calls. Not for client-side loading states, React.lazy code-splitting, or global page-level loading.tsx files."

metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: app-router-e-testes
  tags: [next-js, react-suspense, streaming, progressive-rendering, async-components, loading]
---

# Suspense API no React (Next.js App Router)

> Envolver cada componente assincrono independente em um Suspense boundary para que a pagina renderize progressivamente, sem esperar o componente mais lento.

## Rules

1. **Um Suspense por componente assincrono independente** — cada fetch de dados que pode resolver em tempos diferentes merece seu proprio boundary, porque o Next.js por padrao aguarda TODOS os componentes assincronos finalizarem antes de exibir qualquer coisa
2. **Fallback descreve O QUE esta carregando** — `<Suspense fallback={<p>Carregando perfil...</p>}>` nao `<p>Carregando...</p>` generico, porque o usuario precisa saber qual secao ainda esta pendente
3. **Extraia fetches para componentes separados** — mova cada fetch de dados para seu proprio Server Component assincrono, porque Suspense so funciona em boundaries de componentes, nao dentro de um unico componente
4. **loading.tsx e para a pagina inteira** — use loading.tsx quando o proprio componente da page e assincrono (tem await no nivel da page), use Suspense quando quer loading granular por secao
5. **Conteudo estatico nunca deve esperar fetch** — se um H1 ou paragrafo nao depende de dados, ele deve aparecer instantaneamente, porque bloquear conteudo pronto e desperdicio de tempo do usuario

## How to write

### Pagina com multiplos componentes assincronos

```tsx
import { Suspense } from 'react'
import { GitHubProfile } from '@/components/github-profile'
import { RecentPosts } from '@/components/recent-posts'

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>Conteudo estatico aparece instantaneamente</p>

      <Suspense fallback={<p>Carregando perfil...</p>}>
        <GitHubProfile />
      </Suspense>

      <Suspense fallback={<p>Carregando posts...</p>}>
        <RecentPosts />
      </Suspense>
    </div>
  )
}
```

### Server Component assincrono extraido

```tsx
export async function GitHubProfile() {
  const response = await fetch('https://api.github.com/users/diego3g')
  const data = await response.json()

  return (
    <div>
      <img src={data.avatar_url} alt="" />
      <p>{data.name}</p>
    </div>
  )
}
```

## Example

**Before (tudo bloqueado pelo componente mais lento):**
```tsx
export default async function Home() {
  const profile = await fetchProfile()    // 2s
  const analytics = await fetchAnalytics() // 5s
  // Usuario espera 5s para ver QUALQUER coisa

  return (
    <div>
      <h1>Dashboard</h1>
      <Profile data={profile} />
      <Analytics data={analytics} />
    </div>
  )
}
```

**After (renderizacao progressiva com Suspense):**
```tsx
import { Suspense } from 'react'

export default function Home() {
  return (
    <div>
      <h1>Dashboard</h1> {/* instantaneo */}

      <Suspense fallback={<ProfileSkeleton />}>
        <Profile /> {/* aparece em 2s */}
      </Suspense>

      <Suspense fallback={<AnalyticsSkeleton />}>
        <Analytics /> {/* aparece em 5s */}
      </Suspense>
    </div>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Page inteira e async (fetch no nivel da page) | Use loading.tsx |
| Componente individual demora para carregar | Extraia para Server Component + Suspense |
| Varios fetches independentes na mesma pagina | Um Suspense por componente |
| Conteudo estatico + dados dinamicos na mesma page | Remova async da page, mova fetches para componentes filhos com Suspense |
| Fallback de loading | Use Skeleton Screen ou spinner especifico da secao |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `await` de tudo no componente page e bloquear a pagina inteira | Extraia cada fetch para componente filho + Suspense |
| Um unico Suspense envolvendo todos os componentes | Um Suspense por componente independente |
| `fallback={<p>Carregando...</p>}` generico | `fallback={<ProfileSkeleton />}` especifico |
| Deixar conteudo estatico dentro de componente async | Mova conteudo estatico para fora, so o fetch fica async |
| Usar loading.tsx para loading granular por secao | Use Suspense para secoes, loading.tsx para pagina inteira |

## Troubleshooting

### Loading state nao aparece durante carregamento
**Symptom:** Pagina fica em branco durante o carregamento, sem skeleton ou spinner
**Cause:** Arquivo `loading.tsx` ausente no diretorio da rota, ou Suspense boundary nao configurado
**Fix:** Criar arquivo `loading.tsx` no diretorio da pagina que demora para carregar. Para granularidade maior, envolver componentes lentos com `<Suspense fallback={...}>`

### Streaming SSR nao funciona
**Symptom:** Pagina inteira espera todos os dados antes de renderizar
**Cause:** Dados sao carregados na pagina principal sem Suspense boundary
**Fix:** Mover fetch de dados para componentes filhos async e envolver com `<Suspense>`. Cada Suspense boundary habilita streaming independente

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-suspense-api-no-react/references/deep-explanation.md) — O Next.js, por padrao, quando tem componentes assincronos dentro de uma pagina, **aguarda TODOS fina
- [code-examples.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-suspense-api-no-react/references/code-examples.md) — O instrutor cria `components/github-profile.tsx`:
