---
name: rs-next-js-seo-e-core-web-vitals
description: "Enforces SEO best practices and Core Web Vitals optimization when building Next.js applications. Use when user asks to 'optimize SEO', 'improve performance', 'configure metadata', 'check Core Web Vitals', 'deploy Next.js app', or 'improve page speed'. Applies rules for Open Graph, metadata configuration, LCP/FCP/CLS optimization, and PageSpeed testing. Make sure to use this skill whenever deploying or optimizing Next.js projects for production. Not for general CSS styling, business logic, or backend API design."
---

# SEO e Core Web Vitals no Next.js

> Ao preparar um projeto Next.js para producao, garanta SEO 100% e performance otimizada medindo com PageSpeed Insights e otimizando as tres metricas Core Web Vitals.

## Rules

1. **Sempre configure metadata completa** — title, description, Open Graph (og:image, og:title, og:description), porque links compartilhados sem OG aparecem sem preview e perdem cliques
2. **Teste com PageSpeed Insights antes de considerar deploy finalizado** — `pagespeed.web.dev`, porque o Google usa essas metricas para ranqueamento
3. **Otimize as tres metricas Core Web Vitals** — LCP (Largest Contentful Paint), FCP (First Contentful Paint), CLS (Cumulative Layout Shift), porque sao os fatores criticos de ranqueamento e experiencia do usuario
4. **Teste tanto mobile quanto desktop** — PageSpeed analisa ambos separadamente e mobile geralmente tem scores piores, porque o Google usa mobile-first indexing
5. **Corrija problemas de contraste e acessibilidade** — PageSpeed reporta problemas de contraste insuficiente, porque acessibilidade impacta SEO e usabilidade
6. **Resolva erros de console** — PageSpeed detecta e reporta erros JavaScript, porque erros no console indicam problemas que afetam performance e experiencia

## How to write

### Metadata com Open Graph no Next.js (App Router)

```typescript
// app/layout.tsx ou app/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Titulo do Projeto',
  description: 'Descricao clara e concisa do projeto',
  openGraph: {
    title: 'Titulo do Projeto',
    description: 'Descricao para compartilhamento',
    images: ['/og-image.png'],
    type: 'website',
  },
}
```

### Otimizacao de imagens para LCP

```typescript
// Imagem principal (LCP element) com priority
import Image from 'next/image'

<Image
  src="/hero.png"
  alt="Hero description"
  width={1200}
  height={630}
  priority // Carrega sem lazy loading — melhora LCP
/>
```

### Prevencao de CLS (Cumulative Layout Shift)

```typescript
// Sempre defina dimensoes explicitas para imagens e embeds
<Image
  src="/produto.png"
  alt="Produto"
  width={400}
  height={300}
  // width e height previnem layout shift durante carregamento
/>
```

## Example

**Before (SEO fraco, sem Open Graph):**
```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

**After (SEO completo, Open Graph configurado):**
```typescript
// app/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Meu Projeto',
    template: '%s | Meu Projeto',
  },
  description: 'Descricao otimizada para motores de busca',
  openGraph: {
    title: 'Meu Projeto',
    description: 'Descricao para compartilhamento em redes sociais',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Deploy para producao | Rodar PageSpeed Insights em mobile E desktop |
| Score de performance < 90 | Investigar LCP e otimizar imagens com `priority` e `next/image` |
| CLS > 0.1 | Adicionar dimensoes explicitas a todos os elementos dinamicos |
| Contraste insuficiente reportado | Ajustar cores para WCAG AA (ratio minimo 4.5:1) |
| Erros no console reportados | Corrigir antes de considerar deploy finalizado |
| Compartilhamento em redes sociais sem preview | Verificar configuracao de Open Graph |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Deploy sem testar PageSpeed | Testar mobile e desktop no `pagespeed.web.dev` |
| Imagens sem dimensoes definidas | Sempre usar `width` e `height` em `next/image` |
| Hero image sem `priority` | Adicionar `priority` ao elemento LCP principal |
| Metadata so com title | Configurar title, description, e Open Graph completo |
| Ignorar score mobile | Priorizar mobile — Google usa mobile-first indexing |
| `<html>` sem atributo `lang` | Sempre definir `<html lang="pt-BR">` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-seo-e-core-web-vitals/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-seo-e-core-web-vitals/references/code-examples.md)
