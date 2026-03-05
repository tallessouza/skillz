---
name: rs-nextjs-app-router-opengraph-image
description: "Generates dynamic OpenGraph images in Next.js App Router using ImageResponse and opengraph-image.tsx files. Use when user asks to 'create og image', 'generate share image', 'dynamic social preview', 'opengraph image', or 'meta image for each page'. Applies convention-based file routing for og images with dynamic params. Make sure to use this skill whenever generating social sharing images or configuring opengraph metadata in Next.js projects. Not for static metadata, favicon generation, or general image optimization."
---

# Gerando OpenGraph Image no Next.js

> Crie imagens de compartilhamento dinamicas por rota usando `opengraph-image.tsx` e `ImageResponse`.

## Rules

1. **Use `opengraph-image.tsx` para imagens dinamicas** — coloque o arquivo na pasta da rota que precisa da imagem, porque o Next.js detecta automaticamente pelo nome do arquivo
2. **Use `opengraph-image.png/jpg` para imagens estaticas** — basta colocar o arquivo de imagem na pasta da rota, porque o Next resolve automaticamente sem codigo
3. **Tamanho padrao: 1200x630** — exporte `size` com essas dimensoes, porque e o padrao OpenGraph aceito por todas as plataformas
4. **Use `img` nativo, nao `next/image`** — o componente Image do Next nao funciona dentro de `opengraph-image.tsx`, porque o contexto de renderizacao e isolado do layout
5. **URLs de imagem devem ser absolutas** — use o construtor `new URL(path, baseUrl)` para montar URLs completas, porque og-image nao resolve caminhos relativos
6. **Variaveis de ambiente server-only nao precisam de prefixo `NEXT_PUBLIC_`** — og-image roda no servidor, entao acesse `process.env.APP_URL` diretamente

## How to write

### Arquivo opengraph-image.tsx com params dinamicos

```typescript
// app/product/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import colors from 'tailwindcss/colors'
import { api } from '@/data/api'

export const alt = 'Product image'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage({
  params,
}: {
  params: { slug: string }
}) {
  const product = await api(`/products/${params.slug}`)

  const productImageUrl = new URL(
    product.image,
    process.env.APP_URL,
  ).toString()

  return new ImageResponse(
    (
      <div
        style={{
          background: colors.zinc[950],
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <img src={productImageUrl} alt="" style={{ width: '100%' }} />
      </div>
    ),
    { ...size },
  )
}
```

### Config exports obrigatorios

```typescript
// Estes exports viram meta tags automaticamente
export const alt = 'Descricao da imagem'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
```

## Example

**Before (sem og-image dinamico):**
```
app/product/[slug]/
  └── page.tsx          // sem imagem de compartilhamento personalizada
```

**After (com og-image dinamico):**
```
app/product/[slug]/
  ├── page.tsx
  └── opengraph-image.tsx   // gera imagem unica por produto
```

O Next gera automaticamente as meta tags:
```html
<meta property="og:image" content="http://localhost:3000/product/camiseta-ai/opengraph-image" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Product image" />
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Imagem igual para todas as paginas de uma rota | Use `opengraph-image.png` estatico na pasta |
| Imagem diferente por item (produto, post) | Use `opengraph-image.tsx` com params |
| Precisa de fonte customizada | Passe array `fonts` no segundo argumento do `ImageResponse` |
| Twitter precisa de imagem diferente | Crie `twitter-image.tsx` separado (aceita imagens maiores) |
| Sem `twitter-image`, Next usa og-image | Nao precisa duplicar, Twitter suporta formato OpenGraph |
| Precisa de cores do Tailwind no og-image | Importe `tailwindcss/colors` (Tailwind classes nao funcionam) |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `import Image from 'next/image'` no og-image | Use `<img>` nativo do HTML |
| `src="/produto.png"` (caminho relativo) | `src={new URL(path, baseUrl).toString()}` |
| `NEXT_PUBLIC_APP_URL` para variavel so usada no servidor | `APP_URL` sem prefixo (og-image e server component) |
| Tailwind classes (`className="bg-zinc-950"`) | Inline styles com `tailwindcss/colors` |
| Extensao `.png/.jpg` quando quer imagem dinamica | Extensao `.tsx` para gerar via codigo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-app-router-e-testes-gerando-opengraph-image/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-app-router-e-testes-gerando-opengraph-image/references/code-examples.md)
