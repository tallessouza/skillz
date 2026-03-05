---
name: rs-next-js-gerando-open-graph-image
description: "Generates Open Graph image routes in Next.js App Router using ImageResponse from next/og. Use when user asks to 'create og image', 'add open graph', 'generate social preview', 'share preview image', or 'embed image for sharing'. Applies correct file naming, Flexbox-only CSS, ImageResponse dimensions, and caching. Make sure to use this skill whenever creating social sharing images in Next.js projects. Not for general image optimization, static assets, or favicon generation."
---

# Gerando Open Graph Image no Next.js

> Crie arquivos `opengraph-image.tsx` nas rotas do App Router para gerar imagens de embed automaticamente com ImageResponse.

## Rules

1. **Importe ImageResponse de `next/og`** — nao de `next/server`, porque `next/og` e o modulo correto para Open Graph image generation
2. **Use apenas Flexbox** — `display: "flex"` e obrigatorio no container raiz, `display: grid` e outras propriedades CSS avancadas nao funcionam no ImageResponse
3. **Defina dimensoes 1200x630** — esse e o tamanho padrao de imagens Open Graph para embeds em redes sociais
4. **Passe estilos como objetos inline** — nao ha suporte a Tailwind ou CSS modules dentro do ImageResponse, use a prop `style` com objetos JavaScript
5. **Adicione cache com `unstable_cache` ou `"use cache"`** — a geracao da imagem acontece server-side e pode fazer fetch de dados, cachear evita reprocessamento
6. **Nomeie o arquivo exatamente `opengraph-image.tsx`** — o Next.js detecta automaticamente pela convencao de nome e injeta a meta tag `og:image` no head

## How to write

### Arquivo basico de Open Graph image

```typescript
// app/issues/[id]/opengraph-image.tsx
import { ImageResponse } from "next/og";

export default async function IssueImage({
  params,
}: {
  params: { id: string };
}) {
  const issue = await getIssue(params.id);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          background: "#16161D",
          padding: "80px",
        }}
      >
        <p style={{ fontSize: 48, fontWeight: 600, color: "#9397AA" }}>
          {issue.issueNumber}
        </p>
        <p
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#ECEDF2",
            textAlign: "left",
            maxWidth: 1000,
          }}
        >
          {issue.title}
        </p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

## Example

**Before (sem Open Graph image):**
```
app/issues/[id]/
  └── page.tsx        // pagina existe mas sem preview social
```

**After (com Open Graph image):**
```
app/issues/[id]/
  ├── page.tsx
  └── opengraph-image.tsx   // Next.js auto-injeta og:image no head
```

O Next.js gera automaticamente no `<head>`:
```html
<meta property="og:image" content="/issues/42/opengraph-image" />
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Rota dinamica com dados unicos | Criar `opengraph-image.tsx` com fetch + cache |
| Pagina estatica sem dados dinamicos | Usar imagem estatica em `opengraph-image.png` |
| Precisa de fonte customizada | Carregar fonte via `fetch` + `ArrayBuffer` dentro do ImageResponse |
| Layout complexo com grid | Converter para Flexbox equivalente, grid nao funciona |
| Imagem demora para carregar | Adicionar cache de 15min+ nos dados fetchados |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `import { ImageResponse } from "next/server"` | `import { ImageResponse } from "next/og"` |
| `display: "grid"` no ImageResponse | `display: "flex"` com flexDirection |
| `className="..."` no ImageResponse | `style={{ ... }}` objeto inline |
| Imagem sem dimensoes explicitas | `{ width: 1200, height: 630 }` como segundo argumento |
| Fetch sem cache em OG image | Adicionar `"use cache"` ou `unstable_cache` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
