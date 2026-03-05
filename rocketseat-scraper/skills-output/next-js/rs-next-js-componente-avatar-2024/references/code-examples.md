# Code Examples: Compound Component Pattern — Avatar

## Estrutura completa de cada subcomponente

### avatar-container.tsx

```typescript
import { ReactNode } from "react"

type AvatarContainerProps = {
  children: ReactNode
}

export function AvatarContainer({ children }: AvatarContainerProps) {
  return <div className="flex items-center gap-3">{children}</div>
}
```

### avatar-content.tsx

```typescript
import { ReactNode } from "react"

type AvatarContentProps = {
  children: ReactNode
}

export function AvatarContent({ children }: AvatarContentProps) {
  return <div className="flex flex-col">{children}</div>
}
```

### avatar-image.tsx

```typescript
import Image, { ImageProps } from "next/image"

export function AvatarImage({ src, alt, width = 40, height = 40, ...rest }: ImageProps) {
  return <Image src={src} alt={alt} width={width} height={height} {...rest} />
}
```

### avatar-title.tsx

```typescript
import { ReactNode } from "react"

type AvatarTitleProps = {
  children: ReactNode
}

export function AvatarTitle({ children }: AvatarTitleProps) {
  return <strong className="text-body-sm text-gray-200">{children}</strong>
}
```

### avatar-description.tsx

```typescript
import { ReactNode } from "react"

type AvatarDescriptionProps = {
  children: ReactNode
}

export function AvatarDescription({ children }: AvatarDescriptionProps) {
  return <div className="text-body-xs text-gray-300">{children}</div>
}
```

### index.ts (namespace)

```typescript
import { AvatarContainer } from "./avatar-container"
import { AvatarImage } from "./avatar-image"
import { AvatarContent } from "./avatar-content"
import { AvatarTitle } from "./avatar-title"
import { AvatarDescription } from "./avatar-description"

export const Avatar = {
  Container: AvatarContainer,
  Image: AvatarImage,
  Content: AvatarContent,
  Title: AvatarTitle,
  Description: AvatarDescription,
}
```

## Uso na pagina do post (slug)

```typescript
import { Avatar } from "@/components/avatar"

// Formatar data
const publishDate = new Date(post.date!).toLocaleDateString("pt-BR")

// Dentro do JSX, no header do article
<header className="p-4 md:p-6 lg:p-12 pb-0">
  <h1 className="mb-6 text-balance text-heading-lg md:text-heading-xl lg:text-heading-xl">
    {post.title}
  </h1>

  <Avatar.Container>
    <Avatar.Image src={post.author.avatar} alt={post.author.name} />
    <Avatar.Content>
      <Avatar.Title>{post.author.name}</Avatar.Title>
      <Avatar.Description>
        Publicado em{" "}
        <time dateTime={post.date}>{publishDate}</time>
      </Avatar.Description>
    </Avatar.Content>
  </Avatar.Container>
</header>
```

## Uso no PostCard (versao simplificada)

```typescript
import { Avatar } from "@/components/avatar"

// Dentro do PostCard — sem Description
<Avatar.Container>
  <Avatar.Image src={post.author.avatar} alt={post.author.name} />
  <Avatar.Content>
    <Avatar.Title>{post.author.name}</Avatar.Title>
  </Avatar.Content>
</Avatar.Container>
```

## Correcao do slug: includes vs strict equal

```typescript
// ERRADO — pode retornar multiplos posts
const post = posts.find((post) => post.slug.includes(slug))

// CORRETO — retorna exatamente o post com aquele slug
const post = posts.find((post) => post.slug === slug)
```

## Correcao do border no PostCard

```typescript
// ANTES — border em todos os lados
<div className="border-t rounded-lg">

// DEPOIS — apenas border-radius sem border-top indesejado
<div className="rounded-lg">
```