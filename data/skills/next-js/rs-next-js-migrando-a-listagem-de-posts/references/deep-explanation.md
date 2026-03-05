# Deep Explanation: Migrando a Listagem de Posts para App Router

## Por que migrar a listagem e nao so copiar?

O instrutor enfatiza que a migracao nao e simplesmente mover arquivos — e repensar onde cada responsabilidade vive. Na Pages Router, tudo era client-side por default. Na App Router, tudo e server-side por default. Isso inverte a mentalidade.

## A cadeia de dependencias do `'use client'`

Um ponto critico da aula: quando voce marca um componente como `'use client'`, isso nao resolve automaticamente se ele importa outros componentes/hooks que tambem usam APIs do cliente.

O instrutor demonstrou isso passo a passo:
1. Adicionou `'use client'` no BlogList — ainda deu erro
2. Por que? O BlogList importa `useClipboard` (hook customizado) que usa `useEffect` internamente
3. Solucao: marcar o arquivo do hook tambem com `'use client'`
4. Mas ai descobriu outro problema: o hook usava `useRouter` do `next/router`, que nao funciona na App Router

**Licao:** `'use client'` propaga pra baixo, mas cada dependencia precisa ser compativel com o ambiente client da App Router.

## Server components nao sao magicos — sao simples

O instrutor destaca que o server component e simplesmente um componente onde o corpo da funcao executa no servidor. Entao:

```typescript
export default function BlogPage() {
  // Isso aqui roda no servidor. Ponto.
  const sortedPosts = allPosts.sort(...)
  return <BlogList posts={sortedPosts} />
}
```

Isso substitui `getServerSideProps` de forma mais natural — o codigo fica no componente, nao em uma funcao exportada separada.

## `useSearchParams` vs `useRouter().query`

Na Pages Router, `useRouter()` retornava um objeto com `query` contendo os search params. Na App Router:
- `useRouter()` serve para navegacao programatica (push, replace, back)
- `useSearchParams()` serve para ler query params da URL
- Ambos vem de `next/navigation`

O `useSearchParams` retorna um objeto `URLSearchParams` readonly com metodo `.get()`:
```typescript
const searchParams = useSearchParams()
const q = searchParams.get('q') ?? ''
```

## `router.push` mudou a API

Na Pages Router:
```typescript
router.push(url, as, { shallow: true })
```

Na App Router:
```typescript
router.push(url, { scroll: false })
```

- O segundo parametro `as` (URL masking) foi removido
- `shallow` nao existe mais — a App Router gerencia isso diferentemente
- `scroll` controla se rola pro topo apos navegacao

## Client components NAO sao obsoletos

O instrutor faz questao de dizer: "clients nao estao obsoletos, nem nada disso." A estrategia e:
1. Maximize server components (data fetching, rendering estatico)
2. Use client components quando precisar de interatividade (state, effects, event handlers)
3. Isole o client component no menor escopo possivel

No caso da aula, a pagina inteira virou client component porque o titulo da pagina atualiza conforme o usuario digita na busca. O instrutor menciona que poderia isolar mais, mas nesse caso a interatividade permeia o componente todo.

## Estrategia de migracao incremental

O instrutor usa uma abordagem pragmatica:
1. Renomeia a pasta antiga (ex: `blog` → `blog-page`) para desativar a rota
2. Cria a nova pasta `blog` dentro de `app/` com `page.tsx`
3. Migra componente por componente, resolvendo erros conforme aparecem
4. Testa no browser a cada passo

Isso evita quebrar tudo de uma vez e permite debug incremental.