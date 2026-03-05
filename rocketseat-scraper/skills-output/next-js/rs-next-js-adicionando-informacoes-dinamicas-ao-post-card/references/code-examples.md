# Code Examples: PostCard Dinâmico com Props Tipadas

## Exemplo completo do componente refatorado

### Tipos

```typescript
type Author = {
  name: string
  avatar: string
}

interface PostCardProps {
  slug: string
  title: string
  description: string
  image: string
  date: string
  author: Author
}
```

### Componente PostCard

```typescript
import Link from 'next/link'

export function PostCard({ slug, title, description, image, date, author }: PostCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <div className="rounded-[12px] overflow-hidden bg-white shadow">
        {/* Imagem com border-radius menor que o container */}
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full rounded-t-[8px]"
          />

          {/* Badge de data com backdrop blur */}
          <div className="absolute top-0 left-0 bg-gray-600 backdrop-blur-sm rounded-bl-[10px] px-3 py-1">
            <span className="text-white text-sm">{date}</span>
          </div>
        </div>

        {/* Conteudo do card */}
        <div className="p-4">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-gray-500 mt-2">{description}</p>

          {/* Autor */}
          <div className="flex items-center gap-2 mt-4">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm text-gray-600">{author.name}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
```

### Consumo na pagina de blog

```typescript
// pages/blog/index.tsx
export default function Blog() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <PostCard
        slug="transformando-seu-negocio-em-uma-loja-virtual"
        title="Transformando seu negócio em uma loja virtual"
        description="Buscando os melhores produtos para sua loja"
        date="20/12/2024"
        image="/assets/primeiro-post.png"
        author={{
          name: "John Doe",
          avatar: "/customers/customer01.png"
        }}
      />

      <PostCard
        slug="como-comecar-no-ecommerce"
        title="Como começar no e-commerce"
        description="Guia completo para iniciantes"
        date="18/12/2024"
        image="/assets/segundo-post.png"
        author={{
          name: "Jane Smith",
          avatar: "/customers/customer02.png"
        }}
      />
    </div>
  )
}
```

## Estilizacao Tailwind — valores exatos do Figma

```typescript
// Container do card
className="rounded-[12px]"  // 12px conforme Figma

// Imagem (topo apenas)
className="rounded-t-[8px]"  // 8px, menor que o container

// Badge de data (canto inferior esquerdo apenas)
className="absolute top-0 left-0 bg-gray-600 backdrop-blur-sm rounded-bl-[10px]"

// Escala do Tailwind vs valores arbitrarios:
// rounded-lg  = 8px   ✓ poderia usar para imagem
// rounded-xl  = 12px  ✓ poderia usar para container
// rounded-2xl = 16px  ✗ nao coincide com o design
```

## Variacao: com optional chaining durante desenvolvimento

```typescript
// Enquanto o consumidor ainda nao envia todas as props
export function PostCard({ slug, title, description, image, date, author }: Partial<PostCardProps>) {
  return (
    <Link href={`/blog/${slug ?? '#'}`}>
      <div className="rounded-[12px]">
        <img src={image} alt={title ?? ''} />
        <span>{date}</span>
        <h3>{title}</h3>
        <p>{description}</p>
        <img src={author?.avatar} />
        <span>{author?.name}</span>
      </div>
    </Link>
  )
}
```