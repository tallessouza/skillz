---
name: rs-next-js-secao-feature
description: "Applies Next.js landing page feature section patterns when building card-based UI sections with Next Image, Next Link, and Tailwind CSS. Use when user asks to 'create a features section', 'build card components', 'make responsive cards', 'add image with next/image in a card', or 'build a landing page section'. Enforces responsive mobile-first layout, duplicate button pattern for mobile/desktop, and proper image containment. Make sure to use this skill whenever creating card-based feature sections in Next.js with Tailwind. Not for API routes, data fetching, server components logic, or non-UI tasks."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: landing-page-sections
  tags: [feature-section, cards, responsive, next-image, tailwind, mobile-first, landing-page]
---

# Secao Feature — Landing Page Cards com Next.js

> Construa secoes de features com cards responsivos usando Next Image, Next Link e Tailwind CSS, seguindo o padrao mobile-first com progressive enhancement.

## Rules

1. **Componente isolado por secao** — crie `feature-section.tsx` com export nomeado e re-exporte via `index.ts`, porque facilita composicao na page
2. **Cards identicos = mesma estrutura, conteudo diferente** — copie a div do card e troque apenas texto/props, porque evita inconsistencia visual
3. **Card diferenciado recebe tratamento grid** — quando um card tem imagem + CTA, use grid com 1 coluna mobile e 2 colunas em `md:`, porque separa conteudo e midia
4. **Botao duplicado para responsividade** — crie dois botoes identicos, um `hidden md:flex` e outro `md:hidden`, porque a posicao do CTA muda entre mobile e desktop
5. **Imagem contida com overflow-hidden** — envolva Next Image em div com `overflow-hidden`, `max-w-md`, e aplique `object-cover w-full` na imagem, porque previne quebra de layout
6. **Estilos customizados no Tailwind config** — quando um estilo nao existe (ex: `text-body-tag`), crie no `tailwind.config`, porque manter consistencia com o style guide e prioritario

## How to write

### Estrutura do componente

```tsx
// components/feature-section.tsx
import Image from "next/image";
import Link from "next/link";

export const FeatureSection = () => {
  return (
    <section className="container bg-gray-700 grid gap-6 md:grid-cols-1 pb-8 pt-8 md:py-10">
      <h2 className="text-gray-100 text-heading-lg">Titulo da secao</h2>

      {/* Card simples */}
      <div className="flex flex-col gap-4 rounded-lg bg-gray-500 p-6 md:p-12">
        <span className="text-body-tag text-blue-200 bg-blue-400 px-2 py-1 inline-flex rounded-sm uppercase">
          Tag
        </span>
        <p>Descricao do card</p>
      </div>

      {/* Card com imagem e CTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-4 rounded-lg bg-gray-500 p-6 md:p-12">
        <div className="flex flex-col gap-4">
          <span className="text-body-tag text-blue-200 bg-blue-400 px-2 py-1 inline-flex rounded-sm uppercase">
            Tag
          </span>
          <p>Descricao</p>
          {/* Botao desktop */}
          <button className="hidden md:flex rounded-full mt-4">
            <Link href="/criar-loja">Criar loja gratis</Link>
          </button>
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <div className="w-full max-w-md overflow-hidden">
            <Image src="/feature-section.svg" alt="Features" width={440} height={330} className="object-cover w-full" />
          </div>
        </div>
        {/* Botao mobile */}
        <button className="md:hidden w-full rounded-full mt-4 gap-2">
          <Link href="/criar-loja">Criar loja gratis</Link>
        </button>
      </div>
    </section>
  );
};
```

### Estilo customizado no Tailwind

```js
// tailwind.config.js — adicionar font size customizado
fontSize: {
  'body-tag': ['12px', { lineHeight: 'normal', fontWeight: '500' }],
}
```

## Example

**Before (card sem responsividade):**
```tsx
<div className="bg-gray-500 p-6">
  <span>Tag</span>
  <p>Texto</p>
  <Image src="/img.svg" alt="img" width={440} height={330} />
  <button>CTA</button>
</div>
```

**After (com padrao responsivo e imagem contida):**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-4 rounded-lg bg-gray-500 p-6 md:p-12">
  <div className="flex flex-col gap-4">
    <span className="text-body-tag text-blue-200 bg-blue-400 px-2 py-1 inline-flex rounded-sm uppercase">Tag</span>
    <p>Texto</p>
    <button className="hidden md:flex rounded-full mt-4">CTA</button>
  </div>
  <div className="flex flex-col items-center justify-center w-full">
    <div className="w-full max-w-md overflow-hidden">
      <Image src="/img.svg" alt="img" width={440} height={330} className="object-cover w-full" />
    </div>
  </div>
  <button className="md:hidden w-full rounded-full mt-4">CTA</button>
</div>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Cards com mesma estrutura | Copie a div, troque so conteudo |
| Card com imagem lateral | Use grid 1col mobile, 2col desktop |
| CTA muda de posicao no mobile | Duplique botao com hidden/md:hidden |
| Estilo nao existe no Tailwind | Crie no config seguindo style guide |
| Imagem pode estourar container | Envolva em div com overflow-hidden e max-w |
| Span como tag/badge | Use inline-flex, rounded-sm, uppercase, padding pequeno |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Botao unico com position absolute para mobile | Dois botoes com hidden/md:hidden |
| `<img>` tag HTML direto | `<Image>` do next/image com width/height |
| `<a>` tag para navegacao interna | `<Link>` do next/link |
| Imagem sem container com overflow | Div wrapper com overflow-hidden e max-w |
| Estilo inline para tipografia recorrente | Classe customizada no tailwind.config |
| Grid fixo sem breakpoint mobile | grid-cols-1 default + md:grid-cols-2 |

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

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-secao-feature/references/deep-explanation.md) — O instrutor segue o padrao de criar um arquivo por secao da landing page (`feature-section.tsx`) com
- [code-examples.md](../../../data/skills/next-js/rs-next-js-secao-feature/references/code-examples.md) — // components/feature-section.tsx
