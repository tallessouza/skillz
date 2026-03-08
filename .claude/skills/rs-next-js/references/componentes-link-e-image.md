---
name: rs-next-js-componentes-link-e-image
description: "Enforces usage of Next.js Image and Link components instead of native HTML tags when writing Next.js code. Use when user asks to 'add an image', 'create a link', 'navigate between pages', 'optimize images', or any Next.js page/component work. Applies rules: always next/image over img, always next/link over anchor, required props (src, width, height, alt), public folder asset paths with leading slash. Make sure to use this skill whenever generating Next.js components that include images or navigation links. Not for React without Next.js, external link libraries, or React Router."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: fundamentos-next-js
  tags: [next-image, next-link, optimization, lazy-loading, prefetch, next-js]
---

# Componentes Link e Image do Next.js

> Sempre use `next/image` e `next/link` em vez das tags HTML nativas `<img>` e `<a>` em projetos Next.js.

## Rules

1. **Sempre `next/image` em vez de `<img>`** — porque o componente Image otimiza tamanho automaticamente por dispositivo, suporta formatos modernos (WebP), faz lazy loading e evita layout shift (aquele pulo de conteudo quando a imagem carrega)
2. **Sempre `next/link` em vez de `<a>`** — porque o Link faz prefetch no hover, nao recarrega a pagina inteira e torna a navegacao muito mais rapida e fluida
3. **Propriedades obrigatorias no Image** — `src`, `width`, `height` e `alt`, porque sem width/height causa layout shift, sem alt prejudica SEO e acessibilidade
4. **Assets na pasta `public/` acessados com barra** — `src="/assets/foto.png"` acessa `public/assets/foto.png`, porque o Next serve automaticamente o conteudo de `public/` na raiz
5. **Importe de `next/image` e `next/link`** — sao componentes built-in do Next.js, nao precisa instalar nada adicional

## How to write

### Image otimizada

```tsx
import Image from 'next/image'

<Image
  src="/assets/avatar.png"
  width={200}
  height={200}
  alt="Foto de perfil do usuario"
/>
```

### Link com prefetch automatico

```tsx
import Link from 'next/link'

<Link href="/users">
  Pagina de usuarios
</Link>
```

## Example

**Before (tags HTML nativas):**
```tsx
export default function Home() {
  return (
    <div>
      <a href="/users">Ver usuarios</a>
      <img src="/assets/banner.png" />
    </div>
  )
}
```

**After (com componentes Next.js):**
```tsx
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div>
      <Link href="/users">Ver usuarios</Link>
      <Image
        src="/assets/banner.png"
        width={800}
        height={400}
        alt="Banner principal do site"
      />
    </div>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Qualquer navegacao interna entre paginas | Use `next/link` |
| Link externo (outro dominio) | `<a>` com `target="_blank"` e `rel="noopener"` e OK |
| Qualquer imagem no projeto | Use `next/image` |
| Imagem local na pasta public | `src="/caminho/arquivo.ext"` (barra inicial) |
| Imagem de dominio externo | Configure `next.config.js` com `images.remotePatterns` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<img src="/logo.png" />` | `<Image src="/logo.png" width={100} height={50} alt="Logo" />` |
| `<a href="/about">Sobre</a>` | `<Link href="/about">Sobre</Link>` |
| `<Image src="/foto.png" />` (sem dimensoes) | `<Image src="/foto.png" width={300} height={200} alt="Descricao" />` |
| `<Image ... alt="" />` (alt vazio) | `<Image ... alt="Descricao significativa da imagem" />` |

## Troubleshooting

### Imagem nao carrega com next/image
**Symptom:** Componente Image mostra placeholder ou erro 404
**Cause:** Dominio externo nao configurado em next.config ou path incorreto
**Fix:** Para imagens externas, adicionar o dominio em `images.remotePatterns` no next.config.js. Para imagens locais, verificar que o arquivo esta em `public/` e o path comeca com `/`

### Imagem distorcida ou cortada
**Symptom:** Imagem aparece com proporcoes erradas
**Cause:** Width e height nao correspondem ao aspect ratio original
**Fix:** Usar `fill` prop com `objectFit="cover"` para responsividade, ou calcular width/height corretos

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-componentes-link-e-image/references/deep-explanation.md) — O instrutor destaca que performance e experiencia do usuario sao essenciais para aplicacoes web. As 
- [code-examples.md](../../../data/skills/next-js/rs-next-js-componentes-link-e-image/references/code-examples.md) — // pages/index.tsx — Pagina Home
