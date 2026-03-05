# Code Examples: Finalizando o Search

## 1. Input responsivo com Tailwind

```tsx
// Antes — largura fixa quebra no mobile
<input className="w-[240px]" />

// Depois — mobile-first, 100% no mobile, 240px no md+
<input className="w-full md:w-[240px]" />
```

Aplicar tanto no input quanto no form container para consistencia.

## 2. Icone de limpar com posicionamento absoluto

```tsx
<form className="relative w-full md:w-[240px]">
  {/* Icone de busca (sempre visivel) */}
  <Search
    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
    size={16}
  />

  <input
    value={query}
    onChange={(e) => handleSearch(e.target.value)}
    className="w-full md:w-[240px] pl-10 pr-8"
  />

  {/* Icone de limpar (condicional) */}
  {query && (
    <CircleX
      onClick={resetSearch}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 cursor-pointer"
      size={16}
    />
  )}
</form>
```

### Detalhes do posicionamento:
- `size={16}` no Lucide equivale a `w-4 h-4` (16px)
- `top-1/2 -translate-y-1/2` centraliza verticalmente
- `right-3` posiciona 12px da borda direita
- `pr-8` no input garante que texto nao fique sob o icone

## 3. Funcao resetSearch completa

```tsx
function resetSearch() {
  router.push('/blog', undefined, { shallow: true, scroll: false })
}
```

O segundo argumento `undefined` e o `as` parameter do Next.js (URL decorativa). Passamos `undefined` porque nao precisamos de URL diferente.

`shallow: true` — nao re-executa data fetching methods
`scroll: false` — mantem posicao do scroll

## 4. Query param com nullish coalescing

```tsx
// router.query.q pode ser: string | string[] | undefined
const query = (router.query.q as string) ?? ''

// Fluxo:
// Usuario digita "react" → router.query.q = "react" → query = "react"
// Usuario clica limpar → router.push('/blog') → router.query.q = undefined → query = ""
```

O instrutor mostrou com `console.log(query)` que ao clicar em limpar, o valor vai para `undefined`. Sem o `?? ''`, o input receberia `undefined` como value, causando warning de uncontrolled component.

## 5. Titulo dinamico derivado de URL state

```tsx
// Na pagina pai (blog-list.tsx)
const router = useRouter()
const query = (router.query.q as string) ?? ''

const pageTitle = query
  ? `Resultados de busca para "${query}"`
  : 'Dicas e estratégias para impulsionar o seu negócio'

// No JSX
<h2>{pageTitle}</h2>
```

O titulo muda em tempo real conforme o usuario digita, porque `shallow: true` no search atualiza a URL e o `useRouter()` no pai reage.

## 6. Estrutura de templates completa

```
src/
  templates/
    blog/
      blog-list.tsx      # export function BlogList() { ... }
      index.ts           # export { BlogList } from './blog-list'
    landing-page/
      landing-page.tsx
      index.ts

  pages/
    blog/
      index.tsx          # import { BlogList } → export default BlogPage
    index.tsx            # import { LandingPage } → export default Home
```

### pages/blog/index.tsx (fino)

```tsx
import { BlogList } from '@/templates/blog'

export default function BlogPage() {
  return <BlogList />
}
```

### templates/blog/blog-list.tsx (toda a logica)

```tsx
import { useRouter } from 'next/router'
import { SearchComponent } from '@/components/search'

export function BlogList() {
  const router = useRouter()
  const query = (router.query.q as string) ?? ''

  const pageTitle = query
    ? `Resultados de busca para "${query}"`
    : 'Dicas e estratégias para impulsionar o seu negócio'

  return (
    <section>
      <h2>{pageTitle}</h2>
      <SearchComponent />
      {/* PostGrid vai aqui */}
    </section>
  )
}
```

Note que `BlogList` nao e export default — apenas `pages/` precisa de default export (requisito do Next.js Pages Router).