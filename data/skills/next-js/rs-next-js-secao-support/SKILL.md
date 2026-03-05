---
name: rs-next-js-secao-support
description: "Applies Next.js landing page section patterns when building card-based support/feature sections with Tailwind CSS. Use when user asks to 'create a support section', 'build card components', 'make a landing page section with cards', 'add icon cards with grid layout', or 'style cards with gradients'. Enforces flexbox/grid layout, responsive padding, gradient backgrounds, Next Font integration, and consistent card structure. Make sure to use this skill whenever building card-grid sections in Next.js Pages Router projects. Not for app router, server components, or backend API routes."
---

# Secao Support — Card Grid em Landing Page Next.js

> Construa secoes de cards com grid responsivo, icones, gradientes e tipografia consistente usando Tailwind CSS no Pages Router.

## Rules

1. **Estruture cada card como div com flex column** — `flex flex-col gap-2` com padding responsivo (`p-6 md:p-12`), porque cards precisam de espacamento interno consistente em todos os breakpoints
2. **Use grid para layout de multiplos cards** — `grid gap-6 md:grid-cols-3`, porque grid distribui cards uniformemente e colapsa em mobile automaticamente
3. **Envolva icones em container com fundo** — div com `flex h-12 w-12 items-center justify-center rounded-lg bg-{cor}` e `mb-4`, porque icones soltos sem container parecem desalinhados
4. **Use Next Font para tipografia customizada** — importe fontes via `next/font/google` com `subsets` e `weight` especificos, porque fontes carregadas via CSS causam layout shift
5. **Aplique gradientes na section wrapper** — `bg-gradient-to-r from-gray-500 to-gray-700`, porque gradientes sutis dao profundidade sem distrair do conteudo
6. **Diferencie cards por cor, nao por estrutura** — mude apenas `bg-{cor}` do card e do icone container, mantendo a mesma estrutura HTML, porque facilita refatoracao futura em componente reutilizavel

## How to write

### Estrutura de card com icone

```tsx
<div className="flex flex-col gap-2 rounded-lg p-6 md:p-12 bg-blue-400">
  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-300 mb-4">
    <PaintbrushVertical className="h-6 w-6 text-white" />
  </div>
  <strong className="text-heading-sm text-gray-100">Personaliza o seu site</strong>
  <p className="text-body-sm text-gray-200">Descricao do card aqui</p>
</div>
```

### Grid de cards responsivo

```tsx
<div className="grid gap-6 md:grid-cols-3">
  {/* Card 1 — bg-blue-400 / bg-blue-300 */}
  {/* Card 2 — bg-cyan-300 / bg-cyan-200 */}
  {/* Card 3 — bg-blue-400 / bg-blue-300 */}
</div>
```

### Section com gradiente e Next Font

```tsx
import { PT_Sans_Caption } from "next/font/google";

const ptSansCaption = PT_Sans_Caption({ subsets: ["latin"], weight: "700" });

export const SupportSection = () => (
  <section className="container pb-8 md:py-10 bg-gradient-to-r from-gray-500 to-gray-700">
    <div className="flex flex-col items-center gap-12">
      <h2 className={`${ptSansCaption.className} text-balance text-center text-heading-xl text-gray-100`}>
        Sua loja de afiliados simples do jeito que deveria ser
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {/* cards aqui */}
      </div>
    </div>
  </section>
);
```

## Example

**Before (cards sem estrutura):**
```tsx
<div>
  <PaintbrushVertical />
  <h3>Personaliza o seu site</h3>
  <p>Descricao</p>
</div>
<div>
  <Store />
  <h3>Monte a sua loja</h3>
  <p>Descricao</p>
</div>
```

**After (com esta skill):**
```tsx
<section className="container pb-8 md:py-10">
  <div className="flex flex-col items-center gap-12">
    <h2 className={`${ptSansCaption.className} text-balance text-center text-heading-xl text-gray-100`}>
      Sua loja de afiliados simples do jeito que deveria ser
    </h2>
    <div className="grid gap-6 md:grid-cols-3">
      <div className="flex flex-col gap-2 rounded-lg p-6 md:p-12 bg-blue-400">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-300 mb-4">
          <PaintbrushVertical className="h-6 w-6 text-white" />
        </div>
        <strong className="text-heading-sm text-gray-100">Personaliza o seu site</strong>
        <p className="text-body-sm text-gray-200">Descricao do card</p>
      </div>
      <div className="flex flex-col gap-2 rounded-lg p-6 md:p-12 bg-cyan-300">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-200 mb-4">
          <Store className="h-6 w-6 text-white" />
        </div>
        <strong className="text-heading-sm text-gray-100">Monte a sua loja</strong>
        <p className="text-body-sm text-gray-200">Descricao do card</p>
      </div>
      <div className="flex flex-col gap-2 rounded-lg p-6 md:p-12 bg-blue-400">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-300 mb-4">
          <Handshake className="h-6 w-6 text-white" />
        </div>
        <strong className="text-heading-sm text-gray-100">Receba suporte amigavel</strong>
        <p className="text-body-sm text-gray-200">Descricao do card</p>
      </div>
    </div>
  </div>
</section>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| 3+ cards lado a lado | Use `grid md:grid-cols-3` com `gap-6` |
| Icone dentro de card | Envolva em div com fundo colorido e rounded |
| Titulo de secao com fonte especial | Use Next Font com `weight` e `subsets` explicitos |
| Cards identicos com cores diferentes | Mantenha estrutura, varie apenas classes de cor |
| Padding responsivo | `p-6 md:p-12` — menor em mobile, maior em desktop |
| Secao com fundo gradiente | `bg-gradient-to-r from-{cor1} to-{cor2}` na section |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| Icone solto sem container | Div wrapper com flex/center/rounded/bg |
| `<link href="fonts.googleapis.com">` | `import { Font } from "next/font/google"` |
| Cards com estrutura HTML diferente | Mesma estrutura, apenas cores diferentes |
| Padding fixo sem responsividade | `p-6 md:p-12` |
| `style={{ fontFamily: '...' }}` | `className={font.className}` |
| Cards em `flex` horizontal direto | `grid md:grid-cols-3` para distribuicao uniforme |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
