---
name: rs-next-js-melhorando-seo-landing-page
description: "Applies Next.js static metadata and Open Graph configuration when building landing pages or improving SEO. Use when user asks to 'add SEO', 'configure metadata', 'add open graph', 'improve page ranking', or 'add meta tags' in a Next.js project. Ensures correct metadata export, OG image setup, and robots configuration. Make sure to use this skill whenever creating or editing Next.js pages that need SEO. Not for dynamic metadata generation, sitemap creation, or structured data/JSON-LD."
---

# SEO com Metadata Estatica no Next.js

> Exporte a constante `metadata` tipada com `Metadata` do Next.js para gerar automaticamente todas as meta tags de SEO e Open Graph.

## Rules

1. **Exporte `metadata` como constante tipada** — `export const metadata: Metadata = {}`, porque o Next.js detecta essa API automaticamente e gera todas as meta tags no `<head>`
2. **Use a imagem OG na pasta `public/`** — nomeie como `og-image.jpg` na raiz de `public/`, porque o Next.js serve arquivos de `public/` diretamente na URL base
3. **URL da imagem OG deve ser absoluta** — use a URL de producao completa (`https://dominio.com/og-image.jpg`), porque redes sociais precisam de URL absoluta para buscar a imagem
4. **Inclua `robots: { index: true, follow: true }`** — porque isso permite que motores de busca indexem e sigam links da pagina
5. **Open Graph precisa de title, description, url, siteName, locale, type e images** — porque cada campo alimenta um aspecto diferente do preview em redes sociais
6. **Especifique width e height nas imagens OG** — `width: 800, height: 600` evita layout shift no preview das redes sociais

## How to write

### Metadata estatica completa

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nome do Site",
  description: "Descricao concisa do que o site oferece",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Nome do Site",
    description: "Descricao concisa do que o site oferece",
    url: "https://dominio-producao.com",
    siteName: "Nome do Site",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "https://dominio-producao.com/og-image.jpg",
        width: 800,
        height: 600,
        alt: "Nome do Site",
      },
    ],
  },
};
```

## Example

**Before (pagina sem SEO):**
```typescript
// src/app/page.tsx
export default function Home() {
  return <main>...</main>;
}
// Resultado: <head> com apenas tags padrao do Next.js
```

**After (com metadata estatica):**
```typescript
// src/app/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site.Set",
  description: "Venda seus produtos como afiliado em um unico lugar",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Site.Set",
    description: "Venda seus produtos como afiliado em um unico lugar",
    url: "https://site-set.vercel.app",
    siteName: "Site.Set",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "https://site-set.vercel.app/og-image.jpg",
        width: 800,
        height: 600,
        alt: "Site.Set",
      },
    ],
  },
};

export default function Home() {
  return <main>...</main>;
}
// Resultado: <head> com dezenas de meta tags geradas automaticamente
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Landing page nova | Adicione metadata estatica com OG completo |
| Pagina com conteudo dinamico (blog post) | Use `generateMetadata()` em vez de constante |
| Imagem OG do Figma | Exporte como JPEG, coloque em `public/`, nomeie `og-image.jpg` |
| Verificar meta tags geradas | Inspecione `<head>` no DevTools do navegador |
| Verificar preview social | Use opengraph.xyz para checar como aparece nas redes |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Meta tags manuais no JSX (`<meta>`) | `export const metadata: Metadata` |
| URL relativa na imagem OG (`/og-image.jpg`) | URL absoluta (`https://dominio.com/og-image.jpg`) |
| Imagem OG sem width/height | Sempre especifique `width: 800, height: 600` |
| Metadata sem tipagem | `import type { Metadata } from "next"` para autocomplete |
| Commit direto na main em projetos reais | Crie branch, abra PR |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-melhorando-o-seo-da-landing-page/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-melhorando-o-seo-da-landing-page/references/code-examples.md)
