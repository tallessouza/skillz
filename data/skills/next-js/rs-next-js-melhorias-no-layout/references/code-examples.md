# Code Examples: Melhorias no Layout

## 1. Layout com CallToAction promovido

```tsx
// Antes: layout sem CallToAction
export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="py-20">{children}</main>
      <Footer />
    </>
  )
}

// Depois: CallToAction faz parte do layout
export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="py-20">{children}</main>
      <CallToAction />
      <Footer />
    </>
  )
}
```

## 2. Remocao do CallToAction da landing page

```tsx
// pages/index.tsx — ANTES (duplicado)
export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <CallToAction /> {/* REMOVER — ja esta no layout */}
    </>
  )
}

// pages/index.tsx — DEPOIS
export default function Home() {
  return (
    <>
      <Hero />
      <Features />
    </>
  )
}
```

## 3. Extracao de template PostPage

```tsx
// templates/post/PostPage.tsx
import { ShareButtons } from '@/components/ShareButtons'
import { Breadcrumb } from '@/components/Breadcrumb'

export const PostPage = ({ post }) => {
  return (
    <article>
      <Breadcrumb
        items={[
          { label: 'Blog', href: '/blog' },
          { label: post.title }
        ]}
      />

      <img src={post.coverImage} alt={post.title} className="mt-2" />

      <div className="prose">
        {post.content}
      </div>

      <aside>
        <ShareButtons post={post} />
      </aside>
    </article>
  )
}

// templates/post/index.ts
export { PostPage } from './PostPage'
```

## 4. Uso na page

```tsx
// pages/blog/[slug].tsx
import { PostPage } from '@/templates/post'

export default function Post({ post }) {
  return <PostPage post={post} />
}
```

## 5. ShareButtons responsivo completo

```tsx
// Antes: sem responsividade mobile
<div className="flex flex-col gap-4">
  <span>Compartilhar</span>
  {providers.map(provider => (
    <button key={provider.name} className="w-full">
      <provider.icon />
      <span>{provider.name}</span>
    </button>
  ))}
</div>

// Depois: mobile-first responsivo
<div className="flex justify-between md:flex-col gap-2">
  <span className="hidden md:block">Compartilhar</span>
  {providers.map(provider => (
    <button key={provider.name} className="w-fit md:w-full">
      <provider.icon />
      <span className="hidden md:block">{provider.name}</span>
    </button>
  ))}
</div>
```

### Comportamento por breakpoint:

| Breakpoint | Layout | Label | Titulo "Compartilhar" | Width botao |
|------------|--------|-------|-----------------------|-------------|
| Mobile (default) | `flex justify-between` (horizontal) | Hidden | Hidden | `w-fit` |
| Desktop (`md:`) | `flex-col` (vertical) | `block` (visivel) | `block` (visivel) | `w-full` |

## 6. Correcao de icone do Lucide

```tsx
// Antes: icone Link2 (redundante)
import { Link2 } from 'lucide-react'

// Depois: icone Link (mais limpo, visualmente identico)
import { Link } from 'lucide-react'
```

## 7. Ajuste de espacamento vertical

```tsx
// Antes: margin-top excessivo
<main className="mt-32">
  {children}
</main>

// Depois: padding vertical equilibrado
<main className="py-20">
  {children}
</main>
```

O `py-20` gera 80px totais (40px top + 40px bottom), criando espacamento harmonioso em relacao ao header e ao conteudo seguinte.