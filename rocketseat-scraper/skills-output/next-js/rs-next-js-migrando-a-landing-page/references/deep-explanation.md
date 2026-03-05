# Deep Explanation: Migrando de Pages Router para App Router

## Por que a migração é incremental

O Next.js permite que Pages Router e App Router coexistam no mesmo projeto. Isso é um facilitador enorme de migração — você não precisa migrar tudo de uma vez. Pode ir rota por rota, componente por componente.

O único conflito que o Next não tolera é a **mesma rota definida nos dois sistemas**. Se `pages/index.tsx` e `app/page.tsx` existem ao mesmo tempo, o Next não sabe qual renderizar e lança um erro explícito dizendo exatamente quais arquivos estão conflitando.

**Estratégia prática:** ao migrar uma rota, renomeie o arquivo na Pages Router (ex: `index.tsx` → `landing-page.tsx`) para que ele deixe de ser uma rota, e crie o equivalente na App Router.

## O conceito de arquivos especiais na App Router

Na Pages Router, a convenção era:
- `index.tsx` = rota raiz daquele diretório
- `_app.tsx` = wrapper global (providers, layout)
- `_document.tsx` = customização do HTML/body

Na App Router, o Next introduziu **file conventions** mais granulares:
- `page.tsx` = gera uma rota (equivale ao `index.tsx`)
- `layout.tsx` = wrapper persistente (combina `_app` + `_document`)
- `loading.tsx` = UI de loading (Suspense boundary automático)
- `error.tsx` = error boundary automático
- `not-found.tsx` = página 404 customizada

O `layout.tsx` é particularmente importante porque ele:
1. Envolve todas as páginas filhas
2. Persiste entre navegações (não re-renderiza)
3. É onde você coloca o `<html>` e `<body>` (no layout raiz)
4. É onde importa CSS global

## React Server Components como default

Na App Router, **todo componente é Server Component por padrão**. Isso inclui:
- Componentes definidos dentro de `app/`
- Componentes **importados** por componentes dentro de `app/`

Isso significa que se você tem um componente em `components/ActiveLink.tsx` que usa `useRouter`, e importa ele no `layout.tsx` da App Router, ele **também será tratado como Server Component** — e vai quebrar, porque hooks de navegação são APIs do client.

O erro do Next é bem descritivo: ele diz exatamente qual componente está importando algo incompatível com Server Components e onde está o problema.

## A diretiva `use client`

Para transformar um componente em Client Component, adicione `"use client"` como primeira linha do arquivo. Isso diz ao React:
- Este componente precisa de hydration no client
- Ele pode usar hooks (useState, useEffect, etc.)
- Ele pode acessar APIs do browser (window, document, etc.)
- Ele será renderizado no servidor primeiro (SSR), mas será hidratado no client

O nome "Client Component" é enganoso — ele **ainda renderiza no servidor** durante o SSR. A diferença é que ele também executa no client para hydration e interatividade.

## Hooks novos de navegação

A App Router introduziu hooks novos em `next/navigation` (não `next/router`):
- `usePathname()` — retorna o path atual (substituiu `useRouter().asPath` para path simples)
- `useSearchParams()` — retorna os query params
- `useRouter()` — versão nova, API diferente da Pages Router
- `useParams()` — retorna parâmetros de rotas dinâmicas

Todos esses hooks são **exclusivos de Client Components** — exigem `"use client"`.

## A lógica do ActiveLink com usePathname

O instrutor implementou uma lógica de "link ativo" que cobre dois casos:
1. **Match exato:** `pathName === linkPath` — quando está exatamente naquela rota
2. **Match por prefixo:** `pathName.startsWith(linkPath + '/')` — quando está em uma sub-rota

O segundo caso é importante para navegação em blogs: se o usuário está em `/blog/meu-post`, o link de "Blog" no menu deve continuar destacado, porque `/blog/meu-post` começa com `/blog/`.

A barra extra no `startsWith` evita falsos positivos — sem ela, `/blogging` também matcharia com `/blog`.