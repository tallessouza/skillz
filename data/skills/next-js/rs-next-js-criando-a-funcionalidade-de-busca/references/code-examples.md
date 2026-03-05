# Code Examples: Busca e Empty State em Listagem

## Exemplo completo do template de listagem (blog-list)

### Filtro de busca no template

```typescript
// Em templates/blog/blog-list.tsx (ou equivalente)

// allPosts vem da Content Layer ou qualquer fonte de dados
// query vem dos search params da URL

const posts = query
  ? allPosts.filter((post) =>
      post.title.toLowerCase().includes(query.toLowerCase())
    )
  : allPosts

const hasPosts = posts.length > 0
```

### JSX condicional completo

```tsx
<div className="container px-8">
  {hasPosts ? (
    <div className="grid grid-cols-2 gap-4">
      {posts.map((post) => (
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
```

## PostCard com alt corrigido

```tsx
// Antes (sem alt descritivo)
<Image
  src={post.coverImage}
  alt=""
  width={360}
  height={144}
/>

// Depois (com alt descritivo usando titulo)
<Image
  src={post.coverImage}
  alt={post.title}
  width={360}
  height={144}
/>
```

## Variacao: busca em multiplos campos

```typescript
// Se quiser buscar por titulo E descricao
const posts = query
  ? allPosts.filter((post) => {
      const search = query.toLowerCase()
      return (
        post.title.toLowerCase().includes(search) ||
        post.description.toLowerCase().includes(search)
      )
    })
  : allPosts
```

## Variacao: empty state reutilizavel como componente

```tsx
interface EmptyStateProps {
  message: string
  icon?: React.ReactNode
}

function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 border-dashed border-2 border-gray-300 p-8 md:p-12 rounded-lg">
      {icon || <Inbox className="h-12 w-12 text-cyan-100" />}
      <p className="text-gray-100 text-center">{message}</p>
    </div>
  )
}

// Uso
<EmptyState message="Nenhum post encontrado" />
```

## Estrutura de arquivos mencionada

```
public/
  assets/
    primeiro-post/
      cover.png
      customer01.png
    segundo-post/
      cover.png
      customer03.png

content/
  posts/
    primeiro-post.mdx
    segundo-post.mdx
```