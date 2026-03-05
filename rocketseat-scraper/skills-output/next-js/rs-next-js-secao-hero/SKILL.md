---
name: rs-next-js-secao-hero
description: "Applies Hero section construction patterns when building landing pages with Next.js. Use when user asks to 'create a hero section', 'build a landing page', 'make a responsive hero', or 'implement a hero component'. Enforces mobile-first responsive layout with CSS grid, Next.js Image component, Link wrapping for CTAs, and semantic HTML structure. Make sure to use this skill whenever creating hero or above-the-fold sections in Next.js projects. Not for API routes, data fetching, or backend logic."
---

# Secao Hero — Next.js Landing Page

> Construa hero sections com layout grid responsivo, mobile-first, usando Image e Link do Next.js com HTML semantico.

## Rules

1. **Use HTML semantico** — `<section>` para a hero, `<h1>` para titulo principal, porque melhora SEO e acessibilidade
2. **Mobile-first sempre** — comece com layout mobile (coluna unica, imagem escondida) e adicione breakpoints `md:` e `lg:`, porque garante experiencia em todos os dispositivos
3. **Grid para layout hero** — use CSS grid com `grid-cols-1 md:grid-cols-2` para dividir conteudo e imagem, porque flexbox nao distribui colunas iguais tao bem
4. **Imagem via next/image** — sempre use o componente `Image` do Next.js com `width`, `height` e `alt` descritivo, porque otimiza carregamento automaticamente
5. **Botao-link com asChild** — quando um botao e na verdade navegacao, use a prop `asChild` do componente Button e envolva com `Link` do Next.js, porque preserva semantica e acessibilidade
6. **Imagens em /public** — acesse com path absoluto a partir de `/`, sem incluir `public/` no src, porque Next.js serve `/public` como raiz estatica

## How to write

### Estrutura do componente Hero

```tsx
// components/HeroSection.tsx
import Image from "next/image"
import Link from "next/link"
import { Clock, Store, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const HeroSection = () => {
  return (
    <section className="container relative flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[20rem] md:h-[36rem] items-center">
        {/* Lado esquerdo: conteudo */}
        <div className="flex flex-col items-center justify-center gap-4 md:items-start lg:items-start">
          <h1 className="text-heading-hg">Venda seus produtos online</h1>

          {/* Features com icones */}
          <div>
            <div className="flex items-center gap-2">
              <Clock className="text-cyan-100" height={16} width={16} />
              <span className="text-gray-200">Crie sua loja em minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <Store className="text-cyan-100" height={16} width={16} />
              <span className="text-gray-200">Milhares de produtos</span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-2 items-center md:items-start">
            <Button className="w-fit" asChild>
              <Link href="/criar-loja">
                Criar loja gratis
                <ArrowRight className="text-white" />
              </Link>
            </Button>
            <p className="text-gray-300 text-body-xs">
              Sem necessidade de cartao de credito
            </p>
          </div>
        </div>

        {/* Lado direito: imagem (hidden no mobile) */}
        <div className="relative h-[20rem] hidden md:flex lg:flex items-center justify-center">
          <Image
            src="/hero-section.svg"
            alt="Ilustracao com icones de store, tag e sacola"
            width={200}
            height={400}
            className="h-auto w-auto"
          />
        </div>
      </div>
    </section>
  )
}
```

### Uso na pagina

```tsx
// pages/index.tsx
import { HeroSection } from "@/components/HeroSection"

export default function Home() {
  return (
    <>
      <HeroSection />
      {/* demais secoes */}
    </>
  )
}
```

## Example

**Before (botao sem navegacao):**
```tsx
<button className="bg-primary text-white">
  Criar loja gratis
</button>
```

**After (botao-link com asChild):**
```tsx
<Button className="w-fit" asChild>
  <Link href="/criar-loja">
    Criar loja gratis
    <ArrowRight className="text-white" />
  </Link>
</Button>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Hero com imagem decorativa | `hidden` no mobile, `md:flex` no desktop |
| CTA que navega para outra rota | `Button asChild` + `Link` do Next.js |
| Icones pequenos ao lado de texto | Flex row com `items-center gap-2`, tamanho fixo no icone |
| Layout conteudo + imagem lado a lado | Grid `grid-cols-1 md:grid-cols-2` |
| Imagem estatica no projeto | Coloque em `/public`, acesse com `/nome.svg` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| `<img src="...">` em Next.js | `<Image src="..." width={} height={} alt="..." />` |
| `<button onClick={() => router.push(...)}` | `<Button asChild><Link href="...">` |
| `src="/public/hero.svg"` | `src="/hero.svg"` (sem /public) |
| Layout hero com flexbox para 2 colunas | `grid grid-cols-1 md:grid-cols-2` |
| Imagem visivel no mobile sem necessidade | `hidden md:flex` para mostrar so no desktop |
| `<div>` como container da secao | `<section>` com classe container |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
