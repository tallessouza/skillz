---
name: rs-next-js-busca-listagem
description: "Applies search filtering and empty state patterns when building list pages in Next.js or React. Use when user asks to 'add search', 'filter a list', 'create a search bar', 'handle empty state', or 'show no results message'. Enforces lowercase includes filtering, hasItems guard pattern, and dashed-border empty state feedback. Make sure to use this skill whenever implementing search or empty states in listing pages. Not for backend search, full-text search engines, or database query optimization."
---

# Busca e Empty State em Paginas de Listagem

> Implemente busca client-side com filtro lowercase e sempre forneca feedback visual quando a lista estiver vazia.

## Rules

1. **Filtre com toLowerCase + includes** — `title.toLowerCase().includes(query.toLowerCase())`, porque garante busca case-insensitive sem dependencia externa
2. **Separe allItems de items filtrados** — mantenha a lista original intacta e derive a lista filtrada condicionalmente, porque permite limpar a busca e voltar ao estado original
3. **Crie uma variavel guard hasItems** — `const hasPosts = allPosts.length > 0` antes do JSX, porque simplifica a condicional no template e deixa a intencao explicita
4. **Sempre implemente empty state** — mesmo que "raramente o usuario veja", porque da feedback claro e evita tela em branco confusa
5. **Empty state com borda tracejada** — use `border-dashed` + icone + texto centralizado, porque e um padrao visual reconhecido que comunica "area vazia"
6. **Use alt descritivo em imagens de listagem** — passe o titulo do item como alt, porque melhora acessibilidade sem esforco extra

## How to write

### Filtro de busca

```typescript
// Derive a lista filtrada a partir do query da URL
const allPosts = /* fonte de dados */
const posts = query
  ? allPosts.filter(post =>
      post.title.toLowerCase().includes(query.toLowerCase())
    )
  : allPosts
```

### Guard de lista vazia

```typescript
const hasPosts = posts.length > 0
```

### Empty state component

```tsx
{!hasPosts && (
  <div className="flex flex-col items-center justify-center gap-8 border-dashed border-2 border-gray-300 p-8 md:p-12 rounded-lg">
    <Inbox className="h-12 w-12 text-cyan-100" />
    <p className="text-gray-100 text-center">Nenhum post encontrado</p>
  </div>
)}
```

## Example

**Before (sem busca, sem empty state):**
```tsx
export default function BlogList({ posts, query }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {posts.map(post => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
```

**After (com busca e empty state):**
```tsx
export default function BlogList({ allPosts, query }) {
  const posts = query
    ? allPosts.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase())
      )
    : allPosts

  const hasPosts = posts.length > 0

  return (
    <div className="container px-8">
      {hasPosts ? (
        <div className="grid grid-cols-2 gap-4">
          {posts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-8 border-dashed border-2 border-gray-300 p-8 md:p-12 rounded-lg">
          <Inbox className="h-12 w-12 text-cyan-100" />
          <p className="text-gray-100 text-center">Nenhum post encontrado</p>
        </div>
      )}
    </div>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Lista com campo de busca | Filtre client-side com toLowerCase + includes |
| Lista pode estar vazia (busca ou sem dados) | Sempre renderize empty state |
| Query vem da URL (search params) | Derive lista filtrada condicionalmente |
| Imagem na listagem sem alt | Use o titulo do item como alt |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `posts.filter(p => p.title.includes(query))` | `posts.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))` |
| `{posts.length === 0 && <p>Vazio</p>}` | Componente empty state completo com icone e borda tracejada |
| `{posts.map(...)}` sem guard | `{hasPosts ? <Grid/> : <EmptyState/>}` |
| `<img alt="" />` ou `<img alt="image" />` | `<img alt={post.title} />` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-criando-a-funcionalidade-de-busca/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-criando-a-funcionalidade-de-busca/references/code-examples.md)
