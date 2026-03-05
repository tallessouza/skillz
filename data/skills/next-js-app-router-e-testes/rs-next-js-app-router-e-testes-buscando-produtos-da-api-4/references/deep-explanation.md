# Deep Explanation: Buscando Produtos da API

## Por que searchParams nas props e nao useSearchParams?

O instrutor Diego explica que por padrao todo componente no Next.js App Router e um Server Component. O hook `useSearchParams` so funciona em Client Components (precisa do `'use client'` directive). Transformar a pagina inteira em Client Component so para acessar um parametro de URL seria desperdicar todos os beneficios de Server Components: SSR, SEO, menor bundle JS, acesso direto a dados no servidor.

A alternativa elegante: toda pagina no Next.js recebe automaticamente dois objetos nas props:
- `params` — parametros dinamicos da rota (ex: `[slug]`)
- `searchParams` — parametros de query string (ex: `?q=camiseta`)

Entao a mesma informacao que `useSearchParams` daria esta disponivel sem precisar de Client Component.

## Duas formas de acessar search params

O Diego apresenta explicitamente as duas opcoes:

1. **`useSearchParams` em Client Component** — mover a logica para um componente com `'use client'`. Funciona, mas forca client-side rendering desnecessario.

2. **`searchParams` nas props da pagina** — acessar diretamente no Server Component. Mais performatico e simples.

A segunda forma e preferivel quando voce precisa do parametro para fazer fetch de dados no servidor.

## O padrao de redirect para parametro obrigatorio

Insight do instrutor: "se o usuario acessar essa pagina de busca sem uma busca na URL, nao faz sentido". Isso e um padrao de protecao de rota — a pagina `/search` sem `?q=algo` nao tem razao de existir. O `redirect('/')` de `next/navigation` faz um redirect server-side antes de renderizar qualquer coisa.

## Funcoes de fetch separadas por contexto

O Diego pega a funcao `getFeaturedProducts` da home e cria uma nova `searchProducts`. Mesmo que a estrutura seja similar (fetch + revalidate + return), cada funcao tem:
- URL diferente (`/products/featured` vs `/products/search?q=...`)
- Parametros diferentes (nenhum vs query string)
- Potencialmente revalidacao diferente

Manter separado e mais claro e permite ajustar cada uma independentemente.

## Console Ninja — dica de tooling

O instrutor menciona o Console Ninja, uma extensao do VSCode que traz os logs do navegador para dentro do editor. Util para ver o `console.log` das props sem precisar abrir o DevTools. Isso ajudou ele a demonstrar a estrutura de `props` que a pagina recebe (`params` vazio + `searchParams` com `query`).

## Revalidacao para busca

O instrutor comenta que pode deixar "uma hora" de revalidate para busca, e ate "um pouquinho menos". A ideia e que resultados de busca podem mudar mais frequentemente que dados da home, entao o tempo de cache pode ser menor. Mas sem ser zero (sem cache), porque isso sobrecarregaria a API.