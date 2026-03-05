---
name: rs-next-js-componente-markdown
description: "Applies React Markdown rendering patterns when building blog posts or content pages in Next.js. Use when user asks to 'render markdown', 'create a blog post', 'display markdown content', 'style markdown elements', or 'use react-markdown'. Enforces component-based markdown element customization with Tailwind styling, remark plugins setup, and progressive element styling. Make sure to use this skill whenever rendering markdown content in React/Next.js projects. Not for markdown parsing without rendering, static site generators, or MDX component authoring."
---

# Componente Markdown com React Markdown

> Renderize conteudo Markdown em Next.js usando react-markdown com componentes customizados para cada elemento HTML, estilizados individualmente.

## Rules

1. **Use react-markdown como wrapper** — ele converte Markdown em componentes React, porque permite customizar cada elemento individualmente
2. **Sempre instale remark-gfm** — adiciona suporte a tabelas, listas de tarefas e URLs automaticas, porque Markdown padrao nao suporta essas features
3. **Customize elementos via prop `components`** — passe um objeto mapeando tags HTML para componentes React estilizados, porque isso da controle total sobre a aparencia
4. **Estilize progressivamente** — comece com h1, p, e links, depois adicione h2, h3, strong conforme necessario, porque nem todo post usa todos os elementos
5. **Mantenha responsividade nos componentes** — use breakpoints diferentes para mobile e desktop em cada elemento, porque posts sao lidos em todos os dispositivos
6. **Repasse href e children fielmente** — nunca perca props dos elementos originais ao customizar, porque links quebram sem href

## How to write

### Setup de dependencias

```bash
pnpm add react-markdown remark-gfm
```

### Componente Markdown base

```typescript
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

### Uso na pagina de post

```typescript
import { Markdown } from "@/components/markdown";

// Dentro do componente da pagina
<article>
  <Header />
  <div className="prose max-w-[900px] px-4 mt-12 md:px-6 lg:px-12">
    <Markdown content={post.body.raw} />
  </div>
</article>
```

## Example

**Before (markdown sem customizacao):**
```typescript
// Renderiza HTML cru sem estilizacao
<div dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }} />
```

**After (com react-markdown e componentes):**
```typescript
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    h1: ({ children }) => (
      <h1 className="mb-8 text-heading-md md:text-heading-xl">{children}</h1>
    ),
    p: ({ children }) => (
      <p className="mb-6 leading-relaxed text-gray-200">{children}</p>
    ),
    a: ({ href, children }) => (
      <a href={href} className="text-blue-200 hover:underline">{children}</a>
    ),
  }}
>
  {content}
</ReactMarkdown>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Post tem links externos | Adicione componente `a` com hover:underline e cor diferenciada |
| Post usa titulos hierarquicos | Mapeie h1, h2, h3 com tamanhos decrescentes e responsivos |
| Post tem texto enfatizado | Mapeie `strong` com font-extrabold e cor levemente mais clara |
| Precisa de tabelas ou task lists | Instale remark-gfm como plugin |
| Quer syntax highlighting | Pesquise plugins adicionais de remark/rehype |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `dangerouslySetInnerHTML` para markdown | `<ReactMarkdown>{content}</ReactMarkdown>` |
| Estilizar markdown com CSS global | Usar prop `components` para customizar cada tag |
| Esquecer remark-gfm | Sempre incluir `remarkPlugins={[remarkGfm]}` |
| Passar className direto no ReactMarkdown | Envolver em div com className para layout |
| Criar componente sem repassar children | Sempre desestruturar e repassar `{ children }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
