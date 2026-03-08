---
name: rs-next-js-adicionando-imagens
description: "Applies background image patterns in Next.js pages using Tailwind CSS utility classes. Use when user asks to 'add background image', 'add section background', 'responsive background', 'bg image tailwind', or 'image overlay section'. Enforces absolute-positioned div overlay pattern with mobile-first visibility, proper stacking context with relative parent, and opacity control. Make sure to use this skill whenever adding decorative background images to page sections in Next.js or Tailwind projects. Not for content images, Next.js Image component optimization, or icon/logo placement."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: styling-images
  tags: [background-image, tailwind, responsive, overlay, opacity, next-js]
---

# Adicionando Imagens de Fundo com Tailwind CSS

> Use uma div absoluta separada para imagens de fundo decorativas, nunca aplique diretamente na section, porque isso permite controle independente de opacidade e visibilidade responsiva.

## Rules

1. **Imagens decorativas em `/public`** — coloque SVGs e backgrounds em `public/` na raiz, porque o Next.js serve estaticamente de la
2. **Div separada para background** — crie uma div auto-fechada com a imagem via `bg-[url()]`, porque separar do conteudo permite controlar opacidade sem afetar o texto
3. **Parent relative, overlay absolute** — a section recebe `relative`, a div de imagem recebe `absolute inset-0`, porque isso cria o stacking context correto
4. **Conteudo tambem relative** — a div de conteudo sobre o background precisa de `relative`, porque sem isso o conteudo fica atras da imagem absoluta
5. **Mobile-first visibility** — use `hidden md:block` na div de background, porque em telas pequenas imagens decorativas poluem a interface
6. **Opacity para suavizar** — aplique `opacity-90` ou similar na div de background, porque isso evita que a imagem compete visualmente com o conteudo

## How to write

### Background decorativo em section

```tsx
<section className="relative">
  {/* Overlay de imagem — separado do conteudo */}
  <div
    className="absolute inset-0 hidden md:block bg-[url('/background-features.svg')] bg-cover bg-center bg-no-repeat opacity-90"
  />

  {/* Conteudo — relative para ficar acima do overlay */}
  <div className="relative">
    <h2>Seu conteudo aqui</h2>
  </div>
</section>
```

## Example

**Before (imagem direto na section — problematico):**
```tsx
<section className="bg-[url('/bg.svg')] bg-cover opacity-90">
  <h2>Texto fica com opacity tambem</h2>
</section>
```

**After (com div separada — correto):**
```tsx
<section className="relative">
  <div className="absolute inset-0 hidden md:block bg-[url('/bg.svg')] bg-cover bg-center bg-no-repeat opacity-90" />
  <div className="relative">
    <h2>Texto com opacity normal</h2>
  </div>
</section>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Imagem decorativa de fundo | Div absoluta separada com `hidden md:block` |
| Conteudo some atras do bg | Adicione `relative` na div de conteudo |
| Imagem nao aparece | Verifique que o path comeca com `/` e esta em `public/` |
| Precisa de opacity no bg sem afetar texto | Div separada com opacity propria |
| SVG exportado do Figma | Coloque em `public/`, use via `bg-[url()]` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<section style={{backgroundImage: ...}}>` | Div absoluta com classes Tailwind |
| `opacity-90` na section inteira | `opacity-90` apenas na div de background |
| Background visivel em mobile sem necessidade | `hidden md:block` na div de background |
| Conteudo sem `relative` sobre bg absoluto | `<div className="relative">` envolvendo conteudo |
| Imagem em `src/assets/` para bg CSS | Imagem em `public/` para acesso via URL |

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

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-adicionando-imagens/references/deep-explanation.md) — O instrutor demonstra um pattern essencial: quando voce aplica `opacity` diretamente numa section qu
- [code-examples.md](../../../data/skills/next-js/rs-next-js-adicionando-imagens/references/code-examples.md) — // Suporte section — section de Features
