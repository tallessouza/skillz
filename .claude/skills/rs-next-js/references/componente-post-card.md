---
name: rs-next-js-componente-post-card
description: "Generates PostCard components for blog layouts using Next.js Link, Image, and Tailwind CSS. Use when user asks to 'create a card component', 'build a blog post card', 'make a post listing', or 'create a blog grid layout'. Applies patterns: image container with absolute-positioned metadata overlay, hover border transitions, author footer section with avatar, line-clamp for text truncation. Make sure to use this skill whenever building card-based blog UI components in Next.js. Not for API data fetching, content management setup, or backend logic."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: componentes-blog
  tags: [post-card, blog, Link, Image, tailwind, line-clamp, next-js]
---

# Componente PostCard

> Construa componentes de card para blog usando containers semanticos, posicionamento absoluto para metadados sobre imagem, e transicoes suaves de hover.

## Rules

1. **Envolva o card inteiro em um Link do Next.js** — `<Link href={...}>` como wrapper externo, porque o card inteiro deve ser clicavel para navegacao
2. **Use containers semanticos separados** — `imageContainer`, `postContent`, `postFooter`, porque cada secao tem estilizacao e responsabilidades distintas
3. **Posicione metadados sobre a imagem com absolute** — container pai `relative`, filho `absolute top-0 right-0`, porque data e tags ficam sobrepostas a imagem
4. **Use transicoes suaves no hover** — `transition-all duration-300` com `hover:border-blue-300`, porque mudancas abruptas de cor prejudicam a experiencia
5. **Aplique line-clamp para truncar texto** — `line-clamp-3` em titulo e descricao, porque cards tem altura fixa e texto longo quebra o layout
6. **Use Next.js Image com dimensoes explicitas** — `width`, `height`, `object-cover`, `object-center`, porque o componente Image exige dimensoes para otimizacao

## How to write

### Estrutura do PostCard

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

export function PostCard({ slug, title, description, coverImage, date, author }: PostCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="w-full max-w-2xl rounded-3xl border border-gray-400 bg-gray-600 overflow-hidden transition-all duration-300 hover:border-blue-300"
    >
      <div className="rounded-md overflow-hidden">
        {/* Image container com data sobreposta */}
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

        {/* Conteudo textual */}
        <div className="px-2 mt-4 space-y-4">
          <h2 className="text-heading-sm text-gray-100 line-clamp-3">{title}</h2>
          <p className="text-body-sm text-gray-300 line-clamp-3">{description}</p>
        </div>

        {/* Footer com autor */}
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

### Exportacao via index

```tsx
// components/PostCard/index.ts
export { PostCard } from './PostCard'
```

## Example

**Before (card sem estrutura):**
```tsx
function Card({ post }) {
  return (
    <div>
      <img src={post.image} />
      <p>{post.date}</p>
      <h2>{post.title}</h2>
      <p>{post.desc}</p>
      <p>{post.author}</p>
    </div>
  )
}
```

**After (com este skill aplicado):**
```tsx
function PostCard({ slug, title, description, coverImage, date, author }: PostCardProps) {
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
          <Image src={coverImage} alt={title} width={288} height={144} className="w-full h-60 object-cover object-center" />
        </div>
        <div className="px-2 mt-4 space-y-4">
          <h2 className="text-heading-sm text-gray-100 line-clamp-3">{title}</h2>
          <p className="text-body-sm text-gray-300 line-clamp-3">{description}</p>
        </div>
        <div className="flex items-center gap-3 border-t border-gray-400 py-4">
          <div className="relative h-5 w-5 md:h-6 md:w-6 rounded-full border border-blue-200">
            <Image src={author.avatar} alt={author.name} fill className="object-cover rounded-md" />
          </div>
          <span className="text-body-xs text-gray-300">{author.name}</span>
        </div>
      </div>
    </Link>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Card inteiro deve ser clicavel | Envolva tudo em `<Link>` do Next.js |
| Metadado (data, tag) sobre imagem | Container `relative` + filho `absolute` |
| Texto pode exceder altura do card | Use `line-clamp-3` |
| Hover precisa ser suave | `transition-all duration-300` |
| Avatar do autor | `rounded-full` com `border` e `Image fill` |
| Borda do card muda no hover | Borda base cinza, hover azul: `border-gray-400 hover:border-blue-300` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<a href={...}>` para navegacao interna | `<Link href={...}>` do Next.js |
| `<img src={...}>` em Next.js | `<Image src={...} width={} height={}>` |
| Mudanca de cor sem transicao | `transition-all duration-300` |
| Texto sem truncamento em cards | `line-clamp-3` |
| Avatar quadrado para autores | `rounded-full` com dimensoes fixas |
| Dados hardcoded no componente | Props tipadas via interface |

## Troubleshooting

### Componente nao renderiza ou renderiza vazio
**Symptom:** Componente importado corretamente mas nao aparece na tela
**Cause:** Falta de export default/named, ou props obrigatorias nao passadas
**Fix:** Verificar que o componente tem export correto (default ou named). Checar TypeScript props para garantir que todas as props obrigatorias estao sendo passadas

### Props nao atualizam o componente
**Symptom:** Componente mostra dados antigos mesmo quando props mudam
**Cause:** Componente nao re-renderiza por falta de key unica em listas, ou estado interno sobrescreve props
**Fix:** Adicionar `key` unica em elementos de lista. Se usando estado interno, sincronizar com props via useEffect ou derivar estado das props

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-componente-post-card/references/deep-explanation.md) — O instrutor cria uma pasta `components/` dentro do template do blog, seguindo o padrao de colocaliza
- [code-examples.md](../../../data/skills/next-js/rs-next-js-componente-post-card/references/code-examples.md) — O instrutor comeca criando a estrutura minima:
