# Deep Explanation: Criando a Pagina de Post no App Router

## Por que o 404 acontecia

O problema raiz era um conflito de rotas. O projeto tinha duas pastas de roteamento: `app/` e `pages/`. Ambas tinham uma rota `/blog`. Para resolver o conflito inicial da listagem, a pasta em `pages/` foi renomeada para `blog-page`. Porem, a rota dinamica `/blog/[slug]` que existia em `pages/` tambem precisava ser recriada em `app/`.

O Next.js permite coexistencia de `app/` e `pages/`, mas a **mesma rota nao pode existir em ambos**. Se `/blog` esta em `app/`, nao pode estar em `pages/`.

## Params assincronos: a mudanca do Next.js 15

Nas versoes anteriores (14 e antes, usando app router), os params eram sincronos:

```typescript
// Next.js 14 (sincrono)
export default function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug // direto, sem await
}
```

A partir do Next.js 15, params e searchParams passaram a ser **Promises**. Isso significa que o componente precisa ser `async` e usar `await`:

```typescript
// Next.js 15+ (assincrono)
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
}
```

O instrutor mostrou isso imprimindo o props no console — o objeto retornado mostra claramente `params` e `searchParams` como promises.

## Server components podem ser async

O instrutor destaca que isso pode parecer estranho a primeira vista — um componente React async. Mas server components suportam isso nativamente. O `await` funciona porque o componente executa no servidor, nao no browser.

O `console.log` do slug aparece no terminal do servidor, nao no browser. Se aparece no browser tambem, e uma feature de dev do React que espelha logs do server.

## A armadilha do "use client" na pagina inteira

O instrutor demonstrou o erro em tempo real: ao importar um componente que usa `useClipboard` (um custom hook), o Next.js deu erro porque por default todo componente em `app/` e server component.

A "solucao facil" seria colocar `"use client"` no topo da pagina. E funciona — mas e uma pessima estrategia. O instrutor enfatiza:

> "A gente tem tudo isso — titulo, autor, imagem, conteudo, navigation — e esta transformando o componente inteiro em client component apenas por conta de um trecho de compartilhamento. Isso nao faz sentido."

A abordagem correta e isolar: criar um componente separado apenas para a funcionalidade que precisa ser client-side, e manter todo o resto como server component. Essa e a filosofia central do App Router.

## notFound() vs retorno manual

Em vez de fazer um `if (!post) return <div>404</div>`, o Next.js oferece `notFound()` de `next/navigation`. Essa funcao:
- Redireciona automaticamente para a pagina 404
- Usa a pagina 404 customizada se existir (o projeto ja tinha uma)
- E a forma idiomatica do framework

## Relacao entre nome da pasta e nome do param

O instrutor explicou com clareza: se a pasta se chama `[slug]`, o param sera `slug`. Se fosse `[id]`, seria `id`. Se fosse `[postSlug]`, seria `postSlug`. O nome entre colchetes define exatamente o nome da propriedade no objeto de params.