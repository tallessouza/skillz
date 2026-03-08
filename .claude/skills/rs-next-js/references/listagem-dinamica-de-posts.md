---
name: rs-next-js-listagem-dinamica-de-posts
description: "Generates dynamic post listings using ContentLayer in Next.js Pages Router. Use when user asks to 'list posts dynamically', 'render blog posts', 'use ContentLayer', 'map over posts', 'format dates in Next.js', or 'define nested types in ContentLayer'. Applies patterns: allPosts iteration, date formatting with toLocaleDateString, defineNestedType for structured frontmatter fields. Make sure to use this skill whenever working with ContentLayer post listings or blog index pages in Next.js. Not for static site generation, MDX rendering, or App Router server components."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: contentlayer
  tags: [contentlayer, blog, listing, defineNestedType, date-formatting, pages-router, next-js]
---

# Listagem Dinâmica de Posts com ContentLayer

> Itere sobre `allPosts` do ContentLayer com `.map`, formate datas com `toLocaleDateString`, e defina tipos aninhados com `defineNestedType` para campos estruturados no frontmatter.

## Rules

1. **Importe `allPosts` direto do ContentLayer** — `import { allPosts } from 'contentlayer/generated'`, porque o ContentLayer ja gera o array tipado automaticamente
2. **Formate datas no ponto de uso** — `new Date(post.date).toLocaleDateString('pt-BR')`, porque o ContentLayer retorna datas como string ISO
3. **Use `defineNestedType` para objetos no frontmatter** — como `author: { name, avatar }`, porque `defineDocumentType` nao aceita objetos inline nos fields
4. **Marque campos aninhados como `required: true`** — para eliminar tipos opcionais e evitar optional chaining desnecessario no componente
5. **O slug e o nome do arquivo** — ContentLayer usa o filename como identificador, entao `posts/meu-post.md` gera slug `meu-post`
6. **Reinicie o build do ContentLayer apos mudar o schema** — `pnpm contentlayer build`, porque mudancas no config nao sao detectadas pelo hot reload

## Steps

### Step 1: Definir tipo aninhado no contentlayer.config.ts

```typescript
import { defineNestedType, defineDocumentType, makeSource } from 'contentlayer/source-files'

const Author = defineNestedType(() => ({
  name: 'Author',
  fields: {
    name: { type: 'string', required: true },
    avatar: { type: 'string', required: true },
  },
}))
```

### Step 2: Usar o tipo aninhado no document type

```typescript
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
```

### Step 3: Adicionar frontmatter no post Markdown

```markdown
---
title: Meu Post
description: Descricao do post
date: 2024-01-15
image: /images/post-cover.jpg
author:
  name: João Silva
  avatar: /images/avatar.jpg
---
```

### Step 4: Iterar e renderizar na pagina

```typescript
import { allPosts } from 'contentlayer/generated'

export default function Blog() {
  const posts = allPosts

  return (
    <div>
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
    </div>
  )
}
```

## Error handling

- Se TypeScript nao reconhece os novos tipos apos rebuild: execute `Ctrl+Shift+P > Reload Window` no VS Code para forcar reload das tipagens geradas
- Se campos aparecem como `undefined`: verifique que `required: true` esta definido no config E no frontmatter do post
- Se o ContentLayer nao detecta mudancas no schema: mate o processo dev, rode `pnpm contentlayer build`, e reinicie

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo campo simples (string, date) | Adicione direto em `fields` do `defineDocumentType` |
| Novo campo objeto (author, seo) | Crie com `defineNestedType` e referencie com `type: 'nested'` |
| Data aparece sem formatacao | Use `new Date(post.date).toLocaleDateString('pt-BR')` |
| Tipo nao atualiza no VS Code | Reload Window, nao reinstale dependencias |
| Precisa de novo post | Crie arquivo `.md` na pasta de posts, ContentLayer detecta automaticamente |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Definir objetos inline nos fields do document type | Usar `defineNestedType` separado |
| Formatar data no componente filho | Formatar no `.map` antes de passar como prop |
| Usar optional chaining em campos required | Marcar `required: true` no config e remover `?` |
| Editar arquivos em `.contentlayer/generated/` | Editar apenas `contentlayer.config.ts` e rebuild |
| Instalar libs de data so para formatacao simples | Usar `toLocaleDateString` nativo |

## Troubleshooting

### Erro ao usar hooks em Server Component
**Symptom:** Erro "useState/useEffect is not a function" ou "Hooks can only be called inside a Client Component"
**Cause:** Tentativa de usar hooks React (useState, useEffect, useSession) em um componente sem a diretiva "use client"
**Fix:** Adicionar `"use client"` no topo do arquivo OU extrair a parte interativa para um componente-folha separado com "use client"

### Server Component nao consegue ser async apos adicionar "use client"
**Symptom:** Erro ao usar `async function Component()` com `"use client"`
**Cause:** Client Components nao suportam async/await — essa e uma restricao fundamental do React
**Fix:** Remover "use client" e usar async/await direto (Server Component), ou manter "use client" e buscar dados via hooks (useEffect, React Query)

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-listagem-dinamica-de-posts/references/deep-explanation.md) — O ContentLayer funciona como uma camada intermediaria entre seus arquivos Markdown e o Next.js. Quan
- [code-examples.md](../../../data/skills/next-js/rs-next-js-listagem-dinamica-de-posts/references/code-examples.md) — import {
