# Code Examples: Componente Markdown

## 1. Instalacao

```bash
pnpm add react-markdown
pnpm add remark-gfm
```

## 2. Componente Markdown completo (como construido na aula)

```typescript
// components/markdown/markdown.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
  content: string;
}

export const Markdown = ({ content }: MarkdownProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="mb-4 text-heading-md md:text-heading-xl">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-4 mt-2 text-heading-sm md:text-heading-lg">
            {children}
          </h2>
        ),
        p: ({ children }) => (
          <p className="mb-6 leading-relaxed text-gray-200">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-extrabold text-gray-100">{children}</strong>
        ),
        a: ({ href, children }) => (
          <a href={href} className="text-blue-200 hover:underline">
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
```

## 3. Barrel export

```typescript
// components/markdown/index.ts
export { Markdown } from "./markdown";
```

## 4. Uso na pagina de post (pages/blog/[slug].tsx)

```typescript
import { Markdown } from "@/components/markdown";

export default function PostPage({ post }) {
  return (
    <div className="container space-y-12 px-4 md:px-8">
      <article>
        <Header
          title={post.title}
          author={post.author}
          date={post.date}
          className="mt-8 md:mt-12"
        />
        <div className="prose max-w-[900px] px-4 mt-12 md:px-6 lg:px-12">
          <Markdown content={post.body.raw} />
        </div>
      </article>
    </div>
  );
}
```

## 5. Testando elementos no markdown

```markdown
# Titulo H1

## Subtitulo H2

Este e um paragrafo com **texto em negrito** para testar.

[Esse e um link em markdown](https://localhost)
```

## 6. Adicionando mais componentes (extensao)

```typescript
// Exemplo de como adicionar h3, ul, li, blockquote
components={{
  // ... componentes existentes
  h3: ({ children }) => (
    <h3 className="mb-3 mt-2 text-heading-xs md:text-heading-md">
      {children}
    </h3>
  ),
  ul: ({ children }) => (
    <ul className="mb-6 ml-6 list-disc text-gray-200">{children}</ul>
  ),
  li: ({ children }) => (
    <li className="mb-2 leading-relaxed">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-300">
      {children}
    </blockquote>
  ),
}}
```

## 7. Espacamento do layout

```
Header (mt-8 mobile, mt-12 desktop)
  |
  48px (mt-12)
  |
Markdown content (max-w-[900px], px-4, md:px-6, lg:px-12)
  |
  [area reservada para compartilhamento ao lado]
```