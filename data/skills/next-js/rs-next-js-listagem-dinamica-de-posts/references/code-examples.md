# Code Examples: Listagem Dinâmica de Posts com ContentLayer

## Exemplo completo do contentlayer.config.ts

```typescript
import {
  defineNestedType,
  defineDocumentType,
  makeSource,
} from 'contentlayer/source-files'

// Tipo aninhado para o author
const Author = defineNestedType(() => ({
  name: 'Author',
  fields: {
    name: { type: 'string', required: true },
    avatar: { type: 'string', required: true },
  },
}))

// Document type principal
const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: '**/*.md',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    date: { type: 'date', required: true },
    image: { type: 'string', required: true },
    author: { type: 'nested', of: Author, required: true },
  },
}))

export default makeSource({
  contentDirPath: 'posts',
  documentTypes: [Post],
})
```

## Exemplo do frontmatter de um post

```markdown
---
title: Fundamentos do Next.js
description: Aprenda os fundamentos do Next.js com exemplos praticos
date: 2024-01-15
image: /images/nextjs-cover.jpg
author:
  name: Diego Fernandes
  avatar: /images/diego-avatar.jpg
---

Conteudo do post em Markdown aqui...
```

## Exemplo completo da pagina de listagem

```typescript
import { allPosts } from 'contentlayer/generated'
import { PostCard } from '@/components/PostCard'

export default function Blog() {
  const posts = allPosts

  return (
    <main>
      <h1>Blog</h1>
      <section>
        {posts.map((post) => (
          <PostCard
            key={post._id}
            title={post.title}
            description={post.description}
            date={new Date(post.date).toLocaleDateString('pt-BR')}
            slug={post._raw.flattenedPath}
            image={post.image}
            author={post.author.name}
            avatar={post.author.avatar}
          />
        ))}
      </section>
    </main>
  )
}
```

## Variacao: ordenar posts por data (mais recente primeiro)

```typescript
const posts = allPosts.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
)
```

## Variacao: formatacao de data mais detalhada

```typescript
// Formato curto: 15/01/2024
new Date(post.date).toLocaleDateString('pt-BR')

// Formato longo: 15 de janeiro de 2024
new Date(post.date).toLocaleDateString('pt-BR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

// Formato relativo (precisa de Intl.RelativeTimeFormat ou lib externa)
```

## Evolucao: adicionando mais campos ao Author

```typescript
const Author = defineNestedType(() => ({
  name: 'Author',
  fields: {
    name: { type: 'string', required: true },
    avatar: { type: 'string', required: true },
    role: { type: 'string', required: false },
    twitter: { type: 'string', required: false },
  },
}))
```

## Comandos de rebuild

```bash
# Quando mudar o contentlayer.config.ts:
# 1. Matar o processo dev (Ctrl+C)
# 2. Rebuildar
pnpm contentlayer build

# 3. Reiniciar dev
pnpm dev

# Se tipagens nao atualizam no VS Code:
# Ctrl+Shift+P > "Reload Window"
```