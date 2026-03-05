---
name: rs-nextjs-app-router-componente-header
description: "Applies Tailwind CSS layout patterns when building page headers and navigation components in Next.js. Use when user asks to 'create a header', 'build a navbar', 'style a layout', 'add navigation', or 'create a search input'. Enforces grid-based page layout, justify-between header structure, Next.js Image optimization, and external domain configuration. Make sure to use this skill whenever building top-level layout structures with Tailwind in Next.js. Not for footer components, sidebar navigation, or mobile-responsive menu logic."
---

# Componente Header com Tailwind CSS no Next.js

> Construa headers usando grid layout no wrapper, flex com justify-between no header, e otimize imagens externas com o componente Image do Next.js.

## Rules

1. **Use grid no layout raiz, flex no header** — grid controla a estrutura vertical (header + conteudo), flex controla o alinhamento horizontal dentro do header, porque grid e melhor para macro-layout e flex para micro-alinhamento
2. **Sempre use min-h-screen no container principal** — porque divs por padrao ocupam apenas o tamanho do conteudo, impossibilitando posicionar elementos no final da pagina
3. **Combine w-full com max-w para responsividade** — `w-full max-w-[1600px]` evita barra de rolagem horizontal em telas pequenas e limita largura em telas grandes, porque width 100% sozinho estoura em telas grandes
4. **Use o componente Image do Next.js para imagens externas** — porque ele reduz o tamanho da imagem antes de carregar (ex: imagem 460px carregada como 24px), e configure `domains` no next.config
5. **Passe width e height no Image alem do className** — o className controla o visual, mas width/height controlam o tamanho de otimizacao da imagem pelo Next.js, porque sao propositos diferentes
6. **Use ring ao inves de border para bordas sutis** — `ring-zinc-700` cria uma borda visual sem afetar o box model, porque border altera dimensoes do elemento

## How to write

### Layout raiz com grid

```tsx
// layout.tsx - wrapper do conteudo
<div className="mx-auto grid min-h-screen w-full max-w-[1600px] grid-rows-[min-content_max-content] gap-5 p-8">
  <header>{/* header content */}</header>
  <main>{/* page content */}</main>
</div>
```

### Header com duas secoes

```tsx
<header>
  <div className="flex items-center justify-between">
    {/* Esquerda: logo + busca */}
    <div className="flex items-center gap-5">
      <Link href="/" className="text-2xl font-extrabold text-white">
        devstore
      </Link>
      {/* Search form */}
    </div>

    {/* Direita: carrinho + conta */}
    <div className="flex items-center gap-4">
      {/* Cart + separator + account */}
    </div>
  </div>
</header>
```

### Input de busca estilizado

```tsx
<form className="flex w-[320px] items-center gap-3 rounded-full bg-zinc-900 px-5 py-3 ring-zinc-700">
  <Search className="h-5 w-5 text-zinc-500" />
  <input
    placeholder="Buscar produtos..."
    className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-500"
  />
</form>
```

### Separador vertical entre elementos

```tsx
<div className="w-px h-4 bg-zinc-700" />
```

### Image otimizado com dominio externo

```tsx
// Componente
<Image
  src="https://github.com/username.png"
  className="h-6 w-6 rounded-full"
  width={24}
  height={24}
  alt=""
/>

// next.config.js - configuracao obrigatoria
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['github.com'],
  },
}
```

## Example

**Before (sem estrutura):**
```tsx
<div>
  <header>
    <a href="/">Logo</a>
    <input placeholder="Search" />
    <img src="https://github.com/user.png" />
  </header>
  <main>{children}</main>
</div>
```

**After (com este skill aplicado):**
```tsx
<div className="mx-auto grid min-h-screen w-full max-w-[1600px] grid-rows-[min-content_max-content] gap-5 p-8">
  <header>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-5">
        <Link href="/" className="text-2xl font-extrabold text-white">
          devstore
        </Link>
        <form className="flex w-[320px] items-center gap-3 rounded-full bg-zinc-900 px-5 py-3 ring-zinc-700">
          <Search className="h-5 w-5 text-zinc-500" />
          <input placeholder="Buscar produtos..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-500" />
        </form>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" />
          <span className="text-sm">Cart (0)</span>
        </div>
        <div className="w-px h-4 bg-zinc-700" />
        <Link href="/" className="flex items-center gap-2 hover:underline">
          <span className="text-sm">Account</span>
          <Image src="https://github.com/user.png" className="h-6 w-6 rounded-full" width={24} height={24} alt="" />
        </Link>
      </div>
    </div>
  </header>
  <main>{children}</main>
</div>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Layout com header + conteudo | Grid vertical com `grid-rows-[min-content_max-content]` |
| Header com logo esquerda e menu direita | `flex items-center justify-between` |
| Input com icone dentro | Estilize o container (form/div) como input, input interno fica `bg-transparent outline-none` |
| Imagem de avatar de URL externa | `Image` do Next.js + `domains` no next.config |
| Separar elementos visuais no header | Div com `w-px h-4 bg-zinc-700` |
| Tela deve ocupar altura toda | `min-h-screen` no container |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `<img src={url}>` para imagens externas | `<Image src={url} width={N} height={N}>` |
| `height: 100vh` sem fallback | `min-h-screen` (permite conteudo maior) |
| `max-w-[1600px]` sem `w-full` | `w-full max-w-[1600px]` (evita scroll horizontal) |
| `border` para bordas decorativas sutis | `ring-zinc-700` (nao afeta box model) |
| Input com background e borda propria quando tem icone | Container estilizado + input `bg-transparent` |
| `<Image>` sem width/height props | Sempre passe width/height para otimizacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
