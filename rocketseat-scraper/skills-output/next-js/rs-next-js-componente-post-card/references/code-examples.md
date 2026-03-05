# Code Examples: Componente PostCard

## Exemplo 1: Estrutura basica do componente

O instrutor comeca criando a estrutura minima:

```tsx
// components/PostCard/PostCard.tsx
export function PostCard() {
  return (
    <div>Post card</div>
  )
}
```

```tsx
// components/PostCard/index.ts
export { PostCard } from './PostCard'
```

Depois importa no template do blog para ja visualizar.

## Exemplo 2: Link wrapper com Next.js

```tsx
import Link from 'next/link'

export function PostCard() {
  return (
    <Link href="/blog/slug-do-post">
      {/* conteudo do card */}
    </Link>
  )
}
```

O `href` aponta para `/blog/{slug}` — a rota ainda nao existe mas a estrutura ja esta preparada.

## Exemplo 3: Image container com data sobreposta

```tsx
<div className="relative">
  <div className="absolute top-0 right-0 px-3 py-1">
    <span className="text-gray-300 text-body-xs">20 de 12 de 2024</span>
  </div>
  <Image
    src="/assets/primeiro-post.png"
    alt="Titulo do post"
    width={288}
    height={144}
    className="w-full h-60 object-cover object-center"
  />
</div>
```

## Exemplo 4: Estilizacao do link (card wrapper)

```tsx
<Link
  href={`/blog/${slug}`}
  className="w-full max-w-2xl rounded-3xl border border-gray-400 bg-gray-600 overflow-hidden transition-all duration-300 hover:border-blue-300"
>
```

Propriedades aplicadas pelo instrutor:
- `w-full max-w-2xl` — ocupa largura disponivel ate um maximo
- `rounded-3xl` — cantos bem arredondados
- `border border-gray-400` — borda sutil quase invisivel
- `bg-gray-600` — fundo escuro do card
- `overflow-hidden` — imagem respeita os cantos arredondados
- `transition-all duration-300` — animacao suave
- `hover:border-blue-300` — destaque no hover

## Exemplo 5: Content container

```tsx
<div className="rounded-md overflow-hidden">
  {/* image container */}
  {/* post content */}
  {/* post footer */}
</div>
```

O `overflow-hidden` aqui garante que a imagem nao vaze dos cantos arredondados.

## Exemplo 6: Textos com line-clamp

```tsx
<div className="px-2 mt-4 space-y-4">
  <h2 className="text-heading-sm text-gray-100 line-clamp-3">
    Titulo do post que pode ser bem longo
  </h2>
  <p className="text-body-sm text-gray-300 line-clamp-3">
    Descricao do post com texto que sera truncado apos 3 linhas...
  </p>
</div>
```

O instrutor inicialmente usou `text-heading-xs` e `text-body-xs` mas achou pequeno demais e aumentou para `sm`.

## Exemplo 7: Footer com autor

```tsx
<div className="flex items-center gap-3 border-t border-gray-400 py-4">
  <div className="relative h-5 w-5 md:h-6 md:w-6 rounded-full border border-blue-200">
    <Image
      src="/customers/customer-01.png"
      alt="Nome do autor"
      fill
      className="object-cover rounded-md"
    />
  </div>
  <span className="text-body-xs text-gray-300">Nome do Autor</span>
</div>
```

O avatar usa `fill` (sem width/height explicitos) porque as dimensoes vem do container pai (`h-5 w-5`). O `rounded-full` cria o circulo e `border border-blue-200` adiciona um anel sutil.

## Exemplo 8: Componente completo com props tipadas

```tsx
import Link from 'next/link'
import Image from 'next/image'

interface PostCardProps {
  slug: string
  title: string
  description: string
  coverImage: string
  date: string
  author: {
    name: string
    avatar: string
  }
}

export function PostCard({
  slug,
  title,
  description,
  coverImage,
  date,
  author
}: PostCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="w-full max-w-2xl rounded-3xl border border-gray-400 bg-gray-600 overflow-hidden transition-all duration-300 hover:border-blue-300"
    >
      <div className="rounded-md overflow-hidden">
        <div className="relative">
          <div className="absolute top-0 right-0 px-3 py-1">
            <span className="text-gray-300 text-body-xs">{date}</span>
          </div>
          <Image
            src={coverImage}
            alt={title}
            width={288}
            height={144}
            className="w-full h-60 object-cover object-center"
          />
        </div>

        <div className="px-2 mt-4 space-y-4">
          <h2 className="text-heading-sm text-gray-100 line-clamp-3">
            {title}
          </h2>
          <p className="text-body-sm text-gray-300 line-clamp-3">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-3 border-t border-gray-400 py-4">
          <div className="relative h-5 w-5 md:h-6 md:w-6 rounded-full border border-blue-200">
            <Image
              src={author.avatar}
              alt={author.name}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <span className="text-body-xs text-gray-300">{author.name}</span>
        </div>
      </div>
    </Link>
  )
}
```

## Variacoes possiveis

### Card horizontal (para listagens compactas)

```tsx
<Link href={`/blog/${slug}`} className="flex gap-4 ...">
  <div className="relative w-32 h-24 flex-shrink-0">
    <Image src={coverImage} alt={title} fill className="object-cover rounded-lg" />
  </div>
  <div className="flex-1">
    <h3 className="text-heading-xs line-clamp-2">{title}</h3>
    <p className="text-body-xs text-gray-300 line-clamp-2">{description}</p>
  </div>
</Link>
```

### Grid de cards (proximo passo mencionado pelo instrutor)

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {posts.map(post => (
    <PostCard key={post.slug} {...post} />
  ))}
</div>
```